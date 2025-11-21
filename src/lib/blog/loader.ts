import fs from 'fs';
import matter from 'gray-matter';
import * as path from 'path';

import { defaultLang, Lang } from '@/i18n';

import { BlogNode, Category, LoadFailure, Post } from './types';
import config from '../../../config';

const META_FILE = '_meta.json';

interface CategoryMeta {
  title: Record<Lang, string>;
  featuredPost?: string; // slug of featured post
  icon?: string;
}

interface DirnameMeta {
  slug: string;
  sortKey?: string; // optional sort key for ordering posts
}

const normalizeSlug = (slug: string): string => {
  const s = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-') // non-alphanumeric to dashes
    .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes only
  return s || 'untitled'; // ensure non-empty slug
};

const blogNodesCompare = (a: BlogNode, b: BlogNode): number => {
  // If both nodes have dates, use them for sorting (newest first)
  if ('date' in a && 'date' in b && a.date && b.date) {
    return b.date.getTime() - a.date.getTime();
  }

  // Sort by sortKey if both have it, otherwise by slug
  if (a.sortKey && b.sortKey) {
    return a.sortKey.localeCompare(b.sortKey);
  }
  return a.slug.localeCompare(b.slug);
};

function parseFilePath(fp: string): DirnameMeta {
  const base = path.basename(fp);
  // 003.title
  // 2023-10-01.title
  // 2023-10-01.title.en
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
    if (err.code === 'ENOENT') return null; // file does not exist
    throw err; // other error (permissions, parse error, etc.)
  }
}

export function loadDirectory(
  dirname: string,
  lang: Lang,
  parent?: BlogNode,
): BlogNode {
  const meta = maybeReadMetadata(dirname);
  if (meta) {
    return loadCategory(dirname, meta, lang, parent);
  } else {
    return loadLocalizedPost(dirname, lang, parent);
  }
}

function loadPostFile(
  filename: string,
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

    const rawImage = data.hero || data.image || '/images/blog-generic.webp';

    const image = rawImage.startsWith('http://') || rawImage.startsWith('https://')
      ? rawImage // external URL
      : `${config.SITE_URL}${path.join('/', path.dirname(filename), rawImage)}`; // posts mirrored in next.js `public`

    // Store raw content for later serialization
    const meta: Post = {
      type: 'Post',
      slug,
      sortKey,
      title: data.title || slug,
      filePath: filename,
      parent,
      children: [],
      childrenBySlug: {},
      date,
      image,
      content: content, // Store raw content instead of serialized
      excerpt: data.excerpt || content.slice(0, 200) + '...',
    };
    return meta;
  } catch (err) {
    return {
      type: 'LoadFailure',
      slug,
      sortKey,
      title: `Failed to load ${path.basename(filename)}`,
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
  let c: Category = {
    type: 'Category',
    slug,
    sortKey,
    title: meta.title[lang] || meta.title[defaultLang] || slug,
    filePath: dirname,
    icon: meta.icon,
    parent,
    children: [],
    childrenBySlug: {},
    getPosts: () => {
      if (!c.children || c.children.length === 0) {
        return [];
      }
      return c.children
        .filter(
          (child): child is Post =>
            child.type === 'Post' && child !== c.featured,
        )
        .sort(blogNodesCompare);
    },
    getCategories: () => {
      if (!c.children || c.children.length === 0) {
        return [];
      }
      return c.children
        .filter((child): child is Category => child.type === 'Category')
        .sort(blogNodesCompare);
    },
  };

  try {
    const files = fs.readdirSync(dirname, { withFileTypes: true });
    for (const file of files) {
      let childNode: BlogNode | undefined = undefined;
      if (file.isDirectory()) {
        childNode = loadDirectory(path.join(dirname, file.name), lang, c);
      } else if (file.isFile() && /\.mdx?$/.test(file.name)) {
        childNode = loadPostFile(path.join(dirname, file.name), c);
      }
      if (childNode) {
        c.children = c.children || [];
        c.children.push(childNode);
        c.childrenBySlug = c.childrenBySlug || {};
        c.childrenBySlug[childNode.slug] = childNode;
      }
    }

    // featured post
    if (meta.featuredPost) {
      try {
        const feat = c.childrenBySlug
          ? c.childrenBySlug[meta.featuredPost]
          : undefined;
        if (!feat) {
          throw new Error(`Featured post ${meta.featuredPost} not found`);
        }
        if (feat.type !== 'Post') {
          throw new Error(
            `Featured post ${meta.featuredPost} is not a Post but ${feat.type}`,
          );
        }
        c.featured = feat as Post;
      } catch (err) {
        c.featured = {
          type: 'LoadFailure',
          slug,
          sortKey,
          parent,
          title: `Failed to load ${dirname}`,
          filePath: dirname,
          err,
          children: [],
          childrenBySlug: {},
        };
      }
    } else {
      // the latest post fallback
      const posts = c.getPosts();
      if (posts.length > 0) {
        c.featured = posts[0];
      }
    }
  } catch (err) {
    return {
      type: 'LoadFailure',
      slug,
      sortKey,
      parent,
      title: `Failed to load ${dirname}`,
      filePath: dirname,
      err,
      children: [],
      childrenBySlug: {},
    };
  }

  return c;
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
  try {
    let filename: string | undefined;
    for (const f of variants) {
      try {
        const s = fs.statSync(f);
        if (s && s.isFile()) {
          filename = f;
          break;
        }
      } catch (err) {
        if ((err as any)?.code === 'ENOENT') {
          continue; // File does not exist, try next variant
        }
        throw err; // Other error (permissions, etc.)
      }
    }

    if (!filename) {
      throw new Error(`No localized posts found in ${dirname}`);
    }

    return loadPostFile(filename, parent, slug, sortKey);
  } catch (err) {
    return {
      type: 'LoadFailure',
      slug,
      sortKey,
      title: dirname,
      filePath: dirname,
      parent,
      err,
      children: [],
      childrenBySlug: {},
    };
  }
}
