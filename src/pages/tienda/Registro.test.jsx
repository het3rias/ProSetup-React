/* Pruebas de ESTADO y EVENTOS: select dependiente Región -> Comuna y registro */
import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import Registro from "./Registro.jsx";
import { sesionDB, usuariosDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

const escribir = (etiqueta, name, value) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { name, value } });

describe("Registro", () => {
    it("la comuna está deshabilitada hasta elegir región y luego carga sus comunas", () => {
        renderizar(<Registro />, { ruta: "/registro", patron: "/registro" });
        const comuna = screen.getByLabelText(/Comuna/);
        expect(comuna).toBeDisabled();
        escribir(/Región/, "region", "Región de Ñuble");
        expect(comuna).not.toBeDisabled();
        expect(screen.getByRole("option", { name: "Chillán" })).toBeInTheDocument();
    });

    it("registra un Cliente nuevo, inicia sesión y vuelve al inicio", () => {
        renderizar(<Registro />, { ruta: "/registro", patron: "/registro" });
        escribir(/RUN/, "run", "176543213");
        escribir(/^Nombre/, "nombre", "Luis");
        escribir(/Apellidos/, "apellidos", "Mora");
        escribir(/Correo/, "email", "luis@duoc.cl");
        escribir(/^Contraseña/, "password", "abcd");
        escribir(/Confirmar/, "confirmar", "abcd");
        escribir(/Región/, "region", "Región del Maule");
        escribir(/Comuna/, "comuna", "Talca");
        escribir(/Dirección/, "direccion", "1 Sur 123");
        fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

        const creado = usuariosDB.obtenerPorEmail("luis@duoc.cl");
        expect(creado.tipoUsuario).toBe("Cliente");
        expect(sesionDB.obtenerEmail()).toBe("luis@duoc.cl");
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/");
    });

    it("no permite registrar un RUN que ya existe", () => {
        renderizar(<Registro />, { ruta: "/registro", patron: "/registro" });
        escribir(/RUN/, "run", "190110222");
        fireEvent.blur(screen.getByLabelText(/RUN/));
        expect(screen.getByText("Ya existe un usuario registrado con este RUN.")).toBeInTheDocument();
    });
});
