/* Pruebas con MOCKS (vi.spyOn) y renderizado condicional del error */
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login.jsx";
import { usuariosDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

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

    it("muestra el error solo cuando las credenciales son incorrectas (mock de autenticar)", async () => {
        renderLogin();
        const user = userEvent.setup();
        const autenticar = vi.spyOn(usuariosDB, "autenticar").mockReturnValue(null);

        await llenarYEnviar(user, "ana@gmail.com", "1234");

        expect(autenticar).toHaveBeenCalledWith("ana@gmail.com", "1234");
        expect(screen.getByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    });

    it("no llama a la base de datos si el formulario es inválido", async () => {
        renderLogin();
        const user = userEvent.setup();
        const autenticar = vi.spyOn(usuariosDB, "autenticar");

        await llenarYEnviar(user, "ana@hotmail.com", "12");

        expect(autenticar).not.toHaveBeenCalled();
        expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument();
    });

    it("redirige al panel cuando inicia sesión un Administrador", async () => {
        renderLogin();
        await llenarYEnviar(userEvent.setup(), "admin@duoc.cl", "1234");
        expect(screen.getByTestId("ruta-actual")).toHaveTextContent("/admin");
    });

    it("redirige al inicio cuando inicia sesión un Cliente", async () => {
        renderLogin();
        await llenarYEnviar(userEvent.setup(), "cliente@gmail.com", "1234");
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/");
    });
});
