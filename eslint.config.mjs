// ESLint flat config — design-system の規約を機械強制する。
//
// 方針: typescript-eslint の recommended ルールセットは入れない (既存コードへの大量指摘を避ける)。
// TS パーサだけ有効化し、AGENTS.md の規約に直結するルール (生 hex 禁止 / 依存 import 禁止) +
// react-hooks + storybook recommended のみを足す。詳細は AGENTS.md §3-7 (lint が強制する規約)。
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'tokens/build/**', 'node_modules/**'],
  },

  // TS パーサ + プラグインの登録のみ (ルールは付けない)。base は単一 config オブジェクト。
  tseslint.configs.base,

  // ── react-hooks: components / .storybook の TS(X) ──
  {
    files: ['components/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // ── 生 hex / 色 bracket 禁止 (AGENTS §3): 出荷される component 実装のみ ──
  // stories (Colors 等は hex を意図的に表示) / tokens カタログ / .storybook 設定 (Storybook UI
  // テーマや backgrounds は hex 必須) は対象外。spacing/サイズ bracket (w-[44px]) も対象外。
  {
    files: ['components/**/*.tsx'],
    ignores: ['**/*.stories.tsx', 'components/tokens/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,8}/]',
          message:
            '生 hex / 色 bracket (#xxxxxx, [#xxx]) は禁止。semantic token (bg-surface / text-onSurface 等) を使う (AGENTS §3)。',
        },
        {
          selector: 'Literal[value=/\\[(rgb|hsl)/]',
          message: 'rgb()/hsl() の任意値 bracket は禁止。semantic token を使う (AGENTS §3)。',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]',
          message:
            '生 hex / 色 bracket はテンプレートリテラル内でも禁止。semantic token を使う (AGENTS §3)。',
        },
        {
          selector: 'TemplateElement[value.raw=/\\[(rgb|hsl)/]',
          message: 'rgb()/hsl() の任意値 bracket はテンプレートリテラル内でも禁止。semantic token を使う (AGENTS §3)。',
        },
      ],
    },
  },

  // ── 依存ルール: components 配下のみ @/ エイリアス import を禁止 (§4) ──
  {
    files: ['components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*'],
              message:
                'components 配下では @/ エイリアス import 禁止 (§4 依存ルール)。相対 import か @sb-blocks を使う。',
            },
          ],
        },
      ],
    },
  },

  // ── Storybook recommended (play 関数の await 漏れ / story 命名規約 等) ──
  ...storybook.configs['flat/recommended'],
);
