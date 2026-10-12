import { Link, useNavigate, useParams } from "react-router-dom";
import { categoriasDB } from "../../data/db.js";
import { useFormulario } from "../../hooks/useFormulario.js";
import { validarCategoria } from "../../utils/validaciones.js";
import CampoFormulario from "../../components/common/CampoFormulario.jsx";

/** Nueva categoría o Editar categoría. */
export default function AdminCategoriaForm() {
    const { id } = useParams();
    const navegar = useNavigate();
    const categoria = id ? categoriasDB.obtenerPorId(id) : null;
    const validar = (datos) => validarCategoria(datos, { existeNombre: (nombre) => categoriasDB.existeNombre(nombre, id || null) });
    const { valores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario(
        { nombre: categoria?.nombre || "", descripcion: categoria?.descripcion || "", imagen: categoria?.imagen || "" }, validar);

    if (id && !categoria) return <p>Categoría no encontrada. <Link to="/admin/categorias">Volver</Link></p>;

    const guardar = (e) => {
        e.preventDefault();
        if (!validarTodo()) return;
        const datos = { nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim(), imagen: valores.imagen.trim() || "/img/placeholder.png" };
        if (id) categoriasDB.actualizar(id, datos);
        else categoriasDB.crear(datos);
        navegar("/admin/categorias");
    };

    return (
        <>
            <Link to="/admin/categorias">&larr; Volver a categorías</Link>
            <div className="card shadow-sm mt-3" style={{ maxWidth: 640 }}>
                <div className="card-body">
                    <h1 className="h4 mb-3">{id ? "Editar categoría" : "Nueva categoría"}</h1>
                    <form onSubmit={guardar} noValidate>
                        <CampoFormulario etiqueta="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} onBlur={manejarBlur}
                            error={errores.nombre} maxLength={50} requerido
                            ayuda={id ? "Si cambias el nombre, los productos de esta categoría se actualizan automáticamente." : undefined} />
                        <CampoFormulario etiqueta="Descripción" name="descripcion" como="textarea" value={valores.descripcion} onChange={manejarCambio}
                            onBlur={manejarBlur} error={errores.descripcion} maxLength={200} />
                        <CampoFormulario etiqueta="Imagen (ruta o URL)" name="imagen" value={valores.imagen} onChange={manejarCambio} placeholder="/img/teclado.jpg" />
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">Guardar</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navegar("/admin/categorias")}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
