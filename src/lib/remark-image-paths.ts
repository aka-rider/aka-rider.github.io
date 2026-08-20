import { Image, Root } from 'mdast';
import * as path from 'path';
import { visit } from 'unist-util-visit';

const remarkImagePaths = (postFilePath: string) => {
  return () => (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      if (
        !node.url ||
        node.url.startsWith('http://') ||
        node.url.startsWith('https://') ||
        node.url.startsWith('/')
      ) {
        return;
      }

      node.url = path.posix.join('/', path.dirname(postFilePath), node.url);
    });
  };
};

export default remarkImagePaths;
