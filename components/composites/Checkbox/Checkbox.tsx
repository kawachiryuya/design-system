import React from 'react';
import { Label } from '../../primitives/Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/** Checkbox のサイズ */
export type CheckboxSize = 'small' | 'medium' | 'large';

interface CheckboxBaseProps {
  /**
   * チェックボックスのサイズ。
   * @default 'medium'
   */
  size?: CheckboxSize;
  /** ラベルテキスト。未指定時はチェックボックスのみ表示。 */
  label?: string;
  /** ラベルの補足テキスト（より小さく、ミュート色で 1〜2 行）。 */
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
  /** エラーメッセージ（必須）。 */
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
 *   // 単体（必須）
 *   <Checkbox label="利用規約に同意する" required />
 *
 * @example
 *   // 説明付き
 *   <Checkbox
 *     label="メール通知"
 *     description="週 1 回の更新メールを受け取る"
 *   />
 *
 * @example
 *   // 不確定状態（親チェックで一部選択中）
 *   <Checkbox label="全て選択" indeterminate checked={someSelected} />
 *
 * @example
 *   // エラー状態（errorMessage 必須）
 *   <Checkbox
 *     label="プライバシーポリシーに同意"
 *     error
 *     errorMessage="同意が必要です"
 *   />
 *
 * @see principles/Patterns/forms.md
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
      size = 'medium',
      label,
      description,
      error = false,
      errorMessage,
      indeterminate = false,
      disabled,
      id,
      className = '',
      ...rest
    } = props as _InternalCheckboxProps;

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

    const inputClasses = [
      sizePx,
      'appearance-none',
      'ds-checkbox',
      'rounded-xs',
      'border-2',
      'cursor-pointer',
      'bg-surface',
      'bg-center',
      'bg-no-repeat',
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
            {...rest}
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
 *
 * Checkbox をグルーピングし、`<fieldset>` + `<legend>` でラップ。
 * エラー時は legend と children の下にエラーメッセージ表示。
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
 *   // 動的エラー（フォームバリデーション）
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
   * エラー状態。動的 boolean OK。`true` 時のみ `errorMessage` が表示される。
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
