/* ============================================
   ProSetup - Almacén de datos sincronizado con el backend (Spring Boot)
   ============================================
   Antes este archivo era una "base de datos" simulada en localStorage. Ahora los datos
   viven en MySQL y se piden al backend por la API REST (ver src/services/api.js).

   Cómo funciona:
   - LECTURAS (listar, obtenerPorId...): son síncronas y leen una copia en memoria (caché).
     Así las pantallas se siguen escribiendo igual con el hook useDatos().
   - La caché se llena desde el backend: cargarCatalogo() al abrir la tienda (público) y
     cargarDatosPrivados() después de iniciar sesión (usuarios y órdenes según el rol).
   - ESCRITURAS (crear, actualizar, eliminar): son ASÍNCRONAS. Llaman al backend, y cuando
     éste responde OK actualizan la caché y avisan a los suscriptores; si el servidor
     rechaza la operación (400, 403, 409...) lanzan un ApiError con el mensaje.
   - El carrito sí se guarda en localStorage (es del navegador, no del servidor).
   - La sesión (usuario conectado) se mantiene con tokens JWT; ver AuthContext.jsx.

   Las colecciones se exportan como OBJETOS (productosDB, usuariosDB, ...) para que en las
   pruebas se puedan reemplazar funciones con spyOn (mocks).
   ============================================ */

import { api, ApiError, tokens } from "../services/api.js";
import { categoriasIniciales, productosIniciales, usuariosIniciales, ordenesIniciales } from "./datosIniciales.js";

const CLAVE_CARRITO = "prosetup_carrito";

/* ---------------- Caché en memoria ---------------- */

const cache = {
    productos: [],
    categorias: [],
    usuarios: [],   // solo se carga para el Administrador
    ordenes: [],    // Administrador/Vendedor: todas; Cliente: las suyas
    usuarioActual: null,
    catalogoListo: false,
    errorCatalogo: ""
};

/* ---------------- Suscripción a cambios (tiempo real) ---------------- */

const suscriptores = new Set();

export function suscribir(funcion) {
    suscriptores.add(funcion);
    return () => suscriptores.delete(funcion);
}

function notificar() {
    suscriptores.forEach(funcion => funcion());
}

const copia = (obj) => JSON.parse(JSON.stringify(obj));
const mismoId = (a, b) => Number(a) === Number(b);

/* ---------------- Carga desde el backend ---------------- */

/** Pide productos y categorías (datos públicos). Se llama al abrir la aplicación. */
export async function cargarCatalogo() {
    try {
        const [productos, categorias] = await Promise.all([api.productos.listar(), api.categorias.listar()]);
        cache.productos = productos;
        cache.categorias = categorias;
        cache.catalogoListo = true;
        cache.errorCatalogo = "";
    } catch (error) {
        cache.errorCatalogo = error.message || "No se pudo cargar la tienda.";
    }
    notificar();
}

/** Vuelve a pedir solo los productos (por ejemplo, después de una compra cambió el stock). */
export async function refrescarProductos() {
    cache.productos = await api.productos.listar();
    notificar();
}

/** Después de iniciar sesión: el panel necesita usuarios y órdenes según el rol del usuario. */
export async function cargarDatosPrivados(usuario) {
    cache.usuarios = [];
    cache.ordenes = [];
    if (usuario.tipoUsuario === "Administrador") {
        const [usuarios, ordenes] = await Promise.all([api.usuarios.listar(), api.ordenes.listar()]);
        cache.usuarios = usuarios;
        cache.ordenes = ordenes;
    } else if (usuario.tipoUsuario === "Vendedor") {
        cache.ordenes = await api.ordenes.listar();
    } else {
        cache.ordenes = await api.ordenes.mias();
    }
    notificar();
}

export const catalogoListo = () => cache.catalogoListo;
export const errorCatalogo = () => cache.errorCatalogo;

