/* ============================================
   ProSetup - Datos iniciales ("semilla" de la base de datos simulada)
   Se cargan en localStorage la primera vez que se abre el sitio
   (o cuando cambia la versión de la base de datos en db.js).
   ============================================ */

export const categoriasIniciales = [
    { id: 1, nombre: "Perifericos", descripcion: "Teclados, mouse y todo lo que conectas a tu PC.", imagen: "/img/teclado.jpg" },
    { id: 2, nombre: "Audio", descripcion: "Audífonos, parlantes y micrófonos para jugar y transmitir.", imagen: "/img/7.1.png" },
    { id: 3, nombre: "Monitores", descripcion: "Pantallas de alta tasa de refresco para gaming y trabajo.", imagen: "/img/monitor144.webp" },
    { id: 4, nombre: "Accesorios", descripcion: "Mousepads, webcams, hubs y soportes para tu escritorio.", imagen: "/img/mousepadrgb.jpeg" },
    { id: 5, nombre: "Componentes", descripcion: "Almacenamiento y piezas para armar o mejorar tu equipo.", imagen: "/img/SSD.png" },
    { id: 6, nombre: "Sillas y Mobiliario", descripcion: "Sillas y muebles para largas sesiones frente al PC.", imagen: "/img/silla.webp" }
];

// Campos: codigo, nombre, descripcion, precio, precioOferta (null si no está en oferta),
// stock, stockCritico (umbral de alerta), categoria (nombre), imagen.
export const productosIniciales = [
    { id: 1, codigo: "TEC-001", nombre: "Teclado Mecánico RGB", descripcion: "Teclado mecánico con switches rojos e iluminación RGB personalizable.", precio: 45990, precioOferta: null, stock: 15, stockCritico: 5, categoria: "Perifericos", imagen: "/img/teclado.jpg" },
    { id: 2, codigo: "MOU-001", nombre: "Mouse Gamer 16000 DPI", descripcion: "Mouse óptico gamer de alta precisión, sensor de 16000 DPI ajustable.", precio: 29990, precioOferta: 24990, stock: 20, stockCritico: 5, categoria: "Perifericos", imagen: "/img/mouse.jpg" },
    { id: 3, codigo: "AUD-001", nombre: "Audífonos Gaming 7.1", descripcion: "Audífonos con sonido envolvente 7.1 y micrófono desmontable.", precio: 38990, precioOferta: null, stock: 12, stockCritico: 4, categoria: "Audio", imagen: "/img/7.1.png" },
    { id: 4, codigo: "MON-001", nombre: "Monitor Gamer 24\" 144Hz", descripcion: "Monitor Full HD de 24 pulgadas con tasa de refresco de 144Hz.", precio: 149990, precioOferta: 129990, stock: 8, stockCritico: 3, categoria: "Monitores", imagen: "/img/monitor144.webp" },
    { id: 5, codigo: "ACC-001", nombre: "Mousepad XL RGB", descripcion: "Mousepad extendido con borde iluminado RGB.", precio: 14990, precioOferta: 9990, stock: 30, stockCritico: 8, categoria: "Accesorios", imagen: "/img/mousepadrgb.jpeg" },
    { id: 6, codigo: "ACC-002", nombre: "Webcam Full HD 1080p", descripcion: "Webcam con resolución 1080p y corrección automática de luz.", precio: 35990, precioOferta: null, stock: 14, stockCritico: 4, categoria: "Accesorios", imagen: "/img/webcam.webp" },
    { id: 7, codigo: "SIL-001", nombre: "Silla Gamer Ergonómica", descripcion: "Silla gamer con respaldo reclinable, apoyabrazos ajustables y base de 5 ruedas.", precio: 119990, precioOferta: null, stock: 3, stockCritico: 3, categoria: "Sillas y Mobiliario", imagen: "/img/silla.webp" },
    { id: 8, codigo: "AUD-002", nombre: "Parlantes Bluetooth 2.1", descripcion: "Set de parlantes 2.1 con subwoofer, conexión Bluetooth y entrada auxiliar.", precio: 42990, precioOferta: 34990, stock: 10, stockCritico: 3, categoria: "Audio", imagen: "/img/parlantes.webp" },
    { id: 9, codigo: "AUD-003", nombre: "Micrófono de Condensador USB", descripcion: "Micrófono USB plug and play para streaming y grabación, con soporte antivibración.", precio: 54990, precioOferta: null, stock: 9, stockCritico: 3, categoria: "Audio", imagen: "/img/microfono.jpg" },
    { id: 10, codigo: "ACC-003", nombre: "Hub USB-C 7 en 1", descripcion: "Adaptador USB-C con salida HDMI, lector de tarjetas SD/microSD y 3 puertos USB 3.0.", precio: 24990, precioOferta: null, stock: 18, stockCritico: 5, categoria: "Accesorios", imagen: "/img/conectar71.png" },
    { id: 11, codigo: "ACC-004", nombre: "Soporte de Monitor Articulado", descripcion: "Brazo articulado de escritorio para un monitor, con ajuste de altura e inclinación.", precio: 32990, precioOferta: null, stock: 2, stockCritico: 3, categoria: "Accesorios", imagen: "/img/soporte.png" },
    { id: 12, codigo: "COM-001", nombre: "SSD NVMe 1TB", descripcion: "Unidad de estado sólido NVMe M.2 de 1TB, velocidades de lectura de hasta 3500 MB/s.", precio: 64990, precioOferta: 54990, stock: 16, stockCritico: 4, categoria: "Componentes", imagen: "/img/SSD.png" }
];

