import { render, screen } from '@testing-library/react';

import NotFound from '@/components/NotFound';

describe('NotFound Component', () => {
  it('renders a heading', () => {
    render(<NotFound lang='en' />);

    const heading = screen.getByText(/not found/i);

    expect(heading).toBeInTheDocument();
  });
});
