import { NextApiRequest, NextApiResponse } from 'next';
import { bitpayClient } from '@/lib/bitpay';
import prisma from '@/lib/prisma';
import { sseService } from '@/services/sse';
import { Invoice } from 'bitpay-sdk/dist/Model';
import { Prisma } from '@prisma/client';
import logger from '@/utils/logger';
import { webhookVerifier } from '@/services/webhooks';
import config from '@/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { data, event } = req.body as {
    data: Partial<Invoice>;
    event: { code: number; name: string };
  };
  const signature = req.headers['x-signature'] as string;

  logger.info({
    code: 'IPN_RECEIVED',
    message: 'Received IPN',
    context: {
      ...req.body,
    },
  });

  try {
    const isVerified = webhookVerifier.verify(
      config.bitpay.token,
      JSON.stringify(req.body),
      signature
    );

    if (!isVerified) {
      throw new Error('Signature invalid');
    }

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

    logger.info({
      code: 'IPN_VALIDATE_SUCCESS',
      message: 'Successfully validated IPN',
      context: {
        id: verifedInvoice.id,
      },
    });

    logger.info({
      code: 'INVOICE_UPDATE_SUCCESS',
      message: 'Successfully update invoice',
      context: {
        id: invoice.bitpay_id,
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
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error({
        code: 'INVOICE_UPDATE_FAIL',
        message: 'Failed to update invoice',
        context: {
          id: data.id,
        },
      });
    } else {
      logger.error({
        code: 'IPN_VALIDATE_FAIL',
        message: 'Failed to validate IPN',
        context: {
          errorMessage: e.message,
          stackTeace: e,
        },
      });

      return res.status(500).json(e.message);
    }

    return res.status(500).json(e);
  }
}
