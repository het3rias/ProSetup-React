# ProSetup – Frontend (React + Vite)

Tienda de componentes de PC. Consume la API REST del repositorio `ProSetup-Backend` (Spring Boot, MySQL, JWT).
Proyecto DSY1104 – Desarrollo Fullstack II (Evaluación Parcial 3).

## Cómo ejecutarlo

1. Levantar el backend (`mvn spring-boot:run`, con MySQL de XAMPP encendido). Queda en `http://localhost:8080`.
2. Copiar `.env.example` a `.env` (si el backend está en otra URL, cambiar `VITE_API_URL`).
3. En esta carpeta:
   ```bash
   npm install
   npm run dev
   ```
4. Abrir `http://localhost:5173`.

Cuentas de prueba (las crea el backend): `admin@duoc.cl`, `vendedor@duoc.cl` y `cliente@gmail.com`, todas con contraseña `1234`.

## Integración con el backend

- `src/services/api.js`: cliente de la API. Agrega el token JWT a cada petición, renueva la sesión con el refreshToken si el token vence y convierte los errores del servidor en mensajes legibles.
- `src/data/db.js`: almacén de datos. Las lecturas salen de una caché en memoria y las escrituras (crear, editar, eliminar, comprar) se hacen contra el backend.
- `src/context/AuthContext.jsx`: login, registro y **persistencia de sesión**: los tokens quedan en `sessionStorage`, y al recargar (F5) se pide `GET /api/auth/me` para recuperar al usuario.
- Restricciones por rol: `RutaProtegida` bloquea las rutas del panel; el backend vuelve a validar los permisos (401/403).
  - Administrador: todo. Vendedor: ve productos, órdenes y su perfil (no crea ni edita). Cliente: tienda y sus compras.
- El carrito se guarda en `localStorage` del navegador. Las compras sin sesión (invitado) también funcionan.

## Pruebas

```bash
npm test
```

Jasmine + Karma (Chrome headless). Las pruebas usan una API falsa en memoria (`src/test/apiFalsa.js`), por lo que no necesitan el backend encendido.
