import { bitpayClient } from '@/lib/bitpay';
import { prisma } from '@/lib/prisma';
import { Invoice } from 'bitpay-sdk/dist/Model';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { SupportedTransactionCurrency } from 'bitpay-sdk/dist/Model/Invoice/SupportedTransactionCurrency';

export interface InvoiceCreateInput {
  price: string;
  currency: string;
}

const includeInvoiceFields = {
  invoice_payment: {
    include: {
      payment_curenncies: {
        include: {
          currency_codes: true,
          exchange_rates: true,
          miner_fee: true,
          supported_transaction_currency: true,
        },
      },
    },
  },
  invoice_buyer: {
    include: {
      invoice_buyer_provided_info: true,
    },
  },
};

export const createInvoice = async (payload: InvoiceCreateInput) => {
  const data = new Invoice(parseFloat(payload.price), payload.currency);
  data.posData = JSON.stringify(payload);
  data.transactionSpeed = 'medium';
  data.itemDesc = 'Example';
  data.orderId = uuidv4();

  const invoice = await bitpayClient.createInvoice(data);
  return await saveInvoice(invoice);
};

const saveInvoice = async (invoice: Invoice) => {
  const invoiceBuyer = setInvoiceBuyer(invoice);
  const invoicePayment = setInvoicePayment(invoice);
  return await prisma.invoice.create({
    data: {
      bitpay_url: invoice.url,
      pos_data_json: invoice.posData,
      bitpay_guid: invoice.guid,
      bitpay_id: invoice.id,
      price: invoice.price,
      currency_code: invoice.currency,
      status: invoice.status,
      token: invoice.token,
      low_fee_detected: invoice.lowFeeDetected,
      item_description: invoice.itemDesc,
      json_pay_pro_required: invoice.jsonPayProRequired,
      bitpay_order_id: invoice.orderId,
      transaction_speed: invoice.transactionSpeed,
      //merchant_name: invoice.merchantName, // TODO: SDK - Add merchantName to InvoiceInterface
      created_date: invoice.invoiceTime ? new Date(invoice.invoiceTime) : null,
      expiration_time: invoice.expirationTime
        ? new Date(invoice.expirationTime)
        : null,
      invoice_payment: {
        create: invoicePayment,
      },
      invoice_buyer: {
        create: invoiceBuyer,
      },
    },
    include: includeInvoiceFields,
  });
};

const setInvoiceBuyer = (invoice: Invoice) => {
  const invoiceBuyer: Prisma.InvoiceBuyerCreateInput = {
    name: invoice.buyer?.name,
    address1: invoice.buyer?.address1,
    address2: invoice.buyer?.address2,
    region: invoice.buyer?.region,
    postal_code: invoice.buyer?.postalCode,
    country: invoice.buyer?.country,
    email: invoice.buyer?.email,
    phone: invoice.buyer?.phone,
    notify: invoice.buyer?.notify,
  };

  const invoiceBuyerProvidedInfo: Prisma.InvoiceBuyerProvidedInfoCreateInput = {
    // TODO - SDK Add BuyerProvidedInfo to Interface
  };

  invoiceBuyer.invoice_buyer_provided_info = {
    create: invoiceBuyerProvidedInfo,
  };

  return invoiceBuyer;
};

