# iurii.net design system — conventions for the design agent

## What this is

`iurii.net` is not a component library that ships to `npm` — it's this personal
site's own `src/components/` tree, converted in place. Every component here is
a real, in-production React component from a Next.js (App Router) site, in
English and Ukrainian. There is no Storybook and no published package: import
everything the way the site itself does.

## 1. Wrapping and setup

Import components by name from the package, and always render inside the
theme provider — most components read `--bg`/`--text`/… custom properties
that only exist once the theme class (`light`/`dark`) is on an ancestor:

```jsx
import { ThemeProvider } from 'next-themes';
import { PostCard } from 'iurii.net';

<ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
  <PostCard lang='en' post={post} />
</ThemeProvider>
```

Every component takes an explicit `lang: 'en' | 'uk'` prop (or reads
already-localized strings/data passed in as props) — this site has no locale
context. Compose the Ukrainian variant by passing `lang='uk'` and (where the
component takes free-form copy, not just a `lang` flag) real Ukrainian text —
never leave a UK story showing English strings.

Components that need real content (`BlogFeed`, `PostCard`, `PostRow`,
`PostNavigation`, `Breadcrumbs`) expect the site's actual blog data shape —
`Post`/`LoadFailure` objects from `@/lib/blog/types`, not ad hoc props. Build
a small representative `Post` object (title, date, excerpt, tags, reading
time, an image path) rather than inventing new fields.

## 2. Styling idiom — tokens + a small class vocabulary, plus Tailwind

This is **not** a CSS-in-JS or a Tailwind-only design system. Layout and
component structure lean on Tailwind utility classes; color, type, and
recurring UI patterns (nav bar, hero, post list, card, prose, buttons) come
from a **hand-written class vocabulary in `src/styles/styles.css`**, driven by
CSS custom properties.

**Tokens** (`:root` for light, `html.dark` for dark — never hardcode a hex
value, always the variable):

- `--bg`, `--surface` — page background / raised surface
- `--text`, `--text-2`, `--muted` — primary / secondary / de-emphasized text
- `--rule`, `--rule-2` — hairline borders, two weights
- `--accent`, `--accent-ink`, `--accent-soft` — the teal accent, its ink
  (darker, for text-on-accent-adjacent contexts) and its low-opacity fill
- `--code-bg` — code block background

`@theme inline` aliases these into Tailwind utilities, so the same tokens are
reachable as classes: `bg-bg`, `text-text`, `text-text-2`, `text-muted`,
`border-rule`, `bg-code-bg`, `text-accent`, `text-accent-ink`. Prefer these
over Tailwind's default gray/slate/etc. palette — a `text-gray-500` or
`bg-white` in a composition is a tell that it isn't using this design system.

**The class vocabulary** (all defined in `src/styles/styles.css` — apply
these instead of re-deriving the look with utilities):

- `.wrap` — the page's max-width content column
- `.nav` — the top nav bar (logo, section links, lang switcher, theme toggle)
- `.hero` — the large title/photo block used on post and root pages
- `.section` — a labeled content section (`<h2>` + body)
- `.list` — the post-list rows layout (with a `.lead` variant for a
  featured/larger first row)
- `.card` — the visual-mode post card (thumbnail + title)
- `.prose` — long-form article typography (headings, lists, blockquotes,
  images) inside blog post bodies
- `.btn` — the filled/pill button (e.g. "Return home", "Connect on LinkedIn")
- `.seg` — a segmented two-option control (`LangSwitcher`'s EN/UK toggle)
- `.ibtn` — an icon-only button (the theme toggle's sun/moon)

A typical composition mixes both systems: `.card` for the component's own
look, Tailwind (`max-w-sm`, `grid`, `gap-4`) for the surrounding layout the
call site provides.

## 3. Where the truth lives

- `src/styles/styles.css` is the single source for every token and class
  above — when in doubt about a color or a class name, that file is
  authoritative, not this document.
- Each component's own doc, when one exists, is
  `components/<group>/<Name>/<Name>.prompt.md` in this bundle — it carries
  the extracted prop types and the authored story snippets. Reading a
  component's `.prompt.md` is the fastest way to see its real API and a
  working example side by side.
- Groups (`blog`, `root-page`, `layout`, `links`, `general`) mirror this
  repo's own `src/components/<group>/` directories, not an arbitrary
  taxonomy.

## 4. A worked example

`PostRow` (a single row in a post list — the `ListEntry` story, one of this
component's three graded variants). Note it takes the *summarized* blog shape
(`PostSummary` from `@/lib/blog/summary`), not the raw `Post` node:

```jsx
import { ThemeProvider } from 'next-themes';
import { PostRow } from 'iurii.net';

<ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
  <div className='list'>
    <PostRow
      lang='en'
      post={{
        slug: 'zero-downtime-schema-migrations',
        href: '/en/blog/posts/zero-downtime-schema-migrations',
        title: 'Zero-Downtime Schema Migrations in Postgres',
        excerpt:
          'A practical checklist for shipping backward-compatible column and index changes without a maintenance window.',
        image: '',
        date: new Date('2026-02-10'),
        readingTime: 5,
        contentLang: null,
      }}
    />
  </div>
</ThemeProvider>
```

Notice the row itself carries no visible background or border — `.list`
(applied by the parent, not `PostRow`) supplies the hairline dividers between
rows via `.list > a`. Compose `PostRow` inside a `.list` wrapper, not bare, to
see it as it actually renders in the product.
