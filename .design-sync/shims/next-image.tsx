import * as React from 'react';

export type ImageProps = React.ComponentPropsWithoutRef<'img'> & {
  src?: string | { src: string };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number | string;
  placeholder?: string;
  blurDataURL?: string;
  sizes?: string;
  loader?: (...args: any[]) => string;
  unoptimized?: boolean;
};

function resolveSrc(src: ImageProps['src']): string {
  if (typeof src === 'string') return src;
  if (src && typeof src === 'object' && 'src' in src) return src.src;
  return '';
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  quality,
  placeholder,
  blurDataURL,
  sizes,
  loader,
  unoptimized,
  onLoad,
  className,
  style,
  ...rest
}: ImageProps) {
  const fillStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : {};

  return (
    <img
      src={resolveSrc(src)}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...fillStyle, ...style }}
      onLoad={onLoad}
      {...rest}
    />
  );
}
