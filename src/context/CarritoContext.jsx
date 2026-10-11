import { createContext, useContext, useEffect, useRef, useState } from "react";
import { carritoDB, productosDB } from "../data/db.js";
import { useDatos } from "../hooks/useDatos.js";
import { agregarItem, calcularSubtotal, detallarCarrito } from "../utils/tienda.js";

/* Contexto del carrito: cualquier componente puede agregar productos
   y el contador del navbar se actualiza al instante. */
const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
    const itemsGuardados = useDatos(() => carritoDB.obtener());
    const productos = useDatos(() => productosDB.listar());
    const [aviso, setAviso] = useState(null); // { tipo: "success" | "warning", texto }
    const temporizador = useRef(null);

    const items = detallarCarrito(itemsGuardados, productos);
    const subtotal = calcularSubtotal(items);
    const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

    const mostrarAviso = (tipo, texto) => {
        setAviso({ tipo, texto });
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setAviso(null), 2500);
    };
    useEffect(() => () => clearTimeout(temporizador.current), []);

    const agregar = (producto, cantidad = 1) => {
        const resultado = agregarItem(carritoDB.obtener(), producto, cantidad);
        if (resultado.ok) carritoDB.guardar(resultado.items);
        mostrarAviso(resultado.ok ? "success" : "warning", resultado.mensaje);
        return resultado.ok;
    };

    const cambiarCantidad = (id, cantidad) => {
        const producto = productos.find(p => p.id === id);
        if (!producto) return;
        const acotada = Math.max(1, Math.min(Number(cantidad) || 1, producto.stock));
        carritoDB.guardar(carritoDB.obtener().map(i => (i.id === id ? { ...i, cantidad: acotada } : i)));
    };

    const eliminar = (id) => carritoDB.guardar(carritoDB.obtener().filter(i => i.id !== id));
    const vaciar = () => carritoDB.vaciar();

    const valor = { items, subtotal, cantidadTotal, aviso, agregar, cambiarCantidad, eliminar, vaciar, cerrarAviso: () => setAviso(null) };
    return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
    const contexto = useContext(CarritoContext);
    if (!contexto) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
    return contexto;
}
