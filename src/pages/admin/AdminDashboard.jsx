import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ordenesDB, productosDB, usuariosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { resumenVentas } from "../../utils/reportes.js";
import { formatearPrecio } from "../../utils/tienda.js";
import TarjetaEstadistica from "../../components/common/TarjetaEstadistica.jsx";
import TablaOrdenes from "../../components/admin/TablaOrdenes.jsx";
import { MENU_ADMIN } from "../../components/layout/AdminLayout.jsx";

const DESCRIPCIONES = {
    "/admin": "Visión general de las métricas y estadísticas clave.",
    "/admin/ordenes": "Gestión y seguimiento de las órdenes de compra.",
    "/admin/productos": "Inventario y detalle de los productos.",
    "/admin/categorias": "Organiza los productos en categorías.",
    "/admin/usuarios": "Cuentas de usuario y sus roles.",
    "/admin/reportes": "Informes de ventas e inventario.",
    "/admin/perfil": "Tu información personal y contraseña."
};

export default function AdminDashboard() {
    const { usuario, esAdmin } = useAuth();
    const ordenes = useDatos(() => ordenesDB.listar());
    const productos = useDatos(() => productosDB.listar());
    const criticos = useDatos(() => productosDB.listarCriticos());
    const usuarios = useDatos(() => usuariosDB.listar());
    const resumen = resumenVentas(ordenes);
    const inventario = productos.reduce((s, p) => s + Number(p.stock), 0);
    const accesos = MENU_ADMIN.filter(op => op.ruta !== "/admin" && op.roles.includes(usuario.tipoUsuario));

    return (
        <>
            <h1 className="h3">Dashboard</h1>
            <p className="text-muted">¡Hola, {usuario.nombre}! Este es el resumen de la tienda.</p>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <TarjetaEstadistica titulo="Compras" valor={resumen.cantidadVentas} icono="🛒" color="primary"
                        detalle={`Total vendido: ${formatearPrecio(resumen.totalVendido)}`} />
                </div>
                <div className="col-md-4">
                    <TarjetaEstadistica titulo="Productos" valor={productos.length} icono="📦" color="success"
                        detalle={`Inventario actual: ${inventario} unidades`} />
                </div>
                {esAdmin && (
                    <div className="col-md-4">
                        <TarjetaEstadistica titulo="Usuarios" valor={usuarios.length} icono="👥" color="warning"
                            detalle={`${usuarios.filter(u => u.tipoUsuario === "Cliente").length} clientes`} />
                    </div>
                )}
            </div>

            {criticos.length > 0 && (
                <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span>⚠️ Hay <strong>{criticos.length}</strong> producto(s) con stock crítico.</span>
                    <Link to="/admin/productos/criticos" className="btn btn-sm btn-warning">Ver listado</Link>
                </div>
            )}

            <div className="row g-3 mb-4">
                {accesos.map(op => (
                    <div key={op.ruta} className="col-6 col-lg-3">
                        <Link to={op.ruta} className="card h-100 text-center text-decoration-none text-reset shadow-sm tarjeta-acceso">
                            <div className="card-body">
                                <div className="fs-2" aria-hidden="true">{op.icono}</div>
                                <h2 className="h6 mt-2">{op.texto}</h2>
                                <p className="small text-muted mb-0">{DESCRIPCIONES[op.ruta]}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="h5">Últimas órdenes</h2>
                    <TablaOrdenes ordenes={ordenes.slice(0, 5)} />
                </div>
            </div>
        </>
    );
}
