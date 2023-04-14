import { NextApiRequest, NextApiResponse } from 'next';
import { invoiceService } from '@/services/invoice';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const { invoices, count, next, prev } = await invoiceService.getInvoices(
      page,
      limit
    );

    return res.status(200).json({
      data: invoices,
      total: count,
      next,
      prev,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
}
