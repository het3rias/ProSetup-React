/* ============================================
   ProSetup - Validaciones (reutilizadas de la Evaluación 1)
   ============================================
   Funciones PURAS: reciben datos y devuelven un objeto de errores
   { campo: "mensaje" }. Si el objeto está vacío, los datos son válidos.
   Al no tocar el DOM se pueden usar en cualquier componente React
   y probar fácilmente con Vitest.
   ============================================ */

// Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com
export const REGEX_CORREO_PERMITIDO = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export const MENSAJE_CORREO = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";

export const esValido = (errores) => Object.keys(errores).length === 0;

/* ---------------- RUN chileno ---------------- */

// Sin puntos ni guion (ej: 19011022K), largo entre 7 y 9
export function formatoRunValido(run) {
    if (/[.\-]/.test(run)) return false;
    return /^[0-9]+[0-9kK]$/.test(run) && run.length >= 7 && run.length <= 9;
}

// Algoritmo módulo 11
export function calcularDigitoVerificador(cuerpo) {
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

export function validarRun(run) {
    if (!formatoRunValido(run)) return false;
    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1).toUpperCase();
    return dv === calcularDigitoVerificador(cuerpo);
}

export function validarCorreo(email) {
    return REGEX_CORREO_PERMITIDO.test(email);
}

/* ---------------- Login ---------------- */

export function validarLogin({ email, password }) {
    const errores = {};
    if (!email) errores.email = "El correo es obligatorio.";
    else if (email.length > 100) errores.email = "Máximo 100 caracteres.";
    else if (!validarCorreo(email)) errores.email = MENSAJE_CORREO;

    if (!password) errores.password = "La contraseña es obligatoria.";
    else if (password.length < 4 || password.length > 10) errores.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    return errores;
}

/* ---------------- Usuario (registro y mantenedor) ---------------- */
// opciones.esEdicion: la contraseña es opcional al editar
// opciones.existeRun / existeEmail: funciones para revisar duplicados (inyectadas, fáciles de simular en pruebas)

