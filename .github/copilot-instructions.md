# AI Coding Agent Instructions

Always use context7 when I need code generation, setup or configuration steps, or library/API documentation.
This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

Never add or remove dependencies by editing package.json directly, use `npm install` `npm uninstall` commands instead.

Never store summary of your changes in markdown files, never write readme, architecture.md, quickstart.md, or any other documentation files unless explicitly asked to do so.

## Project Overview

- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Site Type**: Personal portfolio website with multilingual MDX blog system
- **Deployment**: Static export (`output: 'export'` in next.config.mjs)
- **Multi-language support**: No hardcoded text, all content is localized
- **Dark Mode**: Full support with Tailwind dark mode selector

## Architecture Patterns

### App Router Structure

- **Dynamic Routes**: `[lang]` for internationalization, `[...slug]` for blog navigation
- **Layout Hierarchy**: Root layout (dummy) → language layout (true root) → route group layouts
- **Static Generation**: All pages use `generateStaticParams()` for static export

### Blog System Architecture

- **Content Location**: `_posts/` directory with nested category structure
- **File Structure**: `YYYY-MM-DD.title.mdx` or numbered prefixes `001.title/` meaning `${sortKey}.${slug}$`
- **Directories Hierarchy**: Directories are either categories (containing `_meta.json`) or posts (containing `index.mdx` or `index.${lang}.mdx`)
- **Categories Metadata**: `_meta.json` files define category titles, featured posts, icons
- **Content Loading**: Singleton `Blog` class with recursive directory parsing
- **Internationalization**: Content fallback chain (lang-specific → default lang)

#### Blog Content Structure

```
_posts/
├── _meta.json                    # Root category metadata
├── 10.software-engineering/      # Category with sort prefix
│   ├── _meta.json               # Category config
│   └── 2024-12-16.post-title.mdx # Date-prefixed posts
└── 20.fpv-drone/                # Another category
    ├── _meta.json
    └── 01.beginner/             # Nested subcategories
```

#### Metadata Format

```json
{
  "title": {
    "en": "Category Name",
    "uk": "Назва Категорії"
  },
  "featuredPost": "post-slug",
  "icon": "SiReact"
}
```

#### Blog Node Types

- **Category**: Directory with `_meta.json`, contains posts/subcategories
- **Post**: MDX file with frontmatter, contains article content
- **LoadFailure**: Error state when content fails to load

#### Blog Content Loading

1. **Directory Scanning**: Recursive traversal of `_posts/` structure
2. **Metadata Parsing**: JSON metadata for categories, frontmatter for posts
3. **Slug Generation**: Normalized from filenames/directory names
4. **Hierarchy Building**: Parent-child relationships with breadcrumb support
5. **Static Params**: Generate all possible routes for static export
6. **Images Handling**: Images in `_posts/` (including frontmatter) paths resolved relative to post location

### Coding Conventions

- **Code Comments**: Write comments that explain WHY, never WHAT - avoid verbose generic comments

  ```typescript
  // ✅ Preferred: Explains the reasoning
  // Using debounce to prevent excessive API calls during rapid user input
  const debouncedSearch = debounce(searchUsers, 300);

  // ❌ Avoid: States the obvious
  // This function debounces the search with 300ms delay
  const debouncedSearch = debounce(searchUsers, 300);
  ```

## Internationalization (i18n)

- **Never hardcode any text into HTML**: `src/i18n/` for all static text

### Translation System

- **Root Content**: `src/i18n/root.ts` for homepage sections
- **Translation Function**: `getTranslations(lang)` for localized strings
- **Metadata**: Language-specific titles, descriptions, keywords

### Content Localization

- **Blog Posts**: Filename variants (`.en.mdx`, `.uk.mdx`) with fallbacks
- **Navigation**: Localized category names in `_meta.json`
- **URLs**: Language prefix in all routes (`/en/blog/`, `/uk/blog/`)

