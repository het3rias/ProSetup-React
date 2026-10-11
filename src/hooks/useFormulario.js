import { useRef, useState } from "react";

/**
 * Hook reutilizable para formularios controlados.
 * Maneja el estado de los valores, los errores y los campos "tocados"
 * (para mostrar errores en vivo solo después de que el usuario salió del campo).
 *
 * Se guarda una copia de los valores en un ref para que varios cambios seguidos
 * (ej: cambiar la región y limpiar la comuna en el mismo clic) no se pisen entre sí.
 */
export function useFormulario(valoresIniciales, validar) {
    const [valores, setValoresEstado] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});
    const valoresRef = useRef(valoresIniciales);
    const tocadosRef = useRef({});

    const setValores = (nuevos) => {
        valoresRef.current = nuevos;
        setValoresEstado(nuevos);
    };

    // Recalcula los errores, mostrando solo los de campos ya tocados
    const revalidar = () => {
        const todos = validar(valoresRef.current);
        const visibles = {};
        Object.keys(todos).forEach(campo => {
            if (tocadosRef.current[campo]) visibles[campo] = todos[campo];
        });
        setErrores(visibles);
    };

    const manejarCambio = (evento) => {
        const { name, value, type, checked } = evento.target;
        setValores({ ...valoresRef.current, [name]: type === "checkbox" ? checked : value });
        revalidar();
    };

    const manejarBlur = (evento) => {
        tocadosRef.current = { ...tocadosRef.current, [evento.target.name]: true };
        revalidar();
    };

    // Valida todo (al enviar). Devuelve true si no hay errores.
    const validarTodo = () => {
        const todos = validar(valoresRef.current);
        Object.keys(valoresRef.current).forEach(c => { tocadosRef.current[c] = true; });
        setErrores(todos);
        return Object.keys(todos).length === 0;
    };

    const reiniciar = (nuevosValores = valoresIniciales) => {
        setValores(nuevosValores);
        tocadosRef.current = {};
        setErrores({});
    };

    return { valores, setValores, errores, setErrores, manejarCambio, manejarBlur, validarTodo, reiniciar };
}
