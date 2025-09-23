import { Category } from '@/lib/blog';
import { Blog } from '@/lib/blog/Blog';

import BlogPostPreview from '@/components/BlogPostPreview';
import FontIcon from '@/components/FontIcon';
import UnstyledLink from '@/components/links/UnstyledLink';

import { Lang } from '@/i18n';

export default function BlogCategory({
  lang,
  category,
  collapsed = false,
  depth = 0,
}: React.ComponentPropsWithoutRef<'div'> & {
  lang: Lang;
  category: Category;
  collapsed?: boolean;
  depth?: number;
}) {
  const Subcategories = (
    <div className='gap-8'>
      {category.getCategories().map((subCategory) => (
        <div key={subCategory.slug}>
          <UnstyledLink href={Blog.getLink(lang, subCategory)}>
            <div className="flex flex-row items-center pt-10 mb-10 pb-2 gap-3">
              {subCategory.icon && <FontIcon iconName={subCategory.icon} size={42} />}
              {(() => {
                switch (depth + 1) {
                  case 0:
                    return (
                      <h2 className='p-0 m-0 inline-block'>
                        {subCategory.title.toUpperCase()}
                      </h2>
                    );
                  case 1:
                    return (
                      <h3 className='p-0 m-0 inline-block'>
                        {subCategory.title.toUpperCase()}
                      </h3>
                    );
                  default:
                    return (
                      <h4 className='p-0 m-0 inline-block'>
                        {subCategory.title.toUpperCase()}
                      </h4>
                    );
                }
              })()}
            </div>
          </UnstyledLink>
          <BlogCategory
            lang={lang}
            category={subCategory}
            collapsed={true} // Subcategories are always collapsed
            depth={depth + 1} // Increase depth for subcategories
          />
        </div>
      ))}
    </div>
  );

  const posts = collapsed
    ? category.getPosts().slice(0, 4)
    : category.getPosts();

  const CollapsedPosts = (
    <div className='flex w-full flex-col md:flex-row gap-4'>
      {/* Featured post preview */}
      {category.featured && (
        <div className='w-full md:w-1/2 flex items-center justify-center'>
          <div className='flex aspect-square h-full w-full items-center justify-center'>
            <BlogPostPreview
              lang={lang}
              post={category.featured}
              featured={true}
            />
          </div>
        </div>
      )}

      {/* Other posts preview */}
      <div className='w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {posts.map((post) => (
          <div
            key={post.slug}
            className='flex aspect-square items-center justify-center'
          >
            <BlogPostPreview lang={lang} post={post} />
          </div>
        ))}
      </div>
    </div>
  );

  const ExpandedPosts = (
    <div className='flex w-full flex-col items-center justify-center gap-4 p-4'>
      {category.featured && (
        <BlogPostPreview
          lang={lang}
          post={category.featured}
          featured={true}
          className='aspect-auto'
        />
      )}

      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
        {posts.map((post) => (
          <div key={post.slug} className='flex aspect-square'>
            <BlogPostPreview
              lang={lang}
              post={post}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className='flex flex-col'>
      {Subcategories}
      {collapsed ? CollapsedPosts : ExpandedPosts}
    </section>
  );
}
