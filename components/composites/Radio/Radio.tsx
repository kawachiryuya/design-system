import React from 'react';
import { Label } from '../../primitives/Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/** Radio のサイズ */
export type RadioSize = 'small' | 'medium' | 'large';

/**
 * Radio Props
 *
 * 単独では使わず RadioGroup と組み合わせる。`name` 属性が同じ Radio 同士で 1 つを選択。
 *
 * @example
 *   // RadioGroup と組み合わせ（推奨）
 *   <RadioGroup legend="お支払い方法" required>
 *     <Radio name="payment" value="card" label="クレジットカード" />
 *     <Radio name="payment" value="bank" label="銀行振込" />
 *   </RadioGroup>
 *
 * @example
 *   // 説明付き
 *   <Radio
 *     name="plan"
 *     value="pro"
 *     label="Pro プラン"
 *     description="月額 980 円、全機能利用可能"
 *   />
 *
 * @example
 *   // 大サイズ（モバイル CTA）
 *   <Radio name="size" value="lg" label="L サイズ" size="large" />
 *
 * @example
 *   // エラー状態（バリデーションエラー時、通常 RadioGroup の error と連動）
 *   <Radio name="agree" value="yes" label="同意する" error />
 *
 * @see principles/patterns/forms.md
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * ラジオボタンのサイズ。
   * @default 'medium'
   */
  size?: RadioSize;
  /** ラベルテキスト。未指定時はラジオボタンのみ表示。 */
  label?: string;
  /** ラベルの補足テキスト（より小さく、ミュート色）。プラン詳細等。 */
  description?: string;
  /**
   * エラー状態。通常 RadioGroup の error と連動して使う。
   * @default false
   */
  error?: boolean;
}

/**
 * RadioGroup Props
 *
 * Radio をグルーピングし、`<fieldset>` + `<legend>` でラップ。
 * a11y: グループとして読み上げ、選択肢の意味付けが明確になる。
 *
 * **Note**: フォームでは `error` が動的 boolean になることが多いため緩い型にしている
 * （CheckboxGroup と同じ判断）。
 *
 * @example
 *   // 基本（縦並び）
 *   <RadioGroup legend="お支払い方法" required>
 *     <Radio name="payment" value="card" label="クレジットカード" />
 *     <Radio name="payment" value="bank" label="銀行振込" />
 *   </RadioGroup>
 *
 * @example
 *   // 横並び（少数の選択肢）
 *   <RadioGroup legend="性別" inline>
 *     <Radio name="gender" value="male" label="男性" />
 *     <Radio name="gender" value="female" label="女性" />
 *     <Radio name="gender" value="other" label="その他" />
 *   </RadioGroup>
 *
 * @example
 *   // 動的エラー
 *   <RadioGroup
 *     legend="プラン"
 *     required
 *     error={submitted && !selected}
 *     errorMessage="プランを選択してください"
 *   >
 *     <Radio name="plan" value="free" label="Free" />
 *     <Radio name="plan" value="pro" label="Pro" />
 *   </RadioGroup>
 */
export interface RadioGroupProps {
  /** グループのラベル（`<legend>` 要素として表示）。a11y で必須。 */
  legend: string;
  /** Radio の選択肢（複数の `<Radio>` を入れる、`name` 属性は揃える）。 */
  children: React.ReactNode;
  /**
   * エラー状態。動的 boolean OK。
   * @default false
   */
  error?: boolean;
  /** エラーメッセージ。`error: true` 時に表示。 */
  errorMessage?: string;
  /** ヘルプテキスト。エラー時は非表示。 */
  helpText?: string;
  /**
   * 必須グループ。`legend` 末尾に `*` 表示。
   * @default false
   */
  required?: boolean;
  /**
   * 横並び表示。少数の選択肢で使用。
   * @default false
   */
  inline?: boolean;
  className?: string;
}

/**
 * Radio — Atomic Design: Composite
 *
 * @see RadioProps for usage examples.
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

    const inputClasses = [
      sizePx,
      'appearance-none',
      'ds-radio',
      'rounded-full',
      'border-2',
      'cursor-pointer',
      'bg-surface',
      'transition-all',
      'duration-150',
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-1',
      error
        ? 'border-border-error focus-visible:ring-border-error checked:bg-surface-error checked:border-border-error'
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
              <Label
                htmlFor={inputId}
                size={size === 'large' ? 'large' : 'medium'}
                disabled={disabled}
              >
                {label}
              </Label>
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
 * RadioGroup — Atomic Design: Composite
 *
 * @see RadioGroupProps for usage examples.
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
