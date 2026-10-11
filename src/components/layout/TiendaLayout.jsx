import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import AvisoFlotante from "../common/AvisoFlotante.jsx";

/** Estructura común de todas las vistas públicas de la tienda. */
export default function TiendaLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
            <AvisoFlotante />
        </div>
    );
}
