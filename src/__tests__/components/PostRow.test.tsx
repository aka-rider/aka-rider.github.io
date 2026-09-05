import { render, screen } from '@testing-library/react';

import { PostSummary } from '@/lib/blog/summary';

import PostRow from '@/components/blog/PostRow';

function makeSummary(overrides: Partial<PostSummary> = {}): PostSummary {
  return {
    slug: 'my-post',
    href: '/en/blog/posts/my-post',
    title: 'My Post',
    excerpt: 'An excerpt.',
    image: '/images/my-post.png',
    date: new Date(Date.UTC(2026, 8, 1)),
    readingTime: 4,
    contentLang: null,
    ...overrides,
  };
}

describe('PostRow', () => {
  it('links to the post href', () => {
    const post = makeSummary();

    render(<PostRow lang='en' post={post} />);

    expect(screen.getByRole('link', { name: /My Post/ })).toHaveAttribute(
      'href',
      '/en/blog/posts/my-post/',
    );
  });

  it('shows the meta text with date and reading time', () => {
    const post = makeSummary();

    render(<PostRow lang='en' post={post} />);

    expect(screen.getByText('Sep 1, 2026 · 4 min')).toBeInTheDocument();
  });

  it('shows a language tag when the content language differs from the page language', () => {
    const post = makeSummary({ contentLang: 'en' });

    render(<PostRow lang='uk' post={post} />);

    expect(screen.getByText('(ENG)')).toBeInTheDocument();
  });

  it('hides the language tag when the content language matches the page language', () => {
    const post = makeSummary({ contentLang: 'en' });

    render(<PostRow lang='en' post={post} />);

    expect(screen.queryByText('(ENG)')).not.toBeInTheDocument();
  });

  it('hides the language tag when the content language is unknown', () => {
    const post = makeSummary({ contentLang: null });

    render(<PostRow lang='uk' post={post} />);

    expect(screen.queryByText(/ENG|УКР/)).not.toBeInTheDocument();
  });

  it('shows the excerpt only for the lead post', () => {
    const post = makeSummary();

    const { rerender } = render(<PostRow lang='en' post={post} />);
    expect(screen.queryByText('An excerpt.')).not.toBeInTheDocument();

    rerender(<PostRow lang='en' post={post} lead />);
    expect(screen.getByText('An excerpt.')).toBeInTheDocument();
  });
});
