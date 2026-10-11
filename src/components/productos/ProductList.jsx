import ProductCard from "./ProductCard.jsx";

/** Lista (grilla responsiva) de productos. Muestra un mensaje si la lista viene vacía. */
export default function ProductList({ productos, onAgregar, mensajeVacio = "No hay productos para mostrar." }) {
    if (!productos.length) {
        return <p className="text-muted my-4" data-testid="lista-vacia">{mensajeVacio}</p>;
    }
    return (
        <div className="row g-3">
            {productos.map(producto => (
                <div key={producto.id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard producto={producto} onAgregar={onAgregar} />
                </div>
            ))}
        </div>
    );
}
