# TODO

Items found during the whole-repository review that were out of scope to fix.

## Content

- **`llm-explains-llm` Ukrainian prose is out of date.** The English post and all shared widgets moved from the "Why is the sky blue?" example to `The Eiffel Tower is in` → ` Paris`, and Act 1 was restructured on the Transformer Explainer (sections renumbered, with a new MLP section). `index.uk.mdx` still has the old prose and old section numbers; it builds, because component props are unchanged, but its text no longer matches its figures. Translate it from the new `index.en.mdx`.
- **Missing translations.** `Vibe-Coding-2026-Uncensored` exists only as `index.uk.mdx`, and `en` is the fallback language, so English readers get Ukrainian content. `a-beginners-guide-to-fpv-drones` lost its `index.uk.mdx` on this branch. `How-to-transfer-10-EUR-reliably`, `A-Better-Programmer` Part 1 and Part 2, `OOP-considered-harmful`, and `Dr--Testflow` are English only.

## Behavior worth a look

- **Typography plugin is now live.** `@tailwindcss/typography` never loaded before, because Tailwind v4 ignores `tailwind.config.ts` without an `@config` directive. The directive is now in `src/styles/styles.css`, so every `prose` class in `BlogPost`, `TLDR`, and `Spoiler` produces real CSS for the first time. Post pages need a visual pass to confirm the new typography does not fight the hand-written heading and blockquote rules in `styles.css`.
- **Footer copyright year freezes at build time.** `new Date().getFullYear()` runs during the static export, so the year goes stale on 1 January until the next rebuild. Fine if the site is published at least yearly; otherwise drop the year or render it client-side.

## Code

- **`npm run build` warns `MODULE_TYPELESS_PACKAGE_JSON` for `tailwind.config.ts`.** Node reparses the config as an ES module on every build because `package.json` declares no `"type"`. Adding `"type": "module"` would silence it but changes how every `.js` config in the root (`next-sitemap.config.js`, `jest.config.js`, `.prettierrc.js`) is loaded; converting `tailwind.config.ts` to CommonJS syntax or renaming it `.mts` are the narrower options.
- **Load-failure diagnostics stay English.** The blog loader stores raw `Error` objects in `LoadFailure.err`, and `BlogLoadFailure` stringifies them into a `<pre>`. Messages such as `No localized posts found in <dir>` appear untranslated in the Ukrainian UI. Decide whether these are user-facing text or developer-only diagnostics, and mark them accordingly.
- **`MoERoutingDemo` couples two arrays by convention.** `ROUTER_SCORES` row length matches `moeStrings.expertHints` length only by agreement; a shorter hints array would render the string `undefined` inside an expert name. Tie them by construction or validate at module load.
- **`TableOfContents` scroll handler is O(headings) per scroll event.** It calls `getElementById` for every heading on every scroll and depends on a fixed 120px offset constant. An `IntersectionObserver` would be cheaper and would not need the magic offset.
- **Tailwind class sorting is not enabled.** `prettier-plugin-tailwindcss` was installed but never referenced in `.prettierrc.js`, so sorting never ran; the dead dependency was removed. Re-adding it is worthwhile but reorders every `className` in the repo, so it deserves its own commit.
- **`npm run lint` still calls `next lint`,** which Next.js 15 deprecates in favour of invoking ESLint directly. Consider folding it into `lint:strict`.

## No frontmatter convention for photo credit / quote attribution

The design's `.credit` (image credit) and `.who` (blockquote attribution)
classes exist in `src/styles/styles.css` but nothing in `_posts/` frontmatter
or the MDX component map feeds them — no post currently has photo-credit or
quote-attribution data. Needs a frontmatter convention (e.g. `imageCredit`,
or a quote component prop) before these can be used.

## `redirect()`/`permanentRedirect()` export an empty shell under `output: 'export'`

Verified in Next 15.5.12: under static export, `redirect()` and
`permanentRedirect()` do not perform a build-time redirect — they render an
empty `__next_error__` shell into the exported HTML, and the meta-refresh
mechanism they normally rely on never fires from that shell. `[...slug]`
category pages avoid the API entirely and render an explicit
`<meta httpEquiv='refresh'>` plus a visible fallback link instead. Worth an
upstream report, or revisiting if a real build-time redirect is ever needed
under `output: 'export'`.

