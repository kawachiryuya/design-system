import React from 'react';
import { FormMessage } from '../../_internal/FormMessage';

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
      'focus-visible:ring-2',
      'focus-visible:ring-offset-1',
      error
        ? 'border-border-error focus-visible:ring-border-error checked:bg-surface-error'
        : 'border-border-strong focus-visible:ring-border-focus checked:bg-surface-primary checked:border-surface-primary',
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
                    disabled ? 'text-onSurface-disabled cursor-not-allowed' : 'text-onSurface cursor-pointer'
                  }`}
                >
                  {label}
                </label>
              )}
              {description && (
                <span className="text-xs text-onSurface-muted leading-normal">{description}</span>
              )}
            </div>
          )}
        </div>
        <div className="ml-7">
          <FormMessage error={error} errorMessage={errorMessage} errorId={errorId} />
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * CheckboxGroup Props
 */
export interface CheckboxGroupProps {
  /** グループのラベル */
  legend: string;
  /** チェックボックスの選択肢 */
  children: React.ReactNode;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 必須 */
  required?: boolean;
  /** 横並び */
  inline?: boolean;
  className?: string;
}

/**
 * CheckboxGroup Component
 *
 * Checkbox をグルーピングし、アクセシブルな fieldset でラップする。
 *
 * @example
 * <CheckboxGroup legend="通知設定" helpText="複数選択できます">
 *   <Checkbox label="メール" />
 *   <Checkbox label="プッシュ" />
 * </CheckboxGroup>
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  legend,
  children,
  error = false,
  errorMessage,
  helpText,
  required = false,
  inline = false,
  className = '',
}) => {
  const errorId = `checkboxgroup-${legend.replace(/\s+/g, '-').toLowerCase()}-error`;
  const helpId = `checkboxgroup-${legend.replace(/\s+/g, '-').toLowerCase()}-help`;

  return (
    <fieldset
      className={`border-0 p-0 m-0 ${className}`}
      aria-describedby={
        [error && errorMessage ? errorId : null, !error && helpText ? helpId : null]
          .filter(Boolean)
          .join(' ') || undefined
      }
    >
      <legend className="text-sm font-medium text-onSurface mb-2">
        {legend}
        {required && (
          <span className="ml-1 text-onSurface-error" aria-label="必須">*</span>
        )}
      </legend>
      <div className={inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2'}>
        {children}
      </div>
      <div className="mt-1">
        <FormMessage
          helpText={helpText}
          helpId={helpId}
          error={error}
          errorMessage={errorMessage}
          errorId={errorId}
        />
      </div>
    </fieldset>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';
