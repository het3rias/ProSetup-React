/* ============================================
   ProSetup - Cálculos para el dashboard y los reportes (funciones puras)
   Solo se consideran ventas las órdenes que no fueron rechazadas.
   ============================================ */

export const ESTADOS_ORDEN = ["Pagada", "Enviada", "Entregada", "Rechazada"];

export const esVenta = (orden) => orden.estado !== "Rechazada";

export function resumenVentas(ordenes) {
    const ventas = ordenes.filter(esVenta);
    const total = ventas.reduce((suma, o) => suma + o.total, 0);
    return {
        cantidadOrdenes: ordenes.length,
        cantidadVentas: ventas.length,
        totalVendido: total,
        ticketPromedio: ventas.length ? Math.round(total / ventas.length) : 0,
        rechazadas: ordenes.length - ventas.length
    };
}

export function ordenesPorEstado(ordenes) {
    return ESTADOS_ORDEN.map(estado => ({ estado, cantidad: ordenes.filter(o => o.estado === estado).length }));
}

// Unidades y monto vendido por producto, de mayor a menor
export function productosMasVendidos(ordenes, limite = 5) {
    const acumulado = {};
    ordenes.filter(esVenta).forEach(o => o.items.forEach(item => {
        if (!acumulado[item.id]) acumulado[item.id] = { id: item.id, nombre: item.nombre, unidades: 0, monto: 0 };
        acumulado[item.id].unidades += item.cantidad;
        acumulado[item.id].monto += item.precio * item.cantidad;
    }));
    return Object.values(acumulado).sort((a, b) => b.unidades - a.unidades || b.monto - a.monto).slice(0, limite);
}

// Monto vendido por categoría (usa la categoría actual de cada producto)
export function ventasPorCategoria(ordenes, productos) {
    const acumulado = {};
    ordenes.filter(esVenta).forEach(o => o.items.forEach(item => {
        const categoria = productos.find(p => p.id === item.id)?.categoria || "Sin categoría";
        acumulado[categoria] = (acumulado[categoria] || 0) + item.precio * item.cantidad;
    }));
    return Object.entries(acumulado).map(([categoria, monto]) => ({ categoria, monto })).sort((a, b) => b.monto - a.monto);
}

export function inventarioValorizado(productos) {
    return productos.reduce((suma, p) => suma + Number(p.precio) * Number(p.stock), 0);
}
