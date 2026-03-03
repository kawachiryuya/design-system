import React from 'react';

/**
 * ProgressBar Props
 * Reference: principles/interaction/feedback/loading-indicators.md
 */
export interface ProgressBarProps {
  /** 現在値（0〜max） */
  value: number;
  /** 最大値 */
  max?: number;
  /** バーの太さ */
  size?: 'sm' | 'md' | 'lg';
  /** カラーバリアント */
  color?: 'primary' | 'success' | 'error' | 'warning';
  /** スクリーンリーダー用ラベル */
  label?: string;
  /** パーセント数値を表示する */
  showValue?: boolean;
  /** 不確定プログレス（value 不明な処理中）*/
  indeterminate?: boolean;
  /** 追加CSSクラス */
  className?: string;
}

/**
 * ProgressBar Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <ProgressBar value={60} label="アップロード中" />
 * <ProgressBar value={100} color="success" showValue />
 * <ProgressBar indeterminate label="処理中" />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  label,
  showValue = false,
  indeterminate = false,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedValue / max) * 100);

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorStyles = {
    primary: 'bg-surface-primary',
    success: 'bg-surface-success',
    error: 'bg-surface-error',
    warning: 'bg-surface-warning',
  };

  const trackClass = [
    'w-full',
    'overflow-hidden',
    'rounded-full',
    'bg-surface-skeleton',
    sizeStyles[size],
    className,
  ].join(' ');

  const fillClass = [
    'h-full',
    'rounded-full',
    'transition-all',
    'duration-300',
    colorStyles[color],
    indeterminate
      ? 'animate-[indeterminate_1.5s_ease-in-out_infinite]'
      : '',
  ].join(' ');

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm text-onSurface">{label}</span>
          )}
          {showValue && !indeterminate && (
            <span className="text-sm text-onSurface-muted ml-auto">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? (indeterminate ? '処理中' : `${percentage}%`)}
        aria-busy={indeterminate || undefined}
        className={trackClass}
      >
        <div
          className={fillClass}
          style={indeterminate ? { width: '40%' } : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
