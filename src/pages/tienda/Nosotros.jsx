const SECCIONES = [
    {
        titulo: "Nuestra historia",
        texto: "La idea surgió de una frustración compartida: conseguir una placa de video o un teclado mecánico bueno en Chile significaba pagar de más, esperar semanas por un envío desde afuera, o comprarle a alguien que no daba garantía ni soporte real. Decidimos hacer las cosas distinto: comprar directo a distribuidores, mantener stock local, y responder nosotros mismos cuando algo fallaba. El primer año trabajamos desde una pieza convertida en bodega; hoy tenemos un local propio y un equipo que sigue creciendo, pero la forma de trabajar no cambió mucho: seguimos probando cada componente antes de despacharlo y seguimos contestando las consultas nosotros mismos."
    },
    {
        titulo: "Nuestra misión",
        texto: "Que armar o actualizar tu PC en Chile sea simple, rápido y sin sorpresas: productos originales, precios claros y gente que realmente entiende de hardware para ayudarte a elegir."
    },
    {
        titulo: "Visión",
        texto: "Ser la tienda de referencia para gamers, streamers y profesionales que arman sus propios equipos en Chile, reconocida por su asesoría técnica y su servicio post-venta."
    },
    {
        titulo: "Nuestros valores",
        texto: "Transparencia en cada compra (sin letra chica ni precios ocultos), pasión genuina por el hardware, soporte real después de la venta y mejora constante de nuestro catálogo según lo que la comunidad gamer y de PC building realmente necesita."
    }
];

export default function Nosotros() {
    return (
        <div className="container my-5" style={{ maxWidth: 900 }}>
            <h1 className="h2">Quiénes somos</h1>
            <p className="lead">
                ProSetup nació en 2026 en Santiago, de la mano de un grupo de amigos que se conocieron armando y reparando PCs por afición.
                Empezamos vendiendo componentes usados y haciendo mantenciones a domicilio los fines de semana, mientras cada uno tenía su pega
                de lunes a viernes. Lo que partió como un par de publicaciones en un grupo de Facebook terminó convirtiéndose en la tienda que es hoy.
            </p>
            <div className="row g-4 mt-2">
                {SECCIONES.map(s => (
                    <section key={s.titulo} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h2 className="h5">{s.titulo}</h2>
                                <p className="mb-0">{s.texto}</p>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
