import React from 'react';
import { Label } from '../../primitives/Label/Label';
import { FormMessage } from '../../_internal/FormMessage';
import { FormDescription } from '../../_internal/FormDescription';

/** Radio のサイズ */
export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * RadioGroup → Radio へ error 状態を伝播する Context。
 * Group の `error` が true のとき、配下の全 Radio が自動で error スタイル / `aria-invalid` を持つ。
 * 個別 Radio が独自に `error` prop を渡せばそちらが優先される。
 */
interface RadioGroupContextValue {
  error: boolean;
}
const RadioGroupContext = React.createContext<RadioGroupContextValue>({ error: false });

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
 *   // 説明付き（description は SR にも aria-describedby で伝わる）
 *   <Radio
 *     name="plan"
 *     value="pro"
 *     label="Pro プラン"
 *     description="月額 980 円、全機能利用可能"
 *   />
 *
 * @example
 *   // 大サイズ（モバイル CTA）
 *   <Radio name="size" value="lg" label="L サイズ" size="lg" />
 *
 * @example
 *   // 個別 error (通常は RadioGroup の error と連動。個別指定すれば優先)
 *   <Radio name="agree" value="yes" label="同意する" error />
 *
 * @see principles/Patterns/forms.mdx
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * ラジオボタンのサイズ。
   * @default 'md'
   */
  size?: RadioSize;
  /** ラベルテキスト。未指定時はラジオボタンのみ表示。 */
  label?: string;
  /** ラベルの補足テキスト（caption サイズ、SR には `aria-describedby` で伝わる）。プラン詳細等。 */
  description?: string;
  /**
   * エラー状態。通常 RadioGroup の `error` から Context で自動伝播するため明示は不要。
   * 個別に渡せば Group より優先される。
   * @default false
   */
  error?: boolean;
}

/**
 * RadioGroup Props
 *
 * Radio をグルーピングし、`<fieldset>` + `<legend>` でラップ。
 * a11y: グループとして読み上げ、選択肢の意味付けが明確になる。
 * `error` は Context で配下の全 Radio に自動伝播 (個別 Radio で上書き可)。
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
 *   // 動的エラー (error が全 Radio に伝播)
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
   * エラー状態。動的 boolean OK。`true` で配下の全 Radio に Context 経由で伝播。
   * @default false
   */
  error?: boolean;
  /** エラーメッセージ。`error: true` 時に表示、`aria-describedby` で fieldset に関連付け。 */
  errorMessage?: string;
  /** ヘルプテキスト。エラー時は非表示。`aria-describedby` で fieldset に関連付け。 */
  helpText?: string;
  /**
   * 必須グループ。`legend` 末尾に `*` (`aria-label="必須"` 付き) 表示。
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
      size = 'md',
      label,
      description,
      error: errorProp,
      disabled,
      id,
      className = '',
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref
  ) => {
    const ctx = React.useContext(RadioGroupContext);
    const error = errorProp ?? ctx.error;

    const reactId = React.useId();
    const inputId = id || `radio-${reactId}`;
    const descId = description ? `${inputId}-desc` : undefined;

    const sizePx = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size];

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
      'focus-visible:ring-focus',
      'focus-visible:ring-offset-focus',
      error
        ? 'border-border-error-emphasis focus-visible:ring-border-error checked:bg-surface-error checked:border-border-error-emphasis'
        : 'border-border-strong focus-visible:ring-border-focus checked:bg-surface-primary checked:border-surface-primary',
      disabled ? 'opacity-disabled cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');

    // aria-describedby に description id と利用者指定 id を結合
    const ariaDescribedBy = [descId, ariaDescribedByProp]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <input
          ref={ref}
          type="radio"
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          className={inputClasses}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <Label
                htmlFor={inputId}
                size={size === 'lg' ? 'lg' : 'md'}
                disabled={disabled}
              >
                {label}
              </Label>
            )}
            {description && (
              <FormDescription id={descId}>{description}</FormDescription>
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
  const reactId = React.useId();
  const errorId = `radiogroup-${reactId}-error`;
  const helpId = `radiogroup-${reactId}-help`;

  const describedBy = [
    error && errorMessage ? errorId : null,
    !error && helpText ? helpId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <fieldset
      className={`border-0 p-0 m-0 ${className}`}
      aria-describedby={describedBy}
    >
      <legend className="text-label text-onSurface mb-2">
        {legend}
        {required && (
          <span className="ml-1 text-onSurface-error" aria-label="必須">*</span>
        )}
      </legend>
      <RadioGroupContext.Provider value={{ error }}>
        <div className={inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-3'}>
          {children}
        </div>
      </RadioGroupContext.Provider>
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
