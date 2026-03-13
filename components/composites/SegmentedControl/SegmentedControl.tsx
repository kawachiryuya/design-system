import React from 'react';

export interface SegmentedControlItem<T extends string | number> {
  value: T;
  label: React.ReactNode;
}

export interface SegmentedControlProps<T extends string | number> {
  /** 選択肢 */
  items: SegmentedControlItem<T>[];
  /** 現在の値 */
  value: T;
  /** 値変更コールバック */
  onChange: (value: T) => void;
  /** サイズ */
  size?: 'small' | 'medium';
  /** aria-label */
  'aria-label'?: string;
}

export const SegmentedControl = <T extends string | number>({
  items,
  value,
  onChange,
  size = 'small',
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => {
  const sizeStyles = {
    small: 'h-10 px-3 text-sm',
    medium: 'h-12 px-4 text-base',
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
              'rounded-xs font-medium whitespace-nowrap transition-colors',
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
