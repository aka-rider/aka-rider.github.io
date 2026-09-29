import path from 'path';
import sharp from 'sharp';

import config from '../../config';

export interface ImageDimensions {
  width: number;
  height: number;
}

export async function getLocalImageDimensions(
  absoluteUrl: string,
): Promise<ImageDimensions | undefined> {
  if (!absoluteUrl.startsWith(config.SITE_URL)) {
    return undefined;
  }

  const relativePath = absoluteUrl.slice(config.SITE_URL.length);
  const filePath = path.join(config.ROOT_DIR, 'public', relativePath);

  try {
    const { width, height } = await sharp(filePath).metadata();
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
}
