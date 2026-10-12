/* Prueba del hook que conecta React con el archivo de datos (actualización en tiempo real) */
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDatos } from "./useDatos.js";
import { productosDB, reiniciarDB } from "../data/db.js";

describe("useDatos", () => {
    it("lee los datos y se actualiza cuando la base de datos cambia", () => {
        reiniciarDB();
        const { result } = renderHook(() => useDatos(() => productosDB.listar()));
        expect(result.current).toHaveLength(12);

        act(() => { productosDB.eliminar(1); });

        expect(result.current).toHaveLength(11);
    });
});
