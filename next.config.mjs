// @ts-check

/** @type {import('@next/mdx').NextMDXOptions} */
import nextMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import mdxMermaid from 'mdx-mermaid'
import config from './config.js';
const { IS_PRODUCTION } = config;

const withMDX = nextMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, [mdxMermaid, { output: 'svg' }]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: IS_PRODUCTION ? process.env.PAGES_BASE_PATH : "",
  images: { unoptimized: true },
  trailingSlash: true,
  eslint: {
    dirs: ['src', '_posts'],
  },

  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default withMDX(nextConfig);
