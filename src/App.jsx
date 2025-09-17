
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\App.jsx"  solo analizalo no modifiques nada  

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';

import Login from './Login.jsx';
import Register from './Register.jsx';
import SegundaPagina from './SegundaPagina.jsx';
import { FaClock } from 'react-icons/fa';

import { guardarStatusActual } from "./utils/guardarStatusActual";
import { cerrarSesionGlobal } from "./utils/cerrarSesion";
import { restaurarDatos } from "./utils/restaurarDatos";

import ContenedoresPaginaPrincipal from "./components/contenedoresPaginaPrincipal";
import BotonPrincipal from "./components/BotonPrincipal";

import { useTemporizador } from "./context/TemporizadorContext.jsx";
import { TemporizadorProvider } from "./context/TemporizadorContext.jsx"; 
import { TemporizadorFactura1Provider } from "./context/TemporizadorFactura1Context";
import { TemporizadorFactura2Provider } from "./context/TemporizadorFactura2Context"; 
import { TemporizadorFactura3Provider } from "./context/TemporizadorFactura3Context";
import { useTemporizadorFactura1 } from './context/TemporizadorFactura1Context';
import { useTemporizadorFactura2 } from './context/TemporizadorFactura2Context';
import { useTemporizadorFactura3 } from './context/TemporizadorFactura3Context';


