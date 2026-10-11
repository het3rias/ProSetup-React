const COLORES = { Pagada: "success", Enviada: "info", Entregada: "primary", Rechazada: "danger" };

/** Badge de color según el estado de la orden. */
export default function EstadoOrden({ estado }) {
    return <span className={`badge text-bg-${COLORES[estado] || "secondary"}`}>{estado}</span>;
}
