const { analizarMensaje } = require('../utils/filter');

function procesarMensaje(mensaje) {
  const resultado = analizarMensaje(mensaje.contenido);
  return {
    tipo: 'resultado_moderacion',
    estado: resultado,
    original: mensaje
  };
}

module.exports = { procesarMensaje };
