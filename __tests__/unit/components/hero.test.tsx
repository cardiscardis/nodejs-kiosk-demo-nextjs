import Hero from '@/components/Hero';
import { render } from '@testing-library/react';

describe('Hero Component', () => {
  it('Should render properly', () => {
    render(<Hero />);
  });
});
