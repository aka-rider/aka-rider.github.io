import * as React from 'react';

export type LinkProps = React.ComponentPropsWithoutRef<'a'> & {
  href?: any;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
};

function resolveHref(href: unknown): string {
  if (typeof href === 'string') return href;
  return '#';
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    children,
    prefetch,
    scroll,
    replace,
    shallow,
    locale,
    legacyBehavior,
    passHref,
    ...rest
  }: any,
  ref,
) {
  return (
    <a ref={ref} href={resolveHref(href)} {...rest}>
      {children}
    </a>
  );
});

export default Link;
