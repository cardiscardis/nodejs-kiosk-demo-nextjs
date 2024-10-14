import PageHeader from '@/components/PageHeader';
import { render } from '@testing-library/react';

describe('Page Header Component', () => {
  it('Should render properly', () => {
    const PAGE_TITLE = 'Page Title';
    const { getByRole } = render(<PageHeader title={PAGE_TITLE} />);
    const title = getByRole('heading', { level: 1 });
    expect(title.textContent).toEqual(PAGE_TITLE);
  });
});
