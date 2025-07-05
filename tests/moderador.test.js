const redis = require('redis');
jest.mock('redis');

describe('Moderación de mensajes (mock de Redis)', () => {
  let mensajeProcesado;

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
        mensajeProcesado = mensaje;
      })
    };

    redis.createClient
      .mockReturnValueOnce(mockSubscriber)
      .mockReturnValueOnce(mockPublisher);

    require('../services/moderationService'); // o '../src/moderador.js' según tu estructura real
  });

  test('Debe bloquear un mensaje con palabra prohibida', () => {
    expect(mensajeProcesado).toBe('Mensaje bloqueado por contenido ofensivo');
  });
});
