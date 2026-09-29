/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
const fs = require('fs');
const path = require('path');
const { SITE_URL, BLOG_POSTS_DIR } = require('./config.js');

function normalizeSlug(slug) {
  const s = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'untitled';
}

function slugOf(basename) {
  if (/^\d[\d-]*\./.test(basename)) {
    const [, ...rest] = basename.split('.');
    return normalizeSlug(rest.join('.'));
  }
  return normalizeSlug(basename);
}

const rootSlug = slugOf(path.basename(BLOG_POSTS_DIR));
const categorySlugs = fs
  .readdirSync(BLOG_POSTS_DIR, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      fs.existsSync(path.join(BLOG_POSTS_DIR, entry.name, '_meta.json')),
  )
  .map((entry) => slugOf(entry.name));

const categoryShellPaths = ['', ...categorySlugs].flatMap((categorySlug) => {
  const segments = [rootSlug, categorySlug].filter(Boolean);
  return [`/*/blog/${segments.join('/')}`, `/*/blog/${segments.join('/')}/`];
});

const LANGS = ['en', 'uk'];

function findPostFallbackExcludes(dir, segments) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      const slug = slugOf(entry.name);
      if (fs.existsSync(path.join(full, '_meta.json'))) {
        return findPostFallbackExcludes(full, [...segments, slug]);
      }
      return LANGS.filter(
        (lang) =>
          !['mdx', 'md'].some((ext) =>
            fs.existsSync(path.join(full, `index.${lang}.${ext}`)),
          ),
      ).flatMap((lang) => {
        const postPath = `/${lang}/blog/${[...segments, slug].join('/')}`;
        return [postPath, `${postPath}/`];
      });
    });
}

const postFallbackExcludes = findPostFallbackExcludes(BLOG_POSTS_DIR, [
  rootSlug,
]);

module.exports = {
  siteUrl: SITE_URL,
  outDir: 'out',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  exclude: [
    '/',
    '/manifest.json',
    '/manifest.json/',
    '/apple-icon.png',
    '/apple-icon.png/',
    '/icon0.svg',
    '/icon0.svg/',
    '/icon1.png',
    '/icon1.png/',
    '/*/feed.xml',
    '/*/feed.xml/',
    '/404',
    '/404/',
    ...categoryShellPaths,
    ...postFallbackExcludes,
  ],
};
