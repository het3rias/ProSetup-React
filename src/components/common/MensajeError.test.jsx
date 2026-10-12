/* Pruebas de RENDERIZADO CONDICIONAL */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MensajeError from "./MensajeError.jsx";
import CampoFormulario from "./CampoFormulario.jsx";

describe("MensajeError y CampoFormulario", () => {
    it("no muestra nada cuando no hay error", () => {
        const { container } = render(<MensajeError mensaje="" />);
        expect(container.innerHTML).toBe("");
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("muestra el mensaje solo cuando hay un error presente", () => {
        render(<MensajeError mensaje="El correo es obligatorio." />);
        expect(screen.getByRole("alert").textContent).toBe("El correo es obligatorio.");
    });

    it("CampoFormulario marca el input como inválido y muestra el error recibido por props", () => {
        render(<CampoFormulario etiqueta="Nombre" name="nombre" value="" onChange={() => {}} error="Obligatorio" requerido />);
        const input = screen.getByLabelText(/Nombre/);
        expect(input.classList.contains("is-invalid")).toBe(true);
        expect(screen.getByRole("alert").textContent).toBe("Obligatorio");
    });

    it("CampoFormulario renderiza un select con las opciones recibidas", () => {
        render(<CampoFormulario etiqueta="Tipo" name="tipo" como="select" value="" onChange={() => {}} opciones={["A", "B", "C"]} placeholder="--" />);
        expect(screen.getAllByRole("option").length).toBe(4);
    });
});
