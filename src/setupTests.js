/* ============================================
   Configuración global de las pruebas (Vitest)
   - jest-dom agrega matchers como toBeInTheDocument(), toHaveValue(), toBeDisabled()
   - Cada prueba parte con el almacenamiento del navegador limpio
   ============================================ */
import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
});
