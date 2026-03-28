import React from 'react';

/**
 * Typography のバリアント定義
 * Reference: principles/Typography/hierarchy.md
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

/** テキストカラー */
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

/** HTML要素の型（as prop） */
type PolymorphicElement =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'div' | 'label' | 'caption'
  | 'legend' | 'figcaption' | 'strong' | 'em'
  | 'dt' | 'dd';

/**
 * Typography Props
 * Reference: principles/Typography/hierarchy.md
 */
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** タイポグラフィのバリアント（視覚スタイルを決定） */
  variant?: TypographyVariant;
  /**
   * レンダリングするHTML要素（省略時はvariantから自動選択）。
   * 視覚スタイルと意味論を切り離すために使用する。
   * @example variant="h1" as="p" → h1のスタイルで<p>タグ
   */
  as?: PolymorphicElement;
  /** テキストカラー */
  color?: TypographyColor;
  /** フォントウェイト（variant のデフォルトを上書き） */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** テキストを省略して1行に収める */
  truncate?: boolean;
  /** 内容 */
  children: React.ReactNode;
}

/** variant → デフォルトHTMLタグのマップ */
const defaultTag: Record<TypographyVariant, PolymorphicElement> = {
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
 * Typography Component
 *
 * Atomic Design: Atom
 *
 * タイポグラフィヒエラルキーを実装したテキストコンポーネント。
 * `variant` で視覚スタイルを、`as` で意味論的なHTML要素を指定する。
 *
 * @example
 * <Typography variant="h1">ページタイトル</Typography>
 * <Typography variant="h2" as="h3">見た目はH2、意味論はH3</Typography>
 * <Typography variant="body" color="muted">補足テキスト</Typography>
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