const setInvoicePayment = (invoice: Invoice) => {
  const invoicePayment: Prisma.InvoicePaymentCreateInput = {
    amount_paid: invoice.amountPaid,
    overpaid_amount: invoice.overpaidAmount,
    display_amount_paid: invoice.displayAmountPaid?.toString(),
    non_pay_pro_payment_received: invoice.nonPayProPaymentReceived,
    transaction_currency: invoice.transactionCurrency,
  };

  const paymentCurrencies: Prisma.InvoicePaymentCurrencyCreateInput[] = [];

  if (invoice.paymentCodes) {
    for (const [currencyCode, currencyCodeValues] of Object.entries(
      invoice.paymentCodes
    )) {
      const paymentTotals = invoice.paymentTotals as unknown as {
        [key: string]: number;
      } | null;

      const paymentDisplayTotals = invoice.paymentDisplayTotals as unknown as {
        [key: string]: string;
      } | null;

      const paymentSubtotals = invoice.paymentSubtotals as unknown as {
        [key: string]: number;
      } | null;

      const paymentDisplaySubTotals =
        invoice.paymentDisplaySubTotals as unknown as {
          [key: string]: string;
        } | null;

      const paymentCurrency: Prisma.InvoicePaymentCurrencyCreateInput = {
        currency_code: currencyCode,
        total: paymentTotals ? paymentTotals[currencyCode] : null,
        display_total: paymentDisplayTotals
          ? paymentDisplayTotals[currencyCode]
          : null,
        subtotal: paymentSubtotals ? paymentSubtotals[currencyCode] : null,
        display_subtotal: paymentDisplaySubTotals
          ? paymentDisplaySubTotals[currencyCode]
          : null,
      };

      if (invoice.exchangeRates) {
        const paymentCurrencyExchangeRates = setInvoiceExchangeRates(
          invoice.exchangeRates as any,
          currencyCode
        );

        paymentCurrency.exchange_rates = {
          create: paymentCurrencyExchangeRates,
        };
      }

      if (invoice.minerFees) {
        const minerFee = setInvoiceMinerFee(
          invoice.minerFees as any,
          currencyCode
        );

        paymentCurrency.miner_fee = {
          create: minerFee,
        };
      }

      if (invoice.supportedTransactionCurrencies) {
        const supportedTransactionCurrency =
          setInvoiceSupportedTransactionCurrency(
            invoice.supportedTransactionCurrencies as any,
            currencyCode
          );

        paymentCurrency.supported_transaction_currency = {
          create: supportedTransactionCurrency,
        };
      }

      if (currencyCodeValues) {
        const paymentCurrenciesCodes = setInvoicePaymentCurrenciesCodes(
          currencyCodeValues as any
        );

        paymentCurrency.currency_codes = {
          create: paymentCurrenciesCodes,
        };
      }

      paymentCurrencies.push(paymentCurrency);
    }
  }

  invoicePayment.payment_curenncies = {
    create: paymentCurrencies,
  };

  return invoicePayment;
};

const setInvoicePaymentCurrenciesCodes = (currencyCodes: {
  [key: string]: string | number;
}) => {
  const paymentCurrenciesCodes: Prisma.InvoicePaymentCurrencyCodeCreateInput[] =
    [];
  for (const [code, codeUrl] of Object.entries(currencyCodes)) {
    const paymentCurrencyCode: Prisma.InvoicePaymentCurrencyCodeCreateInput = {
      code,
      code_url: codeUrl.toString(),
    };

    paymentCurrenciesCodes.push(paymentCurrencyCode);
  }

  return paymentCurrenciesCodes;
};

const setInvoiceMinerFee = (
  minerFees: { [key: string]: { [key: string]: number } },
  currencyCode: string
) => {
  const minerFee: Prisma.InvoicePyamentCurrencyMinerFeeCreateInput = {
    total_fee: minerFees[currencyCode].totalFee,
    satoshis_per_byte: minerFees[currencyCode].satoshisPerByte,
    fiat_amount: minerFees[currencyCode].fiatAmount,
  };

  return minerFee;
};

const setInvoiceExchangeRates = (
  exchangeRates: {
    [key: string]: { [key: string]: number };
  },
  currencyCode: string
) => {
  const paymentCurrencyExchangeRates: Prisma.InvoicePaymentCurrencyExchangeRateCreateInput[] =
    [];

  for (const [exchangeCurrencyCode, rate] of Object.entries(
    exchangeRates[currencyCode]
  )) {
    const exchangeRate: Prisma.InvoicePaymentCurrencyExchangeRateCreateInput = {
      currency_code: exchangeCurrencyCode,
      rate,
    };

    paymentCurrencyExchangeRates.push(exchangeRate);
  }

  return paymentCurrencyExchangeRates;
};

const setInvoiceSupportedTransactionCurrency = (
  supportedTransactionCurrencies: {
    [key: string]: SupportedTransactionCurrency;
  },
  currencyCode: string
) => {
  const supportedTransactionCurrency: Prisma.InvoicePaymentCurrencySupportedTransactionCurrencyCreateInput =
    {
      enabled: supportedTransactionCurrencies[currencyCode].enabled,
      reason: supportedTransactionCurrencies[currencyCode].reason,
    };

  return supportedTransactionCurrency;
};

export const findInvoiceById = async (id: number) => {
  return await prisma.invoice.findUnique({
    where: {
      id,
    },
    include: includeInvoiceFields,
  });
};

export const getInvoices = async (page: number = 1, limit: number = 10) => {
  const startOffset = (page - 1) * limit;
  const endOffset = page * limit;
  let next: { page?: number; limit?: number } | null = null;
  let prev: { page?: number; limit?: number } | null = null;

  const [invoices, count] = await prisma.$transaction([
    prisma.invoice.findMany({
      take: limit,
      skip: startOffset,
      orderBy: {
        id: 'desc',
      },
      include: includeInvoiceFields,
    }),

    prisma.invoice.count(),
  ]);

  if (endOffset < count) {
    next = {
      page: page + 1,
      limit,
    };
  }

  if (startOffset > 0) {
    prev = {
      page: page - 1,
      limit,
    };
  }

  return {
    invoices,
    count,
    next,
    prev,
  };
};
