import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Menú del panel. "roles" indica quién puede ver cada opción.
export const MENU_ADMIN = [
    { ruta: "/admin", texto: "Dashboard", icono: "🏠", roles: ["Administrador", "Vendedor"], exacta: true },
    { ruta: "/admin/ordenes", texto: "Órdenes", icono: "🧾", roles: ["Administrador", "Vendedor"] },
    { ruta: "/admin/productos", texto: "Productos", icono: "📦", roles: ["Administrador", "Vendedor"] },
    { ruta: "/admin/categorias", texto: "Categorías", icono: "🏷️", roles: ["Administrador"] },
    { ruta: "/admin/usuarios", texto: "Usuarios", icono: "👤", roles: ["Administrador"] },
    { ruta: "/admin/reportes", texto: "Reportes", icono: "📊", roles: ["Administrador"] },
    { ruta: "/admin/perfil", texto: "Perfil", icono: "⚙️", roles: ["Administrador", "Vendedor"] }
];

/** Estructura del panel de administración: menú lateral + contenido. */
export default function AdminLayout() {
    const { usuario, cerrarSesion } = useAuth();
    const navegar = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const opciones = MENU_ADMIN.filter(op => op.roles.includes(usuario.tipoUsuario));

    const salir = () => {
        cerrarSesion();
        navegar("/");
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="d-flex justify-content-between align-items-center px-3 mb-3">
                    <span className="admin-sidebar-title p-0">ProSetup Admin</span>
                    <button type="button" className="btn btn-sm btn-outline-light d-md-none" aria-label="Abrir menú del panel"
                        onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
                </div>
                <nav className={"admin-menu" + (menuAbierto ? " abierto" : "")} aria-label="Menú del panel">
                    {opciones.map(op => (
                        <NavLink key={op.ruta} to={op.ruta} end={op.exacta}
                            className={({ isActive }) => (isActive ? "activo" : "")} onClick={() => setMenuAbierto(false)}>
                            <span aria-hidden="true">{op.icono}</span> {op.texto}
                        </NavLink>
                    ))}
                    <div className="admin-sidebar-footer">
                        <NavLink to="/">🏬 Ver tienda</NavLink>
                        <button type="button" className="btn btn-danger btn-sm mx-3 mt-2" onClick={salir}>Cerrar sesión</button>
                    </div>
                </nav>
            </aside>

            <div className="admin-content">
                <header className="admin-topbar">
                    <span className="text-muted small">Panel de administración</span>
                    <span className="badge bg-primary badge-rol">{usuario.tipoUsuario} · {usuario.nombre}</span>
                </header>
                <Outlet />
            </div>
        </div>
    );
}