/** Vuelve a un estado conocido con los datos de ejemplo (src/data/datosIniciales.js). Se usa en las pruebas. */
export function reiniciarDB() {
    localStorage.removeItem(CLAVE_CARRITO);
    tokens.borrar();
    cache.productos = copia(productosIniciales);
    cache.categorias = copia(categoriasIniciales);
    cache.usuarios = copia(usuariosIniciales).map(({ password, ...u }, i) => ({ ...u, id: i + 1 })); // el backend nunca envía contraseñas
    cache.ordenes = copia(ordenesIniciales);
    cache.usuarioActual = null;
    cache.catalogoListo = true;
    cache.errorCatalogo = "";
    notificar();
}

/* ================= PRODUCTOS ================= */

export const productosDB = {
    listar() {
        return cache.productos;
    },
    obtenerPorId(id) {
        return cache.productos.find(p => mismoId(p.id, id)) || null;
    },
    listarPorCategoria(nombreCategoria) {
        return cache.productos.filter(p => p.categoria === nombreCategoria);
    },
    listarOfertas() {
        return cache.productos.filter(p => p.precioOferta != null && p.precioOferta < p.precio);
    },
    listarCriticos() {
        return cache.productos.filter(p => p.stockCritico != null && Number(p.stock) <= Number(p.stockCritico));
    },
    existeCodigo(codigo, idExcluido = null) {
        return cache.productos.some(p => p.codigo.toUpperCase() === codigo.toUpperCase() && !mismoId(p.id, idExcluido));
    },
    async crear(datos) {
        const creado = await api.productos.crear(datos);
        cache.productos = [...cache.productos, creado];
        notificar();
        return creado;
    },
    async actualizar(id, cambios) {
        const actual = this.obtenerPorId(id);
        const actualizado = await api.productos.actualizar(id, { ...actual, ...cambios });
        cache.productos = cache.productos.map(p => (mismoId(p.id, id) ? actualizado : p));
        notificar();
        return actualizado;
    },
    async eliminar(id) {
        await api.productos.eliminar(id);
        cache.productos = cache.productos.filter(p => !mismoId(p.id, id));
        notificar();
        return true;
    }
};

/* ================= CATEGORÍAS ================= */

export const categoriasDB = {
    listar() {
        return cache.categorias;
    },
    obtenerPorId(id) {
        return cache.categorias.find(c => mismoId(c.id, id)) || null;
    },
    existeNombre(nombre, idExcluido = null) {
        return cache.categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase() && !mismoId(c.id, idExcluido));
    },
    async crear(datos) {
        const nueva = await api.categorias.crear(datos);
        cache.categorias = [...cache.categorias, nueva];
        notificar();
        return nueva;
    },
    // Si cambia el nombre, el backend actualiza los productos de la categoría; se vuelven a pedir
    async actualizar(id, cambios) {
        const anterior = this.obtenerPorId(id);
        const actualizada = await api.categorias.actualizar(id, { ...anterior, ...cambios });
        cache.categorias = cache.categorias.map(c => (mismoId(c.id, id) ? actualizada : c));
        if (anterior && cambios.nombre && cambios.nombre !== anterior.nombre) {
            cache.productos = await api.productos.listar();
        }
        notificar();
        return actualizada;
    },
    // El backend no deja eliminar una categoría con productos (responde 409): se devuelve su mensaje
    async eliminar(id) {
        try {
            await api.categorias.eliminar(id);
        } catch (error) {
            if (error instanceof ApiError) return { ok: false, mensaje: error.message };
            throw error;
        }
        cache.categorias = cache.categorias.filter(c => !mismoId(c.id, id));
        notificar();
        return { ok: true, mensaje: "Categoría eliminada." };
    }
};

/* ================= USUARIOS ================= */

// El formulario trae confirmar/password vacíos y fecha "" : se limpian antes de enviar al servidor
function datosUsuarioParaApi(datos) {
    const { confirmar, ...resto } = datos;
    const limpio = { ...resto, fechaNacimiento: resto.fechaNacimiento || null };
    if (!limpio.password) delete limpio.password; // contraseña vacía = no cambia
    return limpio;
}

