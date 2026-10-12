/* Pruebas de un HOOK personalizado con renderHook (igual que useContador en clases) */
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormulario } from "./useFormulario.js";
import { validarContacto } from "../utils/validaciones.js";

const VACIO = { nombre: "", email: "", comentario: "" };
const evento = (name, value) => ({ target: { name, value, type: "text" } });

describe("useFormulario", () => {
    it("parte con los valores iniciales y sin errores", () => {
        const { result } = renderHook(() => useFormulario(VACIO, validarContacto));
        expect(result.current.valores).toEqual(VACIO);
        expect(result.current.errores).toEqual({});
    });

    it("actualiza el valor del campo que cambia", () => {
        const { result } = renderHook(() => useFormulario(VACIO, validarContacto));
        act(() => result.current.manejarCambio(evento("nombre", "Ana")));
        expect(result.current.valores.nombre).toBe("Ana");
    });

    it("dos cambios seguidos no se pisan (región y comuna en el mismo clic)", () => {
        const { result } = renderHook(() => useFormulario({ region: "", comuna: "" }, () => ({})));
        act(() => {
            result.current.manejarCambio(evento("region", "Región del Maule"));
            result.current.manejarCambio(evento("comuna", "Talca"));
        });
        expect(result.current.valores).toEqual({ region: "Región del Maule", comuna: "Talca" });
    });

    it("solo muestra errores de campos tocados; validarTodo muestra todos", () => {
        const { result } = renderHook(() => useFormulario(VACIO, validarContacto));
        act(() => result.current.manejarBlur(evento("nombre", "")));
        expect(Object.keys(result.current.errores)).toEqual(["nombre"]);

        let valido;
        act(() => { valido = result.current.validarTodo(); });
        expect(valido).toBe(false);
        expect(Object.keys(result.current.errores)).toEqual(["nombre", "comentario"]);
    });

    it("reiniciar vuelve a los valores iniciales", () => {
        const { result } = renderHook(() => useFormulario(VACIO, validarContacto));
        act(() => {
            result.current.manejarCambio(evento("comentario", "Hola"));
            result.current.reiniciar();
        });
        expect(result.current.valores).toEqual(VACIO);
    });
});
