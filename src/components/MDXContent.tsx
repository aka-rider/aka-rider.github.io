'use client';

import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';

export default function MDXContent({
  content,
}: {
  content: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...content} />;
}