- **Internationalization Text**: Respect target language grammar rules and conventions

  ```typescript
  // ✅ Preferred: Respect Ukrainian grammar (no title case)
  const i18n = {
    en: { title: 'Professional Journey' },
    uk: { title: 'Професійний шлях' }, // Ukrainian doesn't use title capitalization
  };

  // ❌ Avoid: Applying English rules to other languages
  const i18n = {
    en: { title: 'Professional Journey' },
    uk: { title: 'Професійний Шлях' }, // Incorrect capitalization for Ukrainian
  };
  ```

- **Language Parameter Rules**: All functions accepting language parameters must use `Lang` type without defaults

  ```typescript
  // ✅ Preferred: Mandatory Lang type, no defaults
  const formatDate = (date: Date, lang: Lang): string => {
    // Implementation
  };

  // ❌ Avoid: Hardcoded union types with defaults
  const formatDate = (date: Date, lang: 'en' | 'uk' = 'en'): string => {
    // Never use hardcoded language unions or defaults
  };
  ```

## File Organization

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Language-based routing
│   │   ├── (root)/        # Homepage routes
│   │   ├── (blog)/        # Blog routes
│   │   └── (debug)/       # Development/testing routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout-specific components
│   └── links/            # Link components
├── lib/                  # Utility libraries
│   ├── blog/            # Blog system logic
│   └── mdx.ts           # MDX processing
├── styles/              # CSS files
└── i18n/               # Internationalization
```

### Import Conventions

**Import Order** (enforced by ESLint):

1. External libraries
2. CSS files
3. `@/lib` and `@/hooks`
4. `@/data`
5. `@/components`
6. `@/store`
7. Other `@/` imports
8. Relative imports

### Links

- **NEVER use raw `<a>` tags**
- **ALWAYS use `UnstyledLink`** from `src/components/links/UnstyledLink.tsx` it handles internal/external links automatically.

## Common Development Tasks

### Adding New Blog Posts

1. Create MDX file in appropriate category: `YYYY-MM-DD.title.mdx`
2. Add frontmatter with title, image, excerpt
3. Content uses standard Markdown with MDX component support
4. Rebuild to regenerate static params

### Adding New Categories

1. Create directory with sort prefix: `NN.category-name/`
2. Add `_meta.json` with localized titles and optional icon
3. Add posts or subcategories within the directory
4. Rebuild to update navigation and static routes

### Styling New Components

1. Use Tailwind utilities for layout and basic styling
2. Add custom CSS to appropriate scope (globals.css vs blog.css)
3. Use CSS variables for theme-aware colors
4. Test in both light and dark themes

### Adding Animations

1. Define `@keyframes` in appropriate CSS file
2. Create `.animate-*` class with animation properties
3. Apply class to components via `className`
4. Test performance and accessibility

## Performance Considerations

### Static Generation

- All routes pre-generated at build time
- No runtime server dependencies
- Optimized for CDN deployment

### Bundle Optimization

- Dynamic icon imports reduce initial bundle size
- MDX content processed server-side
- Images optimized with Next.js Image component

### Build Optimization

- Tree-shaking removes unused code
- CSS purging removes unused styles
- Static analysis for route generation

## Troubleshooting

### Common Build Issues

- **CSS compilation errors**: Check Tailwind v4 syntax, avoid v3 patterns
- **Static param generation**: Ensure `generateStaticParams()` covers all routes
- **MDX processing**: Verify frontmatter format and content structure

### Animation Issues

- Use CSS classes, not CSS custom properties for Tailwind v4 compatibility
- Scope animations to appropriate CSS files (globals vs blog)
- Test animation performance across different devices

### Content Loading

- Verify `_meta.json` format and language support
- Check file naming conventions for posts and categories
- Debug with LoadFailure components for error visibility

## VS Code Configuration

### Extensions

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- MDX Language Support

### Workspace Settings

- Auto-formatting on save
- ESLint auto-fix on save
- TypeScript strict mode
- Path intellisense for `@/` aliases
