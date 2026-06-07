import React from 'react';

/**
 * FilterChip Props
 *
 * 検索結果やリストの絞り込み・並び替え操作を 1 行に並べるための chip 風ボタン。
 * 「Modal を起動するエントリ」「Toggle」「アイコンのみのアクション」などフィルター
 * バー上の複合的な役割を 1 つのコンポーネントで表現する。
 *
 * 視覚的な特徴:
 * - 横長 pill 形（rounded-full）
 * - アクティブ状態は枠線 / 背景色で強調
 * - 左右にアイコンを任意配置可（dropdown 矢印やフィルターアイコン用）
 *
 * a11y:
 * - `<button>` 要素として描画、aria-pressed で active 状態を伝達
 * - アイコンのみで使う場合は `aria-label` 必須
 *
 * @example
 *   // 基本（ラベル + dropdown 矢印、タップで Modal 起動）
 *   <FilterChip
 *     iconRight={<Icon name="expand_more" size="sm" />}
 *     onClick={openSortModal}
 *   >
 *     並び順: 出発時刻順
 *   </FilterChip>
 *
 * @example
 *   // Toggle（押すたびに状態切替、aria-pressed で表現）
 *   <FilterChip
 *     active={hideSoldOut}
 *     onClick={() => setHideSoldOut(!hideSoldOut)}
 *   >
 *     満席を非表示
 *   </FilterChip>
 *
 * @example
 *   // アイコンのみ（Modal 起動、aria-label 必須）
 *   <FilterChip
 *     iconLeft={<Icon name="tune" size="sm" />}
 *     aria-label="すべての条件で絞り込み"
 *     onClick={openAllFilters}
 *   />
 */
export interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * アクティブ状態。`true` で枠線・背景色が強調され、`aria-pressed="true"` が付与される。
   * @default false
   */
  active?: boolean;
  /** 左側に配置するアイコン要素。 */
  iconLeft?: React.ReactNode;
  /** 右側に配置するアイコン要素（dropdown 矢印などに）。 */
  iconRight?: React.ReactNode;
  /**
   * ラベル。
   * 省略する場合（アイコンのみで使う場合）は `aria-label` を必ず指定すること。
   */
  children?: React.ReactNode;
}

/**
 * FilterChip — Atomic Design: Composite
 *
 * @see FilterChipProps for usage examples.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ active = false, iconLeft, iconRight, children, className = '', disabled, ...props }, ref) => {
    const stateClasses = active
      ? 'border-border-focus bg-surface-secondary text-onSurface-primary'
      : 'border-border-default bg-surface text-onSurface hover:border-border-strong';

    const classes = [
      'inline-flex items-center gap-1 px-3 h-9 rounded-full border text-label transition-colors whitespace-nowrap',
      'disabled:opacity-disabled disabled:cursor-not-allowed',
      stateClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  }
);

FilterChip.displayName = 'FilterChip';
