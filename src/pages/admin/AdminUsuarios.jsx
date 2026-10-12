import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { usuariosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import Alerta from "../../components/common/Alerta.jsx";

export default function AdminUsuarios() {
    const { usuario: actual } = useAuth();
    const usuarios = useDatos(() => usuariosDB.listar());
    const navegar = useNavigate();
    const [texto, setTexto] = useState("");
    const [tipo, setTipo] = useState("");
    const [aviso, setAviso] = useState(null);

    const t = texto.trim().toLowerCase();
    const filtrados = usuarios.filter(u => (!tipo || u.tipoUsuario === tipo) &&
        (!t || u.run.toLowerCase().includes(t) || u.email.includes(t) || `${u.nombre} ${u.apellidos}`.toLowerCase().includes(t)));

    const eliminar = (u) => {
        if (u.email === actual.email) {
            setAviso({ tipo: "danger", texto: "No puedes eliminar tu propia cuenta." });
            return;
        }
        if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) return;
        usuariosDB.eliminar(u.email);
        setAviso({ tipo: "success", texto: "Usuario eliminado." });
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Usuarios</h1>
                <Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>
            </div>
            <Alerta tipo={aviso?.tipo} mensaje={aviso?.texto} onCerrar={() => setAviso(null)} />
            <div className="row g-2 mb-3">
                <div className="col-md-8"><input type="search" className="form-control" placeholder="Buscar por RUN, nombre o correo" aria-label="Buscar usuarios" value={texto} onChange={(e) => setTexto(e.target.value)} /></div>
                <div className="col-md-4">
                    <select className="form-select" aria-label="Filtrar por tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="">Todos los roles</option><option>Administrador</option><option>Vendedor</option><option>Cliente</option>
                    </select>
                </div>
            </div>
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light"><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Región / Comuna</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {filtrados.map(u => (
                                <tr key={u.email}>
                                    <td>{u.run}</td><td>{u.nombre} {u.apellidos}</td><td>{u.email}</td>
                                    <td><span className="badge bg-secondary">{u.tipoUsuario}</span></td>
                                    <td className="small">{u.region ? `${u.region} / ${u.comuna}` : "-"}</td>
                                    <td className="text-nowrap">
                                        <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => navegar(`/admin/usuarios/${u.run}`)}>Ver</button>
                                        <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => navegar(`/admin/usuarios/${u.run}/editar`)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(u)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {!filtrados.length && <tr><td colSpan="6" className="text-muted">No hay usuarios.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
