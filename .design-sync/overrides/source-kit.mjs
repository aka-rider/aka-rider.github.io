// forked from design-sync lib/source-kit.mjs — two fixes for synth-entry
// mode (no dist, no .d.ts) on a repo whose components are `export default
// function Name() {}` (the idiomatic Next.js/React pattern):
// 1. Upstream's `if (!components.length && synthEntry)` short-circuits full
//    src derivation entirely once cfg.componentSrcMap seeds one name (e.g.
//    the IconLink filename-collision pin, which disambiguates, not
//    enumerates) — always merge full derivation in synth mode instead.
// 2. Upstream writes the synth entry as `export * from <file>` for every
//    candidate file — this NEVER re-exports a default export (ES module
//    semantics), so components written as `export default function Name()`
//    never reach `window.<GLOBAL>`. Write explicit
//    `export { default as Name } from <srcPath>` per discovered component
//    (falling back to the blanket `export *` for named-export files) once
//    src-enrichment has resolved each component's real file.

import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { Project, Node, ts } from 'ts-morph';
import {
  leadingJsdoc,
  readText,
  slash,
  walk,
} from '../../.ds-sync/lib/common.mjs';
import { resolveDistEntry } from '../../.ds-sync/lib/bundle.mjs';
import { exportedNames, isComponentName } from '../../.ds-sync/lib/dts.mjs';

const NON_IMPL_RX = /\.(stories|test|spec)\./;
const SRC_IMPL_RX = /\.(tsx|jsx)$/;
const GENERIC_DIR = new Set([
  'components',
  'component',
  'src',
  'lib',
  'ui',
  'packages',
  'react',
]);
const slug = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general';

function deriveComponentsFromSrc(srcFiles) {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      allowJs: true,
      skipLibCheck: true,
    },
  });
  const seen = new Set();
  for (const p of srcFiles) {
    if (NON_IMPL_RX.test(p) || !SRC_IMPL_RX.test(p)) continue;
    const sf = project.addSourceFileAtPathIfExists(p);
    if (!sf) continue;
    for (const [name, decls] of sf.getExportedDeclarations()) {
      const real =
        name === 'default'
          ? decls.map((d) => d.getName?.()).find((n) => n && n !== 'default')
          : name;
      if (!real || !/^[A-Z][A-Za-z0-9]*$/.test(real)) continue;
      if (
        decls.some(
          (d) =>
            Node.isVariableDeclaration(d) ||
            Node.isFunctionDeclaration(d) ||
            Node.isClassDeclaration(d),
        )
      ) {
        seen.add(real);
      }
    }
  }
  return [...seen].sort().map((name) => ({ name, group: 'general' }));
}

