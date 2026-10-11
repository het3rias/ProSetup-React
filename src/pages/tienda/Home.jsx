import { Link } from "react-router-dom";
import { categoriasDB, productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { useCarrito } from "../../context/CarritoContext.jsx";
import ProductList from "../../components/productos/ProductList.jsx";
import CategoryCard from "../../components/productos/CategoryCard.jsx";

export default function Home() {
    const productos = useDatos(() => productosDB.listar());
    const ofertas = useDatos(() => productosDB.listarOfertas());
    const categorias = useDatos(() => categoriasDB.listar());
    const { agregar } = useCarrito();

    return (
        <>
            <section className="hero">
                <div className="container">
                    <h1 className="display-5">Arma tu setup gamer</h1>
                    <p className="lead mb-4">Componentes y periféricos al mejor precio, con despacho a todo Chile.</p>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <Link to="/productos" className="btn btn-info btn-lg">Ver productos</Link>
                        <Link to="/ofertas" className="btn btn-outline-light btn-lg">Ver ofertas</Link>
                    </div>
                </div>
            </section>

            <div className="container my-5">
                <section className="mb-5" aria-labelledby="titulo-categorias">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 id="titulo-categorias" className="h4 mb-0">Categorías</h2>
                        <Link to="/categorias">Ver todas</Link>
                    </div>
                    <div className="row g-3">
                        {categorias.map(c => (
                            <div key={c.id} className="col-6 col-md-4 col-lg-2">
                                <CategoryCard categoria={c} cantidad={productos.filter(p => p.categoria === c.nombre).length} />
                            </div>
                        ))}
                    </div>
                </section>

                {ofertas.length > 0 && (
                    <section className="mb-5" aria-labelledby="titulo-ofertas">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 id="titulo-ofertas" className="h4 mb-0">🔥 Ofertas de la semana</h2>
                            <Link to="/ofertas">Ver todas</Link>
                        </div>
                        <ProductList productos={ofertas.slice(0, 4)} onAgregar={agregar} />
                    </section>
                )}

                <section aria-labelledby="titulo-destacados">
                    <h2 id="titulo-destacados" className="h4 mb-3">Productos destacados</h2>
                    <ProductList productos={productos.slice(0, 8)} onAgregar={agregar} />
                </section>
            </div>
        </>
    );
}
