import { NextApiRequest, NextApiResponse } from 'next';
import { invoiceService } from '@/services/invoice';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const data = await invoiceService.createInvoice(req.body);
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json(e);
  }
}
