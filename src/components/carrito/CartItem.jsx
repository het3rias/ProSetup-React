import { formatearPrecio } from "../../utils/tienda.js";

/** Fila del carrito con controles de cantidad (+ / -) y botón eliminar. */
export default function CartItem({ item, onCambiarCantidad, onEliminar }) {
    return (
        <tr data-testid="fila-carrito">
            <td style={{ width: 64 }}>
                <img src={item.imagen} alt={item.nombre} className="img-thumbnail miniatura"
                    onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} />
            </td>
            <td>
                <strong>{item.nombre}</strong>
                <div className="small text-muted">{formatearPrecio(item.precioUnitario)} c/u</div>
            </td>
            <td>
                <div className="input-group input-group-sm flex-nowrap" style={{ maxWidth: 120 }}>
                    <button type="button" className="btn btn-outline-secondary" aria-label={`Disminuir ${item.nombre}`}
                        onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>−</button>
                    <span className="form-control text-center" data-testid="cantidad">{item.cantidad}</span>
                    <button type="button" className="btn btn-outline-secondary" aria-label={`Aumentar ${item.nombre}`}
                        onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)} disabled={item.cantidad >= item.stock}>+</button>
                </div>
            </td>
            <td className="fw-bold text-nowrap">{formatearPrecio(item.subtotal)}</td>
            <td>
                <button type="button" className="btn btn-sm btn-danger" aria-label={`Eliminar ${item.nombre}`}
                    onClick={() => onEliminar(item.id)}>Eliminar</button>
            </td>
        </tr>
    );
}
