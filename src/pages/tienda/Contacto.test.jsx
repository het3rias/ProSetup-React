/* Pruebas de ESTADO y EVENTOS: formulario controlado (hook useFormulario) con userEvent */
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contacto from "./Contacto.jsx";
import { renderizar } from "../../test/utilidades.jsx";

describe("Contacto (estado del formulario)", () => {
    it("el estado del formulario cambia cuando el usuario escribe", async () => {
        renderizar(<Contacto />);
        const user = userEvent.setup();
        const comentario = screen.getByLabelText(/Comentario/);

        await user.type(comentario, "Hola ProSetup");

        expect(comentario).toHaveValue("Hola ProSetup");
        expect(screen.getByTestId("contador-comentario")).toHaveTextContent("13/500 caracteres");
    });

    it("muestra el error de un campo solo después de salir de él (blur)", async () => {
        renderizar(<Contacto />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/Correo/), "ana@yahoo.com");
        expect(screen.queryByText(/Solo se aceptan correos/)).not.toBeInTheDocument();

        await user.tab(); // sale del campo -> blur
        expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument();
    });

    it("al enviar con datos válidos muestra el mensaje de éxito y limpia el formulario", async () => {
        renderizar(<Contacto />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/Nombre completo/), "Ana");
        await user.type(screen.getByLabelText(/Comentario/), "Consulta por stock");
        await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

        expect(screen.getByText(/Gracias Ana/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre completo/)).toHaveValue("");
    });

    it("al enviar vacío muestra todos los errores obligatorios", async () => {
        renderizar(<Contacto />);
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

        expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
        expect(screen.getByText("El comentario es obligatorio.")).toBeInTheDocument();
    });
});
