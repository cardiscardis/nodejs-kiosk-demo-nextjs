import handler from '@/pages/api/invoices';
import { createMocks } from 'node-mocks-http';

describe('/api/invoices', () => {
  it('Should return invoices', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        page: 1,
        limit: 10,
      },
    });

    await handler(req, res);
  });
});
