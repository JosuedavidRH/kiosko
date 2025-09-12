
//CODIGO en produccion 

// src/main.jsx


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// 👇 importa el Provider
import { TemporizadorProvider } from "./context/TemporizadorContext.jsx";
import { TemporizadorFactura1Provider } from "./context/TemporizadorFactura1Context.jsx";
import { TemporizadorFactura2Provider } from "./context/TemporizadorFactura2Context.jsx";
import { TemporizadorFactura3Provider } from "./context/TemporizadorFactura3Context.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 👇 ahora App y todo lo demás están dentro del Provider */}
      <TemporizadorProvider>
       <TemporizadorFactura1Provider>
        <TemporizadorFactura2Provider>
         <TemporizadorFactura3Provider>
          <App />
        </TemporizadorFactura3Provider>
      </TemporizadorFactura2Provider>
    </TemporizadorFactura1Provider>
  </TemporizadorProvider>
 </BrowserRouter>
</React.StrictMode>
);