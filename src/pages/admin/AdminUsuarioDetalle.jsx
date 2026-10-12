import { Link, useParams } from "react-router-dom";
import { ordenesDB, usuariosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import TablaOrdenes from "../../components/admin/TablaOrdenes.jsx";

/** Mostrar usuario + su historial de compras. */
export default function AdminUsuarioDetalle() {
    const { run } = useParams();
    const usuario = useDatos(() => usuariosDB.obtenerPorRun(run), [run]);
    const historial = useDatos(() => (usuario ? ordenesDB.listarPorUsuario(usuario.email) : []), [run, usuario?.email]);

    if (!usuario) return <p>Usuario no encontrado. <Link to="/admin/usuarios">Volver</Link></p>;

    const datos = [
        ["RUN", usuario.run], ["Nombre", `${usuario.nombre} ${usuario.apellidos}`], ["Correo", usuario.email],
        ["Teléfono", usuario.telefono || "No registrado"], ["Fecha de nacimiento", usuario.fechaNacimiento || "No registrada"],
        ["Tipo de usuario", usuario.tipoUsuario], ["Región / Comuna", `${usuario.region || "-"} / ${usuario.comuna || "-"}`], ["Dirección", usuario.direccion]
    ];

    return (
        <>
            <Link to="/admin/usuarios">&larr; Volver a usuarios</Link>
            <div className="card shadow-sm mt-3 mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="h4 mb-0">{usuario.nombre} {usuario.apellidos}</h1>
                        <Link to={`/admin/usuarios/${usuario.run}/editar`} className="btn btn-primary">Editar usuario</Link>
                    </div>
                    <dl className="row mb-0">
                        {datos.map(([k, v]) => [<dt key={k + "t"} className="col-sm-3">{k}</dt>, <dd key={k + "d"} className="col-sm-9">{v}</dd>])}
                    </dl>
                </div>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="h5">Historial de compras</h2>
                    <TablaOrdenes ordenes={historial} mensajeVacio="Este usuario aún no tiene compras." />
                </div>
            </div>
        </>
    );
}
