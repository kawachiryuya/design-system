import React from 'react';

/**
 * ToggleButton Props
 *
 * 単一トグル可能ボタン。`aria-pressed` で押下状態を表現。
 * 用途: カレンダーの日付選択、グリッド内の単一項目トグル等。
 *
 * @example
 *   // 基本（controlled）
 *   <ToggleButton selected={isOn} onClick={() => setOn(!isOn)}>
 *     12
 *   </ToggleButton>
 *
 * @example
 *   // カレンダー日付グリッドの 1 マス
 *   <ToggleButton
 *     selected={selectedDate === date}
 *     onClick={() => setSelectedDate(date)}
 *     aria-label={`${date.toLocaleDateString()}を選択`}
 *   >
 *     {date.getDate()}
 *   </ToggleButton>
 *
 * @example
 *   // disabled
 *   <ToggleButton selected={false} disabled>×</ToggleButton>
 */
export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * 選択状態。`aria-pressed` 属性として反映され、視覚スタイルも切り替わる。
   * @default false
   */
  selected?: boolean;
  /** ボタンの内容（数字・短いラベル等）。必須。 */
  children: React.ReactNode;
}

/**
 * ToggleButton — Atomic Design: Composite
 *
 * @see ToggleButtonProps for usage examples.
 */
export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ selected = false, disabled = false, children, className = '', ...props }, ref) => {
    const stateStyles = disabled
      ? 'bg-surface-inset text-onSurface-disabled cursor-not-allowed'
      : selected
        ? 'bg-surface-primary text-onSurface-inverse'
        : 'bg-surface border border-border-default text-onSurface hover:border-border-strong';

    const classes = [
      'inline-flex items-center justify-center',
      'w-10 h-10 rounded text-xs font-medium transition-colors',
      'focus:outline-none focus-visible:ring-focus focus-visible:ring-offset-focus focus-visible:ring-border-focus',
      stateStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