// IMPORTANTE (para aprender): las contraseñas se guardan en texto plano solo
// porque este proyecto no tiene servidor. En un sistema real se guardan "hasheadas".
export const usuariosIniciales = [
    {
        run: "190110222", nombre: "Admin", apellidos: "ProSetup", email: "admin@duoc.cl", password: "1234",
        telefono: "", fechaNacimiento: "", tipoUsuario: "Administrador",
        region: "Región Metropolitana de Santiago", comuna: "Santiago", direccion: "Av. Siempre Viva 123"
    },
    {
        run: "18057784K", nombre: "Vero", apellidos: "Vendedora", email: "vendedor@duoc.cl", password: "1234",
        telefono: "", fechaNacimiento: "", tipoUsuario: "Vendedor",
        region: "Región Metropolitana de Santiago", comuna: "Maipú", direccion: "Calle Comercio 456"
    },
    {
        run: "204567891", nombre: "Camila", apellidos: "Rojas Pérez", email: "cliente@gmail.com", password: "1234",
        telefono: "912345678", fechaNacimiento: "2001-05-14", tipoUsuario: "Cliente",
        region: "Región Metropolitana de Santiago", comuna: "La Florida", direccion: "Los Crisantemos 1450"
    }
];

// Dos órdenes de ejemplo para que el dashboard, las boletas y los reportes no partan vacíos
export const ordenesIniciales = [
    {
        id: 1001, codigo: "ORDER-1001", fecha: "2026-09-28T15:20:00.000Z", estado: "Pagada", motivo: "",
        usuarioEmail: "cliente@gmail.com",
        cliente: { nombre: "Camila", apellidos: "Rojas Pérez", email: "cliente@gmail.com" },
        direccion: { calle: "Los Crisantemos 1450", departamento: "", region: "Región Metropolitana de Santiago", comuna: "La Florida", indicaciones: "" },
        entrega: "domicilio",
        items: [
            { id: 1, codigo: "TEC-001", nombre: "Teclado Mecánico RGB", precio: 45990, cantidad: 1, imagen: "/img/teclado.jpg" },
            { id: 2, codigo: "MOU-001", nombre: "Mouse Gamer 16000 DPI", precio: 24990, cantidad: 1, imagen: "/img/mouse.jpg" }
        ],
        subtotal: 70980, costoEnvio: 0, total: 70980
    },
    {
        id: 1002, codigo: "ORDER-1002", fecha: "2026-10-03T19:05:00.000Z", estado: "Enviada", motivo: "",
        usuarioEmail: "cliente@gmail.com",
        cliente: { nombre: "Camila", apellidos: "Rojas Pérez", email: "cliente@gmail.com" },
        direccion: { calle: "Los Crisantemos 1450", departamento: "Depto 302", region: "Región Metropolitana de Santiago", comuna: "La Florida", indicaciones: "Dejar con conserjería" },
        entrega: "domicilio",
        items: [
            { id: 12, codigo: "COM-001", nombre: "SSD NVMe 1TB", precio: 54990, cantidad: 1, imagen: "/img/SSD.png" }
        ],
        subtotal: 54990, costoEnvio: 0, total: 54990
    }
];

// Los blogs son contenido fijo (no se administran desde el panel)
export const blogs = [
    {
        id: 1,
        titulo: "Cómo elegir tu primer teclado mecánico",
        resumen: "Te contamos las diferencias entre switches y cuál te conviene según tu uso.",
        imagen: "/img/teclado.jpg",
        parrafos: [
            "Los teclados mecánicos usan un switch individual debajo de cada tecla, a diferencia de los teclados de membrana. Esto les da una respuesta más precisa y, en general, mayor durabilidad.",
            "Los switches Red son lineales y suaves, ideales para juegos rápidos. Los switches Blue son clicky y dan una retroalimentación táctil y sonora, populares para escribir. Los switches Brown son un punto intermedio entre ambos.",
            "Si estás empezando, te recomendamos probar un switch Brown: sirve bien tanto para jugar como para escribir, sin ser tan ruidoso como un Blue."
        ]
    },
    {
        id: 2,
        titulo: "5 tips para armar tu setup gamer",
        resumen: "Desde la iluminación hasta la ergonomía: arma un espacio cómodo y funcional.",
        imagen: "/img/setup.jpg",
        parrafos: [
            "Elige una buena silla: pasarás muchas horas sentado, invierte en tu espalda.",
            "Cuida la altura del monitor: la parte superior de la pantalla debe quedar a la altura de tus ojos.",
            "Organiza los cables: un escritorio ordenado ayuda a mantener la concentración.",
            "Ilumina bien el espacio: evita jugar solo con la luz del monitor, cansa la vista.",
            "Invierte en periféricos cómodos: un buen mouse y teclado marcan la diferencia en sesiones largas."
        ]
    }
];
