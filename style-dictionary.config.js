/**
 * Style Dictionary configuration
 *
 * Inputs:  tokens/source/*.json (SD-compatible token format)
 * Outputs:
 *   - tokens/build/{tokens.json, tokens.flat.json, tokens.ts, variables.css}
 *   - tokens/{colors,semantic-colors,spacing,typography,shadows,radius,breakpoints,animation}.json
 *     (legacy-format build artifacts for backward compat with Storybook stories etc.)
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
    obj[path[path.length - 1]] = token.$value ?? token.value;
  }
  return tree;
};

/**
 * Convert SD reference like "{color.primary.600}" back to legacy notation "primary-600".
 * - {color.base.white} → "white"
 * - {color.primary.600} → "primary-600"
 * - rgba(0, 0, 0, 0.08) → "black/8"
 * - その他 raw 値はそのまま
 */
const refToLegacyNotation = (origValue) => {
  if (typeof origValue !== 'string') return origValue;
  const refMatch = origValue.match(/^\{color\.([^.}]+)\.([^.}]+)\}$/);
  if (refMatch) {
    const [, group, name] = refMatch;
    if (group === 'base') return name;
    return `${group}-${name}`;
  }
  const rgbaMatch = origValue.match(/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)$/);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const pct = Math.round(parseFloat(a) * 100);
    if (r === '0' && g === '0' && b === '0') return `black/${pct}`;
    if (r === '255' && g === '255' && b === '255') return `white/${pct}`;
  }
  return origValue;
};

