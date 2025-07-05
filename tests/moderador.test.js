const redis = require('redis');
jest.mock('redis');

describe('Moderación de mensajes (mock de Redis)', () => {
  let mensajeBloqueado;

  beforeAll(() => {
    const mockSubscriber = {
      connect: jest.fn(),
      subscribe: jest.fn((canal, callback) => {
        if (canal === 'mensaje_chat') {
          callback('Esto contiene droga');
        }
      })
    };

    const mockPublisher = {
      connect: jest.fn(),
      publish: jest.fn((canal, mensaje) => {
        if (canal === 'moderacion_resultado') {
          mensajeBloqueado = mensaje;
        }
      })
    };

    redis.createClient
      .mockReturnValueOnce(mockSubscriber)  // para subscriber
      .mockReturnValueOnce(mockPublisher); // para publisher

    require('../server'); // importa tu lógica real que conecta redis y modera
  });

  test('Debe bloquear un mensaje con palabra prohibida', (done) => {
    // Esperar un momento para que se dispare el callback
    setTimeout(() => {
      expect(mensajeBloqueado).toBe('Mensaje bloqueado por contenido ofensivo');
      done(); // finaliza el test correctamente
    }, 50); // tiempo suficiente para ejecutar el callback
  });
});
