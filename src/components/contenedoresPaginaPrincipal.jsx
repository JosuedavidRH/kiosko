
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\components\contenedoresPaginaPrincipal.jsx" solo analizalo no modifiques nada  


import React from "react";
//import { FaClock } from "react-icons/fa";
import TemporizadorFactura1 from "../TemporizadorFactura1";
import TemporizadorFactura2 from "../TemporizadorFactura2";
import TemporizadorFactura3 from "../TemporizadorFactura3";

const ContenedoresPaginaPrincipal = ({
  clickCount,
  factura1Terminada,
  factura2Terminada,
  factura3Terminada,
  setFactura1Terminada,
  setFactura2Terminada,
  setFactura3Terminada,
  clicked,
  setClicked,
}) => {
  return (
    <>
      {/* ⏰ Header con icono reloj */}
      {clickCount >= 1 && (
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-15px)",
            marginLeft: "160px",
          }}
        >
          <div
            style={{
              backgroundColor: "transparent",
              width: "170px",
              height: "60px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            
            <span style={{ fontSize: "0.7rem", color: "white" }}>
              ESPERA TUS FACTURAS
            </span>
          </div>
        </header>
      )}

      {/* 🧾 Header con facturas pendientes */}
      {clickCount >= 1 && (
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-50px)",
            marginLeft: "-210px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              width: "170px",
              height: "200px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/compras.png"
              alt="Compras"
              style={{ width: "80px", height: "80px", marginBottom: "5px" }}
            />
            <span style={{ fontSize: "0.8rem", color: "white" }}>
              HAY{" "}
              <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {clickCount}
              </span>{" "}
              FACTURAS por valor de ;
            </span>
          </div>
        </header>
      )}

      {/* ✅ Factura 1 */}
      {clickCount >= 1 && (
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-210px)",
            marginLeft: "170px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              width: "200px",
              height: "120px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {factura1Terminada ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  lista tu factura 1 valor;
                </div>
                <button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                  }}
                >
                  pagar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setClicked(!clicked)}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  fontSize: "0.6rem",
                  backgroundColor: "#ff0",
                  color: "#000",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <TemporizadorFactura1
                  onFinish={() => setFactura1Terminada(true)}
                />
              </button>
            )}
          </div>
        </header>
      )}

      {/* ✅ Factura 2 */}
      {clickCount >= 2 && (
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-200px)",
            marginLeft: "170px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              width: "200px",
              height: "120px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {factura2Terminada ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  lista tu factura 2 valor;
                </div>
                <button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                  }}
                >
                  pagar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setClicked(!clicked)}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  fontSize: "0.6rem",
                  backgroundColor: "#ff0",
                  color: "#000",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <TemporizadorFactura2
                  onFinish={() => setFactura2Terminada(true)}
                />
              </button>
            )}
          </div>
        </header>
      )}

      {/* ✅ Factura 3 */}
      {clickCount >= 3 && (
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-190px)",
            marginLeft: "170px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              width: "200px",
              height: "120px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {factura3Terminada ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  lista tu factura 3 valor;
                </div>
                <button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                  }}
                >
                  pagar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setClicked(!clicked)}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  fontSize: "0.6rem",
                  backgroundColor: "#ff0",
                  color: "#000",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <TemporizadorFactura3
                  onFinish={() => setFactura3Terminada(true)}
                />
              </button>
            )}
          </div>
        </header>
      )}
    </>
  );
};

export default ContenedoresPaginaPrincipal;
