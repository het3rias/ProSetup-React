/* Pruebas de integración: carrito + contexto + navbar (estado compartido) */
import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import Carrito from "./Carrito.jsx";
import Navbar from "../../components/layout/Navbar.jsx";
import Ofertas from "./Ofertas.jsx";
import { carritoDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

describe("Carrito de compras", () => {
    it("muestra el mensaje de carrito vacío", () => {
        renderizar(<Carrito />);
        expect(screen.getByTestId("carrito-vacio")).toBeInTheDocument();
    });

    it("al agregar desde la lista, el contador del navbar se actualiza al instante", () => {
        renderizar(<><Navbar /><Ofertas /></>);
        expect(screen.getByTestId("contador-carrito").textContent).toBe("0");
        fireEvent.click(screen.getAllByRole("button", { name: "Añadir al carrito" })[0]);
        expect(screen.getByTestId("contador-carrito").textContent).toBe("1");
        expect(carritoDB.obtener().length).toBe(1);
    });

    it("cambia cantidades, recalcula el total y elimina productos", () => {
        renderizar(<Carrito />, { preparar: () => carritoDB.guardar([{ id: 1, cantidad: 1 }]) }); // Teclado $45.990
        expect(screen.getByTestId("total-carrito").textContent).toBe("$45.990");

        fireEvent.click(screen.getByLabelText("Aumentar Teclado Mecánico RGB"));
        expect(screen.getByTestId("total-carrito").textContent).toBe("$91.980");

        const fila = screen.getByTestId("fila-carrito");
        fireEvent.click(within(fila).getByRole("button", { name: /Eliminar/ }));
        expect(screen.getByTestId("carrito-vacio")).toBeInTheDocument();
    });

    it("se actualiza en tiempo real cuando la base de datos cambia (suscripción)", () => {
        renderizar(<Carrito />);
        act(() => carritoDB.guardar([{ id: 3, cantidad: 2 }]));
        expect(screen.getAllByTestId("fila-carrito").length).toBe(1);
        expect(screen.getByTestId("cantidad").textContent).toBe("2");
    });

    it("pide confirmación antes de vaciar (mock de window.confirm)", () => {
        renderizar(<Carrito />, { preparar: () => carritoDB.guardar([{ id: 2, cantidad: 1 }]) });
        const confirmar = vi.spyOn(window, "confirm").mockReturnValue(false);
        fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
        expect(confirmar).toHaveBeenCalled();
        expect(carritoDB.obtener().length).toBe(1);
    });
});
