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
  thumbnails?: boolean; // Controls whether to show thumbnails in list view
  tags?: Record<string, Post[]>;
  featured?: Post;
  getPosts(): Post[];
  getCategories(): Category[];
}

export interface Post extends NodeProperties {
  type: 'Post';
  image: string;
  excerpt: string;
  content: string;
  date?: Date;
  tags?: string[];
  readingTime: number;
  featured?: boolean;
}

export interface LoadFailure extends NodeProperties {
  type: 'LoadFailure';
  err: unknown;
}
