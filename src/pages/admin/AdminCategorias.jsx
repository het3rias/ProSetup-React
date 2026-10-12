import { useState } from "react";
import { Link } from "react-router-dom";
import { categoriasDB, productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import Alerta from "../../components/common/Alerta.jsx";

export default function AdminCategorias() {
    const categorias = useDatos(() => categoriasDB.listar());
    const productos = useDatos(() => productosDB.listar());
    const [aviso, setAviso] = useState(null);

    const eliminar = (categoria) => {
        if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
        const resultado = categoriasDB.eliminar(categoria.id);
        setAviso({ tipo: resultado.ok ? "success" : "danger", texto: resultado.mensaje });
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Categorías</h1>
                <Link to="/admin/categorias/nueva" className="btn btn-primary">+ Nueva categoría</Link>
            </div>
            <Alerta tipo={aviso?.tipo} mensaje={aviso?.texto} onCerrar={() => setAviso(null)} />
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light"><tr><th>Imagen</th><th>Nombre</th><th>Descripción</th><th>Productos</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {categorias.map(c => (
                                <tr key={c.id}>
                                    <td><img src={c.imagen || "/img/placeholder.png"} alt={c.nombre} className="miniatura rounded" onError={(e) => { e.currentTarget.src = "/img/placeholder.png"; }} /></td>
                                    <td>{c.nombre}</td>
                                    <td className="small">{c.descripcion}</td>
                                    <td>{productos.filter(p => p.categoria === c.nombre).length}</td>
                                    <td className="text-nowrap">
                                        <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
