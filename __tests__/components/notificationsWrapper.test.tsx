import NotificationsWrapper from '@/components/NotificationsWrapper';
import { render } from '@testing-library/react';

describe('Notifications Wrapper Component', () => {
  it('Should render properly', () => {
    render(<NotificationsWrapper />);
  });
});
