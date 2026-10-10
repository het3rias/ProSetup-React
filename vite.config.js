import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite (servidor de desarrollo y build) y de Vitest (pruebas unitarias)
export default defineConfig({
    plugins: [react()],
    server: { port: 5173, open: true },
    test: {
        environment: "jsdom",          // simula el navegador (DOM) para renderizar componentes
        globals: true,                 // describe / it / expect disponibles sin importar
        setupFiles: "./src/setupTests.js",
        restoreMocks: true,            // cada prueba parte con los mocks (vi.spyOn) restaurados
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "json-summary"],
            include: ["src/**/*.{js,jsx}"],
            exclude: ["src/main.jsx", "src/**/*.test.{js,jsx}", "src/setupTests.js", "src/test/**"]
        }
    }
});
