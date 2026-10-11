import { estaEnOferta, precioFinal } from "../../utils/tienda.js";

export const FILTROS_INICIALES = { texto: "", categoria: "", orden: "", soloOfertas: false };

/** Aplica búsqueda, categoría, ofertas y orden a una lista de productos (función pura). */
export function filtrarProductos(productos, filtros) {
    const texto = filtros.texto.trim().toLowerCase();
    let resultado = productos.filter(p =>
        (!texto || p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto)) &&
        (!filtros.categoria || p.categoria === filtros.categoria) &&
        (!filtros.soloOfertas || estaEnOferta(p))
    );
    if (filtros.orden === "precio-asc") resultado = [...resultado].sort((a, b) => precioFinal(a) - precioFinal(b));
    if (filtros.orden === "precio-desc") resultado = [...resultado].sort((a, b) => precioFinal(b) - precioFinal(a));
    if (filtros.orden === "nombre") resultado = [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre));
    return resultado;
}
