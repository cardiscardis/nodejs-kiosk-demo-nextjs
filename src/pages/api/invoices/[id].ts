import { NextApiRequest, NextApiResponse } from 'next';
import { findInvoiceById } from '@/services/invoice';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = parseInt(req.query.id as string);

  try {
    const invoice = await findInvoiceById(id);
    return res.json({
      data: invoice,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
}
