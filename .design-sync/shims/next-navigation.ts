export function usePathname(): string {
  return '/';
}

export function useRouter() {
  return {
    push() {},
    replace() {},
    back() {},
    prefetch() {},
    refresh() {},
  };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useParams(): Record<string, string | string[]> {
  return {};
}
