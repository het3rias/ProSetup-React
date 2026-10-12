/* Pruebas de EVENTOS: fila del carrito */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CartItem from "./CartItem.jsx";

const item = { id: 7, nombre: "Silla", imagen: "/img/silla.webp", precioUnitario: 1000, cantidad: 2, subtotal: 2000, stock: 2 };
const enTabla = (ui) => render(<table><tbody>{ui}</tbody></table>);

describe("CartItem", () => {
    it("al presionar - pide cambiar la cantidad a una unidad menos", () => {
        const onCambiarCantidad = vi.fn();
        enTabla(<CartItem item={item} onCambiarCantidad={onCambiarCantidad} onEliminar={() => {}} />);
        fireEvent.click(screen.getByLabelText("Disminuir Silla"));
        expect(onCambiarCantidad).toHaveBeenCalledWith(7, 1);
    });

    it("deshabilita + cuando la cantidad llega al stock", () => {
        enTabla(<CartItem item={item} onCambiarCantidad={() => {}} onEliminar={() => {}} />);
        expect(screen.getByLabelText("Aumentar Silla")).toBeDisabled();
    });

    it("al presionar Eliminar llama a onEliminar con el id", () => {
        const onEliminar = vi.fn();
        enTabla(<CartItem item={item} onCambiarCantidad={() => {}} onEliminar={onEliminar} />);
        fireEvent.click(screen.getByRole("button", { name: "Eliminar Silla" }));
        expect(onEliminar).toHaveBeenCalledExactlyOnceWith(7);
    });
});
