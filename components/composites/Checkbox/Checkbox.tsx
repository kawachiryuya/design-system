'use client';

import React from 'react';
import { Label } from '../../primitives/Label/Label';
import { FormMessage } from '../../_internal/FormMessage';
import { FormDescription } from '../../_internal/FormDescription';

/**
 * CheckboxGroup → Checkbox へ error 状態を伝播する Context。
 * Group の `error` が true のとき、配下の全 Checkbox が自動で error スタイル / `aria-invalid` を持つ。
 * 個別 Checkbox が独自に `error` prop を渡せばそちらが優先される。
 */
interface CheckboxGroupContextValue {
  error: boolean;
}
const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue>({ error: false });

interface CheckboxBaseProps {
  /** ラベルテキスト。未指定時はチェックボックスのみ表示。 */
  label?: string;
  /** ラベルの補足テキスト (caption サイズ、SR には `aria-describedby` で伝わる)。 */
  description?: string;
  /**
   * 不確定状態（一部選択）。`indeterminate` 視覚スタイルが適用される。
   * 親 Checkbox で「全項目のうち一部選択中」を表現する用途。
   * @default false
   */
  indeterminate?: boolean;
}

/** エラー状態の Checkbox — `errorMessage` が必須 */
interface CheckboxErrorProps extends CheckboxBaseProps {
  /** エラー状態。`true` で枠線赤・`aria-invalid="true"` 自動付与。 */
  error: true;
  /** エラーメッセージ（必須）、`aria-describedby` で input に関連付け。 */
  errorMessage: string;
}

/** 通常状態の Checkbox */
interface CheckboxNormalProps extends CheckboxBaseProps {
  /** @default false */
  error?: false;
  errorMessage?: never;
}

/**
 * Checkbox Props — discriminated union
 *
 * @example
 *   // 単体 (利用規約同意等)
 *   <Checkbox label="利用規約に同意する" required />
 *
 * @example
 *   // 説明付き (description は SR にも aria-describedby で伝わる)
 *   <Checkbox
 *     label="メール通知"
 *     description="週 1 回の更新メールを受け取る"
 *   />
 *
 * @example
 *   // 不確定状態 (親「全て選択」で一部選択中)
 *   <Checkbox label="全て選択" indeterminate checked={someSelected} />
 *
 * @example
 *   // エラー状態 (errorMessage 必須)
 *   <Checkbox
 *     label="プライバシーポリシーに同意"
 *     error
 *     errorMessage="同意が必要です"
 *   />
 */
export type CheckboxProps =
  (CheckboxErrorProps | CheckboxNormalProps) &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

/** Internal flexible type */
type _InternalCheckboxProps = CheckboxBaseProps & {
  error?: boolean;
  errorMessage?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

/**
 * Checkbox — Atomic Design: Composite
 *
 * @see CheckboxProps for usage examples.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const {
      label,
      description,
      error: errorProp,
      errorMessage,
      indeterminate = false,
      disabled,
      id,
      className = '',
      'aria-describedby': ariaDescribedByProp,
      ...rest
    } = props as _InternalCheckboxProps;

    const ctx = React.useContext(CheckboxGroupContext);
    const error = errorProp ?? ctx.error;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    const reactId = React.useId();
    const inputId = id || `checkbox-${reactId}`;
    const descId = description ? `${inputId}-desc` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    const inputClasses = [
      'w-5',
      'h-5',
      'appearance-none',
      'ds-checkbox',
      'rounded-sm',
      'border-2',
      'cursor-pointer',
      'bg-surface',
      'bg-center',
      'bg-no-repeat',
      'transition-all',
      'duration-150',
      'focus:outline-none',
      'focus-visible:ring-focus',
      'focus-visible:ring-offset-focus',
      error
        ? 'border-border-error-emphasis focus-visible:ring-border-error checked:bg-surface-error checked:border-border-error-emphasis'
        : 'border-border-strong focus-visible:ring-border-focus checked:bg-surface-primary checked:border-border-focus',
      disabled ? 'opacity-disabled cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');

    // aria-describedby に description / errorMessage id と利用者指定 id を結合
    const ariaDescribedBy = [
      descId,
      error && errorId ? errorId : null,
      ariaDescribedByProp,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-start gap-2">
          <input
            ref={resolvedRef}
            type="checkbox"
            id={inputId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={ariaDescribedBy}
            className={inputClasses}
            {...rest}
          />
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <Label
                  htmlFor={inputId}
                  size="md"
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
        {error && errorMessage && (
          <div className="ml-8">
            <FormMessage error={error} errorMessage={errorMessage} errorId={errorId} />
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * CheckboxGroup Props
 *
 * Checkbox をグルーピングし、`<fieldset>` + `<legend>` でラップ。
 * エラー時は legend と children の下にエラーメッセージ表示。
 * `error` は Context で配下の全 Checkbox に自動伝播 (個別 Checkbox で上書き可)。
 *
 * **Note**: フォームでは `error` が動的 boolean になることが多いため、Checkbox 単体と異なり
 * discriminated union ではなく緩い型にしている。`errorMessage` は `error: true` 時のみ表示。
 *
 * @example
 *   // 基本（縦並び）
 *   <CheckboxGroup legend="通知設定" helpText="複数選択できます">
 *     <Checkbox label="メール" />
 *     <Checkbox label="プッシュ" />
 *   </CheckboxGroup>
 *
 * @example
 *   // 横並び
 *   <CheckboxGroup legend="言語" inline>
 *     <Checkbox label="日本語" />
 *     <Checkbox label="English" />
 *   </CheckboxGroup>
 *
 * @example
 *   // 動的エラー (error が Context で全 Checkbox に伝播)
 *   <CheckboxGroup
 *     legend="興味のあるトピック"
 *     required
 *     error={submitted && selected.length === 0}
 *     errorMessage="1 つ以上選択してください"
 *   >
 *     <Checkbox label="技術" />
 *     <Checkbox label="ビジネス" />
 *   </CheckboxGroup>
 */
export interface CheckboxGroupProps {
  /** グループのラベル（`<legend>` 要素として表示）。a11y で fieldset とセットで必須。 */
  legend: string;
  /** Checkbox の選択肢（複数の `<Checkbox>` を入れる）。 */
  children: React.ReactNode;
  /**
   * エラー状態。動的 boolean OK。`true` で配下の全 Checkbox に Context 経由で伝播。
   * @default false
   */
  error?: boolean;
  /** エラーメッセージ。`error: true` 時に legend/children の下に表示。 */
  errorMessage?: string;
  /** ヘルプテキスト。エラー時は非表示。 */
  helpText?: string;
  /**
   * 必須グループ。`legend` 末尾に `*` が `aria-label="必須"` 付きで表示される。
   * @default false
   */
  required?: boolean;
  /**
   * 横並び表示（フレックスラップ）。少数の選択肢で水平に並べたい場合。
   * @default false
   */
  inline?: boolean;
  className?: string;
}

/**
 * CheckboxGroup — Atomic Design: Composite
 *
 * @see CheckboxGroupProps for usage examples.
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
  const reactId = React.useId();
  const errorId = `checkboxgroup-${reactId}-error`;
  const helpId = `checkboxgroup-${reactId}-help`;

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
      <CheckboxGroupContext.Provider value={{ error }}>
        <div className={inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-3'}>
          {children}
        </div>
      </CheckboxGroupContext.Provider>
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
