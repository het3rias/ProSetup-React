import { useFormulario } from "../../hooks/useFormulario.js";
import { validarProducto } from "../../utils/validaciones.js";
import CampoFormulario from "../common/CampoFormulario.jsx";

export const PRODUCTO_VACIO = {
    codigo: "", nombre: "", descripcion: "", precio: "", precioOferta: "", stock: "", stockCritico: "", categoria: "", imagen: ""
};

// Convierte un producto guardado en valores de formulario (todo como texto)
export function productoAFormulario(producto) {
    if (!producto) return PRODUCTO_VACIO;
    return {
        codigo: producto.codigo, nombre: producto.nombre, descripcion: producto.descripcion || "",
        precio: String(producto.precio), precioOferta: producto.precioOferta == null ? "" : String(producto.precioOferta),
        stock: String(producto.stock), stockCritico: producto.stockCritico == null ? "" : String(producto.stockCritico),
        categoria: producto.categoria, imagen: producto.imagen || ""
    };
}

// Convierte los valores del formulario al formato que se guarda en la base de datos
export function formularioAProducto(valores) {
    return {
        codigo: valores.codigo.trim().toUpperCase(),
        nombre: valores.nombre.trim(),
        descripcion: valores.descripcion.trim(),
        precio: Number(valores.precio),
        precioOferta: valores.precioOferta === "" ? null : Number(valores.precioOferta),
        stock: Number(valores.stock),
        stockCritico: valores.stockCritico === "" ? null : Number(valores.stockCritico),
        categoria: valores.categoria,
        imagen: valores.imagen.trim() || "/img/placeholder.png"
    };
}

/**
 * Formulario de producto (nuevo o editar).
 * Props: valoresIniciales, categorias (nombres), existeCodigo (fn), onGuardar(producto), onCancelar.
 */
export default function ProductForm({ valoresIniciales = PRODUCTO_VACIO, categorias, existeCodigo = () => false, onGuardar, onCancelar, textoBoton = "Guardar" }) {
    const validar = (datos) => validarProducto(datos, { existeCodigo });
    const { valores, errores, manejarCambio, manejarBlur, validarTodo } = useFormulario(valoresIniciales, validar);

    const enviar = (e) => {
        e.preventDefault();
        if (!validarTodo()) return;
        onGuardar(formularioAProducto(valores));
    };

    const campo = (props) => (
        <CampoFormulario value={valores[props.name]} onChange={manejarCambio} onBlur={manejarBlur} error={errores[props.name]} {...props} />
    );

    return (
        <form onSubmit={enviar} noValidate data-testid="form-producto">
            <div className="row">
                <div className="col-md-4">{campo({ etiqueta: "Código", name: "codigo", requerido: true, placeholder: "TEC-002" })}</div>
                <div className="col-md-8">{campo({ etiqueta: "Nombre", name: "nombre", maxLength: 100, requerido: true })}</div>
            </div>
            {campo({ etiqueta: "Descripción", name: "descripcion", como: "textarea", maxLength: 500, ayuda: `${valores.descripcion.length}/500` })}
            <div className="row">
                <div className="col-md-3">{campo({ etiqueta: "Precio", name: "precio", tipo: "number", requerido: true })}</div>
                <div className="col-md-3">{campo({ etiqueta: "Precio oferta", name: "precioOferta", tipo: "number", ayuda: "Vacío = sin oferta" })}</div>
                <div className="col-md-3">{campo({ etiqueta: "Stock", name: "stock", tipo: "number", requerido: true })}</div>
                <div className="col-md-3">{campo({ etiqueta: "Stock crítico", name: "stockCritico", tipo: "number", ayuda: "Umbral de alerta" })}</div>
            </div>
            <div className="row">
                <div className="col-md-6">{campo({ etiqueta: "Categoría", name: "categoria", como: "select", opciones: categorias, placeholder: "-- Seleccione categoría --", requerido: true })}</div>
                <div className="col-md-6">{campo({ etiqueta: "Imagen (ruta o URL)", name: "imagen", placeholder: "/img/teclado.jpg" })}</div>
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">{textoBoton}</button>
                {onCancelar && <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>}
            </div>
        </form>
    );
}
