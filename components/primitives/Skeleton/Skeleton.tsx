import React from 'react';
import { tv } from '../../_internal/tv';

/** Skeleton の形状バリアント */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

/**
 * Skeleton Props
 *
 * 読み込み中のプレースホルダー。`role="status"` `aria-busy="true"` 自動付与で a11y 対応。
 *
 * @example
 *   // テキスト 3 行（最後の行は 75% 幅）
 *   <Skeleton variant="text" lines={3} />
 *
 * @example
 *   // 円形（アバター・アイコン）
 *   <Skeleton variant="circular" width={40} height={40} />
 *
 * @example
 *   // 画像プレースホルダー
 *   <Skeleton variant="rectangular" width="100%" height={200} />
 *
 * @example
 *   // カード
 *   <Skeleton variant="rounded" width="100%" height={120} />
 *
 * @example
 *   // アニメーション無効（複数並べる場合のパフォーマンス対策）
 *   <Skeleton variant="text" lines={5} animated={false} />
 */
export interface SkeletonProps {
  /**
   * スケルトンの形状。
   * - `text`: 行を模す（lines で複数行）
   * - `circular`: 円形（アバター・アイコン）
   * - `rectangular`: 矩形（画像・カード本体）
   * - `rounded`: 角丸矩形（モダンなカード）
   * @default 'text'
   */
  variant?: SkeletonVariant;
  /** 幅（CSS 文字列 or 数値で px）。省略時は variant ごとのデフォルト。 */
  width?: string | number;
  /** 高さ（CSS 文字列 or 数値で px）。省略時は variant ごとのデフォルト。 */
  height?: string | number;
  /**
   * `variant="text"` 時の行数。最終行は 75% 幅で自然な見た目に。
   * @default 1
   */
  lines?: number;
  /**
   * Pulse アニメーション。
   * @default true
   */
  animated?: boolean;
  /** 追加 CSS クラス。 */
  className?: string;
}

/**
 * Skeleton のスタイル定義 — `tailwind-variants` で variant マップを宣言的に保持。
 *
 * - base: 背景色 (semantic skeleton 色)
 * - variants.variant: 角丸の形状 (text=rounded / circular=rounded-full / rectangular=rounded-none / rounded=rounded-lg)
 * - variants.animated: pulse animation の on/off
 *
 * size (width/height) は CSS 数値で渡すため class 化せず、style 属性で直接指定する。
 */
const skeletonVariants = tv({
  base: 'bg-surface-skeleton',
  variants: {
    variant: {
      text:        'rounded',
      circular:    'rounded-full',
      rectangular: 'rounded-none',
      rounded:     'rounded-lg',
    },
    animated: {
      true:  'animate-pulse',
      false: '',
    },
  },
  defaultVariants: { variant: 'text', animated: true },
});

/** width / height を CSS 値に変換 (number → px, string → そのまま) */
const toCssSize = (v?: string | number) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

/**
 * Skeleton — Atomic Design: Atom
 *
 * @see SkeletonProps for usage examples.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  animated = true,
  className,
}) => {
  // variant="text" + lines>1 のときは複数行を flex-col で組み立てる
  if (variant === 'text' && lines > 1) {
    const lineClass = skeletonVariants({ variant: 'text', animated });
    return (
      <div
        role="status"
        aria-label="読み込み中"
        aria-busy="true"
        className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}
        // width 未指定時は 100% (単一行 text の defaultWidths と揃える)。これが無いと
        // shrink 文脈 (flex items-start 等) で外側が幅0に潰れ、各行 (width:100%) も消える。
        style={{ width: toCssSize(width) ?? '100%' }}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${lineClass} h-4`}
            style={{ width: i === lines - 1 ? '75%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  // variant ごとのデフォルトサイズ (width/height 未指定時のフォールバック)
  const defaultHeights: Record<SkeletonVariant, string | undefined> = {
    text:        '1rem',
    circular:    width ? undefined : '2.5rem',
    rectangular: '8rem',
    rounded:     '8rem',
  };
  const defaultWidths: Record<SkeletonVariant, string | undefined> = {
    text:        '100%',
    circular:    height ? undefined : '2.5rem',
    rectangular: '100%',
    rounded:     '100%',
  };

  return (
    <div
      role="status"
      aria-label="読み込み中"
      aria-busy="true"
      className={skeletonVariants({ variant, animated, className })}
      style={{
        width:  toCssSize(width)  ?? defaultWidths[variant],
        height: toCssSize(height) ?? defaultHeights[variant],
      }}
    />
  );
};

Skeleton.displayName = 'Skeleton';
