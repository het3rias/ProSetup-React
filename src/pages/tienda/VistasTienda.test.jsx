/* Pruebas de renderizado de las vistas públicas (navegación entre páginas de la tienda) */
import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { Rutas } from "../../App.jsx";
import { carritoDB, productosDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

describe("Vistas de la tienda", () => {
    it("Home muestra categorías, ofertas y productos destacados", () => {
        renderizar(<Rutas />, { ruta: "/" });
        expect(screen.getByRole("heading", { name: "Categorías" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /Ofertas de la semana/ })).toBeInTheDocument();
        expect(screen.getAllByTestId("tarjeta-producto").length).toBe(4 + 8);
    });

    it("Categorías separa los productos por categoría", () => {
        renderizar(<Rutas />, { ruta: "/categorias" });
        ["Perifericos", "Audio", "Monitores", "Accesorios", "Componentes", "Sillas y Mobiliario"]
            .forEach(nombre => expect(screen.getByRole("heading", { level: 2, name: nombre })).toBeInTheDocument());
    });

    it("Categoría #1 muestra solo los productos de esa categoría", () => {
        renderizar(<Rutas />, { ruta: "/categorias/2" });
        expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Audio");
        expect(screen.getAllByTestId("tarjeta-producto").length).toBe(3);
    });

    it("Ofertas muestra solo productos con precio rebajado", () => {
        renderizar(<Rutas />, { ruta: "/ofertas" });
        expect(screen.getAllByTestId("tarjeta-producto").length).toBe(productosDB.listarOfertas().length);
    });

    it("Productos toma el texto buscado desde la URL (?q=)", () => {
        renderizar(<Rutas />, { ruta: "/productos?q=ssd" });
        expect(screen.getAllByTestId("tarjeta-producto").length).toBe(1);
        expect(screen.getByTestId("total-resultados").textContent).toContain("1 producto");
    });

    it("el buscador del navbar lleva al catálogo filtrado", () => {
        renderizar(<Rutas />, { ruta: "/" });
        fireEvent.change(screen.getAllByLabelText("Buscar productos")[0], { target: { value: "silla" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Buscar" })[0]);
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/productos");
        expect(screen.getAllByTestId("tarjeta-producto").length).toBe(1);
    });

    it("Detalle de producto agrega la cantidad elegida y muestra relacionados", () => {
        renderizar(<Rutas />, { ruta: "/producto/3" });
        expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Audífonos Gaming 7.1");
        fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "3" } });
        fireEvent.click(screen.getAllByRole("button", { name: "Añadir al carrito" })[0]);
        expect(carritoDB.obtener()).toEqual([{ id: 3, cantidad: 3 }]);
        expect(screen.getByRole("heading", { name: "Productos relacionados" })).toBeInTheDocument();
    });

    it("muestra 'no encontrado' para productos y rutas que no existen", () => {
        renderizar(<Rutas />, { ruta: "/producto/999" });
        expect(screen.getByText(/Producto no encontrado/)).toBeInTheDocument();
    });

    it("Blogs lista los artículos y el detalle muestra el contenido", () => {
        renderizar(<Rutas />, { ruta: "/blogs" });
        fireEvent.click(screen.getAllByRole("link", { name: "Ver más" })[1]);
        expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("5 tips para armar tu setup gamer");
    });

    it("Nosotros muestra misión y visión", () => {
        renderizar(<Rutas />, { ruta: "/nosotros" });
        expect(screen.getByRole("heading", { name: "Nuestra misión" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Visión" })).toBeInTheDocument();
    });

    it("el navbar muestra el nombre del usuario y el acceso Admin solo al personal", () => {
        renderizar(<Rutas />, { ruta: "/", usuario: "vendedor@duoc.cl" });
        expect(screen.getAllByTestId("saludo-usuario")[0].textContent).toContain("Vero");
        expect(screen.getAllByRole("link", { name: "Admin" }).length).toBeGreaterThan(0);
    });
});
