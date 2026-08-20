import { loadDirectory } from '@/lib/blog/loader';
import { BlogNode } from '@/lib/blog/types';

import { defaultLang, Lang, Languages } from '@/i18n';

import config from '../../../config.js';

export class Blog {
  private readonly root: Map<Lang, BlogNode>;

  constructor() {
    this.root = new Map(
      Languages.keys().map((lang) => [
        lang,
        loadDirectory(config.BLOG_POSTS_DIR, lang),
      ]),
    );
  }

  static getLink(lang: Lang, node?: BlogNode): string {
    if (!node) {
      return `/${lang}/blog`;
    }

    if (node.type === 'Category') {
      if (!node.parent) {
        return `/${lang}/blog`;
      }
      return `/${lang}/blog#${node.slug}`;
    }

    const path = [node.slug];
    for (let n = node.parent; n; n = n.parent) {
      path.unshift(n.slug);
    }
    return `/${lang}/blog/${path.join('/')}`;
  }

  generateStaticParams(): { lang: Lang; slug?: string[] }[] {
    const generateParams = (
      lang: Lang,
      node: BlogNode,
      slug: string[],
    ): { lang: Lang; slug?: string[] }[] => {
      const currentPath = [...slug, node.slug];
      return [
        { lang, slug: currentPath },
        ...node.children.flatMap((child) =>
          generateParams(lang, child, currentPath),
        ),
      ];
    };

    return [...this.root.entries()].flatMap(([lang, category]) =>
      generateParams(lang, category, []),
    );
  }

  getRoot(lang: Lang): BlogNode | null {
    return this.root.get(lang) ?? this.root.get(defaultLang) ?? null;
  }

  getBySlug(lang: Lang, slug: string[]): BlogNode | null {
    const rootCategory = this.root.get(lang);
    if (!rootCategory) {
      return null;
    }

    if (slug.length === 0) {
      return rootCategory;
    }

    if (slug[0] === rootCategory.slug) {
      return slug.length === 1
        ? rootCategory
        : this.findNode(rootCategory, slug.slice(1));
    }

    return this.findNode(rootCategory, slug);
  }

  private findNode(node: BlogNode, slugPath: string[]): BlogNode | null {
    if (slugPath.length === 0) {
      return node;
    }
    const nextSlug = slugPath[0];
    if (!nextSlug) return null;

    const child = node.childrenBySlug[nextSlug];
    if (child) {
      return this.findNode(child, slugPath.slice(1));
    }
    return null;
  }
}