/** @type {import('style-dictionary/types').Config} */
export default {
  log: { verbosity: 'verbose' },
  source: ['tokens/source/**/*.json'],

  hooks: {
    formats: {
      // ── New formats (AI-friendly nested tree exports) ──
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
      },

      // ── Legacy formats (backward-compat build artifacts) ──
      // 既存 Storybook stories や lp 等の consumer が tokens/{name}.json を読み込んでいる旧構造を維持。
      // tokens/source/ が一次ソース、ここで旧構造に再変換して書き出す。
      'json/legacy-colors': ({ dictionary }) => {
        const out = {};
        const PRIMITIVE_KEYS = ['primary', 'neutral', 'success', 'error', 'warning', 'info', 'base'];
        dictionary.allTokens.forEach((t) => {
          if (t.path[0] !== 'color') return;
          if (!PRIMITIVE_KEYS.includes(t.path[1])) return;
          const path = t.path.slice(1);
          let obj = out;
          for (let i = 0; i < path.length - 1; i++) {
            if (!obj[path[i]]) obj[path[i]] = {};
            obj = obj[path[i]];
          }
          obj[path[path.length - 1]] = t.$value ?? t.value;
        });
        return JSON.stringify(out, null, 2) + '\n';
      },

      'json/legacy-semantic-colors': ({ dictionary }) => {
        const RENAME = { bg: 'background', surface: 'surface', on: 'onSurface', border: 'border', state: 'state' };
        const out = {};
        dictionary.allTokens.forEach((t) => {
          if (t.path[0] !== 'color') return;
          const oldGroup = RENAME[t.path[1]];
          if (!oldGroup) return;
          if (!out[oldGroup]) out[oldGroup] = {};
          out[oldGroup][t.path[2]] = {
            value: refToLegacyNotation(t.original.value ?? t.original.$value),
            description: t.original.description ?? ''
          };
        });
        return JSON.stringify(out, null, 2) + '\n';
      },

      'json/legacy-spacing': ({ dictionary }) => {
        const out = { spacing: {}, semantic: {} };
        dictionary.allTokens.forEach((t) => {
          if (t.path[0] === 'spacing') {
            out.spacing[t.path[1]] = t.$value ?? t.value;
          } else if (t.path[0] === 'spacing-semantic') {
            const [, group, name] = t.path;
            if (!out.semantic[group]) out.semantic[group] = {};
            out.semantic[group][name] = t.$value ?? t.value;
          }
        });
        return JSON.stringify(out, null, 2) + '\n';
      },

      'json/legacy-typography': ({ dictionary }) => {
        const RENAME = {
          'font-size': 'fontSize',
          'font-weight': 'fontWeight',
          'line-height': 'lineHeight',
          'letter-spacing': 'letterSpacing',
          'font-family': 'fontFamily'
        };
        const out = {};
        dictionary.allTokens.forEach((t) => {
          if (t.path[0] !== 'typography') return;
          const oldGroup = RENAME[t.path[1]];
          if (!oldGroup) return;
          if (!out[oldGroup]) out[oldGroup] = {};
          let v = t.$value ?? t.value;
          if (t.path[1] === 'font-family' && typeof v === 'string') {
            v = v.split(/\s*,\s*/);
          }
          out[oldGroup][t.path[2]] = v;
        });
        return JSON.stringify(out, null, 2) + '\n';
      },

      'json/legacy-namespace': ({ dictionary, file }) => {
        // Configure via `file.options.namespace`: e.g. {shadow: 'shadow'}
        const namespaces = file.options?.namespaces ?? {};
        const out = {};
        Object.values(namespaces).forEach((alias) => {
          out[alias] = {};
        });
        dictionary.allTokens.forEach((t) => {
          const root = t.path[0];
          const alias = namespaces[root];
          if (!alias) return;
          let obj = out[alias];
          for (let i = 1; i < t.path.length - 1; i++) {
            if (!obj[t.path[i]]) obj[t.path[i]] = {};
            obj = obj[t.path[i]];
          }
          obj[t.path[t.path.length - 1]] = t.$value ?? t.value;
        });
        return JSON.stringify(out, null, 2) + '\n';
      }
    }
  },

  platforms: {
    // ── New AI-friendly outputs ──
    'web-json-flat': {
      transformGroup: 'js',
      buildPath: 'tokens/build/',
      files: [{ destination: 'tokens.flat.json', format: 'json/flat' }]
    },
    'web-json-nested': {
      transformGroup: 'js',
      buildPath: 'tokens/build/',
      files: [{ destination: 'tokens.json', format: 'json/nested-values' }]
    },
    'web-ts': {
      transformGroup: 'js',
      buildPath: 'tokens/build/',
      files: [{ destination: 'tokens.ts', format: 'typescript/nested-const' }]
    },
    'web-css': {
      transformGroup: 'css',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          // outputReferences: true で {color.teal.700} 等の primitive 参照を
          // var(--color-teal-700) として出力 (build 時に値解決しない)。
          // これにより下流 product が CSS 変数 (`--color-teal-700` 等) を
          // override すると、semantic / state 等の参照先 token 全てに
          // ランタイムで自動連動 (Style Dictionary 再 build 不要)。
          // 例: state.hover-primary = color-mix(... var(--color-teal-700) 8% ...)
          //     → product が --color-teal-700 を violet 値に override すると
          //       hover-primary も violet tint に自動変化
          options: { selector: ':root', outputReferences: true }
        }
      ]
    },

    // ── Legacy outputs (backward compat, output at tokens/) ──
    // 値変換系（size/rem 等）は除外して raw 値を維持。name/kebab で衝突警告も回避。
    'legacy-jsons': {
      transforms: ['attribute/cti', 'name/kebab'],
      buildPath: 'tokens/',
      files: [
        { destination: 'colors.json',          format: 'json/legacy-colors' },
        { destination: 'semantic-colors.json', format: 'json/legacy-semantic-colors' },
        { destination: 'spacing.json',         format: 'json/legacy-spacing' },
        { destination: 'typography.json',      format: 'json/legacy-typography' },
        { destination: 'shadows.json',         format: 'json/legacy-namespace', options: { namespaces: { shadow: 'shadow' } } },
        { destination: 'radius.json',          format: 'json/legacy-namespace', options: { namespaces: { radius: 'radius' } } },
        { destination: 'breakpoints.json',     format: 'json/legacy-namespace', options: { namespaces: { screens: 'screens' } } },
        { destination: 'animation.json',       format: 'json/legacy-namespace', options: { namespaces: { duration: 'duration', easing: 'easing' } } }
      ]
    }
    // Phase 4 で有効化:
    // ios: { transformGroup: 'ios-swift', buildPath: 'tokens/build/ios/', files: [...] },
    // android: { transformGroup: 'android', buildPath: 'tokens/build/android/', files: [...] }
  }
};
