import { invoiceService } from '@/services/invoice';

describe('Invoice Service', () => {
  const service = invoiceService;

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });
});
