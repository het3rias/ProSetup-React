import { Link } from "react-router-dom";

export default function NoEncontrado() {
    return (
        <div className="container my-5 text-center">
            <h1 className="display-5">404</h1>
            <p className="lead">La página que buscas no existe.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
    );
}
