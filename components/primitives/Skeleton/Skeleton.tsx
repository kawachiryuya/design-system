import React from 'react';

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
 *
 * @see principles/README.md
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
  className = '',
}) => {
  const baseStyles = [
    'bg-surface-skeleton',
    animated ? 'animate-pulse' : '',
  ];

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const getStyle = (w?: string | number, h?: string | number) => ({
    width: w !== undefined ? (typeof w === 'number' ? `${w}px` : w) : undefined,
    height: h !== undefined ? (typeof h === 'number' ? `${h}px` : h) : undefined,
  });

  if (variant === 'text' && lines > 1) {
    return (
      <div
        role="status"
        aria-label="読み込み中"
        aria-busy="true"
        className={['flex flex-col gap-2', className].join(' ')}
        style={getStyle(width)}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={[...baseStyles, variantStyles.text, 'h-4'].join(' ')}
            style={{
              width: i === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  const defaultHeights = {
    text: '1rem',
    circular: width ? undefined : '2.5rem',
    rectangular: '8rem',
    rounded: '8rem',
  };

  const defaultWidths = {
    text: '100%',
    circular: height ? undefined : '2.5rem',
    rectangular: '100%',
    rounded: '100%',
  };

  return (
    <div
      role="status"
      aria-label="読み込み中"
      aria-busy="true"
      className={[
        ...baseStyles,
        variantStyles[variant],
        className,
      ].join(' ')}
      style={{
        width: width !== undefined
          ? (typeof width === 'number' ? `${width}px` : width)
          : defaultWidths[variant],
        height: height !== undefined
          ? (typeof height === 'number' ? `${height}px` : height)
          : defaultHeights[variant],
      }}
    />
  );
};

Skeleton.displayName = 'Skeleton';
