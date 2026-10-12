/* Pruebas del archivo de datos (CRUD sobre localStorage) */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { categoriasDB, ordenesDB, productosDB, reiniciarDB, sesionDB, suscribir, usuariosDB, carritoDB } from "./db.js";

describe("Base de datos simulada (db.js)", () => {
    beforeEach(() => reiniciarDB());

    it("carga los datos iniciales en localStorage", () => {
        expect(productosDB.listar().length).toBe(12);
        expect(categoriasDB.listar().length).toBe(6);
        expect(JSON.parse(localStorage.getItem("prosetup_productos")).length).toBe(12);
    });

    it("CRUD de productos: crear, leer, actualizar y eliminar", () => {
        const nuevo = productosDB.crear({ codigo: "NEW-1", nombre: "Nuevo", precio: 1000, precioOferta: null, stock: 3, stockCritico: 1, categoria: "Audio", imagen: "" });
        expect(nuevo.id).toBe(13);
        expect(productosDB.obtenerPorId(13).nombre).toBe("Nuevo");

        productosDB.actualizar(13, { precio: 2000 });
        expect(productosDB.obtenerPorId(13).precio).toBe(2000);

        expect(productosDB.eliminar(13)).toBe(true);
        expect(productosDB.obtenerPorId(13)).toBeNull();
    });

    it("lista ofertas y productos con stock crítico", () => {
        expect(productosDB.listarOfertas().every(p => p.precioOferta < p.precio)).toBe(true);
        expect(productosDB.listarCriticos().map(p => p.codigo)).toEqual(expect.arrayContaining(["SIL-001", "ACC-004"]));
    });

    it("descuenta stock después de una compra", () => {
        productosDB.descontarStock([{ id: 1, cantidad: 2 }]);
        expect(productosDB.obtenerPorId(1).stock).toBe(13);
    });

    it("al renombrar una categoría se actualizan sus productos", () => {
        categoriasDB.actualizar(2, { nombre: "Sonido" });
        expect(productosDB.listarPorCategoria("Sonido").length).toBe(3);
        expect(productosDB.listarPorCategoria("Audio").length).toBe(0);
    });

    it("no elimina categorías con productos, pero sí las vacías", () => {
        expect(categoriasDB.eliminar(1).ok).toBe(false);
        const vacia = categoriasDB.crear({ nombre: "Redes", descripcion: "", imagen: "" });
        expect(categoriasDB.eliminar(vacia.id).ok).toBe(true);
    });

    it("autentica usuarios y mantiene la contraseña si se edita sin cambiarla", () => {
        expect(usuariosDB.autenticar("admin@duoc.cl", "1234").tipoUsuario).toBe("Administrador");
        expect(usuariosDB.autenticar("admin@duoc.cl", "mala")).toBeNull();
        usuariosDB.actualizar("admin@duoc.cl", { nombre: "Jefe", password: "" });
        expect(usuariosDB.autenticar("admin@duoc.cl", "1234").nombre).toBe("Jefe");
    });

    it("crea órdenes con número correlativo y las filtra por usuario", () => {
        const orden = ordenesDB.crear({ estado: "Pagada", usuarioEmail: "x@gmail.com", cliente: { email: "x@gmail.com" }, items: [], total: 0 });
        expect(orden.id).toBe(1003);
        expect(orden.codigo).toBe("ORDER-1003");
        expect(ordenesDB.listarPorUsuario("cliente@gmail.com").length).toBe(2);
    });

    it("avisa a los suscriptores cuando cambian los datos (tiempo real)", () => {
        const espia = vi.fn();
        const desuscribir = suscribir(espia);
        carritoDB.guardar([{ id: 1, cantidad: 1 }]);
        sesionDB.iniciar("admin@duoc.cl");
        expect(espia).toHaveBeenCalledTimes(2);
        desuscribir();
        carritoDB.vaciar();
        expect(espia).toHaveBeenCalledTimes(2);
    });
});
