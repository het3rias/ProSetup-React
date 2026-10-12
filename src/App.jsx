import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import TiendaLayout from "./components/layout/TiendaLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import RutaProtegida from "./routes/RutaProtegida.jsx";

import Home from "./pages/tienda/Home.jsx";
import Productos from "./pages/tienda/Productos.jsx";
import DetalleProducto from "./pages/tienda/DetalleProducto.jsx";
import Categorias from "./pages/tienda/Categorias.jsx";
import CategoriaDetalle from "./pages/tienda/CategoriaDetalle.jsx";
import Ofertas from "./pages/tienda/Ofertas.jsx";
import Carrito from "./pages/tienda/Carrito.jsx";
import Checkout from "./pages/tienda/Checkout.jsx";
import ResultadoCompra from "./pages/tienda/ResultadoCompra.jsx";
import Login from "./pages/tienda/Login.jsx";
import Registro from "./pages/tienda/Registro.jsx";
import Nosotros from "./pages/tienda/Nosotros.jsx";
import Blogs from "./pages/tienda/Blogs.jsx";
import DetalleBlog from "./pages/tienda/DetalleBlog.jsx";
import Contacto from "./pages/tienda/Contacto.jsx";
import NoEncontrado from "./pages/tienda/NoEncontrado.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminOrdenes from "./pages/admin/AdminOrdenes.jsx";
import AdminBoleta from "./pages/admin/AdminBoleta.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminProductoForm from "./pages/admin/AdminProductoForm.jsx";
import AdminProductoDetalle from "./pages/admin/AdminProductoDetalle.jsx";
import AdminProductosCriticos from "./pages/admin/AdminProductosCriticos.jsx";
import AdminReportes from "./pages/admin/AdminReportes.jsx";
import AdminCategorias from "./pages/admin/AdminCategorias.jsx";
import AdminCategoriaForm from "./pages/admin/AdminCategoriaForm.jsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.jsx";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm.jsx";
import AdminUsuarioDetalle from "./pages/admin/AdminUsuarioDetalle.jsx";
import AdminPerfil from "./pages/admin/AdminPerfil.jsx";

const STAFF = ["Administrador", "Vendedor"];
const SOLO_ADMIN = ["Administrador"];
const soloAdmin = (elemento) => <RutaProtegida roles={SOLO_ADMIN}>{elemento}</RutaProtegida>;

/** Rutas de la aplicación (ver diagrama de flujo de navegación del Anexo 1). */
export function Rutas() {
    return (
        <Routes>
            {/* ----- Tienda (pública) ----- */}
            <Route element={<TiendaLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/categorias/:id" element={<CategoriaDetalle />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/compra-exitosa/:id" element={<ResultadoCompra exito />} />
                <Route path="/compra-fallida/:id" element={<ResultadoCompra exito={false} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<DetalleBlog />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="*" element={<NoEncontrado />} />
            </Route>

            {/* ----- Panel de administración (Administrador y Vendedor) ----- */}
            <Route path="/admin" element={<RutaProtegida roles={STAFF}><AdminLayout /></RutaProtegida>}>
                <Route index element={<AdminDashboard />} />
                <Route path="ordenes" element={<AdminOrdenes />} />
                <Route path="ordenes/:id" element={<AdminBoleta />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="productos/criticos" element={<AdminProductosCriticos />} />
                <Route path="productos/nuevo" element={soloAdmin(<AdminProductoForm />)} />
                <Route path="productos/:id" element={<AdminProductoDetalle />} />
                <Route path="productos/:id/editar" element={soloAdmin(<AdminProductoForm />)} />
                <Route path="categorias" element={soloAdmin(<AdminCategorias />)} />
                <Route path="categorias/nueva" element={soloAdmin(<AdminCategoriaForm />)} />
                <Route path="categorias/:id/editar" element={soloAdmin(<AdminCategoriaForm />)} />
                <Route path="usuarios" element={soloAdmin(<AdminUsuarios />)} />
                <Route path="usuarios/nuevo" element={soloAdmin(<AdminUsuarioForm />)} />
                <Route path="usuarios/:run" element={soloAdmin(<AdminUsuarioDetalle />)} />
                <Route path="usuarios/:run/editar" element={soloAdmin(<AdminUsuarioForm />)} />
                <Route path="reportes" element={soloAdmin(<AdminReportes />)} />
                <Route path="perfil" element={<AdminPerfil />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <CarritoProvider>
                <Rutas />
            </CarritoProvider>
        </AuthProvider>
    );
}
