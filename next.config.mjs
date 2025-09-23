// @ts-check

import fs from 'fs';
import path from 'path';

/** @type {import('@next/mdx').NextMDXOptions} */
import nextMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import config from './config.js';
const { ROOT_DIR, BLOG_POSTS_DIR } = config;

const withMDX = nextMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
  },
});

// Symlink entire _posts directory to public/_posts during build
function symlinkPostsDirectory() {
  // Step 1: Clean up broken symlinks and remove the directory if empty
  function cleanupDeadLinks(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isSymbolicLink()) {
        // Check if symlink target exists
        try {
          fs.accessSync(itemPath, fs.constants.F_OK);
          // Symlink is valid, keep it
        } catch {
          // Symlink is broken, remove it
          fs.unlinkSync(itemPath);
        }
      } else if (item.isDirectory()) {
        // Recursively clean subdirectories first
        cleanupDeadLinks(itemPath);
      }
    }

    // After processing all items, try to remove this directory if it's empty
    try {
      const remainingItems = fs.readdirSync(dir);
      if (remainingItems.length === 0) {
        fs.rmdirSync(dir);
      }
    } catch (err) {
      // Directory not empty or permission issues, ignore
      if (err.code !== 'ENOENT' && err.code !== 'ENOTEMPTY') {
        // Silently ignore other errors
      }
    }
  }

  // Step 2: Create symlinks for entire directory structure
  function symlinkImages(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) {
      return;
    }
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const items = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const item of items) {
      const sourcePath = path.join(sourceDir, item.name);
      const targetPath = path.join(targetDir, item.name);

      if (item.isDirectory()) {
        // Recurse into subdirectory
        symlinkImages(sourcePath, targetPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (
          ![
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp',
            '.svg',
            '.bmp',
            '.tiff',
            '.tif',
            '.heic',
            '.heif',
          ].includes(ext)
        ) {
          // Skip non-image files
          continue;
        }
        try {
          fs.symlinkSync(sourcePath, targetPath);
        } catch {
          // Fallback to copying if symlinks aren't supported (Windows without admin)
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    }
  }

  const target = path.join(ROOT_DIR, 'public', 'images', BLOG_POSTS_DIR);
  // Relink images from _posts to public/images/_posts
  cleanupDeadLinks(target);
  symlinkImages(path.join(ROOT_DIR, BLOG_POSTS_DIR), target);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // SVGR
  webpack(config) {
    symlinkPostsDirectory();

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
