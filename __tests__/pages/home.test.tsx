import Home from '@/pages';
import { render } from '@testing-library/react';

describe('Home Page', () => {
  it('Should render properly', () => {
    render(<Home />);
  });
});
