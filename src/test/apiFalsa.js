/* ============================================
   API falsa para las pruebas
   ============================================
   Las pruebas NO deben depender de que el backend esté encendido. Esta función reemplaza los
   métodos de `api` (src/services/api.js) por versiones en memoria que se comportan como el
   backend: validan duplicados, calculan el total de las órdenes, descuentan stock, etc.
   Se instala antes de cada prueba (ver setup.js) con datos iniciales nuevos. */
import { api, ApiError } from "../services/api.js";
import { sesionDB } from "../data/db.js";
import { categoriasIniciales, productosIniciales, usuariosIniciales, ordenesIniciales } from "../data/datosIniciales.js";

const copia = (x) => JSON.parse(JSON.stringify(x));
const sinClave = ({ password, ...resto }) => resto;

// Referencia a las funciones reales, por si una prueba necesita probar api.js de verdad
export const apiReal = { autenticacion: { ...api.autenticacion }, productos: { ...api.productos }, categorias: { ...api.categorias }, usuarios: { ...api.usuarios }, ordenes: { ...api.ordenes } };

export function instalarApiFalsa() {
    const bd = {
        productos: copia(productosIniciales),
        categorias: copia(categoriasIniciales),
        usuarios: copia(usuariosIniciales).map((u, i) => ({ ...u, id: i + 1 })),
        ordenes: copia(ordenesIniciales),
        sesion: null
    };
    const sigId = (lista) => Math.max(0, ...lista.map(x => x.id)) + 1;
    const buscar = (lista, id) => {
        const x = lista.find(e => e.id === Number(id));
        if (!x) throw new ApiError(404, "No encontrado.");
        return x;
    };
    const exigirSesion = () => {
        // Las pruebas pueden dejar la sesión iniciada directamente con sesionDB.iniciar(email)
        const u = bd.sesion ?? bd.usuarios.find(x => x.email === sesionDB.obtenerEmail());
        if (!u) throw new ApiError(401, "Debes iniciar sesión.");
        return u;
    };

    api.autenticacion.login = async (email, password) => {
        const u = bd.usuarios.find(x => x.email === email && x.password === password);
        if (!u) throw new ApiError(401, "Correo o contraseña incorrectos.");
        bd.sesion = u;
        return { accessToken: "token-falso", refreshToken: "refresh-falso", usuario: sinClave(u) };
    };
    api.autenticacion.registrar = async (datos) => {
        if (bd.usuarios.some(u => u.run === datos.run)) throw new ApiError(409, "Ya existe un usuario con ese RUN.");
        if (bd.usuarios.some(u => u.email === datos.email)) throw new ApiError(409, "Ya existe un usuario con ese correo.");
        const nuevo = { ...datos, id: sigId(bd.usuarios), tipoUsuario: "Cliente" };
        bd.usuarios.push(nuevo);
        return sinClave(nuevo);
    };
    api.autenticacion.yo = async () => sinClave(exigirSesion());

    api.productos.listar = async () => copia(bd.productos);
    api.productos.crear = async (datos) => {
        if (bd.productos.some(p => p.codigo === datos.codigo)) throw new ApiError(409, "Ya existe un producto con ese código.");
        const nuevo = { ...datos, id: sigId(bd.productos) };
        bd.productos.push(nuevo);
        return copia(nuevo);
    };
    api.productos.actualizar = async (id, datos) => {
        const p = buscar(bd.productos, id);
        Object.assign(p, datos, { id: p.id });
        return copia(p);
    };
    api.productos.eliminar = async (id) => {
        buscar(bd.productos, id);
        bd.productos = bd.productos.filter(p => p.id !== Number(id));
    };

    api.categorias.listar = async () => copia(bd.categorias);
    api.categorias.crear = async (datos) => {
        const nueva = { ...datos, id: sigId(bd.categorias) };
        bd.categorias.push(nueva);
        return copia(nueva);
    };
    api.categorias.actualizar = async (id, datos) => {
        const c = buscar(bd.categorias, id);
        const anterior = c.nombre;
        Object.assign(c, datos, { id: c.id });
        bd.productos.forEach(p => { if (p.categoria === anterior) p.categoria = c.nombre; });
        return copia(c);
    };
    api.categorias.eliminar = async (id) => {
        const c = buscar(bd.categorias, id);
        if (bd.productos.some(p => p.categoria === c.nombre)) throw new ApiError(409, "No se puede eliminar: la categoría tiene productos.");
        bd.categorias = bd.categorias.filter(x => x.id !== c.id);
    };

    api.usuarios.listar = async () => bd.usuarios.map(u => sinClave(copia(u)));
    api.usuarios.crear = async (datos) => {
        const nuevo = { ...datos, id: sigId(bd.usuarios) };
        bd.usuarios.push(nuevo);
        return sinClave(copia(nuevo));
    };
    api.usuarios.actualizar = async (id, datos) => {
        const u = buscar(bd.usuarios, id);
        Object.assign(u, datos, { id: u.id });
        return sinClave(copia(u));
    };
    api.usuarios.eliminar = async (id) => {
        buscar(bd.usuarios, id);
        bd.usuarios = bd.usuarios.filter(u => u.id !== Number(id));
    };
    api.usuarios.actualizarPerfil = async (datos) => {
        const u = exigirSesion();
        Object.assign(u, datos);
        return sinClave(copia(u));
    };

    api.ordenes.listar = async () => copia(bd.ordenes);
    api.ordenes.mias = async () => { const u = exigirSesion(); return copia(bd.ordenes.filter(o => o.usuarioEmail === u.email)); };
    api.ordenes.crear = async (datos) => {
        const id = Math.max(1000, ...bd.ordenes.map(o => o.id)) + 1;
        const items = datos.items.map(i => {
            const p = buscar(bd.productos, i.id);
            return { id: p.id, codigo: p.codigo, nombre: p.nombre, precio: p.precioOferta ?? p.precio, cantidad: i.cantidad, imagen: p.imagen };
        });
        const faltaStock = datos.items.some(i => buscar(bd.productos, i.id).stock < i.cantidad);
        const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
        const costoEnvio = datos.entrega === "domicilio" && subtotal < 50000 ? 3990 : 0;
        const rechazada = faltaStock || datos.simularRechazo;
        if (!rechazada) datos.items.forEach(i => { buscar(bd.productos, i.id).stock -= i.cantidad; });
        const orden = {
            id, codigo: `ORDER-${id}`, fecha: new Date().toISOString(), estado: rechazada ? "Rechazada" : "Pagada",
            motivo: faltaStock ? "Stock insuficiente." : (datos.simularRechazo ? "El medio de pago rechazó la transacción." : ""),
            usuarioEmail: bd.sesion?.email ?? sesionDB.obtenerEmail(), cliente: datos.cliente, direccion: datos.direccion, entrega: datos.entrega,
            items, subtotal, costoEnvio, total: subtotal + costoEnvio
        };
        bd.ordenes.push(orden);
        return copia(orden);
    };
    api.ordenes.actualizarEstado = async (id, estado) => {
        const o = buscar(bd.ordenes, id);
        o.estado = estado;
        return copia(o);
    };

    return bd;
}
