
//CODIGO en produccion 

// src/main.jsx


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// 👇 importa el Provider
import { TemporizadorProvider } from "./context/TemporizadorContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 👇 ahora App y todo lo demás están dentro del Provider */}
      <TemporizadorProvider>
        <App />
      </TemporizadorProvider>
    </BrowserRouter>
  </React.StrictMode>
);
