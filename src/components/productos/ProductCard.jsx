import { Link } from "react-router-dom";
import { tieneStockCritico } from "../../utils/tienda.js";
import PrecioProducto from "./PrecioProducto.jsx";
import Boton from "../common/Boton.jsx";

/**
 * Tarjeta de un producto.
 * Props: producto (objeto) y onAgregar (función que recibe el producto).
 * No maneja estado propio: solo muestra datos y avisa el clic al padre.
 */
export default function ProductCard({ producto, onAgregar }) {
    const agotado = producto.stock <= 0;
    return (
        <div className="card card-producto h-100 shadow-sm" data-testid="tarjeta-producto">
            <Link to={`/producto/${producto.id}`} className="position-relative">
                <img src={producto.imagen} className="card-img-top" alt={producto.nombre}
                    onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} />
                {producto.precioOferta != null && <span className="badge bg-danger position-absolute top-0 start-0 m-2">Oferta</span>}
            </Link>
            <div className="card-body d-flex flex-column">
                <p className="text-muted small mb-1">{producto.categoria}</p>
                <h3 className="card-title h6">
                    <Link to={`/producto/${producto.id}`} className="text-reset text-decoration-none">{producto.nombre}</Link>
                </h3>
                <PrecioProducto producto={producto} />
                {agotado
                    ? <span className="badge bg-secondary align-self-start mb-2">Agotado</span>
                    : tieneStockCritico(producto) && <span className="badge bg-warning text-dark align-self-start mb-2">¡Últimas unidades!</span>}
                <Boton
                    etiqueta={agotado ? "Sin stock" : "Añadir al carrito"}
                    variante="dark" className="mt-auto" deshabilitado={agotado}
                    onClick={() => onAgregar(producto)}
                />
            </div>
        </div>
    );
}
