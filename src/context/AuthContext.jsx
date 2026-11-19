import { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError, registrarAlExpirar, tokens } from "../services/api.js";
import { cargarDatosPrivados, sesionDB } from "../data/db.js";
import { useDatos } from "../hooks/useDatos.js";

/* Contexto de autenticación: comparte el usuario conectado con toda la app.

   Flujo de sesión con JWT:
   1. Login: el backend valida el correo y la contraseña y devuelve un accessToken y un refreshToken.
   2. Los tokens se guardan en sessionStorage (api.js) y el usuario en memoria (db.js).
   3. Al recargar la página (F5) la memoria se pierde, pero los tokens siguen en sessionStorage:
      aquí se pide GET /api/auth/me con el token para recuperar al usuario sin pedir login otra vez.
   4. Si el accessToken vence, api.js lo renueva solo con el refreshToken; si eso también falla,
      se cierra la sesión (registrarAlExpirar). */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const usuario = useDatos(() => sesionDB.obtenerUsuario());
    // "cargando" es true mientras se restaura la sesión después de recargar la página
    const [cargando, setCargando] = useState(() => tokens.hayToken() && !sesionDB.obtenerUsuario());

    useEffect(() => {
        registrarAlExpirar(() => sesionDB.cerrar());
    }, []);

    useEffect(() => {
        if (!tokens.hayToken() || sesionDB.obtenerUsuario()) {
            setCargando(false);
            return undefined;
        }
        let activo = true;
        (async () => {
            try {
                const actual = await api.autenticacion.yo();
                await cargarDatosPrivados(actual);
                if (activo) sesionDB.establecer(actual);
            } catch (error) {
                // Token inválido o vencido: se descarta. Si el servidor está apagado se conservan los tokens.
                if (!(error instanceof ApiError) || error.status !== 0) tokens.borrar();
            } finally {
                if (activo) setCargando(false);
            }
        })();
        return () => { activo = false; };
    }, []);

    /** Devuelve el usuario si el login fue correcto, o null si el correo/contraseña no coinciden. */
    const iniciarSesion = async (email, password) => {
        let respuesta;
        try {
            respuesta = await api.autenticacion.login(email.trim().toLowerCase(), password);
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) return null;
            throw error;
        }
        tokens.guardar(respuesta);
        await cargarDatosPrivados(respuesta.usuario);
        sesionDB.establecer(respuesta.usuario);
        return respuesta.usuario;
    };

    /** Registro público: crea un Cliente en el backend e inicia sesión con esa cuenta. */
    const registrar = async (datos) => {
        const { confirmar, ...resto } = datos;
        await api.autenticacion.registrar({ ...resto, fechaNacimiento: resto.fechaNacimiento || null });
        return iniciarSesion(datos.email, datos.password);
    };

    const cerrarSesion = () => sesionDB.cerrar();

    const valor = {
        usuario,
        cargando,
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
