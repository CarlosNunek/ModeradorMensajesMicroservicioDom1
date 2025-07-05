const palabrasProhibidas = ['droga', 'fuga', 'arma'];
const frasesSospechosas = ['plan mañana', 'visita extra'];

function analizarMensaje(texto) {
  for (let palabra of palabrasProhibidas) {
    if (texto.toLowerCase().includes(palabra)) {
      return 'bloqueado';
    }
  }
  for (let frase of frasesSospechosas) {
    if (texto.toLowerCase().includes(frase)) {
      return 'revision';
    }
  }
  return 'permitido';
}

module.exports = { analizarMensaje };
