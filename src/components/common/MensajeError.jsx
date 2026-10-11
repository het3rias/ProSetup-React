/** Muestra un mensaje de error SOLO si existe (renderizado condicional). */
export default function MensajeError({ mensaje, id }) {
    if (!mensaje) return null;
    return (
        <div className="invalid-feedback d-block" role="alert" id={id}>
            {mensaje}
        </div>
    );
}
