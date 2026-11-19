/* Pruebas de la sesión: login con JWT y restauración al recargar la página (F5) */
import { screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { render } from "@testing-library/react";
import { reiniciarDB } from "../data/db.js";
import { api, tokens } from "../services/api.js";
import { esperar } from "../test/utilidades.jsx";

function Estado() {
    const { usuario, cargando } = useAuth();
    return <div data-testid="estado">{cargando ? "cargando" : (usuario?.email ?? "sin-sesion")}</div>;
}

describe("AuthContext", () => {
    it("restaura la sesión con el token guardado (simula recargar la página)", async () => {
        reiniciarDB();
        await api.autenticacion.login("admin@duoc.cl", "1234");           // el servidor "recuerda" la sesión
        tokens.guardar({ accessToken: "token-falso", refreshToken: "refresh-falso" }); // los tokens sobreviven en sessionStorage
        // al recargar, la memoria de la app está vacía (sesionDB sin usuario) pero el token sigue ahí
        render(<AuthProvider><Estado /></AuthProvider>);
        expect(screen.getByTestId("estado").textContent).toBe("cargando");
        await esperar(() => screen.getByTestId("estado").textContent === "admin@duoc.cl");
    });

    it("sin token no hay sesión y no se llama al servidor", () => {
        reiniciarDB();
        const espia = spyOn(api.autenticacion, "yo").and.callThrough();
        render(<AuthProvider><Estado /></AuthProvider>);
        expect(screen.getByTestId("estado").textContent).toBe("sin-sesion");
        expect(espia).not.toHaveBeenCalled();
    });

    it("si el token ya no sirve, descarta la sesión", async () => {
        reiniciarDB();
        tokens.guardar({ accessToken: "malo", refreshToken: "malo" });
        spyOn(api.autenticacion, "yo").and.rejectWith(Object.assign(new Error("Debes iniciar sesión."), { status: 401, name: "ApiError" }));
        render(<AuthProvider><Estado /></AuthProvider>);
        await esperar(() => screen.getByTestId("estado").textContent === "sin-sesion");
        expect(tokens.hayToken()).toBe(false);
    });
});
