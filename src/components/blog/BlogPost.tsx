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
    <div className='px-5 lg:px-10'>
      <div className='relative max-w-[70ch] mx-auto'>
        <article className='prose lg:prose-xl max-w-none'>
          <h1>{post.title}</h1>
          <p className='text-sm opacity-60'>
            {post.readingTime} {common[lang].readingTime}
          </p>

          <Image
            src={post.image}
            alt={post.title}
            width={1350}
            height={1080}
            className='w-full h-auto rounded-[20px] shadow-2xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] my-10'
          />

          <ServerMDX source={content} postFilePath={post.filePath} />
        </article>
        <TableOfContents lang={lang} />
      </div>
    </div>
  );
}
