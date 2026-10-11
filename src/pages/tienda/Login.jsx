import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFormulario } from "../../hooks/useFormulario.js";
import { validarLogin } from "../../utils/validaciones.js";
import CampoFormulario from "../../components/common/CampoFormulario.jsx";
import Alerta from "../../components/common/Alerta.jsx";

export default function Login() {
    const { iniciarSesion } = useAuth();
    const navegar = useNavigate();
    const ubicacion = useLocation();
    const [errorGeneral, setErrorGeneral] = useState("");
    const { valores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario({ email: "", password: "" }, validarLogin);

    const enviar = (e) => {
        e.preventDefault();
        setErrorGeneral("");
        if (!validarTodo()) return;
        const usuario = iniciarSesion(valores.email, valores.password);
        if (!usuario) {
            setErrorGeneral("Correo o contraseña incorrectos.");
            return;
        }
        // Admin y Vendedor van al panel; el Cliente vuelve a donde estaba (o al inicio)
        if (usuario.tipoUsuario !== "Cliente") navegar("/admin");
        else navegar(ubicacion.state?.desde || "/");
    };

    return (
        <div className="container my-5">
            <div className="mx-auto" style={{ maxWidth: 440 }}>
                <div className="card shadow p-4">
                    <h1 className="h3 text-center mb-3">Iniciar sesión</h1>
                    <Alerta tipo="danger" mensaje={errorGeneral} />
                    <form onSubmit={enviar} noValidate>
                        <CampoFormulario etiqueta="Correo" name="email" tipo="email" value={valores.email} onChange={manejarCambio}
                            onBlur={manejarBlur} error={errores.email} maxLength={100} placeholder="tucorreo@duoc.cl" requerido />
                        <CampoFormulario etiqueta="Contraseña" name="password" tipo="password" value={valores.password} onChange={manejarCambio}
                            onBlur={manejarBlur} error={errores.password} maxLength={10} requerido />
                        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                    </form>
                    <p className="text-center mt-3 mb-0">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
                </div>
            </div>
        </div>
    );
}
