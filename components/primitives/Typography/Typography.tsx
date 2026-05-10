import React from 'react';

/**
 * Typography のバリアント定義（視覚スタイル）
 * @see principles/Typography/hierarchy.md
 */
export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label';

/** テキストカラー（semantic-colors.json の onSurface 系を反映） */
export type TypographyColor =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'disabled'
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'inherit';

/** フォントウェイト */
export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/** レンダリング先 HTML 要素（`as` prop） */
export type TypographyElement =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'div' | 'label' | 'caption'
  | 'legend' | 'figcaption' | 'strong' | 'em'
  | 'dt' | 'dd';

/**
 * Typography Props
 *
 * **設計原則**: 視覚スタイル（`variant`）と意味論（`as`）を分離する。
 * - `variant` は見た目だけ決める（h1 サイズに見える等）
 * - `as` は HTML 構造を決める（`<h2>` を実際にレンダリング）
 * - 両方を組み合わせることで「h1 のスタイルで `<p>`」のような柔軟性を実現
 *
 * @example
 *   // 基本（variant に従う HTML タグが自動選択）
 *   <Typography variant="h1">ページタイトル</Typography>
 *
 * @example
 *   // 視覚 vs 意味の分離: 見た目 h2、構造は h3
 *   <Typography variant="h2" as="h3">セクションタイトル</Typography>
 *
 * @example
 *   // 補足テキスト（mute 色）
 *   <Typography variant="body" color="muted">
 *     最終更新日: 2026-05-10
 *   </Typography>
 *
 * @example
 *   // ラベル（form 内で使用、強調）
 *   <Typography variant="label" weight="semibold">必須項目</Typography>
 *
 * @example
 *   // 1 行省略（カード内タイトル等）
 *   <Typography variant="h5" truncate>
 *     {longTitle}
 *   </Typography>
 *
 * @see principles/Typography/hierarchy.md
 */
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * タイポグラフィのバリアント（視覚スタイル）。
   * - `display`: 最大級ヒーローテキスト
   * - `h1`〜`h6`: 見出し（数字が大きいほど小さい）
   * - `body-lg`/`body`/`body-sm`: 本文（3 段階）
   * - `caption`: 補助テキスト（最小）
   * - `label`: フォームラベル等
   * @default 'body'
   */
  variant?: TypographyVariant;
  /**
   * レンダリング先 HTML 要素。省略時は `variant` から自動選択（h1 → `<h1>` 等）。
   * 視覚と意味論の分離に使う。
   *
   * @example variant="h1" as="p" → h1 のスタイルで `<p>` タグ
   */
  as?: TypographyElement;
  /**
   * テキストカラー。
   * @default 'default'
   */
  color?: TypographyColor;
  /**
   * フォントウェイト（variant のデフォルトを上書き）。指定しなければ variant の標準ウェイトに従う。
   */
  weight?: TypographyWeight;
  /**
   * `true` で 1 行に省略（CSS `truncate`）。長いタイトル等で使用。
   * @default false
   */
  truncate?: boolean;
  /** テキスト内容（必須）。 */
  children: React.ReactNode;
}

/** variant → デフォルト HTML タグのマップ */
const defaultTag: Record<TypographyVariant, TypographyElement> = {
  display:  'h1',
  h1:       'h1',
  h2:       'h2',
  h3:       'h3',
  h4:       'h4',
  h5:       'h5',
  h6:       'h6',
  'body-lg': 'p',
  body:      'p',
  'body-sm': 'p',
  caption:   'p',
  label:     'span',
};

/** variant → Tailwind クラスのマップ（tokens/typography.json） */
const variantStyles: Record<TypographyVariant, string[]> = {
  display: [
    'text-5xl',          // 48px
    'font-bold',
    'leading-tight',
    'tracking-tight',
  ],
  h1: [
    'text-4xl',          // 36px
    'font-bold',
    'leading-tight',
    'tracking-tight',
  ],
  h2: [
    'text-3xl',          // 30px
    'font-bold',
    'leading-tight',
    'tracking-tight',
  ],
  h3: [
    'text-2xl',          // 24px
    'font-semibold',
    'leading-normal',
    'tracking-normal',
  ],
  h4: [
    'text-xl',           // 20px
    'font-semibold',
    'leading-normal',
  ],
  h5: [
    'text-lg',           // 18px
    'font-semibold',
    'leading-normal',
  ],
  h6: [
    'text-base',         // 16px
    'font-semibold',
    'leading-normal',
  ],
  'body-lg': [
    'text-lg',           // 18px
    'font-normal',
    'leading-relaxed',
  ],
  body: [
    'text-base',         // 16px
    'font-normal',
    'leading-normal',
  ],
  'body-sm': [
    'text-sm',           // 14px
    'font-normal',
    'leading-normal',
  ],
  caption: [
    'text-xs',           // 12px
    'font-normal',
    'leading-normal',
  ],
  label: [
    'text-sm',           // 14px
    'font-medium',
    'leading-normal',
  ],
};

/** カラー → Tailwind クラスのマップ（semantic-colors.json） */
const colorStyles: Record<TypographyColor, string> = {
  default:  'text-onSurface',
  muted:    'text-onSurface-muted',
  subtle:   'text-onSurface-subtle',
  disabled: 'text-onSurface-disabled',
  primary:  'text-onSurface-primary',
  success:  'text-onSurface-success',
  error:    'text-onSurface-error',
  warning:  'text-onSurface-warning',
  info:     'text-onSurface-info',
  inherit:  'text-inherit',
};

/**
 * Typography — Atomic Design: Atom
 *
 * タイポグラフィヒエラルキーを実装したテキストコンポーネント。
 * 視覚スタイルと HTML 意味論を分離できる polymorphic 設計。
 *
 * @see TypographyProps for usage examples.
 */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      as,
      color = 'default',
      weight,
      truncate = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const Tag = (as || defaultTag[variant]) as React.ElementType;

    // weight 指定時は variant のデフォルト font-weight を除外して上書き
    const baseStyles = weight
      ? variantStyles[variant].filter((c) => !c.startsWith('font-'))
      : variantStyles[variant];

    const classes = [
      ...baseStyles,
      weight ? `font-${weight}` : '',
      colorStyles[color],
      truncate ? 'truncate' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

Typography.displayName = 'Typography';
