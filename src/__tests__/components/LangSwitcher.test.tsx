import { render, screen } from '@testing-library/react';

import LangSwitcher from '@/components/LangSwitcher';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/blog/',
}));

describe('LangSwitcher', () => {
  it('links the other language to the same path and query', async () => {
    window.history.replaceState(null, '', '/en/blog/?category=the-lab');

    render(<LangSwitcher lang='en' />);

    const uk = await screen.findByRole('link', { name: 'Українська' });
    expect(uk).toHaveTextContent('UK');
    expect(uk).toHaveAttribute('href', '/uk/blog/?category=the-lab');
  });

  it('marks the current language link as the current page', async () => {
    window.history.replaceState(null, '', '/en/blog/?category=the-lab');

    render(<LangSwitcher lang='en' />);

    const current = await screen.findByRole('link', { name: 'English' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveAttribute('href', '/en/blog/?category=the-lab');
  });
});
