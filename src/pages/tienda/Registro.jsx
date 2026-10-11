import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { usuariosDB } from "../../data/db.js";
import { useFormulario } from "../../hooks/useFormulario.js";
import { validarUsuario } from "../../utils/validaciones.js";
import CampoFormulario from "../../components/common/CampoFormulario.jsx";
import SelectRegionComuna from "../../components/common/SelectRegionComuna.jsx";

export const USUARIO_VACIO = {
    run: "", nombre: "", apellidos: "", email: "", password: "", confirmar: "",
    telefono: "", fechaNacimiento: "", region: "", comuna: "", direccion: ""
};

const validarRegistro = (datos) => validarUsuario(datos, {
    existeRun: (run) => Boolean(usuariosDB.obtenerPorRun(run)),
    existeEmail: (email) => Boolean(usuariosDB.obtenerPorEmail(email))
});

/** Registro público: crea un usuario tipo Cliente e inicia sesión. */
export default function Registro() {
    const { registrar } = useAuth();
    const navegar = useNavigate();
    const { valores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario(USUARIO_VACIO, validarRegistro);

    const enviar = (e) => {
        e.preventDefault();
        if (!validarTodo()) return;
        const { confirmar, ...datos } = valores;
        registrar({ ...datos, run: datos.run.trim().toUpperCase(), email: datos.email.trim().toLowerCase(),
            nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), direccion: datos.direccion.trim() });
        navegar("/");
    };

    const campo = (props) => (
        <CampoFormulario value={valores[props.name]} onChange={manejarCambio} onBlur={manejarBlur} error={errores[props.name]} {...props} />
    );

    return (
        <div className="container my-5">
            <div className="mx-auto" style={{ maxWidth: 720 }}>
                <div className="card shadow p-4">
                    <h1 className="h3 text-center mb-3">Registro de usuario</h1>
                    <form onSubmit={enviar} noValidate>
                        <div className="row">
                            <div className="col-md-6">{campo({ etiqueta: "RUN", name: "run", maxLength: 9, placeholder: "19011022K", requerido: true, ayuda: "Sin puntos ni guion." })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Fecha de nacimiento", name: "fechaNacimiento", tipo: "date" })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Nombre", name: "nombre", maxLength: 50, requerido: true })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Apellidos", name: "apellidos", maxLength: 100, requerido: true })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Correo", name: "email", tipo: "email", maxLength: 100, requerido: true, ayuda: "@duoc.cl, @profesor.duoc.cl o @gmail.com" })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Teléfono (opcional)", name: "telefono", tipo: "tel", maxLength: 15 })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Contraseña", name: "password", tipo: "password", maxLength: 10, requerido: true, ayuda: "Entre 4 y 10 caracteres." })}</div>
                            <div className="col-md-6">{campo({ etiqueta: "Confirmar contraseña", name: "confirmar", tipo: "password", maxLength: 10, requerido: true })}</div>
                        </div>
                        <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={manejarCambio} onBlur={manejarBlur} errores={errores} />
                        {campo({ etiqueta: "Dirección", name: "direccion", maxLength: 300, requerido: true })}
                        <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                    </form>
                    <p className="text-center mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    );
}
