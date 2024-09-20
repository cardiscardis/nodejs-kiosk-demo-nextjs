import Error from '@/components/Error';
import { render } from '@testing-library/react';

describe('Error Component', () => {
  it('Should render properly', () => {
    render(<Error />);
  });

  it('Should render default error text without children specified', () => {
    const DEFAULT_ERROR_TEXT = 'Error';
    const { getByTestId } = render(<Error />);
    const error = getByTestId('error-text');
    expect(error.textContent).toBe(DEFAULT_ERROR_TEXT);
  });

  it('Should render error text specified in children', () => {
    const ERROR_TEXT = 'Error message';
    const { getByTestId } = render(<Error>{ERROR_TEXT}</Error>);
    const error = getByTestId('error-text');
    expect(error.textContent).toBe(ERROR_TEXT);
  });
});
