# design-sync notes — iurii.net

## Environment

- **NixOS.** A playwright-downloaded chromium binary will not run here
  (missing dynamic linker paths the nix store doesn't provide). Render
  checks use the system chromium at `/run/current-system/sw/bin/chromium`
  instead: `~/.cache/ms-playwright/chromium-1234/chrome-linux/chrome` and
  `~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-linux/headless_shell`
  are symlinks to that binary (`1234` is the build pinned by
  `.ds-sync/node_modules/playwright-core/browsers.json` for the installed
  `playwright` version — re-verify the number on a version bump). This is
  machine state, not committed; recreate the symlinks on a fresh clone
  before the first render check.

## Source shape

- No `dist/` — the repo IS the site, not a publishable package. The
  converter synthesizes its entry from `src/components/` (`cfg.srcDir`).
- `cfg.entry` is set to a **decoy path**
  (`.design-sync/.pkg-dir-anchor.js`) that never exists on disk. This is
  not the real entry — its only job is to make `package-build.mjs`'s
  `PKG_DIR` walk-up land on the repo root's `package.json` (name
  `iurii.net`) instead of looking for a nonexistent
  `node_modules/iurii.net`. `resolveDistEntry`'s `soft: true` path then
  falls through to synth-entry exactly as if no `--entry` were given.

## Next.js runtime shims (`.design-sync/shims/`, wired via `cfg.tsconfig` paths)

- `next-link.tsx`, `next-image.tsx`, `next-navigation.ts`, `next-script.tsx`,
  `next-font-google.ts` — browser-friendly stand-ins for Next-only modules.
- `theme-provider.ts` — re-exports the real `ThemeProvider` from the
  repo's actual `next-themes` dependency (not a stand-in); wired via
  `cfg.provider` + `cfg.extraEntries` so previews needing theme context
  don't render blank.
- Node builtin shims: `node-fs.ts` (every call throws ENOENT — there is no
  filesystem in a browser preview; `src/lib/blog/loader.ts`'s own
  try/catch already treats ENOENT as "no data" and degrades gracefully),
  `node-path.ts` (real minimal POSIX path implementation — its functions
  ARE called with real logic before the fs calls fail), `node-stream.ts`
  and `node-util.ts` (minimal stand-ins for `reading-time`'s unconditional
  `require('stream')`/`require('util')` in its unused streaming variant).
  These make `@/lib/blog/*`, `/config`-consuming components, and the
  `reading-time` dependency chain bundle for the browser at all.
- `tsconfig.json` also pins `"@/i18n"` to the literal
  `./src/i18n/index.ts` file, ahead of the `"@/*"` wildcard: the
  converter's own `tsconfigPathsPlugin` tries extension-less existence
  checks before appending `/index.ts`, so a bare `@/i18n` (a directory)
  resolved to the directory itself and esbuild refused to read it as a
  file. This is a real upstream plugin quirk (`lib/bundle.mjs`, off-limits
  to fork) — worked around by pinning the exact specifier.

## Styling

