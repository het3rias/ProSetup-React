import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { usuariosDB } from "../../data/db.js";
import { validarUsuario } from "../../utils/validaciones.js";
import UserForm from "../../components/admin/UserForm.jsx";
import Alerta from "../../components/common/Alerta.jsx";

/** Perfil del usuario conectado: puede editar sus datos y contraseña (no su RUN, correo ni rol). */
export default function AdminPerfil() {
    const { usuario } = useAuth();
    const [mensaje, setMensaje] = useState("");

    const iniciales = { ...usuario, password: "", confirmar: "", telefono: usuario.telefono || "", fechaNacimiento: usuario.fechaNacimiento || "" };
    const validar = (datos) => validarUsuario(datos, { esEdicion: true });

    const guardar = (datos) => {
        const { run, email, tipoUsuario, ...editables } = datos;
        usuariosDB.actualizar(usuario.email, editables);
        setMensaje("Perfil actualizado correctamente.");
    };

    return (
        <>
            <h1 className="h3 mb-3">Mi perfil</h1>
            <Alerta tipo="success" mensaje={mensaje} onCerrar={() => setMensaje("")} />
            <div className="card shadow-sm">
                <div className="card-body">
                    <p className="text-muted">Rol: <strong>{usuario.tipoUsuario}</strong></p>
                    <UserForm valoresIniciales={iniciales} validar={validar} onGuardar={guardar} esEdicion
                        mostrarTipo={false} bloqueados={["run", "email"]} textoBoton="Guardar perfil" />
                </div>
            </div>
        </>
    );
}
