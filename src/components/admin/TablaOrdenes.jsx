import { Link } from "react-router-dom";
import { formatearFecha, formatearPrecio } from "../../utils/tienda.js";
import EstadoOrden from "./EstadoOrden.jsx";

/** Tabla de órdenes reutilizada en Órdenes, Dashboard e Historial de compras del usuario. */
export default function TablaOrdenes({ ordenes, mensajeVacio = "No hay órdenes registradas." }) {
    if (!ordenes.length) return <p className="text-muted" data-testid="sin-ordenes">{mensajeVacio}</p>;
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th></th></tr>
                </thead>
                <tbody>
                    {ordenes.map(o => (
                        <tr key={o.id}>
                            <td>#{o.id}</td>
                            <td className="small">{formatearFecha(o.fecha)}</td>
                            <td>{o.cliente.nombre} {o.cliente.apellidos}<div className="small text-muted">{o.cliente.email}</div></td>
                            <td>{o.items.reduce((s, i) => s + i.cantidad, 0)}</td>
                            <td className="fw-semibold">{formatearPrecio(o.total)}</td>
                            <td><EstadoOrden estado={o.estado} /></td>
                            <td><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-secondary">Ver boleta</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
