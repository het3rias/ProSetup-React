import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { categoriasDB } from "../../data/db.js";
import { useDatos } from "../../hooks/useDatos.js";
import { formatearPrecio } from "../../utils/tienda.js";

/**
 * Barra de navegación de la tienda.
 * Estado propio: menú abierto en móvil, dropdown de categorías y texto del buscador.
 * El usuario y el carrito vienen de los contextos.
 */
export default function Navbar() {
    const { usuario, puedeEntrarAdmin, cerrarSesion } = useAuth();
    const { cantidadTotal, subtotal } = useCarrito();
    const categorias = useDatos(() => categoriasDB.listar());
    const navegar = useNavigate();

    const [menuAbierto, setMenuAbierto] = useState(false);
    const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const cerrarMenus = () => { setMenuAbierto(false); setCategoriasAbiertas(false); };

    const buscar = (e) => {
        e.preventDefault();
        navegar(`/productos?q=${encodeURIComponent(busqueda.trim())}`);
        cerrarMenus();
    };

    const salir = () => {
        cerrarSesion();
        cerrarMenus();
        navegar("/");
    };

    const claseLink = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top flex-column py-2">
            {/* Fila 1: logo, buscador, sesión y carrito */}
            <div className="container flex-nowrap gap-2">
                <Link className="navbar-brand me-2" to="/" onClick={cerrarMenus}>
                    <img src="/img/logo2.png" alt="ProSetup" className="logo-navbar" />
                </Link>
                <form className="d-none d-md-flex flex-grow-1 mx-lg-4 buscador-navbar" role="search" onSubmit={buscar}>
                    <input className="form-control form-control-sm me-2" type="search" placeholder="Buscar productos"
                        aria-label="Buscar productos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    <button className="btn btn-sm btn-outline-info" type="submit">Buscar</button>
                </form>
                <div className="d-flex align-items-center gap-2 ms-auto">
                    <div className="d-none d-lg-flex align-items-center gap-2">
                        {usuario ? (
                            <>
                                <span className="text-white small text-nowrap" data-testid="saludo-usuario">Hola, <strong>{usuario.nombre}</strong></span>
                                {puedeEntrarAdmin && <Link to="/admin" className="btn btn-sm btn-outline-light">Admin</Link>}
                                <button type="button" className="btn btn-sm btn-outline-light text-nowrap" onClick={salir}>Cerrar sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-sm btn-outline-light text-nowrap">Iniciar sesión</Link>
                                <Link to="/registro" className="btn btn-sm btn-primary text-nowrap">Crear cuenta</Link>
                            </>
                        )}
                    </div>
                    <Link to="/carrito" className="btn btn-sm btn-cart text-nowrap" onClick={cerrarMenus} aria-label="Ver carrito">
                        🛒 <span data-testid="contador-carrito">{cantidadTotal}</span> · {formatearPrecio(subtotal)}
                    </Link>
                    <button className="navbar-toggler" type="button" aria-label="Abrir menú" aria-expanded={menuAbierto}
                        onClick={() => setMenuAbierto(!menuAbierto)}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>

            {/* Fila 2: enlaces de navegación (en móvil se despliegan con el botón ☰) */}
            <div className="container">
                <div className={"collapse navbar-collapse" + (menuAbierto ? " show" : "")}>
                    <form className="d-flex d-md-none my-2" role="search" onSubmit={buscar}>
                        <input className="form-control form-control-sm me-2" type="search" placeholder="Buscar productos"
                            aria-label="Buscar productos (móvil)" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                        <button className="btn btn-sm btn-outline-info" type="submit">Buscar</button>
                    </form>
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><NavLink className={claseLink} to="/" end onClick={cerrarMenus}>Inicio</NavLink></li>
                        <li className="nav-item"><NavLink className={claseLink} to="/productos" onClick={cerrarMenus}>Productos</NavLink></li>
                        <li className="nav-item dropdown">
                            <button type="button" className="nav-link dropdown-toggle btn btn-link" aria-expanded={categoriasAbiertas}
                                onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}>
                                Categorías
                            </button>
                            <ul className={"dropdown-menu" + (categoriasAbiertas ? " show" : "")}>
                                <li><Link className="dropdown-item" to="/categorias" onClick={cerrarMenus}>Ver todas</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                {categorias.map(c => (
                                    <li key={c.id}><Link className="dropdown-item" to={`/categorias/${c.id}`} onClick={cerrarMenus}>{c.nombre}</Link></li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item"><NavLink className={claseLink} to="/ofertas" onClick={cerrarMenus}>Ofertas</NavLink></li>
                        <li className="nav-item"><NavLink className={claseLink} to="/nosotros" onClick={cerrarMenus}>Nosotros</NavLink></li>
                        <li className="nav-item"><NavLink className={claseLink} to="/blogs" onClick={cerrarMenus}>Blogs</NavLink></li>
                        <li className="nav-item"><NavLink className={claseLink} to="/contacto" onClick={cerrarMenus}>Contacto</NavLink></li>
                    </ul>
                    {/* Sesión en móvil */}
                    <div className="d-lg-none border-top border-secondary pt-2 pb-1 d-flex gap-2 flex-wrap align-items-center">
                        {usuario ? (
                            <>
                                <span className="text-white small">Hola, <strong>{usuario.nombre}</strong></span>
                                {puedeEntrarAdmin && <Link to="/admin" className="btn btn-sm btn-outline-light" onClick={cerrarMenus}>Admin</Link>}
                                <button type="button" className="btn btn-sm btn-outline-light" onClick={salir}>Cerrar sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-sm btn-outline-light" onClick={cerrarMenus}>Iniciar sesión</Link>
                                <Link to="/registro" className="btn btn-sm btn-primary" onClick={cerrarMenus}>Crear cuenta</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
