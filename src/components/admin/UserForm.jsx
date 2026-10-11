import { useFormulario } from "../../hooks/useFormulario.js";
import CampoFormulario from "../common/CampoFormulario.jsx";
import SelectRegionComuna from "../common/SelectRegionComuna.jsx";

export const TIPOS_USUARIO = ["Administrador", "Vendedor", "Cliente"];

/**
 * Formulario de usuario reutilizado en: Nuevo usuario, Editar usuario y Perfil.
 * Props: valoresIniciales, validar(datos), onGuardar(datos), onCancelar,
 * esEdicion (contraseña opcional), mostrarTipo (select de rol), bloqueados (campos solo lectura).
 */
export default function UserForm({ valoresIniciales, validar, onGuardar, onCancelar, esEdicion = false, mostrarTipo = true, bloqueados = [], textoBoton = "Guardar" }) {
    const { valores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario(valoresIniciales, validar);

    const enviar = (e) => {
        e.preventDefault();
        if (!validarTodo()) return;
        const { confirmar, ...datos } = valores;
        onGuardar({
            ...datos,
            run: datos.run.trim().toUpperCase(), email: datos.email.trim().toLowerCase(),
            nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), direccion: datos.direccion.trim()
        });
    };

    const campo = (props) => (
        <CampoFormulario value={valores[props.name]} onChange={manejarCambio} onBlur={manejarBlur} error={errores[props.name]}
            deshabilitado={bloqueados.includes(props.name)} {...props} />
    );

    return (
        <form onSubmit={enviar} noValidate data-testid="form-usuario">
            <div className="row">
                <div className="col-md-6">{campo({ etiqueta: "RUN", name: "run", maxLength: 9, requerido: true, placeholder: "19011022K", ayuda: "Sin puntos ni guion." })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Correo", name: "email", tipo: "email", maxLength: 100, requerido: true })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Nombre", name: "nombre", maxLength: 50, requerido: true })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Apellidos", name: "apellidos", maxLength: 100, requerido: true })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Teléfono", name: "telefono", tipo: "tel", maxLength: 15 })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Fecha de nacimiento", name: "fechaNacimiento", tipo: "date" })}</div>
                {mostrarTipo && (
                    <div className="col-md-6">{campo({ etiqueta: "Tipo de usuario", name: "tipoUsuario", como: "select", opciones: TIPOS_USUARIO, requerido: true })}</div>
                )}
            </div>
            <div className="row">
                <div className="col-md-6">{campo({ etiqueta: "Contraseña", name: "password", tipo: "password", maxLength: 10, requerido: !esEdicion, ayuda: esEdicion ? "Déjala vacía para mantener la actual." : "Entre 4 y 10 caracteres." })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Confirmar contraseña", name: "confirmar", tipo: "password", maxLength: 10, requerido: !esEdicion })}</div>
            </div>
            <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={manejarCambio} onBlur={manejarBlur} errores={errores} />
            {campo({ etiqueta: "Dirección", name: "direccion", maxLength: 300, requerido: true })}
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">{textoBoton}</button>
                {onCancelar && <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>}
            </div>
        </form>
    );
}
