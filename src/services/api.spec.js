/* Pruebas del cliente de la API (api.js): token JWT, renovación y errores. fetch se reemplaza por un mock. */
import { api, ApiError, tokens, registrarAlExpirar } from "./api.js";
import { apiReal } from "../test/apiFalsa.js";

const respuesta = (status, cuerpo) => Promise.resolve(new Response(cuerpo === undefined ? "" : JSON.stringify(cuerpo), { status }));

describe("Cliente de la API (api.js)", () => {
    // setup.js instala la API falsa; para probar api.js de verdad se restauran las funciones reales
    beforeEach(() => {
        Object.assign(api.productos, apiReal.productos);
        Object.assign(api.autenticacion, apiReal.autenticacion);
        Object.assign(api.categorias, apiReal.categorias);
    });

    it("envía el token JWT en el header Authorization", async () => {
        tokens.guardar({ accessToken: "abc", refreshToken: "ref" });
        const espia = spyOn(window, "fetch").and.returnValue(respuesta(200, []));
        await api.productos.listar();
        const [url, opciones] = espia.calls.mostRecent().args;
        expect(url).toContain("/api/productos");
        expect(opciones.headers.Authorization).toBe("Bearer abc");
    });

    it("el login no envía token", async () => {
        tokens.guardar({ accessToken: "abc", refreshToken: "ref" });
        const espia = spyOn(window, "fetch").and.returnValue(respuesta(200, {}));
        await api.autenticacion.login("a@gmail.com", "1234");
        expect(espia.calls.mostRecent().args[1].headers.Authorization).toBeUndefined();
    });

    it("si el servidor responde 401 renueva el token con el refreshToken y repite la petición", async () => {
        tokens.guardar({ accessToken: "viejo", refreshToken: "ref" });
        const espia = spyOn(window, "fetch").and.returnValues(
            respuesta(401, { mensaje: "Token vencido" }),
            respuesta(200, { accessToken: "nuevo", refreshToken: "ref2" }),
            respuesta(200, [{ id: 1 }])
        );
        const datos = await api.productos.listar();
        expect(datos).toEqual([{ id: 1 }]);
        expect(espia).toHaveBeenCalledTimes(3);
        expect(tokens.obtenerAcceso()).toBe("nuevo");
    });

    it("si no se puede renovar, borra los tokens y avisa para cerrar la sesión", async () => {
        tokens.guardar({ accessToken: "viejo", refreshToken: "ref" });
        const alExpirar = jasmine.createSpy("alExpirar");
        registrarAlExpirar(alExpirar);
        spyOn(window, "fetch").and.returnValues(respuesta(401, {}), respuesta(401, {}), respuesta(401, { mensaje: "Debes iniciar sesión." }));
        await expectAsync(api.productos.listar()).toBeRejected();
        expect(tokens.hayToken()).toBe(false);
        expect(alExpirar).toHaveBeenCalled();
        registrarAlExpirar(() => {});
    });

    it("convierte los errores del servidor en ApiError con su mensaje", async () => {
        spyOn(window, "fetch").and.returnValue(respuesta(409, { mensaje: "Ya existe un producto con ese código." }));
        try {
            await api.productos.crear({});
            fail("debía fallar");
        } catch (error) {
            expect(error instanceof ApiError).toBe(true);
            expect(error.status).toBe(409);
            expect(error.message).toBe("Ya existe un producto con ese código.");
        }
    });

    it("si no hay conexión lanza un ApiError con status 0", async () => {
        spyOn(window, "fetch").and.returnValue(Promise.reject(new TypeError("Failed to fetch")));
        await expectAsync(api.productos.listar()).toBeRejectedWithError(/No se pudo conectar/);
    });
});
