/* Pruebas de control de acceso por rol */
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import RutaProtegida from "./RutaProtegida.jsx";
import { renderizar } from "../test/utilidades.jsx";

const Secreto = () => <p>Contenido del panel</p>;
const protegido = <RutaProtegida roles={["Administrador", "Vendedor"]}><Secreto /></RutaProtegida>;

describe("RutaProtegida", () => {
    it("sin sesión redirige al login", () => {
        renderizar(protegido, { ruta: "/admin", patron: "/admin" });
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/login");
        expect(screen.queryByText("Contenido del panel")).not.toBeInTheDocument();
    });

    it("un Cliente ve 'Acceso denegado'", () => {
        renderizar(protegido, { ruta: "/admin", patron: "/admin", usuario: "cliente@gmail.com" });
        expect(screen.getByTestId("acceso-denegado")).toBeInTheDocument();
    });

    it("un Vendedor puede entrar", () => {
        renderizar(protegido, { ruta: "/admin", patron: "/admin", usuario: "vendedor@duoc.cl" });
        expect(screen.getByText("Contenido del panel")).toBeInTheDocument();
    });
});
