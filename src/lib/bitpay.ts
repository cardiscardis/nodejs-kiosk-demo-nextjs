import config from '@/config';
import { Client } from 'bitpay-sdk';
import { Environment } from 'bitpay-sdk/dist/Environment';

export const bitpayClient = Client.createPosClient(
  config.bitpay.token,
  config.bitpay.environment as Environment
);
