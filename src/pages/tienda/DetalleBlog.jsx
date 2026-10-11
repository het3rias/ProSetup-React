import { Link, useParams } from "react-router-dom";
import { blogs } from "../../data/datosIniciales.js";

export default function DetalleBlog() {
    const { id } = useParams();
    const blog = blogs.find(b => b.id === Number(id));

    if (!blog) {
        return <div className="container my-5"><p>Artículo no encontrado. <Link to="/blogs">Volver a Blogs</Link></p></div>;
    }

    return (
        <div className="container my-5" style={{ maxWidth: 820 }}>
            <Link to="/blogs">&larr; Volver a Blogs</Link>
            <article className="mt-3">
                <h1 className="h2">{blog.titulo}</h1>
                <img src={blog.imagen} alt={blog.titulo} className="img-fluid rounded my-3 imagen-detalle-blog" />
                {blog.parrafos.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
            </article>
        </div>
    );
}
