/* Pruebas de las vistas del panel de administración */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { Rutas } from "../../App.jsx";
import { categoriasDB, ordenesDB, usuariosDB } from "../../data/db.js";
import { renderizar } from "../../test/utilidades.jsx";

const ADMIN = "admin@duoc.cl";

describe("Vistas del administrador", () => {
    it("Dashboard muestra estadísticas y accesos según el rol (Administrador)", () => {
        renderizar(<Rutas />, { ruta: "/admin", usuario: ADMIN });
        expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
        expect(screen.getAllByTestId("valor-estadistica").map(e => e.textContent)).toEqual(["2", "12", "3"]);
        expect(screen.getAllByRole("link", { name: /Usuarios/ }).length).toBeGreaterThan(0);
    });

    it("el Vendedor no ve Usuarios, Categorías ni Reportes en el menú", () => {
        renderizar(<Rutas />, { ruta: "/admin", usuario: "vendedor@duoc.cl" });
        const menu = screen.getByRole("navigation", { name: "Menú del panel" });
        expect(menu.textContent).toContain("Órdenes");
        expect(menu.textContent).not.toContain("Usuarios");
        expect(menu.textContent).not.toContain("Reportes");
    });

    it("el Vendedor no puede abrir el mantenedor de usuarios por URL", () => {
        renderizar(<Rutas />, { ruta: "/admin/usuarios", usuario: "vendedor@duoc.cl" });
        expect(screen.getByTestId("acceso-denegado")).toBeInTheDocument();
    });

    it("Órdenes filtra por estado", () => {
        renderizar(<Rutas />, { ruta: "/admin/ordenes", usuario: ADMIN });
        fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "Enviada" } });
        expect(screen.getAllByRole("link", { name: "Ver boleta" }).length).toBe(1);
        fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "Entregada" } });
        expect(screen.getByTestId("sin-ordenes")).toBeInTheDocument();
    });

    it("Mostrar boleta permite al Administrador cambiar el estado", () => {
        renderizar(<Rutas />, { ruta: "/admin/ordenes/1001", usuario: ADMIN });
        expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Boleta N° 1001");
        fireEvent.change(screen.getByLabelText("Cambiar estado:"), { target: { value: "Entregada" } });
        expect(ordenesDB.obtenerPorId(1001).estado).toBe("Entregada");
    });

    it("Productos críticos lista los que llegaron al umbral", () => {
        renderizar(<Rutas />, { ruta: "/admin/productos/criticos", usuario: ADMIN });
        expect(screen.getByText("Silla Gamer Ergonómica")).toBeInTheDocument();
        expect(screen.getByText("Soporte de Monitor Articulado")).toBeInTheDocument();
    });

    it("Mostrar producto y Editar producto", () => {
        renderizar(<Rutas />, { ruta: "/admin/productos/1", usuario: ADMIN });
        fireEvent.click(screen.getByRole("link", { name: "Editar producto" }));
        const precio = screen.getByLabelText(/^Precio \*/);
        expect(precio.value).toBe("45990");
        fireEvent.change(precio, { target: { name: "precio", value: "40000" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
        expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin/productos");
    });

    it("Reportes muestra el total vendido", () => {
        renderizar(<Rutas />, { ruta: "/admin/reportes", usuario: ADMIN });
        expect(screen.getAllByTestId("valor-estadistica")[0].textContent).toBe("$125.970");
        expect(screen.getByRole("heading", { name: "Productos más vendidos" })).toBeInTheDocument();
    });

    it("Categorías: no elimina una categoría con productos y crea una nueva", () => {
        renderizar(<Rutas />, { ruta: "/admin/categorias", usuario: ADMIN });
        vi.spyOn(window, "confirm").mockReturnValue(true);
        fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
        expect(screen.getByText(/tiene productos asociados/)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("link", { name: "+ Nueva categoría" }));
        fireEvent.change(screen.getByLabelText(/Nombre/), { target: { name: "nombre", value: "Redes" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
        expect(categoriasDB.existeNombre("Redes")).toBe(true);
    });

    it("Mostrar usuario incluye su historial de compras", () => {
        renderizar(<Rutas />, { ruta: "/admin/usuarios/204567891", usuario: ADMIN });
        expect(screen.getByRole("heading", { name: "Historial de compras" })).toBeInTheDocument();
        expect(screen.getAllByRole("link", { name: "Ver boleta" }).length).toBe(2);
    });

    it("Usuarios: no permite eliminar la propia cuenta", () => {
        renderizar(<Rutas />, { ruta: "/admin/usuarios", usuario: ADMIN });
        fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
        expect(screen.getByText("No puedes eliminar tu propia cuenta.")).toBeInTheDocument();
    });

    it("Editar usuario cambia el rol", () => {
        renderizar(<Rutas />, { ruta: "/admin/usuarios/204567891/editar", usuario: ADMIN });
        fireEvent.change(screen.getByLabelText(/Tipo de usuario/), { target: { name: "tipoUsuario", value: "Vendedor" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
        expect(usuariosDB.obtenerPorEmail("cliente@gmail.com").tipoUsuario).toBe("Vendedor");
    });

    it("Perfil actualiza los datos del usuario conectado", () => {
        renderizar(<Rutas />, { ruta: "/admin/perfil", usuario: ADMIN });
        expect(screen.getByLabelText(/RUN/)).toBeDisabled();
        fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { name: "telefono", value: "987654321" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar perfil" }));
        expect(screen.getByText("Perfil actualizado correctamente.")).toBeInTheDocument();
        expect(usuariosDB.obtenerPorEmail(ADMIN).telefono).toBe("987654321");
    });
});
