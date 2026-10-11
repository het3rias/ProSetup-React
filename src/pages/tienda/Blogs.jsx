import { Link } from "react-router-dom";
import { blogs } from "../../data/datosIniciales.js";

export default function Blogs() {
    return (
        <div className="container my-5">
            <h1 className="h3 mb-4">Noticias importantes</h1>
            <div className="row g-4">
                {blogs.map(blog => (
                    <article key={blog.id} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <img src={blog.imagen} className="card-img-top imagen-blog" alt={blog.titulo} />
                            <div className="card-body">
                                <h2 className="card-title h5">{blog.titulo}</h2>
                                <p className="card-text">{blog.resumen}</p>
                                <Link to={`/blogs/${blog.id}`} className="btn btn-outline-primary">Ver más</Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
