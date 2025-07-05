const redis = require('redis');
jest.mock('redis');

describe('Moderación de mensajes (mock de Redis)', () => {
  let mensajeBloqueado;

  beforeAll(async () => {
    // Mock de funciones
    const mockSubscriber = {
      connect: jest.fn().mockResolvedValue(),
      subscribe: jest.fn()
    };

    const mockPublisher = {
      connect: jest.fn().mockResolvedValue(),
      publish: jest.fn((canal, mensaje) => {
        if (canal === 'moderacion_resultado') {
          mensajeBloqueado = mensaje;
        }
      }),
    };

    // El orden es importante: el primer createClient es el subscriber, el segundo el publisher
    redis.createClient
      .mockReturnValueOnce(mockSubscriber)
      .mockReturnValueOnce(mockPublisher);

    // Requiere el servidor que usará los mocks ya definidos
    require('../server');

    // Simula un mensaje recibido desde Redis
    await mockSubscriber.connect();
    const mensajePrueba = JSON.stringify({ mensaje: 'Esto contiene droga' });

    // Llama manualmente al callback simulado
    const subscriberCallback = mockSubscriber.subscribe.mock.calls[0][1];
    subscriberCallback(mensajePrueba);
  });

  test('Debe bloquear un mensaje con palabra prohibida', () => {
    expect(mensajeBloqueado).toBe('Mensaje bloqueado por contenido ofensivo');
  });
});
