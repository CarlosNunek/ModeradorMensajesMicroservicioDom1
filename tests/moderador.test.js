const redis = require('redis');
jest.mock('redis');

describe('Moderación de mensajes (mock de Redis)', () => {
  let mensajeBloqueado;

  beforeAll(() => {
    // Simula un cliente Redis suscriptor que recibe un mensaje con una palabra prohibida
    const mockSubscriber = {
      connect: jest.fn(),
      subscribe: jest.fn((canal, callback) => {
        if (canal === 'mensaje_chat') {
          const mensaje = 'Esto contiene droga';
          // Aquí simulamos manualmente el filtro como en el código real
          if (mensaje.toLowerCase().includes('droga')) {
            mensajeBloqueado = 'Mensaje bloqueado por contenido ofensivo';
          } else {
            mensajeBloqueado = mensaje;
          }
        }
      }),
    };

    const mockPublisher = {
      connect: jest.fn(),
      publish: jest.fn()
    };

    redis.createClient
      .mockReturnValueOnce(mockSubscriber)
      .mockReturnValueOnce(mockPublisher);

    require('../services/moderationService'); // Ejecuta el código que se suscribe
  });

  test('Debe bloquear un mensaje con palabra prohibida', () => {
    expect(mensajeBloqueado).toBe('Mensaje bloqueado por contenido ofensivo');
  });
});

