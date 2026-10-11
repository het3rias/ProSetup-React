import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { formatearPrecio, validarStockCarrito } from "../../utils/tienda.js";
import CartItem from "../../components/carrito/CartItem.jsx";
import ProductList from "../../components/productos/ProductList.jsx";
import Alerta from "../../components/common/Alerta.jsx";

export default function Carrito() {
    const { items, subtotal, cantidadTotal, agregar, cambiarCantidad, eliminar, vaciar } = useCarrito();
    const sugeridos = useDatos(() => productosDB.listar().filter(p => p.stock > 0));
    const navegar = useNavigate();
    const problemasStock = validarStockCarrito(items);

    const confirmarVaciar = () => {
        if (window.confirm("¿Vaciar el carrito?")) vaciar();
    };

    return (
        <div className="container my-5">
            <h1 className="h3 mb-4">Carrito de compras</h1>

            {items.length === 0 ? (
                <div className="text-center py-5 card shadow-sm" data-testid="carrito-vacio">
                    <p className="fs-5 mb-3">Tu carrito está vacío.</p>
                    <div><Link to="/productos" className="btn btn-primary">Ir al catálogo</Link></div>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <Alerta tipo="warning" mensaje={problemasStock.length ? "Revisa el stock: " + problemasStock.join(" ") : ""} />
                        <div className="card shadow-sm">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr><th>Imagen</th><th>Producto</th><th>Cantidad</th><th>Subtotal</th><th>Acciones</th></tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <CartItem key={item.id} item={item} onCambiarCantidad={cambiarCantidad} onEliminar={eliminar} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="h5">Resumen</h2>
                                <p className="d-flex justify-content-between mb-1"><span>Productos ({cantidadTotal})</span><span>{formatearPrecio(subtotal)}</span></p>
                                <p className="small text-muted">El costo de envío se calcula en el siguiente paso.</p>
                                <p className="d-flex justify-content-between fs-5 fw-bold">
                                    <span>Total</span><span data-testid="total-carrito">{formatearPrecio(subtotal)}</span>
                                </p>
                                <div className="d-grid gap-2">
                                    <button type="button" className="btn btn-success" disabled={problemasStock.length > 0}
                                        onClick={() => navegar("/checkout")}>Comprar ahora</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={confirmarVaciar}>Vaciar carrito</button>
                                    <Link to="/productos" className="btn btn-link">Seguir comprando</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-5">
                <h2 className="h5 mb-3">Te puede interesar</h2>
                <ProductList productos={sugeridos.slice(0, 4)} onAgregar={agregar} />
            </section>
        </div>
    );
}
