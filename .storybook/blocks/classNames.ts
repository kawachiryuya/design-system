/**
 * Storybook docs 専用 utility が使う CSS クラス名の集約定数。
 *
 * - **TSX 側**: この定数を import して `className` に渡す。typo はタイプ補完で防げる。
 * - **CSS 側** (.storybook/tailwind.css): `@class-source ./blocks/classNames.ts:<key>` の
 *   コメントで定数キーを参照する。grep で双方向の連動が追える。
 *
 * 新しい専用クラスを追加する時は、ここにキーを追加 → TSX で使用 → CSS にスタイルと
 * `@class-source` コメントを追加する 3 ステップで完結する。
 */
export const SBDOCS_CLASS = {
  /** DoDontExample のカードコンテナ (上下マージン 40px) */
  doDontExample:      'do-dont-example',
  /** DoDontExample 上部のルール名見出し (太字 + 上限 + 下マージン 16px) */
  doDontExampleLabel: 'do-dont-example-label',
  /** DO/DON'T 説明文 (14px、テキスト色を h1 と揃える、上余白 8px) */
  doDontCaption:      'do-dont-caption',
  /** GuidelineToc の各リンクボタン (Storybook の青リンク標準を無効化) */
  guidelineTocLink:   'guideline-toc-link',
} as const;

export type SbDocsClassKey = keyof typeof SBDOCS_CLASS;
