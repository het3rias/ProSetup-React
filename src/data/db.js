/* ============================================
   ProSetup - Base de datos simulada (persistencia en localStorage)
   ============================================
   Este archivo actúa como la "base de datos" de la aplicación.
   Cada colección (productos, categorías, usuarios, órdenes, carrito)
   expone funciones CRUD: listar / obtener / crear / actualizar / eliminar.

   Los datos se guardan en localStorage como JSON. La sesión activa se
   guarda en sessionStorage (se borra al cerrar el navegador).

   Conexión con React: cada vez que se escribe en la base de datos se
   avisa a los "suscriptores" (ver suscribir()). El hook useDatos() de
   src/hooks/useDatos.js se suscribe y vuelve a leer los datos, así la
   interfaz se actualiza en tiempo real sin recargar la página.

   Las colecciones se exportan como OBJETOS (productosDB, usuariosDB, ...)
   para que en las pruebas se puedan reemplazar funciones con spyOn (mocks).
   ============================================ */

import { categoriasIniciales, productosIniciales, usuariosIniciales, ordenesIniciales } from "./datosIniciales.js";

// Sube este número si cambias los datos iniciales: el navegador recargará la semilla.
export const VERSION_DB = 3;

const CLAVES = {
    version: "prosetup_version",
    productos: "prosetup_productos",
    categorias: "prosetup_categorias",
    usuarios: "prosetup_usuarios",
    ordenes: "prosetup_ordenes",
    carrito: "prosetup_carrito",
    sesion: "prosetup_sesion"
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

/* ---------------- Lectura / escritura genérica ---------------- */

function leer(clave) {
    inicializarDB();
    try {
        return JSON.parse(localStorage.getItem(clave)) ?? [];
    } catch {
        return [];
    }
}

function escribir(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
    notificar();
}

const copia = (obj) => JSON.parse(JSON.stringify(obj));

// Carga los datos semilla si es la primera visita o si cambió VERSION_DB
export function inicializarDB() {
    if (Number(localStorage.getItem(CLAVES.version)) === VERSION_DB) return;
    localStorage.setItem(CLAVES.productos, JSON.stringify(productosIniciales));
    localStorage.setItem(CLAVES.categorias, JSON.stringify(categoriasIniciales));
    localStorage.setItem(CLAVES.usuarios, JSON.stringify(usuariosIniciales));
    localStorage.setItem(CLAVES.ordenes, JSON.stringify(ordenesIniciales));
    localStorage.setItem(CLAVES.carrito, JSON.stringify([]));
    localStorage.setItem(CLAVES.version, String(VERSION_DB));
}

// Borra todo y vuelve a los datos iniciales (útil en pruebas y para "resetear" la demo)
export function reiniciarDB() {
    Object.values(CLAVES).forEach(clave => localStorage.removeItem(clave));
    sessionStorage.removeItem(CLAVES.sesion);
    inicializarDB();
    notificar();
}

const siguienteId = (lista) => (lista.length ? Math.max(...lista.map(x => Number(x.id))) + 1 : 1);

/* ================= PRODUCTOS ================= */

export const productosDB = {
    listar() {
        return leer(CLAVES.productos);
    },
    obtenerPorId(id) {
        return this.listar().find(p => p.id === Number(id)) || null;
    },
    listarPorCategoria(nombreCategoria) {
        return this.listar().filter(p => p.categoria === nombreCategoria);
    },
    listarOfertas() {
        return this.listar().filter(p => p.precioOferta != null && p.precioOferta < p.precio);
    },
    listarCriticos() {
        return this.listar().filter(p => p.stockCritico != null && Number(p.stock) <= Number(p.stockCritico));
    },
    existeCodigo(codigo, idExcluido = null) {
        return this.listar().some(p => p.codigo.toUpperCase() === codigo.toUpperCase() && p.id !== Number(idExcluido));
    },
    crear(datos) {
        const lista = this.listar();
        const nuevo = { ...datos, id: siguienteId(lista) };
        escribir(CLAVES.productos, [...lista, nuevo]);
        return nuevo;
    },
    actualizar(id, cambios) {
        let actualizado = null;
        const lista = this.listar().map(p => {
            if (p.id !== Number(id)) return p;
            actualizado = { ...p, ...cambios, id: p.id };
            return actualizado;
        });
        if (!actualizado) return null;
        escribir(CLAVES.productos, lista);
        return actualizado;
    },
    eliminar(id) {
        const lista = this.listar();
        const nueva = lista.filter(p => p.id !== Number(id));
        if (nueva.length === lista.length) return false;
        escribir(CLAVES.productos, nueva);
        return true;
    },
    // Descuenta stock después de una compra exitosa
    descontarStock(items) {
        const lista = this.listar().map(p => {
            const item = items.find(i => i.id === p.id);
            return item ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p;
        });
        escribir(CLAVES.productos, lista);
    }
};

/* ================= CATEGORÍAS ================= */

export const categoriasDB = {
    listar() {
        return leer(CLAVES.categorias);
    },
    obtenerPorId(id) {
        return this.listar().find(c => c.id === Number(id)) || null;
    },
    existeNombre(nombre, idExcluido = null) {
        return this.listar().some(c => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== Number(idExcluido));
    },
    crear(datos) {
        const lista = this.listar();
        const nueva = { ...datos, id: siguienteId(lista) };
        escribir(CLAVES.categorias, [...lista, nueva]);
        return nueva;
    },
    // Si cambia el nombre, también se actualiza en los productos de esa categoría
    actualizar(id, cambios) {
        const anterior = this.obtenerPorId(id);
        if (!anterior) return null;
        const actualizada = { ...anterior, ...cambios, id: anterior.id };
        escribir(CLAVES.categorias, this.listar().map(c => (c.id === anterior.id ? actualizada : c)));
        if (cambios.nombre && cambios.nombre !== anterior.nombre) {
            const productos = productosDB.listar().map(p =>
                p.categoria === anterior.nombre ? { ...p, categoria: cambios.nombre } : p);
            escribir(CLAVES.productos, productos);
        }
        return actualizada;
    },
    // No se permite eliminar una categoría que todavía tiene productos
    eliminar(id) {
        const categoria = this.obtenerPorId(id);
        if (!categoria) return { ok: false, mensaje: "La categoría no existe." };
        if (productosDB.listarPorCategoria(categoria.nombre).length > 0) {
            return { ok: false, mensaje: "No se puede eliminar: la categoría tiene productos asociados." };
        }
        escribir(CLAVES.categorias, this.listar().filter(c => c.id !== categoria.id));
        return { ok: true, mensaje: "Categoría eliminada." };
    }
};

/* ================= USUARIOS ================= */

export const usuariosDB = {
    listar() {
        return leer(CLAVES.usuarios);
    },
    obtenerPorEmail(email) {
        return this.listar().find(u => u.email === String(email).toLowerCase()) || null;
    },
    obtenerPorRun(run) {
        return this.listar().find(u => u.run === String(run).toUpperCase()) || null;
    },
    crear(datos) {
        const nuevo = { ...datos, email: datos.email.toLowerCase(), run: datos.run.toUpperCase() };
        escribir(CLAVES.usuarios, [...this.listar(), nuevo]);
        return nuevo;
    },
    // Se identifica por el email original (el email puede cambiar al editar)
    actualizar(emailOriginal, cambios) {
        let actualizado = null;
        const lista = this.listar().map(u => {
            if (u.email !== emailOriginal) return u;
            actualizado = { ...u, ...cambios };
            if (!cambios.password) actualizado.password = u.password; // contraseña vacía = no cambia
            return actualizado;
        });
        if (!actualizado) return null;
        escribir(CLAVES.usuarios, lista);
        // Si el usuario editado es el que tiene la sesión abierta, se actualiza la sesión
        if (sesionDB.obtenerEmail() === emailOriginal) sesionDB.iniciar(actualizado.email);
        return actualizado;
    },
    eliminar(email) {
        const lista = this.listar();
        const nueva = lista.filter(u => u.email !== email);
        if (nueva.length === lista.length) return false;
        escribir(CLAVES.usuarios, nueva);
        return true;
    },
    // Devuelve el usuario si el correo y la contraseña coinciden, si no null
    autenticar(email, password) {
        const usuario = this.obtenerPorEmail(email);
        return usuario && usuario.password === password ? usuario : null;
    }
};

/* ================= ÓRDENES / BOLETAS ================= */

export const ordenesDB = {
    listar() {
        // Las más recientes primero
        return [...leer(CLAVES.ordenes)].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    obtenerPorId(id) {
        return leer(CLAVES.ordenes).find(o => o.id === Number(id)) || null;
    },
    listarPorUsuario(email) {
        return this.listar().filter(o => o.usuarioEmail === email || o.cliente?.email === email);
    },
    crear(datos) {
        const lista = leer(CLAVES.ordenes);
        const id = lista.length ? Math.max(...lista.map(o => o.id)) + 1 : 1001;
        const orden = { ...copia(datos), id, codigo: "ORDER-" + id, fecha: new Date().toISOString() };
        escribir(CLAVES.ordenes, [...lista, orden]);
        return orden;
    },
    actualizarEstado(id, estado) {
        let actualizada = null;
        const lista = leer(CLAVES.ordenes).map(o => {
            if (o.id !== Number(id)) return o;
            actualizada = { ...o, estado };
            return actualizada;
        });
        if (actualizada) escribir(CLAVES.ordenes, lista);
        return actualizada;
    }
};

/* ================= CARRITO ================= */
// Se guarda solo { id, cantidad }; el precio y nombre se leen siempre del producto actual.

export const carritoDB = {
    obtener() {
        return leer(CLAVES.carrito);
    },
    guardar(items) {
        escribir(CLAVES.carrito, items);
    },
    vaciar() {
        escribir(CLAVES.carrito, []);
    }
};

/* ================= SESIÓN ================= */

export const sesionDB = {
    obtenerEmail() {
        return sessionStorage.getItem(CLAVES.sesion);
    },
    obtenerUsuario() {
        const email = this.obtenerEmail();
        return email ? usuariosDB.obtenerPorEmail(email) : null;
    },
    iniciar(email) {
        sessionStorage.setItem(CLAVES.sesion, email);
        notificar();
    },
    cerrar() {
        sessionStorage.removeItem(CLAVES.sesion);
        notificar();
    }
};