export async function resolvePackage(ctx) {
  const { PKG_DIR, pkgJson, ENTRY_OVERRIDE, PKG, OUT, cfg } = ctx;
  const srcMap = cfg.componentSrcMap ?? {};

  const srcRoot = [cfg.srcDir, 'src', 'lib', 'components']
    .map((d) => d && resolve(PKG_DIR, d))
    .find((d) => d && existsSync(d));
  const srcFiles = srcRoot
    ? walk(srcRoot, (n) => /\.(tsx|jsx|mdx?)$/.test(n))
    : [];

  let entry = resolveDistEntry({
    pkgDir: PKG_DIR,
    pkgJson,
    override: ENTRY_OVERRIDE,
    pkgName: PKG,
    soft: true,
  });
  let synthEntry = false;
  let comps = [];
  if (!entry) {
    if (!srcRoot) {
      console.error(
        `[NO_DIST] ${PKG} has no built entry and no src/ to synthesize from — run its build.`,
      );
      process.exit(1);
    }
    comps = srcFiles.filter((p) => SRC_IMPL_RX.test(p) && !NON_IMPL_RX.test(p));
    entry = join(OUT, '.pkg-entry.mjs');
    synthEntry = true;
    console.error(
      `[NO_DIST] no built entry — synthesizing from ${comps.length} src files (run the package's build for best results)`,
    );
  }

  const exported = exportedNames(PKG_DIR, pkgJson);
  const names = new Set([...exported].filter(isComponentName));
  for (const [k, v] of Object.entries(srcMap)) {
    if (v === null) {
      names.delete(k);
      continue;
    }
    if (!/^[A-Z][A-Za-z0-9]*$/.test(k)) {
      console.error(
        `[CONFIG] componentSrcMap: "${k}" is not a valid component name (PascalCase identifiers only)`,
      );
      continue;
    }
    names.add(k);
  }
  let components = [...names]
    .sort()
    .map((name) => ({ name, group: 'general' }));
  // [OVERRIDE] fork of the upstream `if (!components.length && synthEntry)`
  // gate: always merge full src-derived components in synth mode, so a
  // componentSrcMap pin (disambiguation, not enumeration) never suppresses
  // discovery of the rest of the package.
  if (synthEntry) {
    const derived = deriveComponentsFromSrc(srcFiles).filter(
      (c) => srcMap[c.name] !== null,
    );
    const existingNames = new Set(components.map((c) => c.name));
    for (const d of derived) {
      if (!existingNames.has(d.name)) {
        components.push(d);
        existingNames.add(d.name);
      }
    }
    components.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (!components.length) {
    if (cfg.cssEntry || existsSync(join(PKG_DIR, 'styles.css'))) {
      console.error(
        '[ZERO_MATCH] no component exports — treating as tokens-only DS',
      );
      return { shape: 'package', entry, components: [], tokensOnly: true };
    }
    console.error(
      `[ZERO_MATCH] no PascalCase exports in ${PKG} and no styles — nothing to sync`,
    );
    process.exit(1);
  }

  const fuzzyFind = (name) => {
    const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
    const nameRx = new RegExp(
      `(?:^|/)(?:${name}/(?:index|${name})\\.(tsx|jsx)|(?:${name}|${kebab})\\.(tsx|jsx))$`,
      'i',
    );
    const hits = srcFiles
      .filter((p) => nameRx.test(p) && !NON_IMPL_RX.test(p))
      .sort(
        (a, b) =>
          (b.toLowerCase().includes(`/${name.toLowerCase()}/`) ? 1 : 0) -
          (a.toLowerCase().includes(`/${name.toLowerCase()}/`) ? 1 : 0),
      );
    const exportRx = new RegExp(
      `export\\s+(?:default\\s+)?(?:const|let|var|function|class)\\s+${name}\\b`,
    );
    return hits.find((p) => exportRx.test(readText(p))) ?? hits[0];
  };

  // [OVERRIDE] a componentSrcMap:null exclusion (e.g. ServerMDX — pulls
  // @mdx-js/mdx + rehype-pretty-code/shiki into the bundle, ~30 MB) must also
  // drop that file from the blanket `export *` fallback below, or the
  // excluded name still drags its whole subtree back into the bundle.
  const excludedPaths = new Set();
  if (srcRoot) {
    for (const [k, v] of Object.entries(srcMap)) {
      if (v !== null) continue;
      const hit = fuzzyFind(k);
      if (hit) excludedPaths.add(hit);
    }
  }

  if (srcRoot) {
    for (const c of components) {
      const hit =
        typeof srcMap[c.name] === 'string'
          ? slash(resolve(PKG_DIR, srcMap[c.name]))
          : fuzzyFind(c.name);
      if (!hit || !existsSync(hit)) continue;
      c.srcPath = hit;
      c.doc = leadingJsdoc(readText(hit), c.name) || undefined;
      c.group = slug(
        slash(relative(srcRoot, dirname(hit)))
          .split('/')
          .filter(
            (s) =>
              s &&
              s.toLowerCase() !== c.name.toLowerCase() &&
              !GENERIC_DIR.has(s.toLowerCase()),
          )
          .at(-1) ||
          (c.doc && /@category\s+(\S+)/.exec(c.doc)?.[1]) ||
          'general',
      );
    }
  }

  console.error(
    `  package: ${components.length} components` +
      (srcRoot
        ? ` (${components.filter((c) => c.srcPath).length} src-matched)`
        : ' (no src/ — dist-only)'),
  );

  // [OVERRIDE] write the synth entry now that each component's real file is
  // known. Components in this repo mix `export default function Name()` and
  // `export function Name()` — a static `export { default as Name }` breaks
  // the many named-export files, and a blanket `export * from <file>` never
  // re-exports a default (ES module semantics). Resolve the ambiguity at
  // runtime instead: import the namespace and pick whichever of
  // `.default`/`.<Name>` is defined.
  if (synthEntry) {
    const matchedPaths = new Set(
      components.filter((c) => c.srcPath).map((c) => c.srcPath),
    );
    // config.js reads process.env.PORT / process.cwd() from lazy getters
    // (not at import time) — a browser IIFE has no `process` global, so a
    // getter call at render time throws `ReferenceError: process is not
    // defined`. Module evaluation order guarantees this runs before any
    // React render, regardless of its position relative to the imports below.
    const lines = [
      `if (typeof globalThis.process === 'undefined') { globalThis.process = { env: {}, cwd: () => '/' }; }`,
    ];
    let idx = 0;
    for (const c of components) {
      if (!c.srcPath) continue;
      const alias = `__ds_${idx++}`;
      lines.push(`import * as ${alias} from ${JSON.stringify(c.srcPath)};`);
      lines.push(
        `export const ${c.name} = ${alias}.default ?? ${alias}[${JSON.stringify(c.name)}];`,
      );
    }
    for (const p of comps) {
      if (matchedPaths.has(p) || excludedPaths.has(p)) continue;
      lines.push(`export * from ${JSON.stringify(p)};`);
    }
    writeFileSync(entry, lines.join('\n') + '\n');
  }

  return { shape: 'package', entry, components, synthEntry, exported };
}
