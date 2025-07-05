const redis = require('redis');
jest.mock('redis');

describe('Moderación de mensajes (mock de Redis)', () => {
  let mensajeModerado;

  beforeAll(async () => {
    // Mock del console.log
    console.log = jest.fn((msg) => {
      mensajeModerado = msg;
    });

    let callbackSubs;

    const mockSubscriber = {
      connect: jest.fn().mockResolvedValue(),
      subscribe: jest.fn((canal, callback) => {
        callbackSubs = callback;
      }),
    };

    redis.createClient.mockReturnValueOnce(mockSubscriber);

    require('../server');

    const mensajeSimulado = JSON.stringify({
      tipo: 'mensaje_enviado',
      contenido: 'esto tiene droga',
    });

    await mockSubscriber.connect();
    callbackSubs(mensajeSimulado);
  });

  test('Debe bloquear un mensaje con palabra prohibida', () => {
    expect(mensajeModerado).toContain('bloqueado');
    expect(mensajeModerado).toContain('droga');
  });
});