- Tailwind v4 compiled via `cfg.buildCmd` into
  `.design-sync/.cache/compiled.css` (~66 KB, gitignored — regenerate
  with the buildCmd, don't hand-edit). `cfg.buildCmd`/`cfg.cssEntry` now
  point at `.design-sync/tailwind-entry.css`, not `src/styles/styles.css`
  directly — see "Primary color scale" and "Fonts" below for why.
- Fonts are Google-hosted: `.design-sync/fonts.css` is a remote
  `@import url(fonts.googleapis.com/...)` for the redesign's three
  families — Atkinson Hyperlegible Next, Wix Madefor Text, JetBrains
  Mono — plus the `--f-en`/`--f-uk`/`--mono` custom properties the real
  `src/styles/styles.css` expects (set at runtime by `next/font` in the
  real app via `src/lib/fonts.ts`'s `fontClassName` on `<html>`; the shim
  in `next-font-google.ts` returns empty tokens, so these vars are what
  actually apply the fonts in previews). It's wired in via
  `tailwind-entry.css`. Validate reports `[FONT_REMOTE]` for this —
  informational, no action needed.

## `.design-sync/overrides/source-kit.mjs` fork (declared in `cfg.libOverrides`)

Two upstream defects in synth-entry mode, both only reachable when there's
no `dist`/`.d.ts` — i.e. exactly this repo's shape:

1. `if (!components.length && synthEntry)` short-circuits full src
   derivation the moment `cfg.componentSrcMap` seeds even one name — any
   other components would never be discovered. Fixed to always merge
   full derivation in synth mode. (The original trigger for this bug was
   an `IconLink` disambiguation pin in `cfg.componentSrcMap`, needed
   while `src/components/IconLink.tsx` and
   `src/components/links/IconLink.tsx` both existed and collided on the
   same default-exported name; both files are gone from `src/` now, and
   `cfg.componentSrcMap` no longer pins `IconLink` — the fix itself
   stays, since a future single-name entry could retrigger the same
   upstream gate.)
2. The synth entry was written as `export * from <file>` for every
   candidate file. `export *` never re-exports a **default** export (ES
   module semantics) — and this repo's components are almost all
   `export default function Name() {}` (idiomatic Next.js/React). Fixed
   to resolve each component through a runtime-probed
   `import * as ns from <file>; export const Name = ns.default ?? ns.Name;`,
   which works regardless of which export style a given file uses. Also
   drops any `componentSrcMap: null`-excluded file from the blanket
   `export *` fallback, and injects one `globalThis.process` polyfill
   line into the generated entry (see below) — module evaluation order
   guarantees it runs before any React render, regardless of where it
   sits relative to the imports.

## Excluded components (`componentSrcMap: null`)

Neither exclusion below applies anymore — both files are gone from
`src/components` entirely after the redesign, so `cfg.componentSrcMap` no
longer nulls them out. Kept as history in case a similar component
reappears:

- **`ServerMDX`** (removed; MDX compilation now lives in
  `src/lib/blog/compile.tsx`, outside `srcDir`) — was an `async function`
  component (React Server Component only; cannot render as a plain client
  component at all) that pulled `@mdx-js/mdx` + the full
  `rehype-pretty-code`/shiki grammar set transitively. Bundled anyway (all
  its node-builtin imports resolved fine via the shims above), but it
  alone added ~20 MB to the single shared IIFE bundle. Genuinely couldn't
  render statically either way (async component) — pure cost, no
  benefit.
- **`BlogIcon`** (deleted entirely — no longer used since the redesign
  switched to a fixed, per-component `react-icons` import) — implemented
  a lazy icon-set loader:
  `Fa/Pi/Si/Md/Bi/Hi/Tb/Lu/Go: () => import('react-icons/<set>').then(...)`.
  In the real Next.js app, webpack/turbopack code-splits each branch into
  its own chunk, loaded only when that icon prefix is actually used. This
  converter emits a single IIFE with no code-splitting support, so esbuild
  inlined **all nine** full react-icons subset barrels synchronously —
  observed ~20 MB just from this one component (`pi`/`si`/`tb` alone were
  6+5+3.7 MB). Fundamentally incompatible with a single-bundle preview
  target.
- Excluding both dropped the bundle from **31.6 MB to 11.2 MB** at the
  time (upload cap is 12 MB) — worth re-checking bundle size on the next
  full re-sync now that both files are gone outright rather than merely
  excluded.

Note: components that only *reference* `@/lib/blog` (data types, or the
`Blog` class whose constructor reads the filesystem) were **not**
excluded — `Blog.ts`/`loader.ts` bundle fine through the fs/path shims and
degrade to "no posts found" gracefully at render time (an fs shim that
always throws ENOENT is the semantically correct behavior for a
filesystem-less browser preview). This is why `BlogFeed`, `PostNavigation`,
and `Breadcrumbs` all have props-driven previews now (they take the blog
data as plain props rather than reading `Blog` themselves) rather than
relying on that fallback.

## Known render warns (validate exit 0, non-blocking, post-authoring)

**Stale — recorded against the pre-redesign component set, not re-verified
since.** The redesign (WP1–WP5) deleted many of the components this section
discusses and changed the props of most of the rest; the counts and per-
component claims below describe an actual `validate`/`capture` run that
predates all of that. Treat this section as historical until the next
`resync.mjs --remote` run (WP7) regenerates it against the current
`src/components` tree and its own real `.render-check.json`/`validate`
output — don't assume any specific number or bullet still holds. Two
corrections already known to be wrong purely from reading the current
source (not from re-running anything):

- The `BlogPreview` bullet below describes a crash (`getRoot` returning a
  `LoadFailure` that the component `as Category`-casts and calls
  `.getCategories()` on) that no longer exists —
  `src/components/root-page/BlogPreview.tsx` now checks `root.type` before
  calling any `Category`-only method. The TODO.md item this bullet cited
  has been removed for the same reason.
- The `LangSwitcher` bullet below describes it rendering "a native
  `<select>`"; the redesigned `LangSwitcher` renders a `div.seg` of two
  `Link`s (EN/UK), not a `<select>` — that specific false-positive
  explanation no longer applies, though the component may still warrant a
  fresh look at capture time.

- **`Analytics`** — floor card, not authored. Renders a shimmed-to-null
  `<Script>` plus a `<noscript><img>` tracking pixel; nothing visual exists
  to compose a preview around, and any attempt would be a lookalike box
  faking a component that's intentionally invisible.
- **`Giscus`** — floor card, not authored. Script-injecting third-party
  widget (`giscus.app`); cannot render statically, per campaign instruction
  to skip it.
- **`BlogPost`** — floor card (preview deleted; see below). `export default
  async function BlogPost(...)` is a React Server Component — an async
  function component, which cannot run as a plain client component in this
  converter's single-bundle-no-RSC-boundary model. Throws `Error: An
  unknown Component is an async Client Component...` on render. Not
  fixable from a preview `.tsx`; revisit only if the converter ever gains
  an RSC boundary.
- **`BlogPreview`** — floor card (preview deleted; see below). Real,
  pre-existing site bug, independent of design-sync: `BlogPreview.tsx` does
  `blog.getRoot(lang) as Category` (unsafe cast) and then calls
  `rootCategory?.getCategories()`; when the fs shim's always-ENOENT
  filesystem makes `Blog()` fail to load, `getRoot` actually returns a
  `LoadFailure`, which has no `getCategories`, so it throws `TypeError:
  rootCategory?.getCategories is not a function` and the cell renders fully
  blank (no `Section` wrapper, no fallback text). Filed in TODO.md. A real
  fix touches `src/components/root-page/BlogPreview.tsx` (out of scope for
  design-sync).
- **`About`** — authored but graded `needs-work` on both cells, not a
  floor card. `About.tsx` calls `next/image` with a hardcoded
  `src='/images/iurii-avatar.webp'`; no prop exists to redirect it, and
  `ds-bundle/` ships no `/images/*` assets, so the portrait always 404s.
  Everything else in both cells (subhead, proofs list, gradient CTA,
  LinkedIn button) renders correctly. Not fixable without adding an
  `image`/`src` prop to `About` in `src/` (out of scope).

Any `[RENDER_BLANK]`/`[RENDER_THIN]` other than the four floor-card
components above, or any warn on a component other than `About`, is new and
should be investigated, not waved through.

One more accepted warn, confirmed benign by eye:

- **`LangSwitcher`** — `[RENDER_THIN]` `variantsIdentical: true`. The
  component renders as a native `<select>`; validate's text-scan reads all
  `<option>` text in the DOM regardless of which one is selected, so
  `English`/`Ukrainian` come out textually identical even though the
  screenshot shows a different selected value (`ENG` vs `УКР`) per export.
  False positive in the check, not a broken preview.

## User directives for this campaign (recorded for the next agent)

- Include **everything** — don't narrow scope beyond what's fundamentally
  unbundleable (see exclusions above).
- Author previews for **all** 47 components (§4.2 of the design-sync
  SKILL), not just a core subset.
- Fan out Sonnet subagents for the authoring wave, after a solo
  calibration pass (one simple / one compound / one text-heavy
  component) per the SKILL's "solo first, then fan out" rule.
- Run one adversarial review pass with Opus 5 before close-out (after
  previews are authored and graded, before the upload gate).
- The authoring wave (fanned out across six parallel waves, a-f) has since
  run to completion — see "Authoring wave learnings" and "Known render
  warns" above for what it found.

## Solo authoring pass — Card, Button, BlogPostPreview

- **Preview import form**: `import { Card } from 'iurii.net'` (named
  import, package name from `cfg.pkg`) — confirmed via `preview-rebuild.mjs`
  (`PKG = manifest.pkg ?? cfg.pkg`) and `story-imports.mjs`. Same for
  `Button`/`BlogPostPreview`. Types (`Post`, `LoadFailure`) come straight
  from `@/lib/blog/types`, which resolves fine through the tsconfig paths
  plugin.
- **`Post`/`LoadFailure` data shapes**: `Post` needs the full
  `NodeProperties` shape (`slug`, `title`, `filePath`, `children: []`,
  `childrenBySlug: {}`) plus `image`, `excerpt`, `content`, `date`, `tags`,
  `readingTime`, `featured`. `filePath`'s extension drives the
  lang-mismatch indicator (`/\.(\w+)\.(mdx|md)$/` — use `.en.mdx` for
  `lang='en'`). `LoadFailure` needs `type: 'LoadFailure'`, the same base,
  and `err` (a real `Error`, since `BlogLoadFailure` calls `.toString()`
  on it). `BlogPostPreview` branches on `post.type`, not a separate prop.
- **Gotcha — `Card`/`BlogPostPreview` titles render as `h3`/`h4`**: only
  `h1`/`h2` in `src/styles/styles.css` get `font-family:
  var(--font-header)` (Merriweather); `h3`/`h4` inherit the sans body
  font. Sans-serif card/post titles in screenshots are correct, not a
  font-pipeline failure.
- **`primary-*` Tailwind utilities were undefined** — historical, resolved
  by the redesign. `Button`, `IconLink`, `TextButton`, `IconButton`,
  `ButtonLink`, `PrimaryLink`, and `BlogPostPreview` (the components that
  used `primary-*`) are all deleted from `src/components` now; the
  redesign's real accent tokens (`--color-accent`, `--color-accent-ink`,
  `--color-accent-soft`) replace them everywhere. The TODO.md entry that
  originally flagged this has been removed, and the `--color-primary-*`
  alias block once carried in `.design-sync/tailwind-entry.css` for
  preview-only workaround purposes has been removed along with it — see
  "Primary color scale" below.

## Primary color scale (`.design-sync/tailwind-entry.css`) — removed

- `.design-sync/tailwind-entry.css` used to add an `@theme` block
  aliasing `--color-primary-50` through `--color-primary-950` to the
  matching `--color-sky-*` step, worked around a real (now-fixed)
  `src/` bug where `primary-*` Tailwind utilities had no backing color
  scale. `grep -rn "primary-" src` now returns nothing, so the alias
  block has been dropped; `tailwind-entry.css` today only chains
  `fonts.css` and the real `src/styles/styles.css`.
- Direct invocation note (still applies to `cfg.buildCmd` generally): the
  documented `npx --prefix .ds-sync
  @tailwindcss/cli ...` form does not resolve in this sandbox (`tailwindcss:
  command not found` — npx's bin-name heuristic doesn't map the scoped
  package `@tailwindcss/cli` to its `tailwindcss` bin here). Two working
  equivalents: `npx --prefix .ds-sync tailwindcss ...` (bin name instead
  of package name), or the direct binary
  `./.ds-sync/node_modules/.bin/tailwindcss ...`. `cfg.buildCmd` is kept
  as the documented form since it's an operator-run reference command
  (nothing in `package-build.mjs` invokes it automatically) — re-check
  this on a future npx/npm bump.

## Fonts — were never actually wired into the bundle (fixed)

- `cfg.tokensGlob` pointing at `.design-sync/fonts.css` was **dead
  config**: `copyTokens()` in `.ds-sync/lib/css.mjs` only acts when
  `cfg.tokensPkg` names an npm package under `node_modules` — `tokensGlob`
  alone, with no matching package, silently no-ops. `fonts.css` never
  reached `ds-bundle/` at all (confirmed: `ds-bundle/tokens/` and
  `ds-bundle/fonts/` were both empty after a full rebuild). The
  `[FONT_REMOTE]` line in `package-validate.mjs`'s prior runs was a false
  negative, not a confirmation: with the font custom properties never
  defined, `var(...)` in the compiled CSS resolves to nothing, so
  validate's `--font-*`-style custom-property scan found no *named*
  family to flag as missing (empty string post-`var()`-resolution gets
  filtered before the check). Net effect: every preview rendered
  headings/body in the browser's default system font, invisibly.
- **Fix**: removed the dead `cfg.tokensGlob` key from `config.json`.
  `.design-sync/tailwind-entry.css` starts with `@import './fonts.css';`
  before `@import '../src/styles/styles.css';`. `fonts.css`'s own first
  line is the remote `@import url(fonts.googleapis.com/...)`, followed by
  a `:root` rule setting the real font custom properties
  `src/styles/styles.css` expects. Tailwind's CLI inlines local
  `@import`s but leaves the external Google Fonts `@import` as a literal,
  still-first rule in the compiled output (verified: `head -c` of
  `.design-sync/.cache/compiled.css` shows it as line 2, right after the
  tailwindcss version banner comment — comments don't count against
  `@import`-must-be-first). The `:root` font vars are unlayered, so they
  win the cascade over `styles.css`'s own `@theme inline`-generated
  self-references regardless of source order.
- **Redesign update (post-WP5, not re-verified with a live render)**: the
  site rebrand changed both the font families and the custom-property
  names the real app sets on `<html>` — `src/lib/fonts.ts` now sources
  `--f-en` (Atkinson Hyperlegible Next), `--f-uk` (Wix Madefor Text), and
  `--mono` (JetBrains Mono) via `next/font/google`, replacing the old
  `--font-header`/`--font-body`/`--font-mono` (Merriweather/Manrope/
  JetBrains Mono) trio. `.design-sync/fonts.css` has been updated to
  import the three new families and define `--f-en`/`--f-uk`/`--mono`
  under `:root` accordingly; the import-ordering mechanism above is
  unchanged and should still apply, but the Playwright verification that
  originally confirmed fonts actually load (computed style +
  `document.fonts` checks) was done against the old family names and has
  not been re-run against these — re-verify at the next capture/resync
  (WP7) rather than assuming it still holds.
- Downloading woff2 files into `.design-sync/fonts/` (the config's other
  suggested option) was not needed — the remote Google Fonts `@import`
  approach works fine once positioned correctly, and matches what the
  real app's `next/font` + Google-hosted fonts already do.
- Previously observed one flaky `package-validate.mjs` run with a handful
  of unrelated `[RENDER]` timeouts that cleared on an immediate re-run
  with no code changes — every render page does a live fetch to
  `fonts.googleapis.com`/`fonts.gstatic.com`, and a full render check can
  occasionally outrace the per-page `networkidle` timeout under that
  added network load. Re-run validate once on a timeout before treating
  it as a real regression.

## Authoring wave learnings (folded from `.design-sync/learnings/wave-*.md`)

- **`Card`/`BlogPostPreview`/`TLDR` titles render sans-serif, not a font bug**:
  only `h1`/`h2` in `src/styles/styles.css` get `font-family:
  var(--font-header)` (Merriweather) — `h3`/`h4` inherit the sans body font
  (Manrope). Any card/post/TLDR title screenshot showing sans-serif text is
  correct.
- **Stale `compiled.css` breaks size utilities asymmetrically, not just
  invisibly**: `.design-sync/.cache/compiled.css` is a static snapshot
  (`cfg.buildCmd`, not re-run by `preview-rebuild.mjs`/`package-capture.mjs`)
  containing only classes literally present in `src/` or already-authored
  previews at the time it was generated. A missing utility doesn't just no-op
  — a half-missing size pair (e.g. `h-24` present, `w-24` absent) leaves one
  axis constrained and the other falling back to intrinsic SVG size, reading
  as a garbled/oversized image rather than an obvious CSS miss (hit on
  `Avatar`, which has no real `src/` caller to borrow compiled classes from).
  Always grep `compiled.css` for a genuinely novel size class before trusting
  its screenshot; recompile Tailwind (step below) whenever new previews
  introduce classes no real `src/` usage already exercises.
- **`TableOfContents`'s `fixed` elements anchor to the capture wrapper, not
  the viewport**: `.ds-sync/lib/emit.mjs` wraps every single-story render in
  `transform: translateZ(0)`, which becomes the CSS containing block for
  `position: fixed` descendants. So `bottom-6`/`inset-0` resolve against the
  wrapper's full content height, not the capture viewport — a tall story
  pushes a `fixed` FAB off-screen even though it renders correctly. Keep
  composed stories short enough that `fixed`-positioned elements land inside
  the captured frame. Also, capture viewport is 900px wide, below Tailwind's
  `xl` (1280px) breakpoint — TableOfContents' desktop sticky-sidebar variant
  is unreachable at this capture size; only the mobile FAB/bottom-sheet
  variant can ever be photographed here.
- **`MDXContent`'s eval path expects `jsxDEV`, not `jsx`/`jsxs`**:
  `next-mdx-remote`'s `<MDXRemote>` evals `compiledSource` via `new
  Function(...)`. Since this bundle's `process.env.NODE_ENV` is unset,
  `next-mdx-remote/dist/jsx-runtime.cjs` resolves to `react/jsx-dev-runtime`,
  which exports only `jsxDEV`/`Fragment`. A hand-built `compiledSource` string
  must target that contract (not `jsx`/`jsxs`) to run through the real eval
  path.
- **`Avatar` has a same-file precedent trick for missing sizes**: no real
  caller exists to copy a working size class from, but `Card.tsx`'s own
  placeholder box already uses `h-16 w-16`, and `h-12 w-12` was already
  compiled elsewhere — reusing already-compiled pairs sidesteps the
  stale-CSS trap above without waiting for a recompile.
- **`About`'s portrait is unshippable, not a props problem**: `About.tsx`
  calls `next/image` with a hardcoded `src='/images/iurii-avatar.webp'` — no
  `image`/`src` prop exists to redirect it, and `ds-bundle/` ships no
  `/images/*` assets, so the shim `<img>` 404s regardless of preview props.
  Not fixable without adding a prop to `About` in `src/` (out of scope).
- **`Social` has no default layout — the real call site always supplies
  one**: its root is a bare `<div className={className}>` with no default
  flex/gap, so an unstyled preview renders a vertically stacked column
  (true behavior, not a bug). The one real caller
  (`src/components/layout/Footer.tsx`) always passes `className='flex
  gap-4'` — previews should pass an equivalent className to reflect real
  usage.
- **`TypingText`'s `typingSpeed` is a total-duration knob, not a per-char
  one**: interval = `typingSpeed * 1000 / text.length`. The capture harness
  only fixes `Date.now`, it doesn't install fake timers, so `setTimeout`
  animation still runs on real wall-clock time bounded by `networkidle` +
  the `settle()` wait (well under a second). A too-large `typingSpeed`
  freezes the animation at zero characters typed, not mid-string as one
  might expect — tune it to finish comfortably inside that real-time window.
- **`NextImage`'s data-URI skeleton state can't be captured**: the capture
  harness's `settle()` step decodes all images before screenshotting, so an
  instantly-loading data-URI's `onLoad` has already fired by capture time —
  a `useSkeleton` cell will always show the loaded state, never the pulsing
  skeleton. Inherent to static capture on a synchronous image source, not a
  preview defect. Separately: SVG data URIs must not be pre-encoded before
  `encodeURIComponent` — write real `#` in the source and let
  `encodeURIComponent` escape it once, or `%23` becomes `%2523` and colors
  fail to parse (renders solid black).
- **`Spoiler` has no way to force its expanded state**: `<details>` is
  hardcoded with no `open`/`defaultOpen` prop and no prop-spreading onto the
  element, so only the collapsed state is reachable from preview props —
  same category as Card/Button hover states.
- **`CodeBlock` has no live syntax highlighter reachable from a browser
  preview**: it's a thin wrapper expecting real `rehype-pretty-code` output
  as `children`; previews must hand-write a `<pre><code>` tree with
  per-token `<span style={{color}}>` wrappers approximating the
  `vitesse-light` shiki theme. Its copy-button/language-badge overlay is
  `opacity-0 group-hover:opacity-100` — invisible in any static screenshot
  by design, not a miss.



- The `entry` decoy path and the `[UNRESOLVED... node-builtin]` shims are
  config/tsconfig-level workarounds for real gaps in the converter's
  synth-entry mode (no dist/no `.d.ts`) — if a future design-sync version
  fixes default-export re-exporting or the `componentSrcMap`
  short-circuit natively, re-check whether `.design-sync/overrides/source-kit.mjs`
  is still needed before blindly re-copying it forward.
- The Google Fonts `@import` in `fonts.css` is a live network fetch at
  preview-render time — if fonts.googleapis.com is unreachable from the
  render environment, previews fall back to system fonts silently (no
  build error).
- `chromium-1234`/`chromium_headless_shell-1234` symlinks are keyed to the
  playwright version currently in `.ds-sync/node_modules` — bumping that
  dependency changes the pinned build number; recreate the symlink at the
  new number or the render check will fail with
  "Executable doesn't exist".
- The bundle is exactly under the 12 MB cap (11.2 MB) with two components
  excluded — adding new components with heavy dependencies (another
  syntax highlighter, another dynamic icon loader) could push it back
  over; re-check `_ds_bundle.js` size after any future component add.
- All 47 components have an authored preview now, except `Analytics` and
  `Giscus` (intentionally skipped) and `BlogPost`/`BlogPreview` (authored
  then deleted — see "Known render warns"), which ship the floor card by
  design.
