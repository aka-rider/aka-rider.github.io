import { render, screen } from '@testing-library/react';

import RssPrompt from '@/components/blog/RssPrompt';

describe('RssPrompt', () => {
  it('renders the RSS link and surrounding text', () => {
    render(<RssPrompt lang='en' />);

    expect(screen.getByText(/liked this\? grab the/i)).toBeInTheDocument();
    expect(screen.getByText(/to get notified\./i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /rss feed/i });
    expect(link).toHaveAttribute('href', '/en/feed.xml');
  });
});
