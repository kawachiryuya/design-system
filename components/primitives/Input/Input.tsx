import React from 'react';
import { FormMessage } from '../../_internal/FormMessage';

/**
 * Input Props
 * Reference: principles/patterns/forms.md
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 入力タイプ */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
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
      'rounded-sm',
      'border',
      'bg-surface',
      'text-onSurface',
      'placeholder:text-onSurface-subtle',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:bg-surface-disabled',
      fullWidth ? 'w-full' : '',
    ];

    // State styles
    const stateStyles = error
      ? [
          'border-border-error',
          'focus:border-border-error',
          'focus:ring-border-error',
          'bg-surface-error-muted',
        ]
      : [
          'border-border',
          'hover:border-border-strong',
          'focus:border-border-focus',
          'focus:ring-border-focus',
        ];

    // Size styles (tokens/spacing.json)
    // 明示的 height でタッチターゲットを保証（WCAG 2.5.5 AAA: 44px）
    const sizeStyles = {
      small: [
        'h-10',  // 40px
        leadingIcon ? 'pl-10' : 'px-3',
        trailingIcon ? 'pr-10' : 'px-3',
        'text-sm',
      ],
      medium: [
        'h-12',  // 48px
        leadingIcon ? 'pl-12' : 'px-3',
        trailingIcon ? 'pr-12' : 'px-3',
        'text-base',
      ],
      large: [
        'h-16',  // 64px
        leadingIcon ? 'pl-12' : 'px-4',
        trailingIcon ? 'pr-12' : 'px-4',
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

    // Icon container positioning
    const leadingIconPosition = {
      small: 'left-3',
      medium: 'left-3',
      large: 'left-4',
    }[size];

    const trailingIconPosition = {
      small: 'right-3',
      medium: 'right-3',
      large: 'right-4',
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
            className="text-sm font-medium text-onSurface"
          >
            {label}
            {required && (
              <span className="ml-1 text-onSurface-error" aria-label="必須">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper（アイコン配置のため） */}
        <div className="relative">
          {leadingIcon && (
            <span
              className={`absolute ${leadingIconPosition} top-1/2 -translate-y-1/2 text-onSurface-subtle pointer-events-none flex items-center justify-center`}
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
              className={`absolute ${trailingIconPosition} top-1/2 -translate-y-1/2 text-onSurface-subtle pointer-events-none flex items-center justify-center`}
            >
              {trailingIcon}
            </span>
          )}
        </div>

        <FormMessage
          helpText={helpText}
          helpId={helpId}
          error={error}
          errorMessage={errorMessage}
          errorId={errorId}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
