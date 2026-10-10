/* ============================================
   ProSetup - Reglas de negocio de la tienda (funciones puras)
   ============================================ */

export const COSTO_ENVIO = 3990;
export const ENVIO_GRATIS_DESDE = 50000;

// $45.990 (formato chileno)
export function formatearPrecio(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-CL");
}

export function formatearFecha(iso) {
    return new Date(iso).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}

export function estaEnOferta(producto) {
    return producto.precioOferta != null && producto.precioOferta !== "" && Number(producto.precioOferta) < Number(producto.precio);
}

// Precio que realmente se cobra (el de oferta si corresponde)
export function precioFinal(producto) {
    return estaEnOferta(producto) ? Number(producto.precioOferta) : Number(producto.precio);
}

export function porcentajeDescuento(producto) {
    if (!estaEnOferta(producto)) return 0;
    return Math.round((1 - producto.precioOferta / producto.precio) * 100);
}

export function tieneStockCritico(producto) {
    return producto.stockCritico != null && producto.stockCritico !== "" && Number(producto.stock) <= Number(producto.stockCritico);
}

// Une el carrito guardado ({id, cantidad}) con los datos actuales de cada producto
export function detallarCarrito(itemsCarrito, productos) {
    return itemsCarrito
        .map(item => {
            const producto = productos.find(p => p.id === item.id);
            if (!producto) return null;
            const precio = precioFinal(producto);
            return { ...producto, precioUnitario: precio, cantidad: item.cantidad, subtotal: precio * item.cantidad };
        })
        .filter(Boolean);
}

export function calcularSubtotal(itemsDetallados) {
    return itemsDetallados.reduce((suma, item) => suma + item.subtotal, 0);
}

// Retiro en tienda: gratis. Despacho: gratis desde $50.000, si no $3.990
export function calcularEnvio(subtotal, entrega) {
    if (entrega !== "domicilio" || subtotal === 0) return 0;
    return subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
}

// Reglas del carrito: no se puede agregar más unidades que el stock disponible
export function agregarItem(items, producto, cantidad = 1) {
    if (producto.stock <= 0) return { items, ok: false, mensaje: "Producto sin stock." };
    const existente = items.find(i => i.id === producto.id);
    const actual = existente ? existente.cantidad : 0;
    const nuevaCantidad = Math.min(actual + cantidad, producto.stock);
    if (nuevaCantidad === actual) {
        return { items, ok: false, mensaje: `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.` };
    }
    const nuevos = existente
        ? items.map(i => (i.id === producto.id ? { ...i, cantidad: nuevaCantidad } : i))
        : [...items, { id: producto.id, cantidad: nuevaCantidad }];
    const limitado = nuevaCantidad < actual + cantidad;
    return {
        items: nuevos,
        ok: true,
        mensaje: limitado ? `Se agregó hasta el máximo disponible (${producto.stock}).` : `${producto.nombre} fue agregado al carrito.`
    };
}

// Revisa si alguna línea del carrito supera el stock actual
export function validarStockCarrito(itemsDetallados) {
    return itemsDetallados
        .filter(item => item.cantidad > item.stock)
        .map(item => `${item.nombre}: pediste ${item.cantidad} y quedan ${item.stock}.`);
}
