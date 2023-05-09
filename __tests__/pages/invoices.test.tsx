import Invoices from '@/pages/invoices';
import { render } from '@testing-library/react';
import { describe } from 'node:test';

describe('Invoices Grid Page', () => {
  it('Should render properly', () => {
    render(
      <Invoices
        data={[]}
        limit={10}
        page={1}
        next={{ page: 2, limit: 10 }}
        prev={{ page: 1, limit: 10 }}
        total={20}
      />
    );
  });
});
