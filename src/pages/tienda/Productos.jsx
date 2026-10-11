import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categoriasDB, productosDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { useCarrito } from "../../context/CarritoContext.jsx";
import FiltroProductos from "../../components/productos/FiltroProductos.jsx";
import ProductList from "../../components/productos/ProductList.jsx";
import { FILTROS_INICIALES, filtrarProductos } from "../../components/productos/filtrarProductos.js";

/** Catálogo con buscador, filtro por categoría, solo ofertas y orden. */
export default function Productos() {
    const productos = useDatos(() => productosDB.listar());
    const categorias = useDatos(() => categoriasDB.listar());
    const { agregar } = useCarrito();
    const [parametros] = useSearchParams();
    const [filtros, setFiltros] = useState({ ...FILTROS_INICIALES, texto: parametros.get("q") || "" });

    // Si se busca desde el navbar estando ya en esta página, se actualiza el filtro
    useEffect(() => {
        setFiltros(f => ({ ...f, texto: parametros.get("q") || "" }));
    }, [parametros]);

    const resultado = filtrarProductos(productos, filtros);

    return (
        <div className="container my-5">
            <h1 className="h3 mb-3">Productos</h1>
            <FiltroProductos filtros={filtros} categorias={categorias.map(c => c.nombre)} onCambiar={setFiltros} />
            <p className="text-muted small" data-testid="total-resultados">{resultado.length} producto(s) encontrado(s)</p>
            <ProductList productos={resultado} onAgregar={agregar} mensajeVacio="No encontramos productos con esos filtros." />
        </div>
    );
}
