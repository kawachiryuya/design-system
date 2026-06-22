import React from 'react';
import { tv } from '../../_internal/tv';

/**
 * Typography のバリアント定義（視覚スタイル）
 *
 * h5 / h6 は h4 と視覚的差が小さく実利用も少ないため省略。
 * 階層がさらに深い場合は `as` で <h5>/<h6> タグを指定しつつ `variant="h4"` で見た目を共有する。
 */
// 型スケール順 = font-size 大→小。同サイズ (body-sm 14reg / label 14med) は
// 例外的に body グループ (body-lg/body/body-sm) をまとめる方針で body-sm → label の順。
export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'label'
  | 'caption';

/**
 * テキストカラー（semantic-colors.json の onSurface 系を反映）。
 * 階層軸 (default / subdued / muted) は Polaris 流の 3 段、
 * 役割 (primary / success / error / warning / info / disabled / inverse) は状態色。
 * `primary` は brand 色テキスト (リンク等) で、階層軸とは別軸。
 * 全ての色は白背景に対して WCAG AA (4.5:1、disabled は対比要件免除) を満たす。
 */
export type TypographyColor =
  | 'default'
  | 'subdued'
  | 'muted'
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
 *   <Typography variant="h4" truncate>
 *     {longTitle}
 *   </Typography>
 */
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * タイポグラフィのバリアント（視覚スタイル）。font-size 大→小 / 同サイズは太→細の順。
   * - `display`: 最大級ヒーローテキスト（48px bold）
   * - `h1`〜`h4`: 見出し（数字が大きいほど小さい。h5/h6 は視覚差が小さいため variant には無く、`as="h5"` でタグだけ指定して `variant="h4"` を流用）
   * - `body-lg`/`body`/`body-sm`: 本文（18/16/14px）
   * - `label`: フォームラベル等（14px medium）
   * - `caption`: 補助テキスト（12px、最小）
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

/** variant → デフォルト HTML タグのマップ (as prop 省略時の自動選択) */
const defaultTag: Record<TypographyVariant, TypographyElement> = {
  display:  'h1',
  h1:       'h1',
  h2:       'h2',
  h3:       'h3',
  h4:       'h4',
  'body-lg': 'p',
  body:      'p',
  'body-sm': 'p',
  label:     'span',
  caption:   'p',
};

/**
 * Typography のスタイル定義 — `tailwind-variants` で variant マップを宣言的に保持。
 *
 * - variant: text-* (semantic typography token = font-size + line-height + letter-spacing) と
 *   variant ごとのデフォルト font-weight をペアで保持
 * - color: semantic-colors の onSurface 系
 * - weight: variant のデフォルト font-weight を上書き (tailwind-merge が後勝ち解決)
 * - truncate: 1 行省略 (truncate class)
 */
const typographyVariants = tv({
  base: '',
  variants: {
    variant: {
      display:   'text-heading-display font-bold',
      h1:        'text-heading-xl font-bold',
      h2:        'text-heading-lg font-bold',
      h3:        'text-heading-md font-semibold',
      h4:        'text-heading-sm font-semibold',
      'body-lg': 'text-body-lg font-normal',
      body:      'text-body-md font-normal',
      'body-sm': 'text-body-sm font-normal',
      label:     'text-label font-medium',
      caption:   'text-caption font-normal',
    },
    color: {
      default:  'text-onSurface',
      subdued:  'text-onSurface-subdued',
      muted:    'text-onSurface-muted',
      disabled: 'text-onSurface-disabled',
      primary:  'text-onSurface-primary',
      success:  'text-onSurface-success',
      error:    'text-onSurface-error',
      warning:  'text-onSurface-warning',
      info:     'text-onSurface-info',
      inherit:  'text-inherit',
    },
    weight: {
      normal:   'font-normal',
      medium:   'font-medium',
      semibold: 'font-semibold',
      bold:     'font-bold',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
    truncate: false,
  },
});

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
      color,
      weight,
      truncate,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const Tag = (as || defaultTag[variant]) as React.ElementType;
    // weight が指定されれば variant の font-* を後勝ちで上書き (tailwind-merge が解決)
    // data-ds-typography は Storybook docs (.sbdocs h1/h2/.../p) の hardcoded font-size
    // との競合を回避するためのマーカー (.storybook/tailwind.css 側で :not() 除外)
    return (
      <Tag data-ds-root
        ref={ref}
        data-ds-typography="true"
        className={typographyVariants({ variant, color, weight, truncate, className })}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Typography.displayName = 'Typography';
