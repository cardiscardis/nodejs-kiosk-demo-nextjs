import config from '@/config';

export const formatNumber = (number: number, currencyCode: string) => {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
};

export const setInitialFormData = () => {
  const initialFormData: any = {};
  for (const field of config.bitpay.design.posData.fields) {
    initialFormData[field.id] = null;

    if (field.currency) {
      initialFormData.currency = field.currency;
    }
  }

  return initialFormData;
};
