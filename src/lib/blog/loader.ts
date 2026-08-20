import fs from 'fs';
import matter from 'gray-matter';
import * as path from 'path';
import readingTime from 'reading-time';

import { defaultLang, Lang } from '@/i18n';

import { BlogNode, Category, LoadFailure, Post } from './types';
import config from '../../../config';

const META_FILE = '_meta.json';
const EXCERPT_LENGTH = 200;
const WORDS_PER_MINUTE: Record<Lang, number> = {
  en: 200,
  uk: 170,
};

interface CategoryMeta {
  title: Record<Lang, string>;
  featuredPost?: string;
  icon?: string;
  thumbnails?: boolean;
}

interface DirnameMeta {
  slug: string;
  sortKey?: string;
}

const normalizeSlug = (slug: string): string => {
  const s = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'untitled';
};

const blogNodesCompare = (a: BlogNode, b: BlogNode): number => {
  if ('date' in a && 'date' in b && a.date && b.date) {
    return b.date.getTime() - a.date.getTime();
  }

  if (a.sortKey && b.sortKey) {
    return a.sortKey.localeCompare(b.sortKey);
  }
  return a.slug.localeCompare(b.slug);
};

function parseFilePath(fp: string): DirnameMeta {
  const base = path.basename(fp);
  if (/^\d[\d-]*\./.test(base)) {
    const [sortKey, ...slug] = base.split('.');
    return {
      slug: normalizeSlug(slug.join('.')),
      sortKey,
    };
  }

  return {
    slug: normalizeSlug(base),
    sortKey: undefined,
  };
}

function maybeReadMetadata(dir: string): CategoryMeta | null {
  try {
    const content = fs.readFileSync(path.join(dir, META_FILE), 'utf8');
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function postImageUrl(rawImage: string, postFilename: string): string {
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    return rawImage;
  }
  if (rawImage.startsWith('/')) {
    return `${config.SITE_URL}${rawImage}`;
  }
  return `${config.SITE_URL}${path.posix.join('/', path.dirname(postFilename), rawImage)}`;
}

function makeExcerpt(content: string): string {
  const head = content.slice(0, EXCERPT_LENGTH);
  return head.length < content.length ? `${head}...` : head;
}

export function loadDirectory(
  dirname: string,
  lang: Lang,
  parent?: BlogNode,
): BlogNode {
  const meta = maybeReadMetadata(dirname);
  if (meta) {
    return loadCategory(dirname, meta, lang, parent);
  }
  return loadLocalizedPost(dirname, lang, parent);
}

function loadPostFile(
  filename: string,
  lang: Lang,
  parent?: BlogNode,
  dirSlug?: string,
  dirSortKey?: string,
): Post | LoadFailure {
  const ownMeta = parseFilePath(path.parse(filename).name);
  const slug = dirSlug || ownMeta.slug;
  const sortKey = dirSortKey || ownMeta.sortKey;
  try {
    const fileContents = fs.readFileSync(filename, 'utf8');
    const { data, content } = matter(fileContents);
    let date: Date | undefined = undefined;
    if (sortKey && /2\d{3}-\d{2}-\d{2}/.test(sortKey)) {
      date = new Date(sortKey);
    }

    const stats = readingTime(content, {
      wordsPerMinute: WORDS_PER_MINUTE[lang],
    });

    return {
      type: 'Post',
      slug,
      sortKey,
      title: data.title || slug,
      filePath: filename,
      parent,
      children: [],
      childrenBySlug: {},
      date,
      image: postImageUrl(
        data.hero || data.image || config.DEFAULT_POST_IMAGE,
        filename,
      ),
      hideHero: Boolean(data.hideHero),
      content,
      excerpt: data.excerpt || makeExcerpt(content),
      tags: data.tags,
      readingTime: Math.ceil(stats.minutes),
      featured: data.featured === true,
    };
  } catch (err) {
    return {
      type: 'LoadFailure',
      slug,
      sortKey,
      title: path.basename(filename),
      filePath: filename,
      err,
      parent,
      children: [],
      childrenBySlug: {},
    };
  }
}

function loadCategory(
  dirname: string,
  meta: CategoryMeta,
  lang: Lang,
  parent?: BlogNode,
): Category | LoadFailure {
  const { slug, sortKey } = parseFilePath(dirname);

  let files: fs.Dirent[];
  try {
    files = fs.readdirSync(dirname, { withFileTypes: true });
  } catch (err) {
    return {
      type: 'LoadFailure',
      slug,
      sortKey,
      parent,
      title: path.basename(dirname),
      filePath: dirname,
      err,
      children: [],
      childrenBySlug: {},
    };
  }

  const category: Category = {
    type: 'Category',
    slug,
    sortKey,
    title: meta.title[lang] || meta.title[defaultLang] || slug,
    filePath: dirname,
    icon: meta.icon,
    thumbnails: meta.thumbnails,
    parent,
    children: [],
    childrenBySlug: {},
    tags: {},
    getPosts: () =>
      category.children
        .filter((child): child is Post => child.type === 'Post')
        .sort(blogNodesCompare),
    getCategories: () =>
      category.children
        .filter((child): child is Category => child.type === 'Category')
        .sort(blogNodesCompare),
  };

  for (const file of files) {
    let childNode: BlogNode | undefined = undefined;
    if (file.isDirectory()) {
      childNode = loadDirectory(path.join(dirname, file.name), lang, category);
    } else if (file.isFile() && /\.mdx?$/.test(file.name)) {
      childNode = loadPostFile(path.join(dirname, file.name), lang, category);
    }
    if (!childNode) {
      continue;
    }

    const clash = category.childrenBySlug[childNode.slug];
    if (clash) {
      throw new Error(
        `Duplicate slug '${childNode.slug}' in ${dirname}: ${clash.filePath} and ${childNode.filePath}`,
      );
    }

    category.children.push(childNode);
    category.childrenBySlug[childNode.slug] = childNode;
  }

  const metaFeatured = meta.featuredPost
    ? category.childrenBySlug[meta.featuredPost]
    : undefined;
  const posts = category.getPosts();
  if (metaFeatured?.type === 'Post') {
    metaFeatured.featured = true;
    category.featured = metaFeatured;
  } else {
    const explicitFeatured = posts.find((post) => post.featured === true);
    const latest = posts[0];
    if (explicitFeatured) {
      category.featured = explicitFeatured;
    } else if (latest) {
      latest.featured = true;
      category.featured = latest;
    }
  }

  const tags: Record<string, Post[]> = {};
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      (tags[tag] ??= []).push(post);
    }
  }
  category.tags = tags;

  return category;
}

function loadLocalizedPost(
  dirname: string,
  lang: Lang,
  parent?: BlogNode,
): Post | LoadFailure {
  const { slug, sortKey } = parseFilePath(dirname);
  const variants = [
    `${dirname}/index.${lang}.mdx`,
    `${dirname}/index.${lang}.md`,
    `${dirname}/index.${defaultLang}.mdx`,
    `${dirname}/index.${defaultLang}.md`,
    `${dirname}/index.mdx`,
    `${dirname}/index.md`,
  ];

  const filename = variants.find(
    (f) => fs.existsSync(f) && fs.statSync(f).isFile(),
  );

  if (!filename) {
    return {
      type: 'LoadFailure',
      slug,
      sortKey,
      title: path.basename(dirname),
      filePath: dirname,
      parent,
      err: new Error(`No localized posts found in ${dirname}`),
      children: [],
      childrenBySlug: {},
    };
  }

  return loadPostFile(filename, lang, parent, slug, sortKey);
}
