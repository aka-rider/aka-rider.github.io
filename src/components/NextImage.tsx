'use client';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

type NextImageProps = {
  useSkeleton?: boolean;
  imgClassName?: string;
  blurClassName?: string;
  alt: string;
} & ImageProps;

const WIDTH_UTILITY = /(^|\s)w-/;

export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  className,
  imgClassName,
  blurClassName,
  ...rest
}: NextImageProps) {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete',
  );
  const widthIsSet = WIDTH_UTILITY.test(className ?? '');

  return (
    <span
      style={
        !widthIsSet && width !== undefined ? { width: `${width}px` } : undefined
      }
      className={className}
    >
      <Image
        className={clsxm(
          'dark:brightness-75',
          imgClassName,
          status === 'loading' && clsxm('animate-pulse', blurClassName),
        )}
        src={src}
        width={width}
        height={height}
        alt={alt}
        onLoad={() => setStatus('complete')}
        {...rest}
      />
    </span>
  );
}
