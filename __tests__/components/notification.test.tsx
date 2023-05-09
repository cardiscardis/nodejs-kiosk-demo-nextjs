import Notification from '@/components/Notification';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

describe('Notification Component', () => {
  it('Should render properly', async () => {
    await act(async () => {
      render(
        <Notification
          eventData={{
            eventCode: 0,
            eventName: 'invoice_expired',
            invoice: {},
            message: { type: 'Bad', content: null },
            showed: false,
          }}
          onClose={() => {}}
        />
      );
    });
  });
});
