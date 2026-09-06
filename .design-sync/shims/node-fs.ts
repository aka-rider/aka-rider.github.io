function enoent(path: string): NodeJS.ErrnoException {
  const err = new Error(
    `ENOENT: no such file or directory, open '${path}'`,
  ) as NodeJS.ErrnoException;
  err.code = 'ENOENT';
  return err;
}

export function readFileSync(path: string): never {
  throw enoent(String(path));
}

export function readdirSync(path: string): never {
  throw enoent(String(path));
}

export function statSync(path: string): never {
  throw enoent(String(path));
}

export function existsSync(_path: string): boolean {
  return false;
}

const fsModule = { readFileSync, readdirSync, statSync, existsSync };
export default fsModule;
