/** Alerta de Bootstrap que solo aparece si hay mensaje. */
export default function Alerta({ tipo = "info", mensaje, onCerrar }) {
    if (!mensaje) return null;
    return (
        <div className={`alert alert-${tipo} d-flex justify-content-between align-items-start`} role="alert">
            <span>{mensaje}</span>
            {onCerrar && <button type="button" className="btn-close ms-3" aria-label="Cerrar" onClick={onCerrar}></button>}
        </div>
    );
}
