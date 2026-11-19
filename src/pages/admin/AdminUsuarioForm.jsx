import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usuariosDB } from "../../data/db.js";
import { validarUsuario } from "../../utils/validaciones.js";
import UserForm from "../../components/admin/UserForm.jsx";
import Alerta from "../../components/common/Alerta.jsx";

/** Nuevo usuario o Editar usuario (desde el panel, se puede elegir el rol). */
export default function AdminUsuarioForm() {
    const { run } = useParams();
    const navegar = useNavigate();
    const [errorGeneral, setErrorGeneral] = useState("");
    const usuario = run ? usuariosDB.obtenerPorRun(run) : null;
    const esEdicion = Boolean(run);

    if (esEdicion && !usuario) return <p>Usuario no encontrado. <Link to="/admin/usuarios">Volver</Link></p>;

    const iniciales = {
        run: usuario?.run || "", nombre: usuario?.nombre || "", apellidos: usuario?.apellidos || "", email: usuario?.email || "",
        password: "", confirmar: "", telefono: usuario?.telefono || "", fechaNacimiento: usuario?.fechaNacimiento || "",
        tipoUsuario: usuario?.tipoUsuario || "Cliente", region: usuario?.region || "", comuna: usuario?.comuna || "", direccion: usuario?.direccion || ""
    };

    // Al editar, el RUN/correo propio no cuenta como duplicado
    const validar = (datos) => validarUsuario(datos, {
        esEdicion,
        existeRun: (r) => { const u = usuariosDB.obtenerPorRun(r); return Boolean(u) && u.email !== usuario?.email; },
        existeEmail: (e) => Boolean(usuariosDB.obtenerPorEmail(e)) && e !== usuario?.email
    });

    const guardar = async (datos) => {
        try {
            if (esEdicion) await usuariosDB.actualizar(usuario.email, datos);
            else await usuariosDB.crear(datos);
            navegar("/admin/usuarios");
        } catch (error) {
            setErrorGeneral(error.message);
        }
    };

    return (
        <>
            <Link to="/admin/usuarios">&larr; Volver a usuarios</Link>
            <div className="card shadow-sm mt-3">
                <div className="card-body">
                    <h1 className="h4 mb-3">{esEdicion ? `Editar usuario: ${usuario.nombre} ${usuario.apellidos}` : "Nuevo usuario"}</h1>
                    <Alerta tipo="danger" mensaje={errorGeneral} />
                    <UserForm valoresIniciales={iniciales} validar={validar} onGuardar={guardar} esEdicion={esEdicion}
                        onCancelar={() => navegar("/admin/usuarios")} textoBoton={esEdicion ? "Guardar cambios" : "Crear usuario"} />
                </div>
            </div>
        </>
    );
}
