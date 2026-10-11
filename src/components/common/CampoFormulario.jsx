import MensajeError from "./MensajeError.jsx";

/**
 * Campo de formulario controlado (input, textarea o select) con su etiqueta,
 * texto de ayuda y mensaje de error. El estado vive en el formulario padre:
 * este componente solo recibe el valor y avisa los cambios por props.
 */
export default function CampoFormulario({
    etiqueta, name, value, onChange, onBlur, error, tipo = "text", como = "input",
    opciones = [], placeholder, ayuda, maxLength, requerido = false, deshabilitado = false,
    filas = 3, className = "mb-3", children
}) {
    const id = `campo-${name}`;
    const claseControl = (como === "select" ? "form-select" : "form-control") + (error ? " is-invalid" : "");
    const comunes = {
        id, name, value: value ?? "", onChange, onBlur, disabled: deshabilitado,
        className: claseControl, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined
    };

    let control;
    if (como === "textarea") {
        control = <textarea {...comunes} rows={filas} maxLength={maxLength} placeholder={placeholder} />;
    } else if (como === "select") {
        control = (
            <select {...comunes}>
                {placeholder && <option value="">{placeholder}</option>}
                {opciones.map(op => {
                    const valor = typeof op === "object" ? op.valor : op;
                    const texto = typeof op === "object" ? op.texto : op;
                    return <option key={valor} value={valor}>{texto}</option>;
                })}
            </select>
        );
    } else {
        control = <input {...comunes} type={tipo} maxLength={maxLength} placeholder={placeholder} />;
    }

    return (
        <div className={className}>
            {etiqueta && (
                <label htmlFor={id} className="form-label">
                    {etiqueta}{requerido && <span className="text-danger"> *</span>}
                </label>
            )}
            {control}
            {ayuda && <div className="form-text">{ayuda}</div>}
            {children}
            <MensajeError mensaje={error} id={`${id}-error`} />
        </div>
    );
}
