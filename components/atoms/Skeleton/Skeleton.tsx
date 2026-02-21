import React from 'react';

/**
 * Skeleton Props
 * Reference: principles/interaction/feedback/loading-indicators.md
 */
export interface SkeletonProps {
  /** スケルトンの形状 */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** 幅（CSS値 or Tailwindクラス用の数値文字列） */
  width?: string | number;
  /** 高さ（CSS値 or 数値） */
  height?: string | number;
  /** variant="text" 時の行数 */
  lines?: number;
  /** pulse アニメーション */
  animated?: boolean;
  /** 追加CSSクラス */
  className?: string;
}

/**
 * Skeleton Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
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
    'bg-neutral-200',
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
