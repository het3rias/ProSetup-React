/* Pruebas de LÓGICA: reglas del carrito, precios y envío */
import { describe, it, expect } from "vitest";
import { agregarItem, calcularEnvio, detallarCarrito, formatearPrecio, porcentajeDescuento, precioFinal, validarStockCarrito, COSTO_ENVIO } from "./tienda.js";
import { productoEjemplo } from "../test/utilidades.jsx";

describe("Reglas de la tienda", () => {
    it("formatea precios en pesos chilenos", () => {
        expect(formatearPrecio(45990)).toBe("$45.990");
    });

    it("usa el precio de oferta solo si es menor al normal", () => {
        expect(precioFinal({ precio: 10000, precioOferta: 8000 })).toBe(8000);
        expect(precioFinal({ precio: 10000, precioOferta: null })).toBe(10000);
        expect(porcentajeDescuento({ precio: 10000, precioOferta: 7500 })).toBe(25);
    });

    it("agrega un producto nuevo y suma cantidad si ya estaba en el carrito", () => {
        let r = agregarItem([], productoEjemplo, 2);
        expect(r.items).toEqual([{ id: 99, cantidad: 2 }]);
        r = agregarItem(r.items, productoEjemplo, 1);
        expect(r.items[0].cantidad).toBe(3);
    });

    it("no permite superar el stock disponible", () => {
        const r1 = agregarItem([{ id: 99, cantidad: 4 }], productoEjemplo, 3);
        expect(r1.items[0].cantidad).toBe(5);
        const r2 = agregarItem(r1.items, productoEjemplo, 1);
        expect(r2.ok).toBe(false);
        expect(r2.mensaje).toContain("Solo hay 5");
    });

    it("no agrega productos sin stock", () => {
        expect(agregarItem([], { ...productoEjemplo, stock: 0 }).ok).toBe(false);
    });

    it("calcula el envío: retiro gratis, domicilio gratis desde $50.000", () => {
        expect(calcularEnvio(20000, "retiro")).toBe(0);
        expect(calcularEnvio(20000, "domicilio")).toBe(COSTO_ENVIO);
        expect(calcularEnvio(60000, "domicilio")).toBe(0);
    });

    it("detalla el carrito con precios actuales e informa problemas de stock", () => {
        const items = detallarCarrito([{ id: 99, cantidad: 7 }, { id: 123, cantidad: 1 }], [productoEjemplo]);
        expect(items.length).toBe(1); // el producto 123 ya no existe y se descarta
        expect(items[0].subtotal).toBe(70000);
        expect(validarStockCarrito(items).length).toBe(1);
    });
});
