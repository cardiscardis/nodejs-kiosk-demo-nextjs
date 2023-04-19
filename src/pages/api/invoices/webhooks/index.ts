import { NextApiRequest, NextApiResponse } from 'next';
import { bitpayClient } from '@/lib/bitpay';
import { prisma } from '@/lib/prisma';
import { sseService } from '@/services/sse';
import { Invoice } from 'bitpay-sdk/dist/Model';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { data, event } = req.body as {
    data: Partial<Invoice>;
    event: { code: number; name: string };
  };

  try {
    const verifedInvoice = await bitpayClient.getInvoice(data.id as string);
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

    const eventMessages: { [key: string]: { [key: string]: string | null } } = {
      invoice_paidInFull: {
        type: 'Good',
        content: `Invoice ${invoice.bitpay_id} has been paid in full.`,
      },
      invoice_expired: {
        type: 'Bad',
        content: `Invoice ${invoice.bitpay_id} has expired.`,
      },
      invoice_confirmed: {
        type: 'Good',
        content: `Invoice ${invoice.bitpay_id} has been confirmed.`,
      },
      invoice_completed: {
        type: 'Good',
        content: `Invoice ${invoice.bitpay_id} is complete.`,
      },
      invoice_manuallyNotified: {
        type: null,
        content: null,
      },
      invoice_failedToConfirm: {
        type: 'Bad',
        content: `Invoice ${invoice.bitpay_id} has failed to confirm.`,
      },
      invoice_refundComplete: {
        type: null,
        content: null,
      },
      invoice_declined: {
        type: 'Bad',
        content: `Invoice ${invoice.bitpay_id} has been declined.`,
      },
    };

    const eventData = {
      eventName: event.name,
      eventCode: event.code,
      invoice,
      message: eventMessages[event.name],
    };

    sseService.sendEvents(eventData);

    return res.status(200).end();
  } catch (e) {
    return res.status(500).json(e);
  }
}
