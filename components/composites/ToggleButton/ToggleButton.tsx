import React from 'react';

export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 選択状態 */
  selected?: boolean;
  /** ボタンの内容 */
  children: React.ReactNode;
}

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
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus',
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
