import { REGIONES_CHILE, obtenerComunas } from "../../data/regiones.js";
import CampoFormulario from "./CampoFormulario.jsx";

/**
 * Par de select dependientes Región -> Comuna.
 * Al cambiar la región se limpia la comuna y se cargan las comunas de esa región.
 * onChange recibe un evento "simulado" { target: { name, value } } para que sirva
 * directo con el hook useFormulario.
 */
export default function SelectRegionComuna({ region, comuna, onChange, onBlur, errores = {}, requerido = true }) {
    const comunas = obtenerComunas(region);

    const cambiarRegion = (e) => {
        onChange({ target: { name: "region", value: e.target.value } });
        onChange({ target: { name: "comuna", value: "" } });
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <CampoFormulario
                    etiqueta="Región" name="region" como="select" value={region} onChange={cambiarRegion} onBlur={onBlur}
                    placeholder="-- Seleccione la región --" opciones={REGIONES_CHILE.map(r => r.region)}
                    error={errores.region} requerido={requerido}
                />
            </div>
            <div className="col-md-6">
                <CampoFormulario
                    etiqueta="Comuna" name="comuna" como="select" value={comuna} onChange={onChange} onBlur={onBlur}
                    placeholder="-- Seleccione la comuna --" opciones={comunas} deshabilitado={!region}
                    error={errores.comuna} requerido={requerido}
                />
            </div>
        </div>
    );
}
