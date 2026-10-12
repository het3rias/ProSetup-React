import { ordenesDB, productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { inventarioValorizado, ordenesPorEstado, productosMasVendidos, resumenVentas, ventasPorCategoria } from "../../utils/reportes.js";
import { formatearPrecio } from "../../utils/tienda.js";
import TarjetaEstadistica from "../../components/common/TarjetaEstadistica.jsx";
import EstadoOrden from "../../components/admin/EstadoOrden.jsx";

export default function AdminReportes() {
    const ordenes = useDatos(() => ordenesDB.listar());
    const productos = useDatos(() => productosDB.listar());
    const resumen = resumenVentas(ordenes);
    const porCategoria = ventasPorCategoria(ordenes, productos);
    const maxCategoria = Math.max(1, ...porCategoria.map(c => c.monto));
    const topProductos = productosMasVendidos(ordenes);

    return (
        <>
            <h1 className="h3 mb-3">Reportes</h1>
            <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3"><TarjetaEstadistica titulo="Total vendido" valor={formatearPrecio(resumen.totalVendido)} color="success" /></div>
                <div className="col-6 col-lg-3"><TarjetaEstadistica titulo="Ventas" valor={resumen.cantidadVentas} color="primary" detalle={`${resumen.rechazadas} pago(s) rechazado(s)`} /></div>
                <div className="col-6 col-lg-3"><TarjetaEstadistica titulo="Ticket promedio" valor={formatearPrecio(resumen.ticketPromedio)} color="info" /></div>
                <div className="col-6 col-lg-3"><TarjetaEstadistica titulo="Inventario valorizado" valor={formatearPrecio(inventarioValorizado(productos))} color="warning" /></div>
            </div>

            <div className="row g-3">
                <div className="col-lg-6">
                    <div className="card shadow-sm h-100"><div className="card-body">
                        <h2 className="h5">Ventas por categoría</h2>
                        {porCategoria.length === 0 && <p className="text-muted">Aún no hay ventas.</p>}
                        {porCategoria.map(c => (
                            <div key={c.categoria} className="mb-2">
                                <div className="d-flex justify-content-between small"><span>{c.categoria}</span><span>{formatearPrecio(c.monto)}</span></div>
                                <div className="progress" role="progressbar" aria-label={c.categoria} aria-valuenow={c.monto} aria-valuemin="0" aria-valuemax={maxCategoria}>
                                    <div className="progress-bar" style={{ width: `${(c.monto / maxCategoria) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div></div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow-sm h-100"><div className="card-body">
                        <h2 className="h5">Productos más vendidos</h2>
                        <table className="table table-sm">
                            <thead><tr><th>Producto</th><th>Unidades</th><th>Monto</th></tr></thead>
                            <tbody>
                                {topProductos.map(p => <tr key={p.id}><td>{p.nombre}</td><td>{p.unidades}</td><td>{formatearPrecio(p.monto)}</td></tr>)}
                                {!topProductos.length && <tr><td colSpan="3" className="text-muted">Aún no hay ventas.</td></tr>}
                            </tbody>
                        </table>
                    </div></div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow-sm h-100"><div className="card-body">
                        <h2 className="h5">Órdenes por estado</h2>
                        <ul className="list-group list-group-flush">
                            {ordenesPorEstado(ordenes).map(e => (
                                <li key={e.estado} className="list-group-item d-flex justify-content-between"><EstadoOrden estado={e.estado} /><strong>{e.cantidad}</strong></li>
                            ))}
                        </ul>
                    </div></div>
                </div>
            </div>
        </>
    );
}
