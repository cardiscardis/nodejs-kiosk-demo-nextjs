import { sseService } from '@/services/sse';

describe('SSE Service', () => {
  const service = sseService;

  it('Should be defined', () => {
    expect(service).toBeDefined();
    expect(service.clients).toEqual([]);
  });

  it('Should add new client', () => {
    const newClient: { id: string; res: any } = { id: '1', res: {} };
    service.addClient(newClient) as any;
    expect(service.clients[0]).toEqual({ id: '1', res: {} });
  });

  it('Should remove client', () => {
    service.removeClient('1');
    expect(service.clients).toEqual([]);
  });

  it('Should send event', () => {
    const newClient: { id: string; res: any } = {
      id: '1',
      res: { write: () => null, flushHeaders: () => null },
    };
    service.addClient(newClient) as any;
    const writeSpy = jest.spyOn(service.clients[0].res, 'write');
    const flushHeadersSpy = jest.spyOn(service.clients[0].res, 'flushHeaders');
    writeSpy.mockImplementation();
    flushHeadersSpy.mockImplementation();

    service.sendEvents('');
    expect(writeSpy).toBeCalled();
    expect(flushHeadersSpy).toBeCalled();
  });
});
