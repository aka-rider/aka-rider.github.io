import { loadDirectory } from '@/lib/blog/loader';
import { BlogNode } from '@/lib/blog/types';

import { defaultLang, Lang, Languages } from '@/i18n';

import config from '../../../config.js';

export class Blog {
  private root: Record<string, BlogNode>;

  private constructor() {
    this.root = {};
    for (const lang of Languages.keys()) {
      this.root[lang] = loadDirectory(config.BLOG_POSTS_DIR, lang);
    }
  }

  static getLink(lang: Lang, node?: BlogNode): string {
    const path = node ? [node.slug] : [];
    for (let n = node?.parent; n; n = n.parent) {
      // Include all parent slugs, including the root category
      path.unshift(n.slug);
    }
    return `/${lang}/blog/${path.join('/')}`;
  }

  generateStaticParams(): { lang: string; slug?: string[] }[] {
    return Object.entries(this.root).flatMap(([lang, category]) => {
      const generateParams = (
        node: BlogNode,
        slug: string[] = [],
      ): { lang: string; slug?: string[] }[] => {
        const params: { lang: string; slug?: string[] }[] = [];

        // Include this node's slug in the path
        const currentPath = [...slug, node.slug];
        params.push({ lang, slug: currentPath });

        node.children?.forEach((child) => {
          params.push(...generateParams(child, currentPath));
        });

        return params;
      };

      // Generate all routes with the root 'posts' slug included
      // This creates /blog/posts/... paths
      return generateParams(category, []);
    });
  }

  getRoot(lang: string): BlogNode | null {
    return this.root[lang] || this.root[defaultLang] || null;
  }

  getBySlug(lang: Lang, slug: string[]): BlogNode | null {
    const rootCategory = this.root[lang];
    if (!rootCategory) {
      return null;
    }

    // If slug is empty, return root
    if (slug.length === 0) {
      return rootCategory;
    }

    // All posts are under /blog/posts/... structure
    // The first slug should be 'posts' (the root category)
    // If the first slug matches the root category, we need to handle it specially
    if (slug.length === 1 && slug[0] === rootCategory.slug) {
      return rootCategory;
    }

    // If the first slug matches the root, look in its children for the rest
    if (slug[0] === rootCategory.slug) {
      return this.findNode(rootCategory, slug.slice(1));
    }

    // Otherwise, search from root (for backward compatibility)
    return this.findNode(rootCategory, slug);
  }

  private findNode(node: BlogNode, slugPath: string[]): BlogNode | null {
    if (slugPath.length === 0) {
      return node;
    }
    const nextSlug = slugPath[0];
    if (!nextSlug) return null;

    const child = node.childrenBySlug?.[nextSlug];
    if (child) {
      return this.findNode(child, slugPath.slice(1));
    }
    return null;
  }

  getPostByFilePath(filePath: string, lang: string): BlogNode | null {
    const root = this.getRoot(lang);
    if (!root) {
      return null;
    }

    const traverseNode = (node: BlogNode): BlogNode | null => {
      // Check if current node is a Post and matches the filePath
      if (node.type === 'Post' && node.filePath === filePath) {
        return node;
      }

      // Recursively search in children
      for (const child of node.children || []) {
        const result = traverseNode(child);
        if (result) {
          return result;
        }
      }

      return null;
    };

    return traverseNode(root);
  }

  static getInstance(): Blog {
    return new Blog();
  }
}
