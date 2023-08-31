import InoviceDetails from '@/pages/invoices/[id]';
import { Invoice } from '@prisma/client';
import { render } from '@testing-library/react';

describe('Invoice Details Page', () => {
  const INVOICE_DETAILS: Invoice = {
    bitpay_guid: 'bitpay_guid_123',
    bitpay_id: 'bitpay_id_123',
    bitpay_order_id: 'bitpay_order_id_123',
    bitpay_url: 'http://bitpay_url.com',
    created_date: new Date(),
    currency_code: 'USD',
    expiration_time: new Date(),
    id: 1,
    price: 100,
    status: 'new',
    pos_data_json: null,
    token: null,
    merchant_name: null,
    transaction_speed: null,
    json_pay_pro_required: null,
    item_description: null,
    low_fee_detected: null,
    invoice_payment_id: null,
    invoice_buyer_id: null,
  };

  it('Should render properly', () => {
    render(<InoviceDetails data={INVOICE_DETAILS} />);
  });
});