## `new Blog()` re-walks `_posts` on every call, with no memoization

Every route that needs blog content constructs its own `new Blog()`, which
walks `_posts/` for both languages from scratch — 7 call sites today,
including three separate ones in `src/app/[lang]/blog/[...slug]/page.tsx`
(`BlogPage`, `generateStaticParams`, `generateMetadata`). A previous commit
deliberately removed a module-level singleton, so re-adding one isn't a
drop-in fix — a per-build cache needs its own design decision (e.g. scoped to
the static-export build process, not a long-lived server process).

## `?category=<slug>` links collide if two categories share a leaf slug

`TabNavigation` and `Blog.getLink` build category links from the leaf slug
only (`?category=<slug>`), not the full path. Content is one level deep
today, so this can't collide yet, but a nested category structure with two
categories sharing a leaf slug would send both tabs to the same panel.

## Static export can't pre-render the `?category=` selection

`output: 'export'` produces one static HTML file per route, so a category
permalink (`/blog/?category=foo`) always serves the same static shell with
the first category active; `BlogFeed`'s `useEffect` reads
`window.location.search` and switches panels client-side after hydration.
A non-JS client landing on such a link sees the first category, not `foo`.
The category links are plain `<a href="?category=…">` elements, so they
still work without JS, but each one reloads the same shell with the first
category active.

## Custom domain `iurii.net` is unverified on GitHub Pages

`gh api repos/aka-rider/aka-rider.github.io/pages` reports
`protected_domain_state: "unverified"` and `https_enforced: false`. Visitors
still get HTTPS because Cloudflare terminates TLS in front of Pages, but an
unverified custom domain can be claimed by another GitHub account if the DNS
record is ever left dangling. Verifying the domain (Settings -> Pages -> add
the `_github-pages-challenge-aka-rider` TXT record) also lets GitHub issue its
own certificate and enforce HTTPS at the origin.

## Two lockfiles, one of them unused

`pnpm-lock.yaml` and `pnpm-workspace.yaml` (with unfilled `allowBuilds`
placeholders) are committed alongside `package-lock.json`, while
`.github/workflows/deploy.yml` installs with `npm ci`. Whichever file is stale silently diverges from what CI actually
resolves. Pick one package manager and delete the other lockfile.

## `llm-explains-llm` ships both mobile and desktop SVGs for every responsive figure

`MatmulFigure.tsx` (two figures: plain matmul and attention matmul) and
`MLPFigure.tsx` render a `hidden sm:block` desktop SVG and a `sm:hidden`
mobile SVG side by side in the markup, switching via CSS only, so both go
into every page load whether or not they're shown. This is deliberate (it
keeps the figures working with no JS and avoids layout shift from a
JS-driven swap), but the duplication is not free.

Measured on the built `/en/blog/posts/the-lab/llm-explains-llm/` page
(`node -e` with `zlib.gzipSync`/`brotliCompressSync`, level 9 for gzip):
removing the three `sm:hidden` (mobile) SVG variants outright drops the page
from 630,706 → 530,378 raw bytes, 109,788 → 100,522 gzip bytes (−8.4%), and
60,201 → 56,751 brotli bytes (−5.7%). So the duplicate-variant tax is about
9.3 KB gzip / 3.5 KB brotli of a roughly 60 KB (brotli) page — real, but a
minority of the total.

The mobile and desktop variants aren't just rescaled — the mobile layout
re-flows a horizontal row-based layout into a stacked vertical one with
different font sizes and group spacing, so a single shared `viewBox` can't
serve both without a visual redesign of the affected figures. That redesign
is out of scope for an accessibility/perf touch-up. If the ~9 KB gzip is
worth chasing later, the concrete options are: (a) collapse the mobile and
desktop variants into one figure component whose internal coordinate math is
computed once and shared, rendering only one `<svg>` (still no-JS, still
zero layout shift, but a real rewrite of three components), or (b) accept
the duplication as the price of the current two very different layouts.
