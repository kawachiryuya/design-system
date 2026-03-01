import React from 'react';

/**
 * Select Props
 * Reference: principles/patterns/forms.md
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** サイズ */
  size?: 'small' | 'medium' | 'large';
  /** ラベル */
  label?: string;
  /** 先頭に表示するプレースホルダー選択肢 */
  placeholder?: string;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 全幅 */
  fullWidth?: boolean;
}

/**
 * Select Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Select label="都道府県" required>
 *   <option value="tokyo">東京都</option>
 *   <option value="osaka">大阪府</option>
 * </Select>
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'medium',
      label,
      placeholder,
      error = false,
      errorMessage,
      helpText,
      fullWidth = false,
      disabled,
      required,
      id,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helpId = selectId ? `${selectId}-help` : undefined;

    const sizeStyles = {
      small: 'px-3 py-1 text-sm',
      medium: 'px-3 py-2 text-base',
      large: 'px-4 py-3 text-lg',
    }[size];

    const stateStyles = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-300 bg-error-50'
      : 'border-neutral-300 hover:border-neutral-400 focus:border-primary-600 focus:ring-primary-300 bg-white';

    const selectClasses = [
      'block',
      'rounded',
      'border',
      'text-neutral-800',
      'appearance-none',
      'cursor-pointer',
      'pr-10',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',
      disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : '',
      fullWidth ? 'w-full' : '',
      sizeStyles,
      stateStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-neutral-700">
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-label="必須">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-required={required ? true : undefined}
            aria-describedby={describedBy}
            className={selectClasses}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {/* カスタム下矢印アイコン */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {error && errorMessage && (
          <p id={errorId} className="text-sm text-error-600" role="alert">{errorMessage}</p>
        )}
        {!error && helpText && (
          <p id={helpId} className="text-sm text-neutral-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
