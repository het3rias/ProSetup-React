import { categoriasDB, productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { useCarrito } from "../../context/CarritoContext.jsx";
import CategoryCard from "../../components/productos/CategoryCard.jsx";
import ProductList from "../../components/productos/ProductList.jsx";

/** Vista que separa los productos por categorías. */
export default function Categorias() {
    const categorias = useDatos(() => categoriasDB.listar());
    const productos = useDatos(() => productosDB.listar());
    const { agregar } = useCarrito();

    return (
        <div className="container my-5">
            <h1 className="h3 mb-4">Categorías</h1>
            <div className="row g-3 mb-5">
                {categorias.map(c => (
                    <div key={c.id} className="col-6 col-md-4 col-lg-2">
                        <CategoryCard categoria={c} cantidad={productos.filter(p => p.categoria === c.nombre).length} />
                    </div>
                ))}
            </div>

            {categorias.map(c => {
                const deLaCategoria = productos.filter(p => p.categoria === c.nombre);
                if (!deLaCategoria.length) return null;
                return (
                    <section key={c.id} className="mb-5" aria-labelledby={`cat-${c.id}`}>
                        <h2 id={`cat-${c.id}`} className="h4 mb-3">{c.nombre}</h2>
                        <ProductList productos={deLaCategoria} onAgregar={agregar} />
                    </section>
                );
            })}
        </div>
    );
}
