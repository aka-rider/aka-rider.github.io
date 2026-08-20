// @ts-check

import nextMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { sharedRemarkPlugins } from './mdx-config.mjs';

const withMDX = nextMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkMdxFrontmatter,
      ...sharedRemarkPlugins,
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  eslint: {
    dirs: ['src', '_posts'],
  },

  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],

  experimental: {
    optimizePackageImports: ['react-icons'],
  },

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
