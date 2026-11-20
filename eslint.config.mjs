// ESLint flat config — design-system の規約を機械強制する。
//
// 方針: typescript-eslint の recommended ルールセットは入れない (既存コードへの大量指摘を避ける)。
// TS パーサだけ有効化し、AGENTS.md の規約に直結するルール (生 hex 禁止 / 依存 import 禁止) +
// react-hooks + storybook recommended のみを足す。詳細は AGENTS.md §3-7 (lint が強制する規約)。
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import { TYPOGRAPHY_PATTERN } from './scripts/typography-pattern.mjs';

// primitive typography 直参照禁止 (#109 Typo-2 / #145 / #155、AGENTS §3-7): text-{size} / leading-* / tracking-* (任意の値・variant 付きも) を書かず、
// text style `type-{role}` (type-body / type-supporting / type-section-title 等) を使う。
// weight の `font-*` は type-* の上書き (Typography の weight prop 等) として許可。
// 出荷コンポーネントと、story・.storybook の両方に掛ける (mdx は eslint が見ないので check:mdx-typography)。
// 例外は `eslint-disable-next-line no-restricted-syntax -- <理由>`。
const typographySelectors = [
  {
    selector: `Literal[value=/${TYPOGRAPHY_PATTERN}/]`,
    message:
      'primitive typography 直参照 (text-sm / leading-tight 等) は禁止。text style `type-{role}` (type-body / type-supporting 等) を使う (AGENTS §3-7)。',
  },
  {
    selector: `TemplateElement[value.raw=/${TYPOGRAPHY_PATTERN}/]`,
    message:
      'primitive typography 直参照はテンプレートリテラル内でも禁止。text style `type-{role}` を使う (AGENTS §3-7)。',
  },
];

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
        // primitive hue 直参照 (`bg-teal-500` / `text-neutral-200` 等) 禁止 (AGENTS §3 / スタイリング3規律)。
        // {utility}-{hue}-{shade} 形を検知。hue は preset が公開する 6 palette。semantic token を使う。
        {
          selector:
            'Literal[value=/(bg|text|border|ring|fill|stroke|from|via|to|divide|decoration|accent|caret|placeholder|outline)-(teal|neutral|green|red|orange|blue)-[0-9]/]',
          message:
            'primitive hue 直参照 (bg-teal-500 / text-neutral-200 等) は禁止。semantic token (bg-surface-primary / text-onSurface-subtle 等) を使う (AGENTS §3 / スタイリング3規律)。',
        },
        {
          selector:
            'TemplateElement[value.raw=/(bg|text|border|ring|fill|stroke|from|via|to|divide|decoration|accent|caret|placeholder|outline)-(teal|neutral|green|red|orange|blue)-[0-9]/]',
          message:
            'primitive hue 直参照はテンプレートリテラル内でも禁止。semantic token を使う (AGENTS §3 / スタイリング3規律)。',
        },
        ...typographySelectors,
        // フォーカスの表現は utility `focus-ring` / `focus-ring-inset` / `focus-ring-on-fill` だけで書く (DDR-2 #131、AGENTS §3-7)。
        // outline-none での消去、フォーカスの variant での ring / outline / 枠線 / 塗り / 影の直書き、ring-inset / ring-offset-* を弾く。
        // フォーカスの variant = focus: / focus-visible: / focus-within: と、その peer- / group- 版 (名前付き `group-focus/name:` も)、
        // arbitrary variant の `[&:focus-visible]:` 等 (#139)。
        // (Avatar の `ring-2 ring-surface` のようなフォーカスと関係ない ring は対象外)
        {
          selector:
            'Literal[value=/(^|\\s|:)((peer|group)-)?focus(-visible|-within)?(\\x2F[\\w-]+)?:(ring|outline|border|bg|shadow)|\\[[^\\]\\s]*:focus[^\\]\\s]*\\]:(ring|outline|border|bg|shadow)|(^|\\s|:)outline-none|(^|\\s|:)ring-(inset|offset)/]',
          message:
            'フォーカスの表現は focus-ring / focus-ring-inset / focus-ring-on-fill のどれか 1 つで書く (outline-none・focus: / focus-visible: / focus-within: とその peer- / group- 版での ring / 枠線 / 塗りの直書き・ring-inset・ring-offset-* は禁止、AGENTS §3-7)。',
        },
        {
          selector:
            'TemplateElement[value.raw=/(^|\\s|:)((peer|group)-)?focus(-visible|-within)?(\\x2F[\\w-]+)?:(ring|outline|border|bg|shadow)|\\[[^\\]\\s]*:focus[^\\]\\s]*\\]:(ring|outline|border|bg|shadow)|(^|\\s|:)outline-none|(^|\\s|:)ring-(inset|offset)/]',
          message:
            'フォーカスの表現はテンプレートリテラル内でも focus-ring / focus-ring-inset / focus-ring-on-fill のどれか 1 つで書く (AGENTS §3-7)。',
        },
      ],
    },
  },

  // ── 文字の直書き禁止を story と .storybook にも (#145、AGENTS §3-7) ──
  // 見本は人にも AI にも写されるので、出荷コンポーネントと同じ規則に揃える。
  // Tokens のカタログ (components/tokens/**) は大きさの段そのものを見せるのが目的なので対象外 (§3-6)。
  {
    files: ['components/**/*.stories.tsx', '.storybook/**/*.{ts,tsx}'],
    ignores: ['components/tokens/**'],
    rules: {
      'no-restricted-syntax': ['error', ...typographySelectors],
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
