import handler from '@/pages/api/create-invoice';
import { invoiceService } from '@/services/invoice';
import logger from '@/utils/logger';
import { createMocks } from 'node-mocks-http';
import { Logger } from 'winston';

const loggerErrorSpy = jest
  .spyOn(logger, 'error')
  .mockReturnValue({} as unknown as Logger);

describe('/api/create-invoice', () => {
  it('Sould return successful response', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        price: 100,
        currency: 'USD',
      },
    });

    const createInvoiceSpy = jest.spyOn(invoiceService, 'createInvoice');

    await handler(req, res);
    expect(createInvoiceSpy).toHaveBeenCalled();
  });
});
