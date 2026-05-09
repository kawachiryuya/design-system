/**
 * Style Dictionary configuration
 *
 * Inputs:  tokens/source/*.json (SD-compatible token format)
 * Outputs: tokens/build/{tokens.json, tokens.ts, variables.css}
 *
 * 詳細: docs/ai-roadmap.md §「Phase 1 / 施策 A」
 * 親 Issue: kawachiryuya/ai-management#32
 */

/**
 * Build a nested values-only object from SD's flat token list.
 * Strips metadata (type, description) — outputs only resolved values.
 */
const buildNestedTree = (allTokens) => {
  const tree = {};
  for (const token of allTokens) {
    const path = token.path;
    let obj = tree;
    for (let i = 0; i < path.length - 1; i++) {
      if (!obj[path[i]]) obj[path[i]] = {};
      obj = obj[path[i]];
    }
    // SD v5 normalizes to `$value`; fall back to `value` for older configs.
    obj[path[path.length - 1]] = token.$value ?? token.value;
  }
  return tree;
};

/** @type {import('style-dictionary/types').Config} */
export default {
  log: { verbosity: 'verbose' },
  source: ['tokens/source/**/*.json'],

  // Custom formats: nested-tree exports for AI-friendly type-safe access.
  hooks: {
    formats: {
      'json/nested-values': ({ dictionary }) =>
        JSON.stringify(buildNestedTree(dictionary.allTokens), null, 2) + '\n',

      'typescript/nested-const': ({ dictionary }) => {
        const tree = buildNestedTree(dictionary.allTokens);
        return [
          '/**',
          ' * Auto-generated from tokens/source/ by Style Dictionary.',
          ' * Do not edit directly — run `npm run tokens:build` to regenerate.',
          ' */',
          '',
          `export const TOKENS = ${JSON.stringify(tree, null, 2)} as const;`,
          '',
          'export type Tokens = typeof TOKENS;',
          ''
        ].join('\n');
      }
    }
  },

  platforms: {
    'web-json-flat': {
      transformGroup: 'js',
      buildPath: 'tokens/build/',
      files: [
        { destination: 'tokens.flat.json', format: 'json/flat' }
      ]
    },
    'web-json-nested': {
      transformGroup: 'js',
      buildPath: 'tokens/build/',
      files: [
        { destination: 'tokens.json', format: 'json/nested-values' }
      ]
    },
    'web-ts': {
      transformGroup: 'js',
      buildPath: 'tokens/build/',
      files: [
        { destination: 'tokens.ts', format: 'typescript/nested-const' }
      ]
    },
    'web-css': {
      transformGroup: 'css',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { selector: ':root' }
        }
      ]
    }
    // Phase 4 で有効化:
    // ios: { transformGroup: 'ios-swift', buildPath: 'tokens/build/ios/', files: [...] },
    // android: { transformGroup: 'android', buildPath: 'tokens/build/android/', files: [...] }
  }
};
