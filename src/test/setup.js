/* ============================================
   Configuración global de las pruebas (Jasmine)
   - jasmine-dom agrega matchers para el DOM: toBeInTheDocument(), toHaveValue(),
     toBeDisabled(), toHaveTextContent()...
   - Cada prueba parte con el almacenamiento del navegador limpio y con una API falsa (apiFalsa.js)
   ============================================ */
import JasmineDOMModulo from "@testing-library/jasmine-dom";
import { instalarApiFalsa } from "./apiFalsa.js";

// El paquete se publica en formato CommonJS: según el empaquetador, los matchers vienen en .default
const JasmineDOM = JasmineDOMModulo.default || JasmineDOMModulo;

beforeEach(() => {
    jasmine.addMatchers(JasmineDOM);
    localStorage.clear();
    sessionStorage.clear();
    instalarApiFalsa(); // las pruebas no usan el backend real
});
