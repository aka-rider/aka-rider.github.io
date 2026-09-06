# TODO

Items found during the whole-repository review that were out of scope to fix.

## Content

- **Missing translations.** `Vibe-Coding-2026-Uncensored` exists only as `index.uk.mdx`, and `en` is the fallback language, so English readers get Ukrainian content. `a-beginners-guide-to-fpv-drones` lost its `index.uk.mdx` on this branch. `How-to-transfer-10-EUR-reliably`, `A-Better-Programmer` Part 1 and Part 2, `OOP-considered-harmful`, and `Dr--Testflow` are English only.
- **Hotlinked hero images.** `A-Better-Programmer` Part 1 and Part 2 (Medium CDN), `OOP-considered-harmful` (Medium CDN, three images), and `Vibe-Coding-2026-Uncensored` uk (Wikimedia) load images from external hosts. They cannot be verified at build time and can rot or be blocked, while every other post self-hosts its assets. Download them into the post directories and reference them relatively.
- **Typographic quotes inside shell fences.** `Makefiles-for-Python-and-beyond` uses curly quotes in code that readers copy: line 197 (`find . -type f -name ‘*.pyc’ -delete`) and the traceback at lines 106-111 (`File “./app.py”`, `No module named ‘requests’`). Pasted into a real shell they fail. The equivalent Makefile at line 284 already uses straight quotes.

## Accessibility

- **Table of contents bottom sheet has no focus trap.** It now moves focus in, restores focus on close, and closes on Escape, but Tab from the last link still escapes to the page behind the backdrop. A complete trap, or a native `<dialog>`, would close this.

## Behavior worth a look

- **Typography plugin is now live.** `@tailwindcss/typography` never loaded before, because Tailwind v4 ignores `tailwind.config.ts` without an `@config` directive. The directive is now in `src/styles/styles.css`, so every `prose` class in `BlogPost`, `TLDR`, and `Spoiler` produces real CSS for the first time. Post pages need a visual pass to confirm the new typography does not fight the hand-written heading and blockquote rules in `styles.css`.
- **Footer copyright year freezes at build time.** `new Date().getFullYear()` runs during the static export, so the year goes stale on 1 January until the next rebuild. Fine if the site is published at least yearly; otherwise drop the year or render it client-side.

## Code

- **Load-failure diagnostics stay English.** The blog loader stores raw `Error` objects in `LoadFailure.err`, and `BlogLoadFailure` stringifies them into a `<pre>`. Messages such as `No localized posts found in <dir>` appear untranslated in the Ukrainian UI. Decide whether these are user-facing text or developer-only diagnostics, and mark them accordingly.
- **`Breadcrumbs` uses a `-1` sentinel.** The `activeIndex` prop encodes "none active" as `-1`, which needs prose to explain. Replace the sentinel with an explicit discriminated prop so the API explains itself.
- **`MoERoutingDemo` couples two arrays by convention.** `ROUTER_SCORES` row length matches `moeStrings.expertHints` length only by agreement; a shorter hints array would render the string `undefined` inside an expert name. Tie them by construction or validate at module load.
- **`TableOfContents` scroll handler is O(headings) per scroll event.** It calls `getElementById` for every heading on every scroll and depends on a fixed 120px offset constant. An `IntersectionObserver` would be cheaper and would not need the magic offset.
- **Tailwind class sorting is not enabled.** `prettier-plugin-tailwindcss` was installed but never referenced in `.prettierrc.js`, so sorting never ran; the dead dependency was removed. Re-adding it is worthwhile but reorders every `className` in the repo, so it deserves its own commit.
- **`npm run lint` still calls `next lint`,** which Next.js 15 deprecates in favour of invoking ESLint directly. Consider folding it into `lint:strict`.
- **`ToolCallDemo` transcript is English in both languages.** The user question, the thinking line, and the final answer now live in `strings/toolCall.ts`, but the `uk` values repeat the English text, because they represent model input and output shown verbatim. Translate them if Ukrainian readers should see a localized transcript.

## Found during the redesign rebase

- **The repo has two lockfiles.** `package-lock.json` (npm) is what `.github/workflows/deploy.yml` actually uses (`npm ci`), but `pnpm-lock.yaml`/`pnpm-workspace.yaml` also exist, seemingly from experimenting with pnpm locally — `pnpm-workspace.yaml` even has unfilled `allowBuilds` placeholders. Decide: migrate CI to pnpm, or delete the pnpm artifacts.

## `rehype-autolink-headings` injects empty anchors into headings

`mdx-config.mjs` runs `rehypeAutolinkHeadings` after `rehypeSlug`, which adds an
empty `<a>` (no visible text) inside every heading for the anchor link. Fine
for the anchor behavior itself, but worth revisiting the link content/behavior
(icon, `aria-label`, or a `::before` symbol) so it isn't a silent empty anchor
in the accessibility tree.

## Some posts contain their own `# h1` under the page `h1`

At least five posts in `_posts/` start their body with a first-level Markdown
heading, which then renders as a second, redundant `h1`/`.prose h2` below the
page's real `<h1>{title}</h1>`. Not fixed site-wide — would need either a
content sweep of the affected posts or a compile-time rule (e.g. demote a
leading `h1` in MDX content).

## No frontmatter convention for photo credit / quote attribution

The design's `.credit` (image credit) and `.who` (blockquote attribution)
classes exist in `src/styles/styles.css` but nothing in `_posts/` frontmatter
or the MDX component map feeds them — no post currently has photo-credit or
quote-attribution data. Needs a frontmatter convention (e.g. `imageCredit`,
or a quote component prop) before these can be used.

## `remark-i18n-links` hardcodes `en|uk`

`src/lib/remark-i18n-links.ts` matches language segments with a hardcoded
`en|uk` alternation instead of deriving it from `src/i18n/languages.ts`'s
`Languages` map. Adding a third language would silently break this plugin.

## `generateStaticParams` emits category/redirect-shell pages into the sitemap

`Blog`'s `generateStaticParams` walks every node (posts, categories, and
`LoadFailure` nodes) and emits a static page for each, including categories
that immediately redirect via `permanentRedirect()`. `next-sitemap` picks up
every emitted route, so the sitemap lists redirect-shell URLs alongside real
content pages.

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
Tabs are now `<Link>` elements, so keyboard/non-JS navigation between
categories works — only the direct permalink-to-category case is affected.

## Custom domain `iurii.net` is unverified on GitHub Pages

`gh api repos/aka-rider/aka-rider.github.io/pages` reports
`protected_domain_state: "unverified"` and `https_enforced: false`. Visitors
still get HTTPS because Cloudflare terminates TLS in front of Pages, but an
unverified custom domain can be claimed by another GitHub account if the DNS
record is ever left dangling. Verifying the domain (Settings -> Pages -> add
the `_github-pages-challenge-aka-rider` TXT record) also lets GitHub issue its
own certificate and enforce HTTPS at the origin.

## Two lockfiles, one of them unused

`pnpm-lock.yaml` and `pnpm-workspace.yaml` are committed alongside
`package-lock.json`, while `.github/workflows/deploy.yml` installs with
`npm ci`. Whichever file is stale silently diverges from what CI actually
resolves. Pick one package manager and delete the other lockfile.
