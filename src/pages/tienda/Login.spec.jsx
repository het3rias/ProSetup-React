/* Pruebas con MOCKS (spyOn) y renderizado condicional del error */
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login.jsx";
import { api, ApiError } from "../../services/api.js";
import { esperar, renderizar } from "../../test/utilidades.jsx";

async function llenarYEnviar(user, email, password) {
    await user.type(screen.getByLabelText(/Correo/), email);
    await user.type(screen.getByLabelText(/Contraseña/), password);
    await user.click(screen.getByRole("button", { name: "Ingresar" }));
}

const renderLogin = () => renderizar(<Login />, { ruta: "/login", patron: "/login" });

describe("Login", () => {
    it("no muestra mensaje de error al cargar", () => {
        renderLogin();
        expect(screen.queryByText("Correo o contraseña incorrectos.")).not.toBeInTheDocument();
    });

    it("muestra el error solo cuando las credenciales son incorrectas (mock de la API de login)", async () => {
        renderLogin();
        const user = userEvent.setup();
        const autenticar = spyOn(api.autenticacion, "login").and.rejectWith(new ApiError(401, "Credenciales inválidas."));

        await llenarYEnviar(user, "ana@gmail.com", "1234");

        expect(autenticar).toHaveBeenCalledWith("ana@gmail.com", "1234");
        expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    });

    it("no llama a la base de datos si el formulario es inválido", async () => {
        renderLogin();
        const user = userEvent.setup();
        const autenticar = spyOn(api.autenticacion, "login").and.callThrough();

        await llenarYEnviar(user, "ana@hotmail.com", "12");

        expect(autenticar).not.toHaveBeenCalled();
        expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument();
    });

    it("redirige al panel cuando inicia sesión un Administrador", async () => {
        renderLogin();
        await llenarYEnviar(userEvent.setup(), "admin@duoc.cl", "1234");
        await esperar(() => screen.getByTestId("ruta-actual").textContent === "/admin");
    });

    it("redirige al inicio cuando inicia sesión un Cliente", async () => {
        renderLogin();
        await llenarYEnviar(userEvent.setup(), "cliente@gmail.com", "1234");
        await esperar(() => screen.getByTestId("ruta-actual").textContent === "/");
    });

    it("un Cliente que venía del panel admin vuelve al inicio (no a 'Acceso denegado')", async () => {
        renderizar(<Login />, { ruta: { pathname: "/login", state: { desde: "/admin" } }, patron: "/login" });
        await llenarYEnviar(userEvent.setup(), "cliente@gmail.com", "1234");
        await esperar(() => screen.getByTestId("ruta-actual").textContent === "/");
    });

    it("un Cliente que venía del checkout vuelve al checkout", async () => {
        renderizar(<Login />, { ruta: { pathname: "/login", state: { desde: "/checkout" } }, patron: "/login" });
        await llenarYEnviar(userEvent.setup(), "cliente@gmail.com", "1234");
        await esperar(() => screen.getByTestId("ruta-actual").textContent === "/checkout");
    });
});
