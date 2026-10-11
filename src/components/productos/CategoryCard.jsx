import { Link } from "react-router-dom";

/** Tarjeta de una categoría con la cantidad de productos que tiene. */
export default function CategoryCard({ categoria, cantidad }) {
    return (
        <Link to={`/categorias/${categoria.id}`} className="card card-categoria h-100 text-decoration-none text-reset shadow-sm">
            <img src={categoria.imagen || "/img/placeholder.png"} className="card-img-top" alt={categoria.nombre}
                onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} />
            <div className="card-body text-center">
                <h3 className="h6 mb-1">{categoria.nombre}</h3>
                <small className="text-muted">{cantidad} {cantidad === 1 ? "producto" : "productos"}</small>
            </div>
        </Link>
    );
}
