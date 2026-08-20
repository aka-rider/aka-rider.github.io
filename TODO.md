# TODO

Items found during the whole-repository review that were out of scope to fix.

## Content

- **Missing translations.** `Vibe-Coding-2026-Uncensored` exists only as `index.uk.mdx`, and `en` is the fallback language, so English readers get Ukrainian content. `a-beginners-guide-to-fpv-drones` lost its `index.uk.mdx` on this branch. `How-to-transfer-10-EUR-reliably`, `A-Better-Programmer` Part 1 and Part 2, `OOP-considered-harmful`, and `Dr--Testflow` are English only.
- **Hotlinked hero images.** `A-Better-Programmer` Part 1 and Part 2 (Medium CDN), `OOP-considered-harmful` (Medium CDN, three images), and `Vibe-Coding-2026-Uncensored` uk (Wikimedia) load images from external hosts. They cannot be verified at build time and can rot or be blocked, while every other post self-hosts its assets. Download them into the post directories and reference them relatively.

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
