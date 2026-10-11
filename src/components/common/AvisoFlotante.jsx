import { useCarrito } from "../../context/CarritoContext.jsx";

/** Aviso tipo "toast" que aparece al agregar productos al carrito. */
export default function AvisoFlotante() {
    const { aviso, cerrarAviso } = useCarrito();
    if (!aviso) return null;
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className={`toast show align-items-center text-bg-${aviso.tipo} border-0`} role="status">
                <div className="d-flex">
                    <div className="toast-body">{aviso.texto}</div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar" onClick={cerrarAviso}></button>
                </div>
            </div>
        </div>
    );
}
