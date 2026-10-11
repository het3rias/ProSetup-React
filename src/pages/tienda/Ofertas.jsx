import { productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { useCarrito } from "../../context/CarritoContext.jsx";
import ProductList from "../../components/productos/ProductList.jsx";

/** Muestra todos los productos que están en oferta. */
export default function Ofertas() {
    const ofertas = useDatos(() => productosDB.listarOfertas());
    const { agregar } = useCarrito();
    return (
        <div className="container my-5">
            <h1 className="h3">🔥 Ofertas</h1>
            <p className="text-muted">Precios rebajados por tiempo limitado.</p>
            <ProductList productos={ofertas} onAgregar={agregar} mensajeVacio="Por ahora no hay productos en oferta." />
        </div>
    );
}
