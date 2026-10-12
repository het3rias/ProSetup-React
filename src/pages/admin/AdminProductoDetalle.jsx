import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { formatearPrecio, tieneStockCritico } from "../../utils/tienda.js";

/** Mostrar producto (solo lectura). El Administrador ve además el botón Editar. */
export default function AdminProductoDetalle() {
    const { id } = useParams();
    const { esAdmin } = useAuth();
    const producto = useDatos(() => productosDB.obtenerPorId(id), [id]);

    if (!producto) return <p>Producto no encontrado. <Link to="/admin/productos">Volver</Link></p>;

    const filas = [
        ["Código", producto.codigo], ["Nombre", producto.nombre], ["Categoría", producto.categoria],
        ["Precio", formatearPrecio(producto.precio)],
        ["Precio oferta", producto.precioOferta != null ? formatearPrecio(producto.precioOferta) : "Sin oferta"],
        ["Stock", `${producto.stock}${tieneStockCritico(producto) ? " (crítico)" : ""}`],
        ["Stock crítico", producto.stockCritico ?? "No definido"],
        ["Descripción", producto.descripcion || "Sin descripción."]
    ];

    return (
        <>
            <Link to="/admin/productos">&larr; Volver a productos</Link>
            <div className="card shadow-sm mt-3">
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} />
                        </div>
                        <div className="col-md-8">
                            <h1 className="h4">{producto.nombre}</h1>
                            <dl className="row mb-3">
                                {filas.map(([k, v]) => (
                                    <Fragment key={k}>
                                        <dt className="col-sm-4">{k}</dt><dd className="col-sm-8">{v}</dd>
                                    </Fragment>
                                ))}
                            </dl>
                            {esAdmin && <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-primary">Editar producto</Link>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
