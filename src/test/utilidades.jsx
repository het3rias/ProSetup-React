/* Utilidades compartidas por las pruebas de componentes */
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { reiniciarDB, sesionDB } from "../data/db.js";

// Muestra la ruta actual para poder verificar redirecciones en las pruebas
export function UbicacionActual() {
    const ubicacion = useLocation();
    return <div data-testid="ruta-actual">{ubicacion.pathname}</div>;
}

/**
 * Renderiza un componente con Router + contextos (igual que en la app real).
 * opciones.ruta: URL inicial; opciones.patron: patrón de la ruta (ej "/producto/:id");
 * opciones.usuario: email con el que se inicia sesión antes de renderizar.
 * opciones.preparar: función que se ejecuta después de reiniciar la BD y antes de renderizar.
 */
export function renderizar(ui, { ruta = "/", patron, usuario, preparar } = {}) {
    reiniciarDB();
    if (usuario) sesionDB.iniciar(usuario);
    if (preparar) preparar(); // permite dejar datos listos (ej: carrito) antes de montar
    return render(
        <MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <CarritoProvider>
                    {patron
                        ? <Routes><Route path={patron} element={ui} /><Route path="*" element={null} /></Routes>
                        : ui}
                    <UbicacionActual />
                </CarritoProvider>
            </AuthProvider>
        </MemoryRouter>
    );
}

// Producto de ejemplo para pruebas de componentes aislados
export const productoEjemplo = {
    id: 99, codigo: "TST-001", nombre: "Teclado de Prueba", descripcion: "Producto de prueba", precio: 10000,
    precioOferta: null, stock: 5, stockCritico: 2, categoria: "Perifericos", imagen: "/img/teclado.jpg"
};
