import handler from '@/pages/api/invoices/[id]';
import { createMocks } from 'node-mocks-http';

describe('/api/invoices/[id]', () => {
  it('Should return invoice', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: 1,
      },
    });

    await handler(req, res);
  });
});
