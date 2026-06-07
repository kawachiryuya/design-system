import React from 'react';

/** ProgressBar の太さ */
export type ProgressBarSize = 'sm' | 'md' | 'lg';

/** ProgressBar のカラーバリアント */
export type ProgressBarColor = 'primary' | 'success' | 'error' | 'warning';

/**
 * ProgressBar Props
 *
 * 進捗インジケーター。`role="progressbar"` `aria-valuenow/min/max` 自動付与。
 *
 * @example
 *   // 基本（アップロード進捗）
 *   <ProgressBar value={60} label="アップロード中" />
 *
 * @example
 *   // パーセント表示 + 完了色
 *   <ProgressBar value={100} max={100} color="success" showValue />
 *
 * @example
 *   // 不確定プログレス（処理中で進捗不明）
 *   <ProgressBar indeterminate label="サーバー応答待ち" />
 *
 * @example
 *   // カスタム max（バイト数等）
 *   <ProgressBar
 *     value={uploaded}
 *     max={fileSize}
 *     label={`${formatBytes(uploaded)} / ${formatBytes(fileSize)}`}
 *   />
 *
 * @example
 *   // エラー時（送信失敗等）
 *   <ProgressBar value={75} color="error" label="送信失敗（75% 完了時）" />
 *
 * @see principles/README.mdx
 */
export interface ProgressBarProps {
  /**
   * 現在値（0〜`max`）。範囲外の値は自動クランプ。
   * `indeterminate: true` の時は無視される。
   */
  value: number;
  /**
   * 最大値。
   * @default 100
   */
  max?: number;
  /**
   * バーの太さ。
   * @default 'md'
   */
  size?: ProgressBarSize;
  /**
   * カラーバリアント（状態の意味付け）。
   * - `primary` 通常進捗
   * - `success` 完了・正常終了
   * - `error` 失敗
   * - `warning` 警告（容量警告等）
   * @default 'primary'
   */
  color?: ProgressBarColor;
  /** ラベルテキスト。バー上部に表示される。a11y で `aria-label` にも反映。 */
  label?: string;
  /**
   * パーセント数値を右上に表示。`indeterminate: true` 時は表示されない。
   * @default false
   */
  showValue?: boolean;
  /**
   * 不確定プログレス（進捗が分からない処理中）。アニメーションで表現、`aria-busy="true"` 自動付与。
   * @default false
   */
  indeterminate?: boolean;
  /** 追加 CSS クラス（トラックに適用）。 */
  className?: string;
}

/**
 * ProgressBar — Atomic Design: Composite
 *
 * @see ProgressBarProps for usage examples.
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
            <span className="text-body-sm text-onSurface">{label}</span>
          )}
          {showValue && !indeterminate && (
            <span className="text-body-sm text-onSurface-muted ml-auto">
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
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