export function validarUsuario(datos, opciones = {}) {
    const { esEdicion = false, existeRun = () => false, existeEmail = () => false } = opciones;
    const errores = {};
    const run = (datos.run || "").trim().toUpperCase();
    const email = (datos.email || "").trim().toLowerCase();

    if (!run) errores.run = "El RUN es obligatorio.";
    else if (!validarRun(run)) errores.run = "RUN inválido. Sin puntos ni guion, ej: 19011022K.";
    else if (existeRun(run)) errores.run = "Ya existe un usuario registrado con este RUN.";

    if (!datos.nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
    else if (datos.nombre.trim().length > 50) errores.nombre = "Máximo 50 caracteres.";

    if (!datos.apellidos?.trim()) errores.apellidos = "Los apellidos son obligatorios.";
    else if (datos.apellidos.trim().length > 100) errores.apellidos = "Máximo 100 caracteres.";

    if (!email) errores.email = "El correo es obligatorio.";
    else if (email.length > 100) errores.email = "Máximo 100 caracteres.";
    else if (!validarCorreo(email)) errores.email = MENSAJE_CORREO;
    else if (existeEmail(email)) errores.email = "Ya existe una cuenta con este correo.";

    if (!esEdicion || datos.password) {
        if (!datos.password || datos.password.length < 4 || datos.password.length > 10) {
            errores.password = "La contraseña debe tener entre 4 y 10 caracteres.";
        }
        if (datos.confirmar !== datos.password) errores.confirmar = "Las contraseñas no coinciden.";
    }

    if (datos.telefono && !/^[0-9+ ]{8,15}$/.test(datos.telefono)) {
        errores.telefono = "Teléfono inválido (solo números, entre 8 y 15 dígitos).";
    }

    if (!datos.direccion?.trim()) errores.direccion = "La dirección es obligatoria.";
    else if (datos.direccion.trim().length > 300) errores.direccion = "Máximo 300 caracteres.";

    if (!datos.region) errores.region = "Selecciona una región.";
    if (!datos.comuna) errores.comuna = "Selecciona una comuna.";
    return errores;
}

/* ---------------- Producto (mantenedor) ---------------- */

export function validarProducto(datos, opciones = {}) {
    const { existeCodigo = () => false } = opciones;
    const errores = {};
    const codigo = (datos.codigo || "").trim();

    if (codigo.length < 3) errores.codigo = "El código es obligatorio (mínimo 3 caracteres).";
    else if (existeCodigo(codigo)) errores.codigo = "Ya existe un producto con este código.";

    if (!datos.nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
    else if (datos.nombre.trim().length > 100) errores.nombre = "Máximo 100 caracteres.";

    if ((datos.descripcion || "").length > 500) errores.descripcion = "Máximo 500 caracteres.";

    if (datos.precio === "" || datos.precio == null || isNaN(datos.precio) || Number(datos.precio) < 0) {
        errores.precio = "El precio es obligatorio y no puede ser negativo.";
    }

    if (datos.precioOferta !== "" && datos.precioOferta != null) {
        if (isNaN(datos.precioOferta) || Number(datos.precioOferta) < 0) errores.precioOferta = "Precio de oferta inválido.";
        else if (!errores.precio && Number(datos.precioOferta) >= Number(datos.precio)) {
            errores.precioOferta = "El precio de oferta debe ser menor al precio normal.";
        }
    }

    if (datos.stock === "" || datos.stock == null || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
        errores.stock = "El stock es obligatorio, entero y no puede ser negativo.";
    }

    if (datos.stockCritico !== "" && datos.stockCritico != null &&
        (!Number.isInteger(Number(datos.stockCritico)) || Number(datos.stockCritico) < 0)) {
        errores.stockCritico = "Debe ser un número entero mayor o igual a 0.";
    }

    if (!datos.categoria) errores.categoria = "Selecciona una categoría.";
    return errores;
}

/* ---------------- Categoría ---------------- */

export function validarCategoria(datos, opciones = {}) {
    const { existeNombre = () => false } = opciones;
    const errores = {};
    const nombre = (datos.nombre || "").trim();
    if (nombre.length < 3) errores.nombre = "El nombre es obligatorio (mínimo 3 caracteres).";
    else if (nombre.length > 50) errores.nombre = "Máximo 50 caracteres.";
    else if (existeNombre(nombre)) errores.nombre = "Ya existe una categoría con ese nombre.";
    if ((datos.descripcion || "").length > 200) errores.descripcion = "Máximo 200 caracteres.";
    return errores;
}

/* ---------------- Contacto ---------------- */

export function validarContacto({ nombre, email, comentario }) {
    const errores = {};
    if (!nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
    else if (nombre.trim().length > 100) errores.nombre = "Máximo 100 caracteres.";

    // El correo es opcional, pero si se escribe debe ser válido
    if (email) {
        if (email.length > 100) errores.email = "Máximo 100 caracteres.";
        else if (!validarCorreo(email)) errores.email = MENSAJE_CORREO;
    }

    if (!comentario?.trim()) errores.comentario = "El comentario es obligatorio.";
    else if (comentario.trim().length > 500) errores.comentario = "Máximo 500 caracteres.";
    return errores;
}

/* ---------------- Checkout (datos de envío) ---------------- */

export function validarCheckout(datos) {
    const errores = {};
    if (!datos.nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
    else if (datos.nombre.trim().length > 50) errores.nombre = "Máximo 50 caracteres.";

    if (!datos.apellidos?.trim()) errores.apellidos = "Los apellidos son obligatorios.";
    else if (datos.apellidos.trim().length > 100) errores.apellidos = "Máximo 100 caracteres.";

    if (!datos.email?.trim()) errores.email = "El correo es obligatorio.";
    else if (!validarCorreo(datos.email.trim())) errores.email = MENSAJE_CORREO;

    if (datos.entrega === "domicilio") {
        if (!datos.calle?.trim()) errores.calle = "La calle es obligatoria.";
        else if (datos.calle.trim().length > 300) errores.calle = "Máximo 300 caracteres.";
        if ((datos.departamento || "").length > 50) errores.departamento = "Máximo 50 caracteres.";
        if (!datos.region) errores.region = "Selecciona una región.";
        if (!datos.comuna) errores.comuna = "Selecciona una comuna.";
    }
    if ((datos.indicaciones || "").length > 300) errores.indicaciones = "Máximo 300 caracteres.";
    if (!datos.entrega) errores.entrega = "Selecciona una opción de entrega.";
    return errores;
}
