import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { formatearPrecio, tieneStockCritico } from "../../utils/tienda.js";
import Alerta from "../../components/common/Alerta.jsx";

/**
 * Listado de productos del panel.
 * Vendedor: solo puede ver (no ve Nuevo / Editar / Eliminar).
 */
export default function AdminProductos() {
    const { esAdmin } = useAuth();
    const productos = useDatos(() => productosDB.listar());
    const navegar = useNavigate();
    const [texto, setTexto] = useState("");
    const [mensaje, setMensaje] = useState("");

    const t = texto.trim().toLowerCase();
    const filtrados = productos.filter(p => !t || p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t) || p.categoria.toLowerCase().includes(t));

    const eliminar = (producto) => {
        if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
        productosDB.eliminar(producto.id);
        setMensaje(`Producto "${producto.nombre}" eliminado.`);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h1 className="h3 mb-0">Productos</h1>
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/productos/criticos" className="btn btn-outline-warning">Productos críticos</Link>
                    {esAdmin && <Link to="/admin/reportes" className="btn btn-outline-secondary">Reportes</Link>}
                    {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>}
                </div>
            </div>
            <Alerta tipo="success" mensaje={mensaje} onCerrar={() => setMensaje("")} />
            <input type="search" className="form-control mb-3" placeholder="Buscar por nombre, código o categoría" aria-label="Buscar productos"
                value={texto} onChange={(e) => setTexto(e.target.value)} />
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr><th>Imagen</th><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {filtrados.map(p => (
                                <tr key={p.id} data-testid="fila-producto">
                                    <td><img src={p.imagen} alt={p.nombre} className="miniatura rounded" onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} /></td>
                                    <td>{p.codigo}</td>
                                    <td>{p.nombre} {p.precioOferta != null && <span className="badge bg-danger">Oferta</span>}</td>
                                    <td>{p.categoria}</td>
                                    <td>{formatearPrecio(p.precio)}</td>
                                    <td>{p.stock} {tieneStockCritico(p) && <span className="badge bg-warning text-dark">crítico</span>}</td>
                                    <td className="text-nowrap">
                                        <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => navegar(`/admin/productos/${p.id}`)}>Ver</button>
                                        {esAdmin && (
                                            <>
                                                <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => navegar(`/admin/productos/${p.id}/editar`)}>Editar</button>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p)}>Eliminar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!filtrados.length && <tr><td colSpan="7" className="text-muted">No hay productos.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
