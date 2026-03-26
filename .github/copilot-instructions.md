# AI Coding Agent Instructions

## Agent Behavior

- **MCP Tools**: You have access to several Model Context Protocol (MCP) servers. Use them proactively:
  - **Context7 (`mcp_context7_*`)**: For code generation, configuration, and library/API documentation. Resolve library IDs and fetch docs without being asked.
  - **Serena (`mcp_oraios_serena_*`)**: For semantic code exploration, finding patterns, and navigating symbols instead of reading whole files. Use it to understand the architecture efficiently.
  - **MarkItDown (`mcp_markitdown_*`)**: For converting URLs, files, or data URIs to Markdown to read external web or local resources.
- Never assume — ask for clarification when intent is ambiguous.
- Progress iteratively in small steps, consulting the user at each step.
- Document WHY, never WHAT. No restating-the-obvious comments.
- Never add or remove dependencies by editing package.json directly, use `npm install` `npm uninstall` commands instead.
- Never store summary of your changes in markdown files, never write readme, architecture.md, quickstart.md, or any other documentation files unless explicitly asked to do so.

## Project Overview

- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Site Type**: Personal portfolio website with multilingual MDX blog system
- **Central Config**: `config.js` (CommonJS) at project root — defines `CNAME`, `SITE_URL`, `BLOG_POSTS_DIR`, `IS_PRODUCTION`, etc. Imported by `next.config.mjs`, blog loader, and components
- **Deployment**: Static export (`output: 'export'`), conditional `basePath` for GitHub Pages
- **Multi-language support**: No hardcoded text, all content is localized
- **Dark Mode**: `next-themes` with `ThemeProvider attribute='class'` + `@variant dark (.dark &)` in CSS
- **Comments**: Giscus (GitHub Discussions) on blog posts
- **RSS Feed**: `[lang]/feed.xml/route.ts` generates per-language Atom feeds

## Architecture Patterns

### App Router Structure

- **Dynamic Routes**: `[lang]` for internationalization, `[...slug]` for blog navigation
- **Layout Hierarchy**: Root layout (`app/layout.tsx` — dummy, imports CSS, generates lang params) → language layout (`[lang]/layout.tsx` — wraps in `Layout` component with `ThemeProvider`)
- **Static Generation**: All pages use `generateStaticParams()` for static export
- **Flat Route Structure**: `[lang]/page.tsx` (homepage), `[lang]/blog/` (blog listing + `[...slug]` for posts), `[lang]/feed.xml/` (RSS)

### Blog System Architecture

- **Content Location**: `_posts/` directory with nested category structure
- **File Structure**: `YYYY-MM-DD.title.mdx` or numbered prefixes `001.title/` meaning `${sortKey}.${slug}$`
- **Directories Hierarchy**: Directories are either categories (containing `_meta.json`) or posts (containing `index.mdx` or `index.${lang}.mdx`)
- **Categories Metadata**: `_meta.json` files define category titles (required), optional `thumbnails` flag
- **Content Loading**: `Blog` class (`src/lib/blog/Blog.ts`) with recursive directory parsing — use `new Blog()` to create a fresh instance
- **Internationalization**: Content fallback chain (lang-specific → default lang)
- **Symlinks**: `public/_posts → ../_posts` and `src/app/[lang]/blog/_posts → ../../../../_posts` — both are symlinks to the root `_posts/` directory, enabling Next.js static image serving from blog content

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
    "uk": "Назва категорії"
  },
  "thumbnails": true
}
```

Only `title` is required. Optional fields: `thumbnails` (boolean), `featuredPost` (slug string), `icon` (string).

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

### MDX Compilation Pipeline

- **Build-time**: `@next/mdx` plugin in `next.config.mjs` with shared remark/rehype plugins from `mdx-config.mjs`
- **Runtime (blog posts)**: `@mdx-js/mdx` `compile` + `run` in `src/components/blog/ServerMDX.tsx` (React Server Component)
- **Custom remark plugins**: `remark-i18n-links` (resolves internal links), `remark-image-paths` (resolves relative image paths)
- **Rehype plugins**: `rehype-slug`, `rehype-pretty-code` (dual theme: vitesse-dark/vitesse-light), `rehype-autolink-headings`
- **Custom MDX components**: `PrimaryLink` for `<a>`, `NextImage` for `<img>`, `TLDR`, `Spoiler`, custom `<hr>`

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

- **Common strings**: `src/i18n/index.ts` exports `common` dict — access as `common[lang].title`
- **Homepage content**: `src/i18n/root-page/` directory (`index.ts`, `foss.ts`, `services.ts`) — access as `rootPage[lang].about.name`
- **Pattern**: Direct dict access `i18n[lang].key`, no wrapper function
- **Language types**: `Lang` type and `Languages` class from `src/i18n/languages.ts`
- **Metadata**: Language-specific titles, descriptions, keywords in `common`

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
config.js                   # Central config (CommonJS): SITE_URL, BLOG_POSTS_DIR, etc.
mdx-config.mjs              # Shared remark/rehype plugin config
_posts/                     # Blog content (source of truth)
src/
├── app/
│   ├── layout.tsx          # Dummy root layout (imports CSS, generates lang params)
│   └── [lang]/
│       ├── layout.tsx      # Language layout (ThemeProvider, Layout component)
│       ├── page.tsx        # Homepage
│       ├── blog/
│       │   ├── page.tsx    # Blog listing
│       │   ├── [...slug]/  # Blog post/category pages
│       │   └── _posts      # → symlink to /_posts/
│       └── feed.xml/       # RSS feed route
├── components/
│   ├── layout/             # Layout, Nav
│   ├── links/              # UnstyledLink, PrimaryLink, etc.
│   ├── blog/               # BlogPost, BlogCategory, ServerMDX, Giscus, etc.
│   └── root-page/          # Homepage sections (About, BlogPreview, Foss, Services)
├── lib/
│   ├── blog/               # Blog.ts, loader.ts, types.ts
│   ├── remark-i18n-links.ts  # MDX plugin: resolves internal links
│   └── remark-image-paths.ts # MDX plugin: resolves image paths
├── styles/
│   └── styles.css          # Single CSS file (@import 'tailwindcss', @variant dark, animations)
└── i18n/
    ├── index.ts            # common translations dict
    ├── languages.ts        # Lang type, Languages class
    └── root-page/          # Homepage i18n (index.ts, foss.ts, services.ts)
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
2. Add custom CSS to `src/styles/styles.css` (single CSS file for the whole project)
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
