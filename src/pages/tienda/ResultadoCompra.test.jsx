/* Renderizado condicional según el resultado del pago */
import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import ResultadoCompra from "./ResultadoCompra.jsx";
import { renderizar } from "../../test/utilidades.jsx";

describe("ResultadoCompra", () => {
    it("compra exitosa: muestra el número de orden, los productos y el botón de boleta", () => {
        renderizar(<ResultadoCompra exito />, { ruta: "/compra-exitosa/1001", patron: "/compra-exitosa/:id" });
        expect(screen.getByTestId("titulo-resultado").textContent).toContain("Se ha realizado la compra");
        expect(screen.getByText("Teclado Mecánico RGB")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Enviar boleta por email" }));
        expect(screen.getByText(/Boleta enviada a cliente@gmail.com/)).toBeInTheDocument();
    });

    it("pago con error: muestra el mensaje de error y el botón para reintentar", () => {
        renderizar(<ResultadoCompra exito={false} />, { ruta: "/compra-fallida/1001", patron: "/compra-fallida/:id" });
        expect(screen.getByTestId("titulo-resultado").textContent).toContain("No se pudo realizar el pago");
        expect(screen.getByRole("link", { name: "Volver a realizar el pago" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Imprimir/ })).not.toBeInTheDocument();
    });
});
