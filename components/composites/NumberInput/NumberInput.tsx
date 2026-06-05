import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Typography } from '../../primitives/Typography/Typography';

/** NumberInput のサイズ */
export type NumberInputSize = 'small' | 'medium';

/**
 * NumberInput Props
 *
 * 数値専用入力。`+`/`-` ボタンで値を増減する controlled component。
 * 利用シーン: チケット枚数、人数、数量等の入力。
 *
 * @example
 *   // 基本（0〜9 の範囲）
 *   <NumberInput value={count} onChange={setCount} max={9} />
 *
 * @example
 *   // 最小値 1（必須項目）
 *   <NumberInput value={passengers} onChange={setPassengers} min={1} max={20} label="人数" />
 *
 * @example
 *   // 小サイズ + ラベル付き
 *   <NumberInput
 *     value={qty}
 *     onChange={setQty}
 *     size="small"
 *     min={0}
 *     max={99}
 *     label="数量"
 *   />
 *
 * @example
 *   // カスタム aria-label（用途を明示）
 *   <NumberInput
 *     value={adults}
 *     onChange={setAdults}
 *     min={1}
 *     max={5}
 *     label="大人"
 *     decrementLabel="大人の人数を減らす"
 *     incrementLabel="大人の人数を増やす"
 *   />
 */
export interface NumberInputProps {
  /** 現在の値（controlled）。 */
  value: number;
  /** 値変更コールバック。`min`/`max` の範囲内にクランプ済みの値が渡される。 */
  onChange: (value: number) => void;
  /**
   * 最小値（境界含む）。これ以下になると `-` ボタンが disabled。
   * @default 0
   */
  min?: number;
  /**
   * 最大値（境界含む）。これ以上になると `+` ボタンが disabled。
   * @default Infinity
   */
  max?: number;
  /** ラベルテキスト。指定すると Typography で上部に表示。 */
  label?: string;
  /**
   * サイズ。
   * - `small` 40px、密集 UI 用
   * - `medium` 48px、標準
   * @default 'medium'
   */
  size?: NumberInputSize;
  /**
   * 無効状態。両方のボタンが disabled になる。
   * @default false
   */
  disabled?: boolean;
  /**
   * 減少（`-`）ボタンの aria-label。スクリーンリーダー用。
   * @default '減らす'
   */
  decrementLabel?: string;
  /**
   * 増加（`+`）ボタンの aria-label。スクリーンリーダー用。
   * @default '増やす'
   */
  incrementLabel?: string;
}

/**
 * NumberInput — Atomic Design: Composite
 *
 * @see NumberInputProps for usage examples.
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  label,
  size = 'medium',
  disabled = false,
  decrementLabel = '減らす',
  incrementLabel = '増やす',
}) => {
  const atMin = value <= min;
  const atMax = value >= max;

  const sizeStyles = {
    small: { container: 'h-10', button: 'w-10', display: 'w-8 text-sm' },
    medium: { container: 'h-12', button: 'w-12', display: 'w-10 text-base' },
  }[size];

  return (
    <div className="flex flex-col gap-1">
      {label && <Typography variant="label">{label}</Typography>}
      <div className={`flex items-center border border-border rounded-sm ${sizeStyles.container}`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || atMin}
          className={`${sizeStyles.button} h-full flex items-center justify-center text-onSurface-muted hover:text-onSurface disabled:opacity-30 transition-colors`}
          aria-label={decrementLabel}
        >
          <Icon name="remove" size="sm" color="inherit" />
        </button>
        <span className={`${sizeStyles.display} text-center font-medium text-onSurface`}>
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled || atMax}
          className={`${sizeStyles.button} h-full flex items-center justify-center text-onSurface-muted hover:text-onSurface disabled:opacity-30 transition-colors`}
          aria-label={incrementLabel}
        >
          <Icon name="add" size="sm" color="inherit" />
        </button>
      </div>
    </div>
  );
};
