import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import App from "./App.jsx";
import { inicializarDB } from "./data/db.js";
import ScrollAlInicio from "./routes/ScrollAlInicio.jsx";

// Carga los datos iniciales en localStorage la primera vez
inicializarDB();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollAlInicio />
            <App />
        </BrowserRouter>
    </StrictMode>
);
