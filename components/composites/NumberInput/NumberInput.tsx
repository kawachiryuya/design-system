'use client';

import React from 'react';
import { Icon } from '../../primitives/Icon';

/** NumberInput のサイズ */
export type NumberInputSize = 'sm' | 'md';

/**
 * NumberInput Props
 *
 * 数値専用入力。`+`/`-` ボタンで値を増減する controlled component。
 * 利用シーン: チケット枚数、人数、数量等の入力。
 *
 * a11y:
 * - label と +/- buttons を `role="group"` + `aria-labelledby` で関連付け
 * - value 表示に `aria-live="polite"` で値変更を SR に通知
 * - +/- buttons は `aria-label` で操作意図を明示 (decrementLabel / incrementLabel)
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
 *     size="sm"
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
  /** ラベルテキスト。指定すると上部に表示され、+/- buttons の group label として SR に伝わる。 */
  label?: string;
  /**
   * サイズ。
   * - `small` 40px、密集 UI 用
   * - `medium` 48px、標準
   * @default 'md'
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
  size = 'md',
  disabled = false,
  decrementLabel = '減らす',
  incrementLabel = '増やす',
}) => {
  const reactId = React.useId();
  const labelId = label ? `numberinput-${reactId}-label` : undefined;

  const atMin = value <= min;
  const atMax = value >= max;

  const sizeStyles = {
    sm: { container: 'h-10', button: 'w-10', display: 'w-8 text-sm' },
    md: { container: 'h-12', button: 'w-12', display: 'w-10 text-base' },
  }[size];

  // disabled state は色ベース (Button と同じ精神、bg 強い場合の半透明問題を回避)。
  // hover overlay は state-hover-primary (8% teal) で branded、白 bg 上で薄ティール tint。
  // focus-visible ring は ring-inset で container border 内側に表示。
  const buttonClasses = [
    sizeStyles.button,
    'h-full flex items-center justify-center transition-colors',
    'text-onSurface-muted hover:text-onSurface hover:bg-state-hover-primary',
    'disabled:text-onSurface-disabled disabled:cursor-not-allowed disabled:hover:bg-transparent',
    'focus:outline-none focus-visible:ring-focus focus-visible:ring-inset focus-visible:ring-border-focus',
  ].join(' ');

  // container は Input / Select と整合する bg-surface。disabled でないときは hover で border 濃化
  const containerClasses = [
    'flex items-center rounded-sm border border-border bg-surface',
    sizeStyles.container,
    disabled ? '' : 'hover:border-border-strong',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div data-ds-root className="flex flex-col gap-1">
      {label && (
        <span id={labelId} className="text-label text-onSurface">
          {label}
        </span>
      )}
      <div
        role="group"
        aria-labelledby={labelId}
        className={containerClasses}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || atMin}
          className={buttonClasses}
          aria-label={decrementLabel}
        >
          <Icon name="remove" size="sm" color="inherit" />
        </button>
        <span
          className={`${sizeStyles.display} text-center font-medium ${disabled ? 'text-onSurface-disabled' : 'text-onSurface'}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled || atMax}
          className={buttonClasses}
          aria-label={incrementLabel}
        >
          <Icon name="add" size="sm" color="inherit" />
        </button>
      </div>
    </div>
  );
};
