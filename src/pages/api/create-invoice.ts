import { NextApiRequest, NextApiResponse } from 'next';
import { invoiceService } from '@/services/invoice';
import logger from '@/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const data = await invoiceService.createInvoice(req.body);
    logger.info({
      code: 'INVOICE_CREATE_SUCCESS',
      message: 'Successfully created invoice',
      context: {
        id: data.bitpay_id,
      },
    });
    return res.status(200).json(data);
  } catch (e: any) {
    logger.error({
      code: 'INVOICE_CREATE_FAIL',
      message: 'Faoled to create invoice',
      context: {
        errorMessage: e.message,
        stackTrace: e,
      },
    });
    return res.status(500).json(e);
  }
}
