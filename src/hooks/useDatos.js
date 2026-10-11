import { useEffect, useRef, useState } from "react";
import { suscribir } from "../data/db.js";

/**
 * Hook que conecta un componente con la base de datos simulada.
 * - Lee los datos con la función `lector` (ej: () => productosDB.listar()).
 * - Se suscribe a los cambios de db.js: cuando alguien crea, edita o elimina,
 *   el componente se vuelve a renderizar con los datos nuevos (tiempo real).
 * - `deps`: si el lector depende de algo (ej: un id de la URL), se vuelve a leer cuando cambia.
 */
export function useDatos(lector, deps = []) {
    const lectorRef = useRef(lector);
    lectorRef.current = lector;
    const [datos, setDatos] = useState(() => lector());

    useEffect(() => {
        const actualizar = () => setDatos(lectorRef.current());
        actualizar();
        return suscribir(actualizar);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return datos;
}
