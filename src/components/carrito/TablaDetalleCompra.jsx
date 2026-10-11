import { formatearPrecio } from "../../utils/tienda.js";

/** Tabla de solo lectura con los productos de una orden/boleta. */
export default function TablaDetalleCompra({ items }) {
    return (
        <div className="table-responsive">
            <table className="table table-sm align-middle">
                <thead>
                    <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td><img src={item.imagen} alt={item.nombre} className="img-thumbnail miniatura"
                                onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} /></td>
                            <td>{item.nombre}</td>
                            <td>{formatearPrecio(item.precio)}</td>
                            <td>{item.cantidad}</td>
                            <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
