import config from '@/config';
import { Client } from 'bitpay-sdk';
import { Environment } from 'bitpay-sdk/dist/Environment';
import { Invoice } from 'bitpay-sdk/dist/Model';
import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';

export const bitpayClient = Client.createPosClient(
  config.bitpay.token,
  config.bitpay.environment as Environment
);

export const createInvoice = async (formData: any) => {
  formData.price = parseFloat(formData.price);

  const payload = {
    price: formData.price,
    currency: formData.currency,
    posData: JSON.stringify(formData),
    transactionSpeed: 'medium',
    itemDesc: 'Example',
    orderId: uuidv4(),
  } as Invoice;

  const res = await bitpayClient.createInvoice(payload);
  const invoice = await prisma.invoice.create({
    data: {
      bitpay_url: res.url,
      pos_data_json: res.posData,
      bitpay_guid: res.guid,
      bitpay_id: res.id,
      price: res.price,
      currency_code: res.currency,
      status: res.status,
      token: res.token,
      low_fee_detected: res.lowFeeDetected,
      item_description: res.itemDesc,
      json_pay_pro_required: res.jsonPayProRequired,
      bitpay_order_id: res.orderId,
      transaction_speed: res.transactionSpeed,
      //merchant_name: res.merchantName, // TODO: SDK - Add merchantName to InvoiceInterface
      created_date: res.invoiceTime ? new Date(res.invoiceTime) : null,
      expiration_time: res.expirationTime ? new Date(res.expirationTime) : null,
      invoice_payment: {
        create: {
          amount_paid: res.amountPaid,
          overpaid_amount: res.overpaidAmount,
          display_amount_paid: res.displayAmountPaid?.toString(),
        },
      },
    },
    include: { invoice_payment: true },
  });

  return invoice;
};
