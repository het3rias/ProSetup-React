import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";

/** Listado de productos cuyo stock llegó al umbral crítico. */
export default function AdminProductosCriticos() {
    const { esAdmin } = useAuth();
    const criticos = useDatos(() => productosDB.listarCriticos());

    return (
        <>
            <Link to="/admin/productos">&larr; Volver a productos</Link>
            <h1 className="h3 my-3">Productos con stock crítico</h1>
            {criticos.length === 0 ? (
                <div className="alert alert-success">No hay productos con stock crítico. 🎉</div>
            ) : (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light"><tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Stock crítico</th><th></th></tr></thead>
                            <tbody>
                                {criticos.map(p => (
                                    <tr key={p.id} className={p.stock === 0 ? "table-danger" : "table-warning"}>
                                        <td>{p.codigo}</td><td>{p.nombre}</td><td className="fw-bold">{p.stock}</td><td>{p.stockCritico}</td>
                                        <td>{esAdmin
                                            ? <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-primary">Reponer stock</Link>
                                            : <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-secondary">Ver</Link>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
