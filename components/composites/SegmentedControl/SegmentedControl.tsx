import React from 'react';

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
 * a11y: `role="radiogroup"` + 各 option `role="radio"` / `aria-checked`。グループ全体で Tab 1 ストップ
 * (roving tabindex)、矢印キー (`←` `→` `↑` `↓` / `Home` / `End`) で移動 = 即選択。
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
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => {
  // h-10 (40px) = Material 3 segmented button 標準値。filter bar / view mode switcher 用途
  const segmentSizeStyle = 'h-10 px-3 text-sm';

  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // 単一選択コントロールの正準パターン = radiogroup + roving tabindex。
  // 選択中の radio のみ Tab ストップ (tabIndex=0)、未選択時は先頭を Tab ストップにする。
  const selectedIndex = items.findIndex((item) => item.value === value);
  const focusableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  // 矢印キーで移動 = 即選択 (Tabs.handleKeyDown と同型)。SegmentedControl に disabled は無い。
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      onChange(items[nextIndex].value);
      btnRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-1 overflow-x-auto" role="radiogroup" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const isSelected = item.value === value;
        return (
          <button
            key={String(item.value)}
            ref={(el) => { btnRefs.current[index] = el; }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={index === focusableIndex ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            // inline-flex items-center justify-center で label 内コンテンツ (icon + text 等) を縦中央配置。
            // selected 時も border を残す (border-transparent) ことで高さを揃え layout shift 防止。
            // 非 selected hover に bg-state-hover-primary (8% teal) で branded feedback。
            // focus ring の色は selected 時は白 (teal bg との contrast 確保)、非 selected は teal。
            className={[
              segmentSizeStyle,
              'inline-flex items-center justify-center border rounded-sm font-medium whitespace-nowrap transition-colors',
              'focus:outline-none focus-visible:ring-focus focus-visible:ring-inset',
              isSelected
                ? 'bg-surface-primary border-transparent text-onSurface-inverse focus-visible:ring-surface'
                : 'bg-surface border-border-subtle text-onSurface hover:border-border-strong hover:bg-state-hover-primary focus-visible:ring-border-focus',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
