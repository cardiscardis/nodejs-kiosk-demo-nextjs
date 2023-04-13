import { NextApiRequest, NextApiResponse } from 'next';
import { bitpayClient } from '@/lib/bitpay';
import { prisma } from '@/lib/prisma';
import { sseService } from '@/services/sse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { data } = req.body;

  try {
    const verifedInvoice = await bitpayClient.getInvoice(data.id);
    const foundedInvoice = await prisma.invoice.findFirstOrThrow({
      where: {
        bitpay_id: verifedInvoice.id,
      },
    });

    const invoice = await prisma.invoice.update({
      where: {
        id: foundedInvoice.id,
      },
      data: {
        status: verifedInvoice.status,
      },
    });

    sseService.sendEvents(invoice);

    return res.status(200).end();
  } catch (e) {
    return res.status(500).json(e);
  }
}
