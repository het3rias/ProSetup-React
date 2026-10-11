import { estaEnOferta, formatearPrecio, porcentajeDescuento } from "../../utils/tienda.js";

/** Muestra el precio; si está en oferta tacha el precio normal y muestra el % de descuento. */
export default function PrecioProducto({ producto, grande = false }) {
    const clase = grande ? "fs-3" : "fs-5";
    if (!estaEnOferta(producto)) {
        return <p className={`precio mb-1 ${clase}`}>{formatearPrecio(producto.precio)}</p>;
    }
    return (
        <p className="mb-1 d-flex flex-wrap align-items-center column-gap-2">
            <span className={`precio precio-oferta ${clase}`}>{formatearPrecio(producto.precioOferta)}</span>
            <del className="text-muted small">{formatearPrecio(producto.precio)}</del>
            <span className="badge bg-danger">-{porcentajeDescuento(producto)}%</span>
        </p>
    );
}
