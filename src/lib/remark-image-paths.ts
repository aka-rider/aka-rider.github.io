import { Image, Root } from 'mdast';
import * as path from 'path';
import { visit } from 'unist-util-visit';

// This plugin replaces relative image paths with absolute paths under /images/_posts/
const remarkImagePaths = (postFilePath: string) => {
  return () => (tree: Root) => {
    if (!tree || !postFilePath) {
      return;
    }

    visit(tree, 'image', (node: Image) => {
      if (!node || !node.url) {
        return;
      }

      // Skip if already a URL or absolute path
      if (node.url.startsWith('http://') ||
        node.url.startsWith('https://') ||
        node.url.startsWith('/')) {
        return;
      }

      try {
        // Convert relative path to absolute path following the post's directory structure
        const postDir = path.dirname(postFilePath);
        const resolvedPath = path.join('/images', postDir, node.url);
        node.url = resolvedPath;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to process image ${node.url} with postFilePath ${postFilePath}:`, error);
      }
    });
  };
};

export default remarkImagePaths;
