import React from 'react';
import { FormMessage } from '../../_internal/FormMessage';

/**
 * Radio Props
 * Reference: principles/patterns/forms.md
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** ラジオボタンのサイズ */
  size?: 'small' | 'medium' | 'large';
  /** ラベルテキスト */
  label?: string;
  /** ラベルの補足テキスト */
  description?: string;
  /** エラー状態 */
  error?: boolean;
}

/**
 * RadioGroup Props
 */
export interface RadioGroupProps {
  /** グループのラベル */
  legend: string;
  /** ラジオボタンの選択肢 */
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
 * Radio Component
 *
 * Atomic Design: Atom
 *
 * 単独では使わず RadioGroup と組み合わせて使用する。
 *
 * @example
 * <RadioGroup legend="お支払い方法" required>
 *   <Radio name="payment" value="card" label="クレジットカード" />
 *   <Radio name="payment" value="bank" label="銀行振込" />
 * </RadioGroup>
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = 'medium',
      label,
      description,
      error = false,
      disabled,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `radio-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    const sizePx = { small: 'w-4 h-4', medium: 'w-5 h-5', large: 'w-6 h-6' }[size];
    const labelSize = { small: 'text-sm', medium: 'text-sm', large: 'text-base' }[size];

    const inputClasses = [
      sizePx,
      'rounded-full',
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
      <div className={`flex items-start gap-2 ${className}`}>
        <input
          ref={ref}
          type="radio"
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
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
    );
  }
);

Radio.displayName = 'Radio';

/**
 * RadioGroup Component
 *
 * Radio をグルーピングし、アクセシブルな fieldset でラップする。
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  legend,
  children,
  error = false,
  errorMessage,
  helpText,
  required = false,
  inline = false,
  className = '',
}) => {
  const errorId = `radiogroup-${legend.replace(/\s+/g, '-').toLowerCase()}-error`;
  const helpId = `radiogroup-${legend.replace(/\s+/g, '-').toLowerCase()}-help`;

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

RadioGroup.displayName = 'RadioGroup';
