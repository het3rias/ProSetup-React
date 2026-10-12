/* Pruebas del panel: permisos por rol, eliminación con confirmación (mock) y formulario */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import AdminProductos from "./AdminProductos.jsx";
import AdminProductoForm from "./AdminProductoForm.jsx";
import { productosDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

describe("Admin - Productos", () => {
    it("lista todos los productos del archivo de datos", () => {
        renderizar(<AdminProductos />, { usuario: "admin@duoc.cl" });
        expect(screen.getAllByTestId("fila-producto").length).toBe(12);
    });

    it("el Vendedor solo puede ver: no aparecen Nuevo, Editar ni Eliminar", () => {
        renderizar(<AdminProductos />, { usuario: "vendedor@duoc.cl" });
        expect(screen.getAllByRole("button", { name: "Ver" }).length).toBe(12);
        expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Eliminar" })).not.toBeInTheDocument();
        expect(screen.queryByText("+ Nuevo producto")).not.toBeInTheDocument();
    });

    it("el Administrador elimina un producto tras confirmar y la tabla se actualiza", () => {
        renderizar(<AdminProductos />, { usuario: "admin@duoc.cl" });
        vi.spyOn(window, "confirm").mockReturnValue(true);
        fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
        expect(productosDB.obtenerPorId(1)).toBeNull();
        expect(screen.getAllByTestId("fila-producto").length).toBe(11);
        expect(screen.getByText(/eliminado/)).toBeInTheDocument();
    });

    it("el buscador filtra la tabla", () => {
        renderizar(<AdminProductos />, { usuario: "admin@duoc.cl" });
        fireEvent.change(screen.getByLabelText("Buscar productos"), { target: { value: "audio" } });
        expect(screen.getAllByTestId("fila-producto").length).toBe(3);
    });

    it("el formulario de nuevo producto valida el código duplicado y guarda uno válido", () => {
        renderizar(<AdminProductoForm />, { ruta: "/admin/productos/nuevo", patron: "/admin/productos/nuevo", usuario: "admin@duoc.cl" });
        const escribir = (et, name, value) => fireEvent.change(screen.getByLabelText(et), { target: { name, value } });
        escribir(/Código/, "codigo", "TEC-001");
        escribir(/^Nombre/, "nombre", "Teclado 60%");
        escribir(/^Precio$|^Precio \*/, "precio", "39990");
        escribir(/^Stock \*/, "stock", "5");
        escribir(/Categoría/, "categoria", "Perifericos");
        fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));
        expect(screen.getByText("Ya existe un producto con este código.")).toBeInTheDocument();

        escribir(/Código/, "codigo", "TEC-060");
        fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));
        expect(productosDB.listar().some(p => p.codigo === "TEC-060")).toBe(true);
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin/productos");
    });
});
