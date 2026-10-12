import { useState } from "react";
import { ordenesDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { ESTADOS_ORDEN } from "../../utils/reportes.js";
import TablaOrdenes from "../../components/admin/TablaOrdenes.jsx";

export default function AdminOrdenes() {
    const ordenes = useDatos(() => ordenesDB.listar());
    const [estado, setEstado] = useState("");
    const [texto, setTexto] = useState("");

    const t = texto.trim().toLowerCase();
    const filtradas = ordenes.filter(o =>
        (!estado || o.estado === estado) &&
        (!t || String(o.id).includes(t) || o.cliente.email.includes(t) || `${o.cliente.nombre} ${o.cliente.apellidos}`.toLowerCase().includes(t)));

    return (
        <>
            <h1 className="h3 mb-3">Órdenes / Boletas</h1>
            <div className="row g-2 mb-3">
                <div className="col-md-6">
                    <input type="search" className="form-control" placeholder="Buscar por N°, nombre o correo" aria-label="Buscar órdenes"
                        value={texto} onChange={(e) => setTexto(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <select className="form-select" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="">Todos los estados</option>
                        {ESTADOS_ORDEN.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
            </div>
            <div className="card shadow-sm"><div className="card-body">
                <TablaOrdenes ordenes={filtradas} mensajeVacio="No hay órdenes que coincidan con el filtro." />
            </div></div>
        </>
    );
}
