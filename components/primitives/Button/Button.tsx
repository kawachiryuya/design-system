import React from 'react';

/**
 * Button Props
 * Reference: principles/interaction/button/priority.md
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのバリアント（優先度） */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** ボタンのサイズ */
  size?: 'small' | 'medium' | 'large';
  /** ローディング状態 */
  isLoading?: boolean;
  /** アイコン（左または右） */
  icon?: React.ReactNode;
  /** アイコンの位置 */
  iconPosition?: 'left' | 'right';
  /** 全幅表示 */
  fullWidth?: boolean;
  /** ボタンの内容 */
  children: React.ReactNode;
}

/**
 * Button Component
 * 
 * Atomic Design: Atom
 * 
 * @example
 * <Button variant="primary">保存</Button>
 * <Button variant="secondary" size="small" icon={<SaveIcon />}>保存</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles - すべてのボタンに共通
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded', // 8px (tokens/radius.json)
      'transition-all',
      'duration-200', // 200ms (tokens/animation.json)
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      // State overlay — inset box-shadow で背景色を維持したまま透過レイヤーを重ねる
      // disabled 時は無効（shadow-none で上書き）
      'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)]',
      'active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]',
      'disabled:hover:shadow-none',
      'disabled:active:shadow-none',
    ];

    // Variant styles
    const variantStyles = {
      primary: [
        'bg-surface-primary',
        'text-onSurface-inverse',
        'focus-visible:ring-border-focus',
      ],
      secondary: [
        'bg-surface',
        'text-onSurface-primary',
        'border',
        'border-primary-600',
        'focus-visible:ring-border-focus',
      ],
      tertiary: [
        'bg-transparent',
        'text-onSurface-primary',
        'focus-visible:ring-border-focus',
      ],
    };

    // Size styles (tokens/spacing.json)
    const sizeStyles = {
      small: [
        'px-3',  // 12px
        'py-1',  // 4px
        'text-sm', // 14px
        'gap-1', // 4px (アイコンとテキストの間)
        'min-w-16', // 64px — 短いラベルでも潰れない
      ],
      medium: [
        'px-4',  // 16px
        'py-2',  // 8px
        'text-base', // 16px
        'gap-2', // 8px
        'min-w-20', // 80px
      ],
      large: [
        'px-6',  // 24px
        'py-3',  // 12px
        'text-lg', // 18px
        'gap-2', // 8px
        'min-w-24', // 96px
      ],
    };

    // Width styles
    const widthStyles = fullWidth ? ['w-full'] : [];

    // すべてのスタイルを結合
    const buttonClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...widthStyles,
      className,
    ].join(' ');

    // アイコンの順序を決定
    const iconElement = icon && (
      <span className="flex-shrink-0 flex items-center">{icon}</span>
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && iconPosition === 'left' && iconElement}
        {children}
        {!isLoading && iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

Button.displayName = 'Button';
