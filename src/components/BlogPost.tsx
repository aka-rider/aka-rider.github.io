import Image from 'next/image';
import React from 'react';

import { Post } from '@/lib/blog/types';

import ServerMDX from '@/components/ServerMDX';

export default async function BlogPost({ post }: { post: Post }) {
  // Add null checks for post data
  if (!post) {
    return <div>Post not found</div>;
  }

  const content = post.content || '';

  return (
    <article className='prose lg:prose-xl p-5 lg:p-10'>
      <h1>{post.title}</h1>

      <Image src={post.image} alt={post.title} width={1350} height={1080} className='p-10' />

      <ServerMDX source={content} postFilePath={post.filePath} />
    </article>
  );
}
