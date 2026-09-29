import { Blog } from '@/lib/blog/Blog';
import { Post } from '@/lib/blog/types';

import { Lang, Languages } from '@/i18n';

export interface PostSummary {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  date?: Date;
  readingTime: number;
  contentLang: Lang | null;
}

const FILE_LANG = /\.(\w+)\.(mdx|md)$/;

export function contentLangOf(filePath: string): Lang | null {
  const suffix = FILE_LANG.exec(filePath)?.[1];
  return suffix && Languages.has(suffix) ? (suffix as Lang) : null;
}

export function toPostSummary(lang: Lang, post: Post): PostSummary {
  const contentLang = contentLangOf(post.filePath);

  return {
    slug: post.slug,
    href: Blog.getLink(lang, post),
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    date: post.date,
    readingTime: post.readingTime,
    contentLang,
  };
}
