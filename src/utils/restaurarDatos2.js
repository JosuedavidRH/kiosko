
//CODIGO en produccion    


//este es mi archivo "C:\Users\user\projects2\myapp2\kiosko_local\src\utils\restaurarDatos2.js" solo analizalo no modifiques nada  



export async function restaurarDatos2(numeroApto) {
  try {
    const response = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${numeroApto}`);
    const data = await response.json();
    if (data.success) {
      return data.data.map(reg => reg.codigo_qr); // array de códigos
    }
    return [];
  } catch (err) {
    console.error("Error restaurando datos:", err);
    return [];
  }
}
