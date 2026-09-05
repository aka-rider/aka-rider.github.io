import { Category, Post } from '@/lib/blog/types';

export function selectPreview(category: Category, limit = 4): { lead: Post | undefined; rest: Post[] } {
  const lead = category.featured;
  const rest = category.getPosts()
    .filter((post) => post !== lead)
    .slice(0, limit);

  return { lead, rest };
}
