import Image from 'next/image';
import React from 'react';

import { Post } from '@/lib/blog/types';

import ServerMDX from '@/components/blog/ServerMDX';
import TableOfContents from '@/components/blog/TableOfContents';

import { common, Lang } from '@/i18n';

export default async function BlogPost({ post, lang }: { post: Post; lang: Lang }) {
  // Add null checks for post data
  if (!post) {
    return <div>Post not found</div>;
  }

  const content = post.content || '';

  return (
    <article className='prose lg:prose-xl p-5 lg:p-10'>
      <h1>{post.title}</h1>
      <p className='text-sm opacity-60'>
        {post.readingTime} {common[lang].readingTime}
      </p>

      <Image src={post.image} alt={post.title} width={1350} height={1080} className='p-10' />

      <TableOfContents />

      <ServerMDX source={content} postFilePath={post.filePath} />
    </article>
  );
}
