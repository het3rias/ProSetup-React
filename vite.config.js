import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite: servidor de desarrollo y build de producción.
// Las pruebas unitarias se ejecutan con Karma + Jasmine (ver karma.conf.cjs).
export default defineConfig({
    plugins: [react()],
    server: { port: 5173, open: true }
});
