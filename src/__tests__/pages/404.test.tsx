import { act, render, screen } from '@testing-library/react';

import NotFound from '@/components/NotFound';

describe('NotFound Component', () => {
  it('renders a heading once the typing animation finishes', async () => {
    jest.useFakeTimers();

    render(<NotFound lang='en' />);

    while (jest.getTimerCount() > 0) {
      await act(async () => {
        await jest.runOnlyPendingTimersAsync();
      });
    }

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('links back to the home page of the current language', () => {
    render(<NotFound lang='uk' />);

    expect(screen.getByRole('link', { name: /на головну/i })).toHaveAttribute(
      'href',
      '/uk/',
    );
  });
});