function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [apartmentNumber, setApartmentNumber] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const location = useLocation();
  const { timeLeft } = useTemporizador();

  // Estados persistentes
  const [clickCount, setClickCount] = useState(() => Number(localStorage.getItem('clickCount')) || 0);
  const [timerStarted, setTimerStarted] = useState(() => localStorage.getItem('timerStarted') === 'true');
  const [clicked, setClicked] = useState(() => localStorage.getItem('clicked') === 'true');
  const [factura1Terminada, setFactura1Terminada] = useState(() => localStorage.getItem('factura1Terminada') === 'true');
  const [factura2Terminada, setFactura2Terminada] = useState(() => localStorage.getItem('factura2Terminada') === 'true');
  const [factura3Terminada, setFactura3Terminada] = useState(() => localStorage.getItem('factura3Terminada') === 'true');

  // Sync con localStorage
  useEffect(() => { localStorage.setItem('clickCount', clickCount); }, [clickCount]);
  useEffect(() => { localStorage.setItem('timerStarted', timerStarted); }, [timerStarted]);
  useEffect(() => { localStorage.setItem('clicked', clicked); }, [clicked]);
  useEffect(() => { localStorage.setItem('factura1Terminada', factura1Terminada); }, [factura1Terminada]);
  useEffect(() => { localStorage.setItem('factura2Terminada', factura2Terminada); }, [factura2Terminada]);
  useEffect(() => { localStorage.setItem('factura3Terminada', factura3Terminada); }, [factura3Terminada]);

  return (
    <TemporizadorProvider
      apartmentNumber={apartmentNumber}
      initialTime={60}
      timeLeft={Number(localStorage.getItem("timeLeftPrincipal") || 60)}
      timerStarted={timerStarted}
      statusActual={clickCount}
    >
      <TemporizadorFactura1Provider initialTime={60}> 
      <TemporizadorFactura2Provider initialTime={60}>
      <TemporizadorFactura3Provider initialTime={60}>

        <Routes>
          {user ? (
            <>
              <Route path="/" element={
                <AppContent 
                  user={user}
                  setUser={setUser}                    
                  apartmentNumber={apartmentNumber}
                  setApartmentNumber={setApartmentNumber} 
                  clicked={clicked}
                  setClicked={setClicked}
                  clickCount={clickCount}
                  setClickCount={setClickCount}
                  factura1Terminada={factura1Terminada}
                  setFactura1Terminada={setFactura1Terminada}
                  factura2Terminada={factura2Terminada}
                  setFactura2Terminada={setFactura2Terminada}
                  factura3Terminada={factura3Terminada}
                  setFactura3Terminada={setFactura3Terminada}
                  isProcessing={isProcessing}          
                  setIsProcessing={setIsProcessing}  
                />
              }/>
              <Route path="/segunda" element={<SegundaPagina user={user} />} />
            </>
          ) : isRegistering ? (
            <Route path="/" element={
              <Register 
                onRegister={({ username, apartmentNumber }) => {
                  setUser(username);
                  setApartmentNumber(apartmentNumber);
                  localStorage.setItem('apartmentNumber', apartmentNumber);
                  fetchDatosIniciales(apartmentNumber);
                }}
                goToLogin={() => setIsRegistering(false)} 
              />
            }/>
          ) : (
            <Route path="/" element={
              <Login
                onLogin={({ username, apartmentNumber }) => {
                  setUser(username);
                  setApartmentNumber(apartmentNumber);
                  localStorage.setItem('apartmentNumber', apartmentNumber);
                }}
                goToRegister={() => setIsRegistering(true)} 
              />
            }/>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </TemporizadorFactura3Provider>
      </TemporizadorFactura2Provider>
      </TemporizadorFactura1Provider> 
    </TemporizadorProvider>
  );
}

function AppContent({...props}) {
  const {
    user, apartmentNumber, clicked, setClicked, clickCount, setClickCount,
    factura1Terminada, setFactura1Terminada, factura2Terminada, setFactura2Terminada,
    factura3Terminada, setFactura3Terminada, isProcessing, setIsProcessing,
    setUser, setApartmentNumber
  } = props;

  const navigate = useNavigate();
  const { timeLeftFactura1, setTimeLeftFactura1 } = useTemporizadorFactura1();
  const { timeLeftFactura2, setTimeLeftFactura2, startFactura2 } = useTemporizadorFactura2();
  const { timeLeftFactura3, setTimeLeftFactura3, startFactura3 } = useTemporizadorFactura3();
  const { timeLeft, setTimeLeft, fondoRojo, setFondoRojo, startCountdown, isRunning, formatTimeLeft } = useTemporizador();

  // Restaurar datos backend
  useEffect(() => {
    if (apartmentNumber) {
      restaurarDatos({
        apartmentNumber, startCountdown, setClickCount, setFondoRojo,
        setTimeLeft, setTimeLeftFactura1, setTimeLeftFactura2, setTimeLeftFactura3,
        startFactura2, startFactura3
      });
    }
  }, [apartmentNumber]);

  useEffect(() => { localStorage.setItem("timeLeftFactura2", timeLeftFactura2); }, [timeLeftFactura2]);
  useEffect(() => { localStorage.setItem("timeLeftFactura3", timeLeftFactura3); }, [timeLeftFactura3]);

  // 🔄 beforeunload → solo notificar backend, no setState
  useEffect(() => {
    if (!apartmentNumber) return;

    const handleBeforeUnload = async (event) => {
      await cerrarSesionGlobal({
        auto: true,
        temporizadorPrincipal: timeLeft,
        temporizadorFactura1: timeLeftFactura1, 
        temporizadorFactura2: timeLeftFactura2, 
        temporizadorFactura3: timeLeftFactura3, 
        userId: apartmentNumber,
      });
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [apartmentNumber, timeLeft, timeLeftFactura1, timeLeftFactura2, timeLeftFactura3, clickCount]);

  // Cerrar sesión manual
  const handleCerrarSesion = async () => {
    await cerrarSesionGlobal({
      auto: false,
      temporizadorPrincipal: timeLeft,
      temporizadorFactura1: timeLeftFactura1,
      temporizadorFactura2: timeLeftFactura2, 
      temporizadorFactura3: timeLeftFactura3,
      statusActual: clickCount,
      userId: apartmentNumber,
    });
    setUser(null);
    setApartmentNumber(null);
    window.location.reload();
  };

  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100vh",
                 backgroundColor:fondoRojo ? "red" : "#282c34",color:"white",fontFamily:"Arial",padding:"20px",textAlign:"center"}}>
      <h1 style={{ fontSize: "20px" }}>Hola, {user}! Apto: {apartmentNumber}</h1>
      {clickCount > 0 && (
        <div style={{ fontSize: "21px", fontWeight: "bold" }}>
          PLAZO DE PAGO {formatTimeLeft(timeLeft)}
          <FaClock style={{fontSize:"2rem",color:"white",animation:"pulse 1s infinite",marginBottom:"5px"}}/>
        </div>
      )}
      <ContenedoresPaginaPrincipal
        clickCount={clickCount}
        factura1Terminada={factura1Terminada}
        factura2Terminada={factura2Terminada}
        factura3Terminada={factura3Terminada}
        setFactura1Terminada={setFactura1Terminada}
        setFactura2Terminada={setFactura2Terminada}
        setFactura3Terminada={setFactura3Terminada}
        clicked={clicked}
        setClicked={setClicked}
      />
      <footer style={{display:'flex',justifyContent:'center',transform:'translateY(-240px)'}}>
        <div style={{backgroundColor:'transparent',width:'250px',height:'70px',marginTop:'90px',marginLeft:'100px',
                     borderRadius:'100px',display:'flex',justifyContent:'center',alignItems:'center'}}>
          {(clickCount > 0 || isRunning) && timeLeft > 0 && (
            <BotonPrincipal 
              clickCount={clickCount}
              setClickCount={setClickCount}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              apartmentNumber={apartmentNumber}
              startCountdown={startCountdown}
            />
          )}
          <div style={{backgroundColor:'transparent',width:'110px',height:'60px',borderRadius:'12px',
                       display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <button onClick={handleCerrarSesion}
              style={{alignSelf:'center',marginTop:'190px',marginLeft:'-250px',padding:'6px 6px',fontSize:'0.9rem',
                      borderRadius:'5px',backgroundColor:'#f44336',color:'white',border:'none',cursor:'pointer'}}>
              Cerrar 🔒
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
