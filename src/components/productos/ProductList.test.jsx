/* Pruebas de RENDERIZADO: lista de productos y tarjeta */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductList from "./ProductList.jsx";
import ProductCard from "./ProductCard.jsx";
import { productosIniciales } from "../../data/datosIniciales.js";
import { productoEjemplo } from "../../test/utilidades.jsx";

const conRouter = (ui) => render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>);

describe("ProductList", () => {
    it("renderiza TODOS los elementos del conjunto de datos", () => {
        conRouter(<ProductList productos={productosIniciales} onAgregar={() => {}} />);
        expect(screen.getAllByTestId("tarjeta-producto").length).toBe(productosIniciales.length);
        productosIniciales.forEach(p => expect(screen.getByText(p.nombre)).toBeInTheDocument());
    });

    it("muestra el mensaje de lista vacía cuando no hay productos", () => {
        conRouter(<ProductList productos={[]} onAgregar={() => {}} mensajeVacio="Nada por aquí" />);
        expect(screen.getByTestId("lista-vacia").textContent).toBe("Nada por aquí");
        expect(screen.queryAllByTestId("tarjeta-producto").length).toBe(0);
    });
});

describe("ProductCard", () => {
    it("muestra nombre, categoría y precio del producto recibido", () => {
        conRouter(<ProductCard producto={productoEjemplo} onAgregar={() => {}} />);
        expect(screen.getByText("Teclado de Prueba")).toBeInTheDocument();
        expect(screen.getByText("Perifericos")).toBeInTheDocument();
        expect(screen.getByText("$10.000")).toBeInTheDocument();
    });

    it("al hacer clic en Añadir llama a onAgregar con el producto", () => {
        const onAgregar = vi.fn();
        conRouter(<ProductCard producto={productoEjemplo} onAgregar={onAgregar} />);
        fireEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));
        expect(onAgregar).toHaveBeenCalledExactlyOnceWith(productoEjemplo);
    });

    it("muestra precio de oferta con descuento y deshabilita el botón si no hay stock", () => {
        conRouter(<ProductCard producto={{ ...productoEjemplo, precioOferta: 8000, stock: 0 }} onAgregar={() => {}} />);
        expect(screen.getByText("$8.000")).toBeInTheDocument();
        expect(screen.getByText("-20%")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
        expect(screen.getByText("Agotado")).toBeInTheDocument();
    });
});
