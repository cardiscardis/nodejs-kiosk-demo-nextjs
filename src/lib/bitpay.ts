// import config from '@/config';
import { Client } from 'bitpay-sdk';

const bitpayConfigFilePath = process.cwd() + '/BitPay.config.json';

export const bitpayClient = Client.createClientByConfig(bitpayConfigFilePath);
