function normalizeSegments(path: string): string[] {
  return path.split('/').filter((s) => s.length > 0 && s !== '.');
}

export function join(...parts: string[]): string {
  const segments = parts.flatMap(normalizeSegments);
  const out: string[] = [];
  for (const seg of segments) {
    if (seg === '..') out.pop();
    else out.push(seg);
  }
  const leadingSlash = parts[0]?.startsWith('/') ? '/' : '';
  return leadingSlash + out.join('/');
}

export function dirname(path: string): string {
  const idx = path.lastIndexOf('/');
  if (idx < 0) return '.';
  if (idx === 0) return '/';
  return path.slice(0, idx);
}

export function basename(path: string, ext?: string): string {
  const base = path.slice(path.lastIndexOf('/') + 1);
  if (ext && base.endsWith(ext) && base !== ext) return base.slice(0, -ext.length);
  return base;
}

export function extname(path: string): string {
  const base = basename(path);
  const idx = base.lastIndexOf('.');
  return idx <= 0 ? '' : base.slice(idx);
}

export function resolve(...parts: string[]): string {
  const joined = join(...parts);
  return joined.startsWith('/') ? joined : '/' + joined;
}

export function parse(path: string) {
  const dir = dirname(path);
  const base = basename(path);
  const ext = extname(base);
  const name = ext ? base.slice(0, -ext.length) : base;
  return { root: '/', dir, base, ext, name };
}

export function isAbsolute(path: string): boolean {
  return path.startsWith('/');
}

export const sep = '/';

const pathModule = { join, dirname, basename, extname, resolve, parse, isAbsolute, sep };
export default pathModule;
