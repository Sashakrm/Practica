import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Без StrictMode: его двойной mount в dev-режиме создавал бы
// фантомные «отменённые» задачи в очереди при каждом рендере.
createRoot(document.getElementById("root")).render(<App />);