import { Feed } from 'feed';
import { NextRequest, NextResponse } from 'next/server';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode, Post } from '@/lib/blog/types';

import { common, Lang, Languages } from '@/i18n';

import config from '../../../../config';

export async function generateStaticParams() {
  return Languages.map((lang) => ({ lang }));
}

function getAllPosts(node: BlogNode): Post[] {
  let posts: Post[] = [];
  if (node.type === 'Post') {
    posts.push(node);
  }
  if (node.children) {
    node.children.forEach((child) => {
      posts = posts.concat(getAllPosts(child));
    });
  }
  return posts;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = (await params) as { lang: Lang };
  const blog = Blog.getInstance();
  const root = blog.getRoot(lang);

  if (!root) {
    return new NextResponse('Not found', { status: 404 });
  }

  const posts = getAllPosts(root).sort(
    (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
  );

  const siteUrl = config.SITE_URL;
  const feedOptions = {
    title: common[lang].title,
    description: common[lang].description,
    id: `${siteUrl}/${lang}`,
    link: `${siteUrl}/${lang}`,
    language: lang,
    image: `${siteUrl}/images/iurii-avatar.webp`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${common[lang].title}`,
    updated: posts[0]?.date || new Date(),
    feedLinks: {
      atom: `${siteUrl}/${lang}/feed.xml`,
    },
    author: {
      name: common[lang].title,
      link: siteUrl,
    },
  };

  const feed = new Feed(feedOptions);

  posts.forEach((post) => {
    const url = `${siteUrl}${Blog.getLink(lang, post)}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      content: post.content,
      author: [
        {
          name: common[lang].title,
          link: siteUrl,
        },
      ],
      date: post.date || new Date(),
      image: post.image,
    });
  });

  return new NextResponse(feed.atom1(), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
