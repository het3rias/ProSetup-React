import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ordenesDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { formatearFecha, formatearPrecio } from "../../utils/tienda.js";
import TablaDetalleCompra from "../../components/carrito/TablaDetalleCompra.jsx";

/** Datos del cliente y dirección de una orden (se reutiliza en éxito, error y boleta del admin). */
export function DatosOrden({ orden }) {
    const d = orden.direccion;
    return (
        <div className="row small g-2 mb-3">
            <div className="col-md-4"><strong>Nombre:</strong> {orden.cliente.nombre}</div>
            <div className="col-md-4"><strong>Apellidos:</strong> {orden.cliente.apellidos}</div>
            <div className="col-md-4"><strong>Correo:</strong> {orden.cliente.email}</div>
            <div className="col-md-6"><strong>Entrega:</strong> {orden.entrega === "domicilio" ? "Despacho a domicilio" : "Retiro en tienda"}</div>
            {orden.entrega === "domicilio" && (
                <div className="col-md-6"><strong>Dirección:</strong> {d.calle}{d.departamento ? `, ${d.departamento}` : ""} — {d.comuna}, {d.region}</div>
            )}
            {d.indicaciones && <div className="col-12"><strong>Indicaciones:</strong> {d.indicaciones}</div>}
        </div>
    );
}

export function TotalesOrden({ orden }) {
    return (
        <div className="text-end">
            <p className="mb-1">Subtotal: {formatearPrecio(orden.subtotal)}</p>
            <p className="mb-1">Envío: {orden.costoEnvio === 0 ? "Gratis" : formatearPrecio(orden.costoEnvio)}</p>
            <p className="fs-4 fw-bold">Total: {formatearPrecio(orden.total)}</p>
        </div>
    );
}

/**
 * Vista de resultado del pago. Props: exito (true = compra exitosa, false = pago con error).
 */
export default function ResultadoCompra({ exito }) {
    const { id } = useParams();
    const orden = useDatos(() => ordenesDB.obtenerPorId(id), [id]);
    const [mensajeEmail, setMensajeEmail] = useState("");

    if (!orden) {
        return <div className="container my-5"><p>No encontramos esa orden. <Link to="/">Volver al inicio</Link></p></div>;
    }

    return (
        <div className="container my-5" style={{ maxWidth: 900 }}>
            <div className="card shadow-sm boleta">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                        {exito ? (
                            <h1 className="h4 text-success mb-0" data-testid="titulo-resultado">✔ Se ha realizado la compra. Nro #{orden.id}</h1>
                        ) : (
                            <h1 className="h4 text-danger mb-0" data-testid="titulo-resultado">✖ No se pudo realizar el pago. Nro #{orden.id}</h1>
                        )}
                        <small className="text-muted">Código orden: {orden.codigo} · {formatearFecha(orden.fecha)}</small>
                    </div>

                    {!exito && (
                        <div className="alert alert-danger">
                            {orden.motivo || "Hubo un problema con el pago."} No se realizó ningún cargo. Puedes intentarlo nuevamente.
                        </div>
                    )}

                    <DatosOrden orden={orden} />
                    <TablaDetalleCompra items={orden.items} />
                    <TotalesOrden orden={orden} />

                    {mensajeEmail && <div className="alert alert-success no-imprimir">{mensajeEmail}</div>}

                    <div className="d-flex gap-2 justify-content-center flex-wrap no-imprimir">
                        {exito ? (
                            <>
                                <button type="button" className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta en PDF</button>
                                <button type="button" className="btn btn-success"
                                    onClick={() => setMensajeEmail(`Boleta enviada a ${orden.cliente.email} (simulado).`)}>
                                    Enviar boleta por email
                                </button>
                                <Link to="/productos" className="btn btn-outline-primary">Seguir comprando</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/checkout" className="btn btn-success">Volver a realizar el pago</Link>
                                <Link to="/carrito" className="btn btn-outline-secondary">Revisar carrito</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
