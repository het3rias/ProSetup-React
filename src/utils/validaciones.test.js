/* Pruebas de LÓGICA: funciones de validación (reutilizadas de la Evaluación 1) */
import { describe, it, expect, vi } from "vitest";
import {
    calcularDigitoVerificador, validarRun, validarCorreo, validarLogin, validarUsuario,
    validarProducto, validarContacto, validarCheckout, validarCategoria, esValido
} from "./validaciones.js";

describe("Validaciones - RUN chileno", () => {
    it("calcula el dígito verificador con módulo 11", () => {
        expect(calcularDigitoVerificador("19011022")).toBe("2");
        expect(calcularDigitoVerificador("18057784")).toBe("K");
    });

    it("acepta RUN válidos sin puntos ni guion (incluida la K minúscula)", () => {
        expect(validarRun("190110222")).toBe(true);
        expect(validarRun("18057784k")).toBe(true);
    });

    it("rechaza RUN con puntos/guion, largo inválido o dígito verificador incorrecto", () => {
        expect(validarRun("19.011.022-2")).toBe(false);
        expect(validarRun("123")).toBe(false);
        expect(validarRun("190110223")).toBe(false);
    });
});

describe("Validaciones - correo y login", () => {
    it("solo acepta los dominios permitidos", () => {
        expect(validarCorreo("ana@duoc.cl")).toBe(true);
        expect(validarCorreo("profe@profesor.duoc.cl")).toBe(true);
        expect(validarCorreo("ana@gmail.com")).toBe(true);
        expect(validarCorreo("ana@hotmail.com")).toBe(false);
    });

    it("valida largo de contraseña entre 4 y 10 caracteres en el login", () => {
        expect(validarLogin({ email: "a@duoc.cl", password: "123" }).password).toBeDefined();
        expect(validarLogin({ email: "a@duoc.cl", password: "12345678901" }).password).toBeDefined();
        expect(esValido(validarLogin({ email: "a@duoc.cl", password: "1234" }))).toBe(true);
    });
});

describe("Validaciones - usuario", () => {
    const valido = {
        run: "213456784", nombre: "Ana", apellidos: "Soto", email: "ana@gmail.com", password: "1234", confirmar: "1234",
        telefono: "", region: "Región de Ñuble", comuna: "Chillán", direccion: "Calle 1"
    };

    it("no tiene errores con datos correctos", () => {
        expect(validarUsuario(valido)).toEqual({});
    });

    it("detecta contraseñas que no coinciden y campos obligatorios vacíos", () => {
        const errores = validarUsuario({ ...valido, confirmar: "9999", nombre: "", comuna: "" });
        expect(errores.confirmar).toBe("Las contraseñas no coinciden.");
        expect(errores.nombre).toBeDefined();
        expect(errores.comuna).toBeDefined();
    });

    it("usa la función inyectada (mock) para detectar RUN duplicado", () => {
        const existeRun = vi.fn().mockReturnValue(true);
        const errores = validarUsuario(valido, { existeRun });
        expect(existeRun).toHaveBeenCalledWith("213456784");
        expect(errores.run).toContain("Ya existe");
    });

    it("al editar, la contraseña vacía es opcional", () => {
        expect(validarUsuario({ ...valido, password: "", confirmar: "" }, { esEdicion: true })).toEqual({});
    });
});

describe("Validaciones - producto, categoría, contacto y checkout", () => {
    it("el precio de oferta debe ser menor al precio normal", () => {
        const errores = validarProducto({ codigo: "ABC", nombre: "X", descripcion: "", precio: "1000", precioOferta: "1500", stock: "1", stockCritico: "", categoria: "Audio" });
        expect(errores.precioOferta).toBeDefined();
    });

    it("rechaza stock negativo o decimal y código corto", () => {
        const errores = validarProducto({ codigo: "AB", nombre: "X", precio: "10", precioOferta: "", stock: "1.5", stockCritico: "-1", categoria: "" });
        expect(Object.keys(errores)).toEqual(expect.arrayContaining(["codigo", "stock", "stockCritico", "categoria"]));
    });

    it("categoría: nombre mínimo 3 caracteres y sin duplicados", () => {
        expect(validarCategoria({ nombre: "AB" }).nombre).toBeDefined();
        expect(validarCategoria({ nombre: "Audio" }, { existeNombre: () => true }).nombre).toContain("Ya existe");
    });

    it("contacto: el correo es opcional pero si se escribe debe ser válido", () => {
        expect(validarContacto({ nombre: "Ana", email: "", comentario: "Hola" })).toEqual({});
        expect(validarContacto({ nombre: "Ana", email: "ana@yahoo.com", comentario: "Hola" }).email).toBeDefined();
    });

    it("checkout: la dirección solo es obligatoria con despacho a domicilio", () => {
        const base = { nombre: "Ana", apellidos: "Soto", email: "ana@gmail.com", calle: "", region: "", comuna: "" };
        expect(validarCheckout({ ...base, entrega: "domicilio" }).calle).toBeDefined();
        expect(validarCheckout({ ...base, entrega: "retiro" })).toEqual({});
    });
});
