/* Pruebas de LÓGICA: cálculos de reportes */
import { describe, it, expect } from "vitest";
import { productosMasVendidos, resumenVentas, ventasPorCategoria } from "./reportes.js";

const ordenes = [
    { estado: "Pagada", total: 30000, items: [{ id: 1, nombre: "A", precio: 10000, cantidad: 3 }] },
    { estado: "Rechazada", total: 99999, items: [{ id: 2, nombre: "B", precio: 99999, cantidad: 1 }] },
    { estado: "Enviada", total: 20000, items: [{ id: 2, nombre: "B", precio: 20000, cantidad: 1 }] }
];

describe("Reportes", () => {
    it("no cuenta las órdenes rechazadas como ventas", () => {
        const r = resumenVentas(ordenes);
        expect(r.cantidadVentas).toBe(2);
        expect(r.totalVendido).toBe(50000);
        expect(r.rechazadas).toBe(1);
        expect(r.ticketPromedio).toBe(25000);
    });

    it("ordena los productos más vendidos por unidades", () => {
        const top = productosMasVendidos(ordenes);
        expect(top[0]).toEqual(expect.objectContaining({ id: 1, unidades: 3 }));
    });

    it("agrupa las ventas por categoría del producto", () => {
        const productos = [{ id: 1, categoria: "Audio" }, { id: 2, categoria: "Monitores" }];
        expect(ventasPorCategoria(ordenes, productos)).toEqual([
            { categoria: "Audio", monto: 30000 }, { categoria: "Monitores", monto: 20000 }
        ]);
    });
});
