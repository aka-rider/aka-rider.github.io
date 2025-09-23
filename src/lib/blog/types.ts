export interface NodeProperties {
  slug: string;
  title: string;
  filePath: string;
  children: BlogNode[];
  childrenBySlug: Record<string, BlogNode>;
  sortKey?: string;
  icon?: string;
  parent?: BlogNode;
}

export type BlogNode = Category | Post | LoadFailure;

export interface Category extends NodeProperties {
  type: 'Category';
  featured?: Post | LoadFailure;
  getPosts(): Post[];
  getCategories(): Category[];
}

export interface Post extends NodeProperties {
  type: 'Post';
  image: string;
  excerpt: string;
  content: string;
  date?: Date;
}

export interface LoadFailure extends NodeProperties {
  type: 'LoadFailure';
  err: unknown;
}
