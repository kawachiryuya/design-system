import React from 'react';

/** SegmentedControl のサイズ */
export type SegmentedControlSize = 'sm' | 'md';

/** SegmentedControl の選択肢アイテム */
export interface SegmentedControlItem<T extends string | number> {
  /** 値（一意）。 */
  value: T;
  /** ラベル（テキスト or 簡単な ReactNode）。 */
  label: React.ReactNode;
}

/**
 * SegmentedControl Props
 *
 * 排他的な選択肢を横並びで表示する UI（iOS の Segmented Control 風）。
 * 用途: フィルター切替、表示モード切替（リスト/グリッド等）、少数（2〜5 個）の排他的選択。
 *
 * @example
 *   // 基本（表示モード切替）
 *   <SegmentedControl
 *     items={[
 *       { value: 'list', label: 'リスト' },
 *       { value: 'grid', label: 'グリッド' },
 *     ]}
 *     value={mode}
 *     onChange={setMode}
 *     aria-label="表示モード"
 *   />
 *
 * @example
 *   // 数値（フィルター期間）
 *   <SegmentedControl
 *     items={[
 *       { value: 7, label: '7 日' },
 *       { value: 30, label: '30 日' },
 *       { value: 90, label: '90 日' },
 *     ]}
 *     value={days}
 *     onChange={setDays}
 *     aria-label="期間"
 *   />
 *
 * @example
 *   // アイコン付きラベル
 *   <SegmentedControl
 *     items={[
 *       { value: 'asc', label: <><Icon name="arrow_upward" /> 昇順</> },
 *       { value: 'desc', label: <><Icon name="arrow_downward" /> 降順</> },
 *     ]}
 *     value={order}
 *     onChange={setOrder}
 *   />
 */
export interface SegmentedControlProps<T extends string | number> {
  /** 選択肢の配列。順序通りに表示される。 */
  items: SegmentedControlItem<T>[];
  /** 現在の値（controlled、`items[].value` のいずれかと一致）。 */
  value: T;
  /** 値変更コールバック。新しい値が引数に渡される。 */
  onChange: (value: T) => void;
  /**
   * サイズ。
   * - `small` 40px、コンパクト UI（フィルターバー等）
   * - `medium` 48px、標準
   * @default 'sm'
   */
  size?: SegmentedControlSize;
  /** aria-label（グループとしての用途を説明、a11y で推奨）。 */
  'aria-label'?: string;
}

/**
 * SegmentedControl — Atomic Design: Composite
 *
 * @see SegmentedControlProps for usage examples.
 */
export const SegmentedControl = <T extends string | number>({
  items,
  value,
  onChange,
  size = 'sm',
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => {
  const sizeStyles = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
  }[size];

  return (
    <div className="flex gap-1 overflow-x-auto" role="group" aria-label={ariaLabel}>
      {items.map((item) => {
        const isSelected = item.value === value;
        return (
          <button
            key={String(item.value)}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              sizeStyles,
              'rounded-sm font-medium whitespace-nowrap transition-colors',
              isSelected
                ? 'bg-surface-primary text-onSurface-inverse'
                : 'bg-surface border border-border-muted text-onSurface hover:border-border-strong',
            ].join(' ')}
            aria-pressed={isSelected}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
