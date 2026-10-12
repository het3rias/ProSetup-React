/* Pruebas de EVENTOS y LÓGICA: filtros de búsqueda */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FiltroProductos from "./FiltroProductos.jsx";
import { FILTROS_INICIALES, filtrarProductos } from "./filtrarProductos.js";
import { productosIniciales } from "../../data/datosIniciales.js";

describe("FiltroProductos", () => {
    it("avisa al padre los nuevos filtros cuando el usuario escribe", () => {
        const onCambiar = vi.fn();
        render(<FiltroProductos filtros={FILTROS_INICIALES} categorias={["Audio"]} onCambiar={onCambiar} />);
        fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "mouse" } });
        expect(onCambiar).toHaveBeenCalledWith({ ...FILTROS_INICIALES, texto: "mouse" });
    });

    it("avisa el cambio del checkbox 'Solo ofertas'", () => {
        const onCambiar = vi.fn();
        render(<FiltroProductos filtros={FILTROS_INICIALES} categorias={[]} onCambiar={onCambiar} />);
        fireEvent.click(screen.getByLabelText("Solo ofertas"));
        expect(onCambiar.mock.lastCall[0].soloOfertas).toBe(true);
    });

    it("filtra por texto, categoría y ordena por precio", () => {
        expect(filtrarProductos(productosIniciales, { ...FILTROS_INICIALES, texto: "mouse" }).length).toBe(2); // mouse y mousepad
        const audio = filtrarProductos(productosIniciales, { ...FILTROS_INICIALES, categoria: "Audio", orden: "precio-asc" });
        expect(audio.map(p => p.codigo)).toEqual(["AUD-002", "AUD-001", "AUD-003"]);
    });
});
