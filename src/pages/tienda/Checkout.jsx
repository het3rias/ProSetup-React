import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { ordenesDB, productosDB } from "../../data/db.js";
import { useFormulario } from "../../hooks/useFormulario.js";
import { validarCheckout } from "../../utils/validaciones.js";
import { calcularEnvio, formatearPrecio, validarStockCarrito, ENVIO_GRATIS_DESDE } from "../../utils/tienda.js";
import CampoFormulario from "../../components/common/CampoFormulario.jsx";
import SelectRegionComuna from "../../components/common/SelectRegionComuna.jsx";

// Si el usuario inició sesión, sus datos se completan automáticamente
export function datosInicialesCheckout(usuario) {
    return {
        nombre: usuario?.nombre || "",
        apellidos: usuario?.apellidos || "",
        email: usuario?.email || "",
        calle: usuario?.direccion || "",
        departamento: "",
        region: usuario?.region || "",
        comuna: usuario?.comuna || "",
        indicaciones: "",
        entrega: "domicilio",
        simularRechazo: false
    };
}

/**
 * Paso de pago: el cliente ingresa sus datos y dirección y elige la entrega.
 * El pago es SIMULADO: es rechazado si falta stock o si se marca "Simular pago rechazado".
 */
export default function Checkout() {
    const { usuario } = useAuth();
    const { items, subtotal, vaciar } = useCarrito();
    const navegar = useNavigate();
    const [procesando, setProcesando] = useState(false);
    const formulario = useFormulario(datosInicialesCheckout(usuario), validarCheckout);
    const { valores, errores, manejarCambio, manejarBlur, validarTodo } = formulario;

    if (items.length === 0 && !procesando) return <Navigate to="/carrito" replace />;

    const envio = calcularEnvio(subtotal, valores.entrega);
    const total = subtotal + envio;

    const pagar = (e) => {
        e.preventDefault();
        if (!validarTodo()) return;
        setProcesando(true);

        const problemas = validarStockCarrito(items);
        const rechazado = valores.simularRechazo || problemas.length > 0;
        const orden = ordenesDB.crear({
            estado: rechazado ? "Rechazada" : "Pagada",
            motivo: problemas.length ? "Stock insuficiente: " + problemas.join(" ") : (valores.simularRechazo ? "El medio de pago rechazó la transacción." : ""),
            usuarioEmail: usuario?.email || null,
            cliente: { nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), email: valores.email.trim().toLowerCase() },
            direccion: valores.entrega === "domicilio"
                ? { calle: valores.calle.trim(), departamento: valores.departamento.trim(), region: valores.region, comuna: valores.comuna, indicaciones: valores.indicaciones.trim() }
                : { calle: "Retiro en tienda", departamento: "", region: "", comuna: "", indicaciones: valores.indicaciones.trim() },
            entrega: valores.entrega,
            items: items.map(i => ({ id: i.id, codigo: i.codigo, nombre: i.nombre, precio: i.precioUnitario, cantidad: i.cantidad, imagen: i.imagen })),
            subtotal, costoEnvio: envio, total
        });

        if (rechazado) {
            navegar(`/compra-fallida/${orden.id}`);
        } else {
            productosDB.descontarStock(items);
            vaciar();
            navegar(`/compra-exitosa/${orden.id}`);
        }
    };

    return (
        <div className="container my-5">
            <h1 className="h3 mb-4">Finalizar compra</h1>
            {!usuario && (
                <p className="alert alert-info">
                    ¿Ya tienes cuenta? <Link to="/login" state={{ desde: "/checkout" }}>Inicia sesión</Link> y completaremos tus datos automáticamente.
                </p>
            )}
            <form className="row g-4" onSubmit={pagar} noValidate>
                <div className="col-lg-7">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="h5 mb-3">Información del cliente</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <CampoFormulario etiqueta="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio}
                                        onBlur={manejarBlur} error={errores.nombre} maxLength={50} requerido />
                                </div>
                                <div className="col-md-6">
                                    <CampoFormulario etiqueta="Apellidos" name="apellidos" value={valores.apellidos} onChange={manejarCambio}
                                        onBlur={manejarBlur} error={errores.apellidos} maxLength={100} requerido />
                                </div>
                            </div>
                            <CampoFormulario etiqueta="Correo" name="email" tipo="email" value={valores.email} onChange={manejarCambio}
                                onBlur={manejarBlur} error={errores.email} maxLength={100} requerido ayuda="@duoc.cl, @profesor.duoc.cl o @gmail.com" />
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="h5 mb-3">Entrega</h2>
                            <div className="mb-3" role="radiogroup" aria-label="Opción de entrega">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" id="entrega-domicilio" name="entrega" value="domicilio"
                                        checked={valores.entrega === "domicilio"} onChange={manejarCambio} />
                                    <label className="form-check-label" htmlFor="entrega-domicilio">
                                        Despacho a domicilio ({formatearPrecio(3990)}, gratis sobre {formatearPrecio(ENVIO_GRATIS_DESDE)})
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" id="entrega-retiro" name="entrega" value="retiro"
                                        checked={valores.entrega === "retiro"} onChange={manejarCambio} />
                                    <label className="form-check-label" htmlFor="entrega-retiro">Retiro en tienda (gratis)</label>
                                </div>
                            </div>

                            {valores.entrega === "domicilio" && (
                                <>
                                    <h3 className="h6">Dirección de entrega</h3>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <CampoFormulario etiqueta="Calle y número" name="calle" value={valores.calle} onChange={manejarCambio}
                                                onBlur={manejarBlur} error={errores.calle} maxLength={300} requerido />
                                        </div>
                                        <div className="col-md-4">
                                            <CampoFormulario etiqueta="Departamento (opcional)" name="departamento" value={valores.departamento}
                                                onChange={manejarCambio} onBlur={manejarBlur} error={errores.departamento} maxLength={50} placeholder="Ej: 603" />
                                        </div>
                                    </div>
                                    <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={manejarCambio} onBlur={manejarBlur} errores={errores} />
                                </>
                            )}
                            <CampoFormulario etiqueta="Indicaciones para la entrega (opcional)" name="indicaciones" como="textarea"
                                value={valores.indicaciones} onChange={manejarCambio} onBlur={manejarBlur} error={errores.indicaciones} maxLength={300}
                                placeholder="Ej: entre calles, dejar con conserjería..." />
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm position-sticky" style={{ top: 90 }}>
                        <div className="card-body">
                            <h2 className="h5 mb-3">Resumen del pedido</h2>
                            <ul className="list-unstyled mb-3">
                                {items.map(i => (
                                    <li key={i.id} className="d-flex justify-content-between small border-bottom py-1">
                                        <span>{i.nombre} × {i.cantidad}</span><span>{formatearPrecio(i.subtotal)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="d-flex justify-content-between mb-1"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></p>
                            <p className="d-flex justify-content-between mb-1"><span>Envío</span><span data-testid="costo-envio">{envio === 0 ? "Gratis" : formatearPrecio(envio)}</span></p>
                            <p className="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span data-testid="total-checkout">{formatearPrecio(total)}</span></p>

                            <div className="form-check mb-3 small">
                                <input className="form-check-input" type="checkbox" id="simular-rechazo" name="simularRechazo"
                                    checked={valores.simularRechazo} onChange={manejarCambio} />
                                <label className="form-check-label text-muted" htmlFor="simular-rechazo">
                                    Simular pago rechazado (demo, no hay pasarela real)
                                </label>
                            </div>
                            <button type="submit" className="btn btn-success w-100 btn-lg" disabled={procesando}>
                                Pagar ahora {formatearPrecio(total)}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
