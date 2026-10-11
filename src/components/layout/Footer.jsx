import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer-tienda mt-5">
            <div className="container py-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <img src="/img/logo2.png" alt="ProSetup" className="logo-footer mb-2" />
                        <p className="small mb-0">Componentes y periféricos para armar tu setup, con soporte real después de la venta.</p>
                    </div>
                    <div className="col-6 col-md-4">
                        <h2 className="h6 text-white">Tienda</h2>
                        <ul className="list-unstyled small mb-0">
                            <li><Link to="/productos">Productos</Link></li>
                            <li><Link to="/categorias">Categorías</Link></li>
                            <li><Link to="/ofertas">Ofertas</Link></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-4">
                        <h2 className="h6 text-white">ProSetup</h2>
                        <ul className="list-unstyled small mb-0">
                            <li><Link to="/nosotros">Nosotros</Link></li>
                            <li><Link to="/blogs">Blogs</Link></li>
                            <li><Link to="/contacto">Contacto</Link></li>
                        </ul>
                    </div>
                </div>
                <p className="text-center small mt-4 mb-0">&copy; 2026 ProSetup · Proyecto académico DSY1104 Duoc UC</p>
            </div>
        </footer>
    );
}
