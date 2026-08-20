import { render, screen } from '@testing-library/react';

import NotFound from '@/components/NotFound';

describe('NotFound Component', () => {
  it('renders a heading', () => {
    render(<NotFound lang='en' />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('links back to the home page of the current language', () => {
    render(<NotFound lang='uk' />);

    expect(screen.getByRole('link', { name: /на головну/i })).toHaveAttribute(
      'href',
      '/uk',
    );
  });
});
