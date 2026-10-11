import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { tieneStockCritico } from "../../utils/tienda.js";
import PrecioProducto from "../../components/productos/PrecioProducto.jsx";
import ProductList from "../../components/productos/ProductList.jsx";

export default function DetalleProducto() {
    const { id } = useParams();
    const producto = useDatos(() => productosDB.obtenerPorId(id), [id]);
    const relacionados = useDatos(
        () => (producto ? productosDB.listarPorCategoria(producto.categoria).filter(p => p.id !== producto.id).slice(0, 4) : []),
        [id, producto?.categoria]
    );
    const { agregar } = useCarrito();
    const [cantidad, setCantidad] = useState(1);

    if (!producto) {
        return (
            <div className="container my-5">
                <p>Producto no encontrado. <Link to="/productos">Volver al catálogo</Link></p>
            </div>
        );
    }

    const agotado = producto.stock <= 0;

    return (
        <div className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
                    <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
                </ol>
            </nav>

            <div className="row g-4">
                <div className="col-md-6">
                    <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow-sm imagen-detalle"
                        onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} />
                </div>
                <div className="col-md-6">
                    <p className="text-muted mb-1">Código: {producto.codigo} · {producto.categoria}</p>
                    <h1 className="h2">{producto.nombre}</h1>
                    <PrecioProducto producto={producto} grande />
                    <p className="mt-3">{producto.descripcion || "Sin descripción disponible."}</p>
                    <p>
                        Stock disponible: <strong>{producto.stock}</strong> unidades{" "}
                        {tieneStockCritico(producto) && !agotado && <span className="badge bg-warning text-dark">¡Últimas unidades!</span>}
                    </p>
                    <div className="d-flex gap-2 align-items-end flex-wrap">
                        <div style={{ maxWidth: 120 }}>
                            <label htmlFor="detalle-cantidad" className="form-label">Cantidad</label>
                            <input id="detalle-cantidad" type="number" className="form-control" min="1" max={Math.max(producto.stock, 1)}
                                value={cantidad} disabled={agotado}
                                onChange={(e) => setCantidad(Math.max(1, Math.min(Number(e.target.value) || 1, producto.stock)))} />
                        </div>
                        <button type="button" className="btn btn-primary btn-lg" disabled={agotado} onClick={() => agregar(producto, cantidad)}>
                            {agotado ? "Sin stock" : "Añadir al carrito"}
                        </button>
                    </div>
                </div>
            </div>

            {relacionados.length > 0 && (
                <section className="mt-5">
                    <h2 className="h4 mb-3">Productos relacionados</h2>
                    <ProductList productos={relacionados} onAgregar={agregar} />
                </section>
            )}
        </div>
    );
}
