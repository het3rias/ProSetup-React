/** Tarjeta de estadística del dashboard (título, valor, detalle e ícono). */
export default function TarjetaEstadistica({ titulo, valor, detalle, color = "primary", icono }) {
    return (
        <div className={`card text-bg-${color} shadow-sm h-100`}>
            <div className="card-body d-flex align-items-center gap-3">
                {icono && <span className="fs-1" aria-hidden="true">{icono}</span>}
                <div>
                    <p className="mb-1 fw-semibold">{titulo}</p>
                    <p className="fs-3 fw-bold mb-0" data-testid="valor-estadistica">{valor}</p>
                    {detalle && <small className="opacity-75">{detalle}</small>}
                </div>
            </div>
        </div>
    );
}
