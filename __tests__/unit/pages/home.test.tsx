import Home from '@/app/page';
import { render } from '@testing-library/react';

describe('Home Page', () => {
  it('Should render properly', async () => {
    render(await Home());
  });
});
