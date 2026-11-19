/* Pruebas del almacén de datos (db.js): caché + llamadas al backend (API falsa en las pruebas) */
import { categoriasDB, ordenesDB, productosDB, reiniciarDB, sesionDB, suscribir, usuariosDB, carritoDB,
    cargarCatalogo, cargarDatosPrivados } from "./db.js";
import { api, ApiError } from "../services/api.js";

describe("Almacén de datos (db.js)", () => {
    beforeEach(() => reiniciarDB());

    it("carga el catálogo desde el backend a la caché", async () => {
        await cargarCatalogo();
        expect(productosDB.listar().length).toBe(12);
        expect(categoriasDB.listar().length).toBe(6);
    });

    it("si el backend no responde, deja el mensaje de error", async () => {
        spyOn(api.productos, "listar").and.rejectWith(new ApiError(0, "No se pudo conectar."));
        const { catalogoListo, errorCatalogo } = await import("./db.js");
        reiniciarDB();
        await cargarCatalogo();
        expect(errorCatalogo()).toBe("No se pudo conectar.");
        expect(catalogoListo()).toBe(true); // reiniciarDB lo había dejado listo; el error igual queda registrado
    });

    it("CRUD de productos: crear, leer, actualizar y eliminar", async () => {
        const nuevo = await productosDB.crear({ codigo: "NEW-1", nombre: "Nuevo", precio: 1000, precioOferta: null, stock: 3, stockCritico: 1, categoria: "Audio", imagen: "" });
        expect(nuevo.id).toBe(13);
        expect(productosDB.obtenerPorId(13).nombre).toBe("Nuevo");

        await productosDB.actualizar(13, { precio: 2000 });
        expect(productosDB.obtenerPorId(13).precio).toBe(2000);

        expect(await productosDB.eliminar(13)).toBe(true);
        expect(productosDB.obtenerPorId(13)).toBeNull();
    });

    it("propaga el error del servidor (código duplicado) sin cambiar la caché", async () => {
        const antes = productosDB.listar().length;
        await expectAsync(productosDB.crear({ codigo: "TEC-001", nombre: "Dup", precio: 1, stock: 1, categoria: "Audio" }))
            .toBeRejectedWithError(/código/i);
        expect(productosDB.listar().length).toBe(antes);
    });

    it("lista ofertas y productos con stock crítico", () => {
        expect(productosDB.listarOfertas().every(p => p.precioOferta < p.precio)).toBe(true);
        expect(productosDB.listarCriticos().map(p => p.codigo)).toEqual(jasmine.arrayContaining(["SIL-001", "ACC-004"]));
    });

    it("al renombrar una categoría se actualizan sus productos", async () => {
        await categoriasDB.actualizar(2, { nombre: "Sonido" });
        expect(productosDB.listarPorCategoria("Sonido").length).toBe(3);
        expect(productosDB.listarPorCategoria("Audio").length).toBe(0);
    });

    it("no elimina categorías con productos, pero sí las vacías", async () => {
        expect((await categoriasDB.eliminar(1)).ok).toBe(false);
        const vacia = await categoriasDB.crear({ nombre: "Redes", descripcion: "", imagen: "" });
        expect((await categoriasDB.eliminar(vacia.id)).ok).toBe(true);
    });

    it("el perfil y los usuarios se editan sin enviar la contraseña vacía", async () => {
        spyOn(api.usuarios, "actualizar").and.callThrough();
        await usuariosDB.actualizar("admin@duoc.cl", { nombre: "Jefe", password: "", confirmar: "", fechaNacimiento: "" });
        const enviado = api.usuarios.actualizar.calls.mostRecent().args[1];
        expect("password" in enviado).toBe(false);
        expect("confirmar" in enviado).toBe(false);
        expect(enviado.fechaNacimiento).toBeNull();
        expect(usuariosDB.obtenerPorEmail("admin@duoc.cl").nombre).toBe("Jefe");
    });

    it("carga los datos privados según el rol", async () => {
        sesionDB.iniciar("cliente@gmail.com");
        await cargarDatosPrivados({ email: "cliente@gmail.com", tipoUsuario: "Cliente" });
        expect(ordenesDB.listar().every(o => o.usuarioEmail === "cliente@gmail.com")).toBe(true);
        expect(usuariosDB.listar().length).toBe(0);
        await cargarDatosPrivados({ email: "admin@duoc.cl", tipoUsuario: "Administrador" });
        expect(usuariosDB.listar().length).toBe(3);
    });

    it("crea órdenes en el servidor, descuenta stock y las filtra por usuario", async () => {
        const orden = await ordenesDB.crear({
            cliente: { nombre: "X", apellidos: "Y", email: "cliente@gmail.com" }, direccion: {}, entrega: "retiro",
            items: [{ id: 1, cantidad: 2 }]
        });
        expect(orden.id).toBe(1003);
        expect(orden.estado).toBe("Pagada");
        expect(productosDB.obtenerPorId(1).stock).toBe(13);
        expect(ordenesDB.obtenerPorId(1003).codigo).toBe("ORDER-1003");
        expect(ordenesDB.listarPorUsuario("cliente@gmail.com").length).toBe(3);
    });

    it("una orden rechazada no descuenta stock", async () => {
        const orden = await ordenesDB.crear({ cliente: { email: "a@gmail.com" }, direccion: {}, entrega: "retiro", items: [{ id: 1, cantidad: 1 }], simularRechazo: true });
        expect(orden.estado).toBe("Rechazada");
        expect(productosDB.obtenerPorId(1).stock).toBe(15);
    });

    it("avisa a los suscriptores cuando cambian los datos (tiempo real)", () => {
        const espia = jasmine.createSpy("espia");
        const desuscribir = suscribir(espia);
        carritoDB.guardar([{ id: 1, cantidad: 1 }]);
        sesionDB.iniciar("admin@duoc.cl");
        expect(espia).toHaveBeenCalledTimes(2);
        desuscribir();
        carritoDB.vaciar();
        expect(espia).toHaveBeenCalledTimes(2);
    });
});
