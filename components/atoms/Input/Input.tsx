import React from 'react';

/**
 * Input Props
 * Reference: principles/patterns/forms.md
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 入力タイプ */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** サイズ */
  size?: 'small' | 'medium' | 'large';
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** ヘルプテキスト（エラー時は非表示） */
  helpText?: string;
  /** 全幅表示 */
  fullWidth?: boolean;
  /** 左側アイコン */
  leadingIcon?: React.ReactNode;
  /** 右側アイコン */
  trailingIcon?: React.ReactNode;
  /** ラベル */
  label?: string;
  /** 一意のID（aria関連付けに使用） */
  id?: string;
}

/**
 * Input Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Input label="メールアドレス" type="email" placeholder="example@email.com" required />
 * <Input label="パスワード" type="password" error errorMessage="8文字以上で入力してください" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'medium',
      error = false,
      errorMessage,
      helpText,
      fullWidth = false,
      leadingIcon,
      trailingIcon,
      label,
      id,
      disabled,
      required,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helpId = inputId ? `${inputId}-help` : undefined;

    // Base wrapper styles
    const wrapperStyles = ['flex', 'flex-col', 'gap-1', fullWidth ? 'w-full' : 'w-auto'].join(' ');

    // Base input styles
    const baseStyles = [
      'block',
      'rounded',
      'border',
      'bg-white',
      'text-neutral-800',
      'placeholder:text-neutral-400',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:bg-neutral-100',
      fullWidth ? 'w-full' : '',
    ];

    // State styles
    const stateStyles = error
      ? [
          'border-error-500',
          'focus:border-error-500',
          'focus:ring-error-300',
          'bg-error-50',
        ]
      : [
          'border-neutral-300',
          'hover:border-neutral-400',
          'focus:border-primary-600',
          'focus:ring-primary-300',
        ];

    // Size styles (tokens/spacing.json)
    const sizeStyles = {
      small: [
        leadingIcon ? 'pl-8' : 'px-3',
        trailingIcon ? 'pr-8' : 'px-3',
        'py-1',   // 4px
        'text-sm',
      ],
      medium: [
        leadingIcon ? 'pl-10' : 'px-3',
        trailingIcon ? 'pr-10' : 'px-3',
        'py-2',   // 8px
        'text-base',
      ],
      large: [
        leadingIcon ? 'pl-12' : 'px-4',
        trailingIcon ? 'pr-12' : 'px-4',
        'py-3',   // 12px
        'text-lg',
      ],
    };

    const inputClasses = [
      ...baseStyles,
      ...stateStyles,
      ...sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Icon size per input size
    const iconSizeClass = {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
      large: 'w-6 h-6',
    }[size];

    // Icon container positioning
    const leadingIconPosition = {
      small: 'left-2',
      medium: 'left-3',
      large: 'left-3',
    }[size];

    const trailingIconPosition = {
      small: 'right-2',
      medium: 'right-3',
      large: 'right-3',
    }[size];

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={wrapperStyles}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-label="必須">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper（アイコン配置のため） */}
        <div className="relative">
          {leadingIcon && (
            <span
              className={`absolute ${leadingIconPosition} top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none ${iconSizeClass}`}
            >
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className={inputClasses}
            {...props}
          />

          {trailingIcon && (
            <span
              className={`absolute ${trailingIconPosition} top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none ${iconSizeClass}`}
            >
              {trailingIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <p
            id={errorId}
            className="text-sm text-error-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* Help text（エラー時は非表示） */}
        {!error && helpText && (
          <p id={helpId} className="text-sm text-neutral-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
