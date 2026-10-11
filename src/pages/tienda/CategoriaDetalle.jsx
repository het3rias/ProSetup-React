import { Link, useParams } from "react-router-dom";
import { categoriasDB, productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { useCarrito } from "../../context/CarritoContext.jsx";
import ProductList from "../../components/productos/ProductList.jsx";

/** Productos de una sola categoría (ej: /categorias/1). */
export default function CategoriaDetalle() {
    const { id } = useParams();
    const categoria = useDatos(() => categoriasDB.obtenerPorId(id), [id]);
    const productos = useDatos(() => (categoria ? productosDB.listarPorCategoria(categoria.nombre) : []), [id, categoria?.nombre]);
    const { agregar } = useCarrito();

    if (!categoria) {
        return <div className="container my-5"><p>Categoría no encontrada. <Link to="/categorias">Ver categorías</Link></p></div>;
    }

    return (
        <div className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{categoria.nombre}</li>
                </ol>
            </nav>
            <h1 className="h3">{categoria.nombre}</h1>
            <p className="text-muted">{categoria.descripcion}</p>
            <ProductList productos={productos} onAgregar={agregar} mensajeVacio="Esta categoría todavía no tiene productos." />
        </div>
    );
}
