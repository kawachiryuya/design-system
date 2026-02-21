import React from 'react';

/**
 * Checkbox Props
 * Reference: principles/patterns/forms.md
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** チェックボックスのサイズ */
  size?: 'small' | 'medium' | 'large';
  /** ラベルテキスト */
  label?: string;
  /** ラベルの補足テキスト */
  description?: string;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** 不確定状態（一部選択） */
  indeterminate?: boolean;
}

/**
 * Checkbox Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Checkbox label="利用規約に同意する" required />
 * <Checkbox label="全て選択" indeterminate />
 * <Checkbox label="メール通知" description="週1回の更新メールを受け取る" />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'medium',
      label,
      description,
      error = false,
      errorMessage,
      indeterminate = false,
      disabled,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    const inputId = id || (label ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;

    const sizePx = { small: 'w-4 h-4', medium: 'w-5 h-5', large: 'w-6 h-6' }[size];
    const labelSize = { small: 'text-sm', medium: 'text-sm', large: 'text-base' }[size];

    const inputClasses = [
      sizePx,
      'rounded',
      'border-2',
      'cursor-pointer',
      'transition-all',
      'duration-150',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1',
      error
        ? 'border-error-500 focus:ring-error-300 checked:bg-error-500'
        : 'border-neutral-400 focus:ring-primary-300 checked:bg-primary-600 checked:border-primary-600',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-start gap-2">
          <input
            ref={resolvedRef}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={error && errorId ? errorId : undefined}
            className={inputClasses}
            {...props}
          />
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <label
                  htmlFor={inputId}
                  className={`${labelSize} font-medium leading-tight select-none ${
                    disabled ? 'text-neutral-400 cursor-not-allowed' : 'text-neutral-700 cursor-pointer'
                  }`}
                >
                  {label}
                </label>
              )}
              {description && (
                <span className="text-xs text-neutral-500 leading-normal">{description}</span>
              )}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p id={errorId} className="text-sm text-error-600 ml-7" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
