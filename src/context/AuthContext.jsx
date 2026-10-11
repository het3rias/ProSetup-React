import { createContext, useContext } from "react";
import { sesionDB, usuariosDB } from "../data/db.js";
import { useDatos } from "../hooks/useDatos.js";

/* Contexto de autenticación: comparte el usuario conectado con toda la app */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const usuario = useDatos(() => sesionDB.obtenerUsuario());

    const iniciarSesion = (email, password) => {
        const encontrado = usuariosDB.autenticar(email.trim().toLowerCase(), password);
        if (encontrado) sesionDB.iniciar(encontrado.email);
        return encontrado;
    };

    const registrar = (datos) => {
        const nuevo = usuariosDB.crear({ ...datos, tipoUsuario: "Cliente" });
        sesionDB.iniciar(nuevo.email);
        return nuevo;
    };

    const cerrarSesion = () => sesionDB.cerrar();

    const valor = {
        usuario,
        esAdmin: usuario?.tipoUsuario === "Administrador",
        esVendedor: usuario?.tipoUsuario === "Vendedor",
        puedeEntrarAdmin: usuario?.tipoUsuario === "Administrador" || usuario?.tipoUsuario === "Vendedor",
        iniciarSesion,
        registrar,
        cerrarSesion
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return contexto;
}