export const usuariosDB = {
    listar() {
        return cache.usuarios;
    },
    obtenerPorEmail(email) {
        return cache.usuarios.find(u => u.email === String(email).toLowerCase()) || null;
    },
    obtenerPorRun(run) {
        return cache.usuarios.find(u => u.run === String(run).toUpperCase()) || null;
    },
    // Creación desde el panel (el Administrador elige el tipo de usuario)
    async crear(datos) {
        const nuevo = await api.usuarios.crear(datosUsuarioParaApi(datos));
        cache.usuarios = [...cache.usuarios, nuevo];
        notificar();
        return nuevo;
    },
    // Edición desde el panel. Se identifica por el email original (el email puede cambiar al editar)
    async actualizar(emailOriginal, cambios) {
        const actual = this.obtenerPorEmail(emailOriginal);
        if (!actual) return null;
        const actualizado = await api.usuarios.actualizar(actual.id, datosUsuarioParaApi({ ...actual, ...cambios }));
        cache.usuarios = cache.usuarios.map(u => (u.id === actual.id ? actualizado : u));
        if (cache.usuarioActual?.email === emailOriginal) cache.usuarioActual = actualizado;
        notificar();
        return actualizado;
    },
    // Cada usuario edita su propio perfil (no puede cambiar RUN, correo ni tipo)
    async actualizarPerfil(cambios) {
        const actualizado = await api.usuarios.actualizarPerfil(datosUsuarioParaApi(cambios));
        cache.usuarioActual = actualizado;
        cache.usuarios = cache.usuarios.map(u => (u.id === actualizado.id ? actualizado : u));
        notificar();
        return actualizado;
    },
    async eliminar(email) {
        const actual = this.obtenerPorEmail(email);
        if (!actual) return false;
        await api.usuarios.eliminar(actual.id);
        cache.usuarios = cache.usuarios.filter(u => u.id !== actual.id);
        notificar();
        return true;
    }
};

/* ================= ÓRDENES / BOLETAS ================= */

export const ordenesDB = {
    listar() {
        // Las más recientes primero
        return [...cache.ordenes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    obtenerPorId(id) {
        return cache.ordenes.find(o => mismoId(o.id, id)) || null;
    },
    listarPorUsuario(email) {
        return this.listar().filter(o => o.usuarioEmail === email || o.cliente?.email === email);
    },
    // Envía la compra al backend: él valida el stock, calcula el total y descuenta el stock.
    // Devuelve la orden (Pagada o Rechazada). Una compra sin sesión también se puede hacer.
    async crear(datos) {
        const orden = await api.ordenes.crear(datos);
        cache.ordenes = [...cache.ordenes, orden];
        notificar();
        try { await refrescarProductos(); } catch { /* si falla, el stock se actualiza en la próxima carga */ }
        return orden;
    },
    async actualizarEstado(id, estado) {
        const actualizada = await api.ordenes.actualizarEstado(id, estado);
        cache.ordenes = cache.ordenes.map(o => (mismoId(o.id, id) ? actualizada : o));
        notificar();
        return actualizada;
    }
};

/* ================= CARRITO ================= */
// Se guarda solo { id, cantidad } en el navegador; el precio y nombre se leen siempre del producto actual.

export const carritoDB = {
    obtener() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) ?? [];
        } catch {
            return [];
        }
    },
    guardar(items) {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
        notificar();
    },
    vaciar() {
        this.guardar([]);
    }
};

/* ================= SESIÓN ================= */
// El usuario conectado se mantiene en memoria; los tokens JWT están en sessionStorage (ver api.js).

export const sesionDB = {
    obtenerEmail() {
        return cache.usuarioActual?.email ?? null;
    },
    obtenerUsuario() {
        return cache.usuarioActual;
    },
    establecer(usuario) {
        cache.usuarioActual = usuario;
        notificar();
    },
    // Solo para pruebas: deja como conectado a un usuario que ya está en la caché
    iniciar(email) {
        cache.usuarioActual = cache.usuarios.find(u => u.email === email) ?? null;
        notificar();
    },
    cerrar() {
        tokens.borrar();
        cache.usuarioActual = null;
        cache.usuarios = [];
        cache.ordenes = [];
        notificar();
    }
};
