/* ============================================
   ProSetup - Cliente de la API REST (backend Spring Boot)
   ============================================
   Todas las llamadas al servidor pasan por este archivo:
   - Agrega el token JWT (header Authorization: Bearer ...) a cada petición.
   - Si el servidor responde 401 (token vencido), intenta renovar la sesión con el
     refreshToken y repite la petición una sola vez.
   - Convierte los errores del servidor en un ApiError con un mensaje legible.

   La URL del backend se define en el archivo .env (VITE_API_URL).
   Las colecciones se exportan como OBJETOS (api.productos, api.usuarios, ...) para que en las
   pruebas se puedan reemplazar funciones con spyOn (mocks), igual que en db.js.
   ============================================ */

export const API_URL = String(import.meta.env?.VITE_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

const CLAVE_ACCESO = "prosetup_token";
const CLAVE_REFRESCO = "prosetup_refresh";

/** Error devuelto por el servidor (status 0 = no se pudo conectar). */
export class ApiError extends Error {
    constructor(status, mensaje, detalle = null) {
        super(mensaje);
        this.name = "ApiError";
        this.status = status;
        this.detalle = detalle;
    }
}

/* ---------------- Tokens ----------------
   Se guardan en sessionStorage: sobreviven a recargar la página (F5) pero se borran
   al cerrar la pestaña. */
export const tokens = {
    obtenerAcceso: () => sessionStorage.getItem(CLAVE_ACCESO),
    obtenerRefresco: () => sessionStorage.getItem(CLAVE_REFRESCO),
    hayToken: () => Boolean(sessionStorage.getItem(CLAVE_ACCESO)),
    guardar({ accessToken, refreshToken }) {
        sessionStorage.setItem(CLAVE_ACCESO, accessToken);
        sessionStorage.setItem(CLAVE_REFRESCO, refreshToken);
    },
    borrar() {
        sessionStorage.removeItem(CLAVE_ACCESO);
        sessionStorage.removeItem(CLAVE_REFRESCO);
    }
};

// Función que avisa a la app cuando la sesión ya no se pudo renovar (para cerrarla)
let alExpirar = () => {};
export function registrarAlExpirar(funcion) {
    alExpirar = funcion;
}

/* ---------------- Petición base ---------------- */

let renovando = null; // evita renovar el token varias veces a la vez

async function renovarSesion() {
    const refresco = tokens.obtenerRefresco();
    if (!refresco) return false;
    if (!renovando) {
        renovando = pedir("/api/v1/auth/refresh", { metodo: "POST", cuerpo: { refreshToken: refresco }, autenticado: false })
            .then((respuesta) => { tokens.guardar(respuesta); return true; })
            .catch(() => { tokens.borrar(); alExpirar(); return false; })
            .finally(() => { renovando = null; });
    }
    return renovando;
}

async function pedir(ruta, { metodo = "GET", cuerpo, autenticado = true, reintentar = true } = {}) {
    const cabeceras = { Accept: "application/json" };
    if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";
    const acceso = tokens.obtenerAcceso();
    if (autenticado && acceso) cabeceras.Authorization = `Bearer ${acceso}`;

    let respuesta;
    try {
        respuesta = await fetch(API_URL + ruta, {
            method: metodo,
            headers: cabeceras,
            body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
        });
    } catch {
        throw new ApiError(0, "No se pudo conectar con el servidor. Revisa que el backend esté encendido.");
    }

    // Token vencido: se renueva con el refreshToken y se repite la petición una vez
    if (respuesta.status === 401 && autenticado && reintentar && tokens.obtenerRefresco()) {
        if (await renovarSesion()) return pedir(ruta, { metodo, cuerpo, autenticado, reintentar: false });
    }

    const texto = await respuesta.text();
    let datos = null;
    try { datos = texto ? JSON.parse(texto) : null; } catch { datos = null; }

    if (!respuesta.ok) {
        throw new ApiError(respuesta.status, datos?.mensaje || `Error ${respuesta.status} del servidor.`, datos?.detalle ?? null);
    }
    return datos;
}

/* ---------------- Endpoints ---------------- */

export const api = {
    autenticacion: {
        login: (email, password) => pedir("/api/v1/auth/login", { metodo: "POST", cuerpo: { email, password }, autenticado: false }),
        registrar: (datos) => pedir("/api/v1/auth/register", { metodo: "POST", cuerpo: datos, autenticado: false }),
        yo: () => pedir("/api/v1/auth/me")
    },
    productos: {
        listar: () => pedir("/api/v1/productos"),
        crear: (datos) => pedir("/api/v1/productos", { metodo: "POST", cuerpo: datos }),
        actualizar: (id, datos) => pedir(`/api/v1/productos/${id}`, { metodo: "PUT", cuerpo: datos }),
        eliminar: (id) => pedir(`/api/v1/productos/${id}`, { metodo: "DELETE" })
    },
    categorias: {
        listar: () => pedir("/api/v1/categorias"),
        crear: (datos) => pedir("/api/v1/categorias", { metodo: "POST", cuerpo: datos }),
        actualizar: (id, datos) => pedir(`/api/v1/categorias/${id}`, { metodo: "PUT", cuerpo: datos }),
        eliminar: (id) => pedir(`/api/v1/categorias/${id}`, { metodo: "DELETE" })
    },
    usuarios: {
        listar: () => pedir("/api/v1/usuarios"),
        crear: (datos) => pedir("/api/v1/usuarios", { metodo: "POST", cuerpo: datos }),
        actualizar: (id, datos) => pedir(`/api/v1/usuarios/${id}`, { metodo: "PUT", cuerpo: datos }),
        eliminar: (id) => pedir(`/api/v1/usuarios/${id}`, { metodo: "DELETE" }),
        actualizarPerfil: (datos) => pedir("/api/v1/usuarios/me", { metodo: "PUT", cuerpo: datos })
    },
    ordenes: {
        listar: () => pedir("/api/v1/ordenes"),
        mias: () => pedir("/api/v1/ordenes/mias"),
        crear: (datos) => pedir("/api/v1/ordenes", { metodo: "POST", cuerpo: datos }),
        actualizarEstado: (id, estado) => pedir(`/api/v1/ordenes/${id}/estado`, { metodo: "PUT", cuerpo: { estado } })
    }
};
