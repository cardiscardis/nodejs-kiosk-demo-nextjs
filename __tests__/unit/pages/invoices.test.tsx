import Invoices from '@/app/invoices/page';
import { render } from '@testing-library/react';

describe('Invoices Grid Page', () => {
  it('Should render properly', async () => {
    render(await Invoices({ searchParams: { page: '1', limit: '10' } }));
  });
});
