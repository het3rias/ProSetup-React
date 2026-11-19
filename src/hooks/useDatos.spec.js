/* Prueba del hook que conecta React con el archivo de datos (actualización en tiempo real) */
import { renderHook, act } from "@testing-library/react";
import { useDatos } from "./useDatos.js";
import { productosDB, reiniciarDB } from "../data/db.js";

describe("useDatos", () => {
    it("lee los datos y se actualiza cuando la base de datos cambia", async () => {
        reiniciarDB();
        const { result } = renderHook(() => useDatos(() => productosDB.listar()));
        expect(result.current.length).toBe(12);

        await act(async () => { await productosDB.eliminar(1); });

        expect(result.current.length).toBe(11);
    });
});
