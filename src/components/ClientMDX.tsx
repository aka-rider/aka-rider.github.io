'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import TLDR from '@/components/TLDR';

const mdxComponents = {
  a: (props: React.ComponentProps<'a'>) => (
    <UnstyledLink {...props} openNewTab={true} />
  ),
  TLDR,
};

interface ClientMDXProps {
  mdxSerializeResult: MDXRemoteSerializeResult;
}

export default function ClientMDX({ mdxSerializeResult }: ClientMDXProps) {
  return <MDXRemote {...mdxSerializeResult} components={mdxComponents} />;
}
