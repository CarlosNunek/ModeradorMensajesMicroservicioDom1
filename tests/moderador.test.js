const redis = require('redis');
jest.mock('redis');

describe('Moderación de mensajes (mock de Redis)', () => {
  let mensajeBloqueado;

  beforeAll(async () => {
    const mockSubscriber = {
      connect: jest.fn().mockResolvedValue(), // ✅ ahora devuelve una promesa
      subscribe: jest.fn((canal, callback) => {
        if (canal === 'chat-eventos') {
          const mensaje = JSON.stringify({ mensaje: 'Esto contiene droga' });
          callback(mensaje);
        }
      }),
    };

    const mockPublisher = {
      connect: jest.fn().mockResolvedValue(), // ✅ ahora devuelve una promesa
      publish: jest.fn((canal, mensaje) => {
        if (canal === 'moderacion_resultado') {
          mensajeBloqueado = mensaje;
        }
      }),
    };

    redis.createClient
      .mockReturnValueOnce(mockSubscriber) // subscriber
      .mockReturnValueOnce(mockPublisher); // publisher

    require('../server'); // carga la lógica real
  });

  test('Debe bloquear un mensaje con palabra prohibida', (done) => {
    setTimeout(() => {
      expect(mensajeBloqueado).toBe('Mensaje bloqueado por contenido ofensivo');
      done();
    }, 50);
  });
});
