const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/public/$1',
    '^estree-walker$': '<rootDir>/node_modules/estree-walker/src/index.js',
  },
};

const ESM_ONLY_MODULE_NAMES = [
  '@mdx-js',
  'unist-util-.*',
  'hast-util-.*',
  'hastscript',
  'hast-.*',
  'mdast-util-.*',
  'micromark.*',
  'remark-.*',
  'rehype-.*',
  'unified',
  'vfile.*',
  'bail',
  'trough',
  'is-plain-obj',
  'property-information',
  'space-separated-tokens',
  'comma-separated-tokens',
  'web-namespaces',
  'zwitch',
  'ccount',
  'markdown-table',
  'longest-streak',
  'decode-named-character-reference',
  'character-entities.*',
  'trim-lines',
  'devlop',
  '@ungap',
  'estree-util-.*',
  'periscopic',
  'is-reference',
  '@stefanprobst',
  '@shikijs',
  'shiki',
  'oniguruma-to-es',
  'regex.*',
  'vscode-oniguruma',
  'vscode-textmate',
  'markdown-extensions',
  'recma-build-jsx',
  'estree-walker',
  'is-hexadecimal',
  'is-decimal',
  'character-reference-invalid',
  'parse-entities',
  'recma-stringify',
  'recma-jsx',
  'escape-string-regexp',
  'github-slugger',
  'html-void-elements',
  'collapse-white-space',
  'stringify-entities',
  'is-alphabetical',
  'is-alphanumerical',
];

module.exports = async () => {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextJestConfig,
    transformIgnorePatterns: [
      `/node_modules/(?!(?:${ESM_ONLY_MODULE_NAMES.join('|')})/)`,
    ],
  };
};
