import handler from '@/pages/api/invoices/webhooks';
import logger from '@/utils/logger';
import { createMocks } from 'node-mocks-http';
import { Logger } from 'winston';

const loggerInfoSpy = jest
  .spyOn(logger, 'info')
  .mockReturnValue({} as unknown as Logger);

const loggerErrorSpy = jest
  .spyOn(logger, 'error')
  .mockReturnValue({} as unknown as Logger);

describe('/api/invoices/webhooks', () => {
  it('Should retrieve webhook', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);
  });
});
