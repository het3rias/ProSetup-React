import { Link, useNavigate, useParams } from "react-router-dom";
import { categoriasDB, productosDB } from "../../data/db.js";
import ProductForm, { productoAFormulario } from "../../components/admin/ProductForm.jsx";

/** Nuevo producto (/admin/productos/nuevo) o Editar producto (/admin/productos/:id/editar). */
export default function AdminProductoForm() {
    const { id } = useParams();
    const navegar = useNavigate();
    const esEdicion = Boolean(id);
    const producto = esEdicion ? productosDB.obtenerPorId(id) : null;
    const categorias = categoriasDB.listar().map(c => c.nombre);

    if (esEdicion && !producto) return <p>Producto no encontrado. <Link to="/admin/productos">Volver</Link></p>;

    const guardar = (datos) => {
        if (esEdicion) productosDB.actualizar(id, datos);
        else productosDB.crear(datos);
        navegar("/admin/productos");
    };

    return (
        <>
            <Link to="/admin/productos">&larr; Volver a productos</Link>
            <div className="card shadow-sm mt-3">
                <div className="card-body">
                    <h1 className="h4 mb-3">{esEdicion ? `Editar producto: ${producto.nombre}` : "Nuevo producto"}</h1>
                    <ProductForm
                        valoresIniciales={productoAFormulario(producto)}
                        categorias={categorias}
                        existeCodigo={(codigo) => productosDB.existeCodigo(codigo, esEdicion ? id : null)}
                        onGuardar={guardar}
                        onCancelar={() => navegar("/admin/productos")}
                        textoBoton={esEdicion ? "Guardar cambios" : "Crear producto"}
                    />
                </div>
            </div>
        </>
    );
}
