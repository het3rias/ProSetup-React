import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Protege rutas según el rol del usuario.
 * - Sin sesión -> redirige a /login
 * - Con sesión pero sin el rol permitido -> muestra "Acceso denegado"
 */
export default function RutaProtegida({ roles, children }) {
    const { usuario } = useAuth();
    const ubicacion = useLocation();

    if (!usuario) {
        return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
    }
    if (roles && !roles.includes(usuario.tipoUsuario)) {
        return (
            <div className="container my-5 text-center" data-testid="acceso-denegado">
                <h1 className="h3">Acceso denegado</h1>
                <p className="text-muted">Tu rol ({usuario.tipoUsuario}) no tiene permiso para ver esta página.</p>
            </div>
        );
    }
    return children;
}
