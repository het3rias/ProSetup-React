/**
 * Filtros de búsqueda del catálogo (componente controlado).
 * Props: filtros = { texto, categoria, orden, soloOfertas }, categorias = [nombres],
 * onCambiar(nuevosFiltros).
 */
export default function FiltroProductos({ filtros, categorias, onCambiar }) {
    const cambiar = (e) => {
        const { name, value, type, checked } = e.target;
        onCambiar({ ...filtros, [name]: type === "checkbox" ? checked : value });
    };

    return (
        <form className="card card-body shadow-sm mb-4" onSubmit={(e) => e.preventDefault()} role="search">
            <div className="row g-2 align-items-end">
                <div className="col-12 col-md-4">
                    <label htmlFor="filtro-texto" className="form-label small mb-1">Buscar</label>
                    <input id="filtro-texto" name="texto" type="search" className="form-control"
                        placeholder="Nombre o código..." value={filtros.texto} onChange={cambiar} />
                </div>
                <div className="col-6 col-md-3">
                    <label htmlFor="filtro-categoria" className="form-label small mb-1">Categoría</label>
                    <select id="filtro-categoria" name="categoria" className="form-select" value={filtros.categoria} onChange={cambiar}>
                        <option value="">Todas</option>
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="col-6 col-md-3">
                    <label htmlFor="filtro-orden" className="form-label small mb-1">Ordenar por</label>
                    <select id="filtro-orden" name="orden" className="form-select" value={filtros.orden} onChange={cambiar}>
                        <option value="">Destacados</option>
                        <option value="precio-asc">Precio: menor a mayor</option>
                        <option value="precio-desc">Precio: mayor a menor</option>
                        <option value="nombre">Nombre (A-Z)</option>
                    </select>
                </div>
                <div className="col-12 col-md-2">
                    <div className="form-check mb-2">
                        <input id="filtro-ofertas" name="soloOfertas" type="checkbox" className="form-check-input"
                            checked={filtros.soloOfertas} onChange={cambiar} />
                        <label htmlFor="filtro-ofertas" className="form-check-label">Solo ofertas</label>
                    </div>
                </div>
            </div>
        </form>
    );
}
