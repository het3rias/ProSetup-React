import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ordenesDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { ESTADOS_ORDEN } from "../../utils/reportes.js";
import { formatearFecha } from "../../utils/tienda.js";
import TablaDetalleCompra from "../../components/carrito/TablaDetalleCompra.jsx";
import EstadoOrden from "../../components/admin/EstadoOrden.jsx";
import { DatosOrden, TotalesOrden } from "../tienda/ResultadoCompra.jsx";

/** Mostrar boleta: detalle de una orden. El Administrador puede cambiar su estado. */
export default function AdminBoleta() {
    const { id } = useParams();
    const { esAdmin } = useAuth();
    const orden = useDatos(() => ordenesDB.obtenerPorId(id), [id]);

    if (!orden) return <p>Orden no encontrada. <Link to="/admin/ordenes">Volver</Link></p>;

    return (
        <>
            <Link to="/admin/ordenes" className="no-imprimir">&larr; Volver a órdenes</Link>
            <div className="card shadow-sm mt-3 boleta">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                        <h1 className="h4 mb-0">Boleta N° {orden.id} <EstadoOrden estado={orden.estado} /></h1>
                        <small className="text-muted">{orden.codigo} · {formatearFecha(orden.fecha)}</small>
                    </div>
                    {orden.motivo && <div className="alert alert-danger">{orden.motivo}</div>}
                    <DatosOrden orden={orden} />
                    <TablaDetalleCompra items={orden.items} />
                    <TotalesOrden orden={orden} />
                    <div className="d-flex gap-2 flex-wrap align-items-center no-imprimir">
                        {esAdmin && orden.estado !== "Rechazada" && (
                            <>
                                <label htmlFor="estado-orden" className="form-label mb-0">Cambiar estado:</label>
                                <select id="estado-orden" className="form-select w-auto" value={orden.estado}
                                    onChange={(e) => ordenesDB.actualizarEstado(orden.id, e.target.value)}>
                                    {ESTADOS_ORDEN.filter(e => e !== "Rechazada").map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </>
                        )}
                        <button type="button" className="btn btn-outline-dark ms-auto" onClick={() => window.print()}>Imprimir boleta</button>
                    </div>
                </div>
            </div>
        </>
    );
}
