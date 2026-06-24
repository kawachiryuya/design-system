import React from 'react';
import { tv } from '../../_internal/tv';

/** Badge のセマンティックカラー */
export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'error' | 'warning' | 'info';

/** Badge のスタイル */
export type BadgeAppearance = 'solid' | 'soft' | 'outline';

/**
 * Badge のスタイル定義 — `tailwind-variants` で variant × appearance を宣言的に保持。
 *
 * - base: 全 variant 共通 (inline-flex / 高さ 24px 固定 / 余白 / 角丸 / 12px text)
 * - variants.appearance / variants.variant: 単独では空。色の決定は compoundVariants で
 * - compoundVariants: 6 variant × 3 appearance の 18 組合せで bg/text/border を決める
 *
 * 高さは `h-6` (24px) 1 段に統一 (業界標準寄り、用途差別化が薄い 2 サイズ運用を回避)。
 * 色は semantic token (`bg-surface-*` / `text-onSurface-*` / `border-border-*`) を参照し、
 * primitive hue 直参照 (blue-500 等の `{hue}-{shade}`) は使わない (AGENTS.md §3)。
 * 注: 反例にも完全な utility 名 (bg- + hue + shade) を書かない — 配信ビルドの content スキャンは
 *     コメントも走査するため、書くと未themeable な hue utility が styles.css に焼き付く。
 */
const badgeVariants = tv({
  base: [
    'inline-flex',
    'items-center',
    'justify-center',
    'h-6',
    'px-2',
    'gap-1.5',
    'text-xs',
    'font-medium',
    'rounded-sm',
    'whitespace-nowrap',
  ],
  variants: {
    appearance: { solid: '', soft: '', outline: '' },
    variant: { neutral: '', primary: '', success: '', error: '', warning: '', info: '' },
  },
  compoundVariants: [
    // solid: 塗りつぶし背景 + 反転テキスト
    { appearance: 'solid', variant: 'neutral', class: 'bg-surface-neutral-strong text-onSurface-inverse' },
    { appearance: 'solid', variant: 'primary', class: 'bg-surface-primary text-onSurface-inverse' },
    { appearance: 'solid', variant: 'success', class: 'bg-surface-success text-onSurface-inverse' },
    { appearance: 'solid', variant: 'error',   class: 'bg-surface-error text-onSurface-inverse' },
    { appearance: 'solid', variant: 'warning', class: 'bg-surface-warning text-onSurface-inverse' },
    { appearance: 'solid', variant: 'info',    class: 'bg-surface-info text-onSurface-inverse' },
    // soft: 薄い背景 + variant 色のテキスト
    { appearance: 'soft', variant: 'neutral', class: 'bg-surface-disabled text-onSurface' },
    { appearance: 'soft', variant: 'primary', class: 'bg-surface-secondary text-onSurface-primary' },
    { appearance: 'soft', variant: 'success', class: 'bg-surface-success-muted text-onSurface-success' },
    { appearance: 'soft', variant: 'error',   class: 'bg-surface-error-muted text-onSurface-error' },
    { appearance: 'soft', variant: 'warning', class: 'bg-surface-warning-muted text-onSurface-warning' },
    { appearance: 'soft', variant: 'info',    class: 'bg-surface-info-muted text-onSurface-info' },
    // outline: 枠線のみ + variant 色のテキスト
    { appearance: 'outline', variant: 'neutral', class: 'border border-border-strong text-onSurface' },
    { appearance: 'outline', variant: 'primary', class: 'border border-border-focus text-onSurface-primary' },
    { appearance: 'outline', variant: 'success', class: 'border border-border-success-emphasis text-onSurface-success' },
    { appearance: 'outline', variant: 'error',   class: 'border border-border-error-emphasis text-onSurface-error' },
    { appearance: 'outline', variant: 'warning', class: 'border border-border-warning-emphasis text-onSurface-warning' },
    { appearance: 'outline', variant: 'info',    class: 'border border-border-info-emphasis text-onSurface-info' },
  ],
  defaultVariants: {
    variant: 'neutral',
    appearance: 'soft',
  },
});

/**
 * Dot の色マップ。
 *
 * solid appearance のときは反転背景に映える `bg-white/70` を使うため、
 * このマップは soft / outline 用 (variant 色そのまま) のみ。
 */
const dotColorMap: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-neutral',
  primary: 'bg-surface-primary',
  success: 'bg-surface-success',
  error: 'bg-surface-error',
  warning: 'bg-surface-warning',
  info: 'bg-surface-info',
};

/**
 * Badge Props
 *
 * ステータス・カテゴリ・数値などを簡潔に表示するインラインラベル。非 interactive。
 *
 * @example
 *   // 完了ステータス（success + soft）
 *   <Badge variant="success">完了</Badge>
 *
 * @example
 *   // エラー強調（solid）
 *   <Badge variant="error" appearance="solid">エラー</Badge>
 *
 * @example
 *   // ドット付き（待機中等のリアルタイム表示）
 *   <Badge variant="warning" dot>処理中</Badge>
 *
 * @example
 *   // 枠線のみ（控えめなカテゴリラベル）
 *   <Badge variant="primary" appearance="outline">
 *     ベータ
 *   </Badge>
 *
 * @example
 *   // 数値カウント
 *   <Badge variant="error" appearance="solid">12</Badge>
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * セマンティックカラー。
   * - `neutral` カテゴリ・タグ等の意味色なし
   * - `primary` ブランド強調
   * - `success` `error` `warning` `info` 状態の意味色
   * @default 'neutral'
   */
  variant?: BadgeVariant;
  /**
   * バッジのスタイル。
   * - `solid` 塗りつぶし（強調表示、数値カウント等）
   * - `soft` 薄い背景（標準、リスト内のステータス）
   * - `outline` 枠線のみ（最も控えめ、サブカテゴリ）
   * @default 'soft'
   */
  appearance?: BadgeAppearance;
  /**
   * 先頭にドットを表示。リアルタイム性（処理中・新着等）を示唆する用途。
   * @default false
   */
  dot?: boolean;
  /** バッジの内容（短いテキストや数値）。 */
  children: React.ReactNode;
}

/**
 * Badge — Primitive: 単一 `<span>` 装飾、状態なし
 *
 * @see BadgeProps for usage examples.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      appearance = 'soft',
      dot = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <span data-ds-root
        ref={ref}
        className={badgeVariants({ variant, appearance, className })}
        {...props}
      >
        {dot && (
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              appearance === 'solid' ? 'bg-white/70' : dotColorMap[variant]
            }`}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
