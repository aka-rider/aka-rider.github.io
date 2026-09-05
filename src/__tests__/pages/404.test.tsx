import { act, render, screen } from '@testing-library/react';

import NotFound from '@/components/NotFound';

describe('NotFound Component', () => {
  it('renders a heading', async () => {
    jest.useFakeTimers();

    render(<NotFound lang='en' />);
    for (let i = 0; i < 20; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(100);
      });
    }

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('links back to the home page of the current language', () => {
    render(<NotFound lang='uk' />);

    expect(screen.getByRole('link', { name: /на головну/i })).toHaveAttribute(
      'href',
      '/uk',
    );
  });
});
