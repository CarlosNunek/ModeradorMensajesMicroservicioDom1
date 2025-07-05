require('dotenv').config();
const redis = require('redis');
const { procesarMensaje } = require('./services/moderationService');

const subscriber = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

subscriber.connect().then(() => {
  console.log('🛡️ Moderador conectado a Redis');
  subscriber.subscribe('chat-eventos', (message) => {
    const evento = JSON.parse(message);
    if (evento.tipo === 'mensaje_enviado') {
      const resultado = procesarMensaje(evento);
      console.log(`[✓] Moderación: ${resultado.estado} - ${evento.contenido}`);
    }
  });
}).catch(console.error);
