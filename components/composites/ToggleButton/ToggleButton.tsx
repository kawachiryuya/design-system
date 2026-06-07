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
    // hover / active は Button と同じく inset shadow で state-layer overlay を重ねる。
    // bg の色に応じて overlay の色味を選ぶ (Button primary / secondary の pattern と整合):
    // - default (白 bg): state-hover-primary (8% teal) で branded な薄ティール tint
    // - selected (teal bg): state-hover (8% black) で明確な darken
    const stateStyles = disabled
      ? 'bg-surface-disabled text-onSurface-disabled cursor-not-allowed'
      : selected
        ? [
            'bg-surface-primary text-onSurface-inverse',
            'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)]',
            'active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]',
          ].join(' ')
        : [
            'bg-surface border border-border-default text-onSurface hover:border-border-strong',
            'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover-primary)]',
            'active:shadow-[inset_0_0_0_9999px_var(--color-state-active-primary)]',
          ].join(' ');

    const classes = [
      'inline-flex items-center justify-center',
      'w-10 h-10 rounded text-body-sm font-medium transition-colors',
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
