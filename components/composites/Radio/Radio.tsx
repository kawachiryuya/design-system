import React from 'react';

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
  required = false,
  inline = false,
  className = '',
}) => {
  const errorId = `radiogroup-${legend.replace(/\s+/g, '-').toLowerCase()}-error`;

  return (
    <fieldset
      className={`border-0 p-0 m-0 ${className}`}
      aria-describedby={error && errorMessage ? errorId : undefined}
    >
      <legend className="text-sm font-medium text-neutral-700 mb-2">
        {legend}
        {required && (
          <span className="ml-1 text-error-500" aria-label="必須">*</span>
        )}
      </legend>
      <div className={inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2'}>
        {children}
      </div>
      {error && errorMessage && (
        <p id={errorId} className="mt-1 text-sm text-error-600" role="alert">
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
};

RadioGroup.displayName = 'RadioGroup';
