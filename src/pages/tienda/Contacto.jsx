import { useState } from "react";
import { useFormulario } from "../../hooks/useFormulario.js";
import { validarContacto } from "../../utils/validaciones.js";
import CampoFormulario from "../../components/common/CampoFormulario.jsx";
import Alerta from "../../components/common/Alerta.jsx";

const VACIO = { nombre: "", email: "", comentario: "" };

export default function Contacto() {
    const [enviado, setEnviado] = useState("");
    const { valores, errores, manejarCambio, manejarBlur, validarTodo, reiniciar } = useFormulario(VACIO, validarContacto);

    const enviar = (e) => {
        e.preventDefault();
        if (!validarTodo()) return;
        setEnviado(`¡Gracias ${valores.nombre.trim()}! Recibimos tu mensaje y te contactaremos pronto.`);
        reiniciar();
    };

    return (
        <div className="container my-5">
            <div className="mx-auto" style={{ maxWidth: 520 }}>
                <div className="card shadow p-4">
                    <h1 className="h3 text-center mb-2">Contáctanos</h1>
                    <p className="text-muted text-center">Déjanos tus datos y te contactaremos a la brevedad.</p>
                    <Alerta tipo="success" mensaje={enviado} onCerrar={() => setEnviado("")} />
                    <form onSubmit={enviar} noValidate>
                        <CampoFormulario etiqueta="Nombre completo" name="nombre" value={valores.nombre} onChange={manejarCambio}
                            onBlur={manejarBlur} error={errores.nombre} maxLength={100} requerido />
                        <CampoFormulario etiqueta="Correo (opcional)" name="email" tipo="email" value={valores.email} onChange={manejarCambio}
                            onBlur={manejarBlur} error={errores.email} maxLength={100} placeholder="tucorreo@duoc.cl"
                            ayuda="Si lo ingresas, debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com." />
                        <CampoFormulario etiqueta="Comentario" name="comentario" como="textarea" filas={4} value={valores.comentario}
                            onChange={manejarCambio} onBlur={manejarBlur} error={errores.comentario} maxLength={500} requerido
                            ayuda={<span data-testid="contador-comentario">{valores.comentario.length}/500 caracteres</span>} />
                        <button type="submit" className="btn btn-primary w-100">Enviar mensaje</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
