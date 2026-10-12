/* Pruebas de PROPIEDADES (props) y EVENTOS: componente Boton */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Boton from "./Boton.jsx";

describe("Boton", () => {
    it("muestra la etiqueta recibida por props", () => {
        render(<Boton etiqueta="Comprar" onClick={() => {}} />);
        expect(screen.getByRole("button", { name: "Comprar" })).toBeInTheDocument();
    });

    it("ejecuta la función onClick recibida al hacer clic (mock con vi.fn)", () => {
        const alHacerClic = vi.fn();
        render(<Boton etiqueta="Guardar" onClick={alHacerClic} />);
        fireEvent.click(screen.getByText("Guardar"));
        expect(alHacerClic).toHaveBeenCalledTimes(1);
    });

    it("aplica la variante y no ejecuta onClick si está deshabilitado", () => {
        const alHacerClic = vi.fn();
        render(<Boton etiqueta="Eliminar" variante="danger" deshabilitado onClick={alHacerClic} />);
        const boton = screen.getByRole("button", { name: "Eliminar" });
        expect(boton.className).toContain("btn-danger");
        expect(boton).toBeDisabled();
        fireEvent.click(boton);
        expect(alHacerClic).not.toHaveBeenCalled();
    });
});
