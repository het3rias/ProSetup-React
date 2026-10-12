/* Pruebas del flujo de compra: autocompletado, envío y resultado del pago */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import Checkout from "./Checkout.jsx";
import { carritoDB, ordenesDB, productosDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

const opciones = (extra = {}) => ({
    ruta: "/checkout", patron: "/checkout",
    preparar: () => carritoDB.guardar([{ id: 1, cantidad: 1 }]), // Teclado $45.990
    ...extra
});
const escribir = (etiqueta, name, value) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { name, value } });

function llenarDatosInvitado() {
    escribir(/^Nombre/, "nombre", "Pedro");
    escribir(/Apellidos/, "apellidos", "Hacker");
    escribir(/Correo/, "email", "pedro@gmail.com");
    escribir(/Calle y número/, "calle", "Los Crisantemos 123");
    escribir(/Región/, "region", "Región Metropolitana de Santiago");
    escribir(/Comuna/, "comuna", "Maipú");
}

describe("Checkout", () => {
    it("redirige al carrito si está vacío", () => {
        renderizar(<Checkout />, { ruta: "/checkout", patron: "/checkout" });
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/carrito");
    });

    it("si el usuario inició sesión sus datos se completan automáticamente", () => {
        renderizar(<Checkout />, opciones({ usuario: "cliente@gmail.com" }));
        expect(screen.getByLabelText(/^Nombre/).value).toBe("Camila");
        expect(screen.getByLabelText(/Correo/).value).toBe("cliente@gmail.com");
        expect(screen.getByLabelText(/Comuna/).value).toBe("La Florida");
    });

    it("cobra envío bajo $50.000 y lo quita al elegir retiro en tienda", () => {
        renderizar(<Checkout />, opciones());
        expect(screen.getByTestId("costo-envio").textContent).toBe("$3.990");
        expect(screen.getByTestId("total-checkout").textContent).toBe("$49.980");
        fireEvent.click(screen.getByLabelText(/Retiro en tienda/));
        expect(screen.getByTestId("costo-envio").textContent).toBe("Gratis");
        expect(screen.queryByLabelText(/Calle y número/)).not.toBeInTheDocument();
    });

    it("no procesa el pago si faltan datos obligatorios", () => {
        renderizar(<Checkout />, opciones());
        const crear = vi.spyOn(ordenesDB, "crear");
        fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
        expect(crear).not.toHaveBeenCalled();
        expect(screen.getByText("La calle es obligatoria.")).toBeInTheDocument();
    });

    it("pago exitoso: crea la orden, descuenta stock, vacía el carrito y va a compra exitosa", () => {
        renderizar(<Checkout />, opciones());
        llenarDatosInvitado();
        fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

        const orden = ordenesDB.listar()[0];
        expect(orden.estado).toBe("Pagada");
        expect(orden.total).toBe(49980);
        expect(productosDB.obtenerPorId(1).stock).toBe(14);
        expect(carritoDB.obtener()).toEqual([]);
        expect(screen.getByTestId("ruta-actual").textContent).toBe(`/compra-exitosa/${orden.id}`);
    });

    it("pago rechazado: registra la orden rechazada, mantiene el carrito y va a la vista de error", () => {
        renderizar(<Checkout />, opciones());
        llenarDatosInvitado();
        fireEvent.click(screen.getByLabelText(/Simular pago rechazado/));
        fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

        const orden = ordenesDB.listar()[0];
        expect(orden.estado).toBe("Rechazada");
        expect(productosDB.obtenerPorId(1).stock).toBe(15);
        expect(carritoDB.obtener().length).toBe(1);
        expect(screen.getByTestId("ruta-actual").textContent).toBe(`/compra-fallida/${orden.id}`);
    });
});
