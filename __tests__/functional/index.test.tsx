import { invoiceService } from '@/services/invoice';
import { describe, test, vi, it, expect, beforeEach, afterEach } from 'vitest';
import { createdInvoice } from '../../__mocks__/createdInvoice';
import { sampleService } from '@/services/sample';

// vi.mock('@/services/invoice', async (importOriginal) => ({
//   ...(await importOriginal<typeof import('@/services/invoice')>()),
//   createInvoice: vi.fn(),
// }));

describe('Posts', () => {
  beforeEach(() => {});
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add post', () => {
    console.log(process.env);
  });
});
