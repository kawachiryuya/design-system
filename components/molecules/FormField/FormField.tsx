import React, { useId } from 'react';
import { Label } from '../../atoms/Label/Label';

/**
 * FormField Props
 * Reference: principles/patterns/forms.md
 *
 * Molecule: Label + 任意のフォームコントロール + helpText + エラーメッセージ
 * を統一したレイアウトで提供する汎用ラッパー。
 *
 * Input/Select/Textarea はすでに label を内包しているが、
 * RadioGroup・Checkbox グループ・カスタムコントロール等、
 * ラベルを外から与えたい場合に FormField を使用する。
 */
export interface FormFieldProps {
  /** ラベルテキスト */
  label: string;
  /** 必須フィールド */
  required?: boolean;
  /** 任意フィールド */
  optional?: boolean;
  /** ヘルプテキスト（エラーより優先度低） */
  helpText?: string;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /**
   * 子コントロールの id に紐付けるための htmlFor。
   * 省略すると自動生成された id を使用し、children に fieldId を渡す。
   */
  htmlFor?: string;
  /**
   * children に fieldId（自動生成 or htmlFor）を渡すレンダープロップ形式もサポート。
   * 通常の JSX children でも動作する。
   */
  children: React.ReactNode | ((fieldId: string) => React.ReactNode);
  /** 追加CSSクラス（外側のラッパー） */
  className?: string;
  /** ラベルのサイズ */
  labelSize?: 'small' | 'medium' | 'large';
  /** フィールド全体の無効状態 */
  disabled?: boolean;
}

/**
 * FormField Component
 *
 * Atomic Design: Molecule（Label Atom + children slot + helpText/error）
 *
 * @example
 * // RadioGroup との組み合わせ
 * <FormField label="配送方法" required error errorMessage="選択してください">
 *   <RadioGroup legend="配送方法" visuallyHideLegend>
 *     <Radio name="delivery" value="standard" label="標準配送" />
 *   </RadioGroup>
 * </FormField>
 *
 * // レンダープロップで id を自動紐付け
 * <FormField label="カスタム入力">
 *   {(id) => <MyCustomInput id={id} />}
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  optional = false,
  helpText,
  error = false,
  errorMessage,
  htmlFor,
  children,
  className = '',
  labelSize = 'medium',
  disabled = false,
}) => {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  const resolvedChildren =
    typeof children === 'function' ? children(fieldId) : children;

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      <Label
        htmlFor={fieldId}
        size={labelSize}
        required={required}
        optional={optional}
        disabled={disabled}
      >
        {label}
      </Label>

      <div
        role="group"
        aria-labelledby={undefined}
        aria-describedby={
          [error && errorMessage ? errorId : null, helpText && !error ? helpId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
      >
        {resolvedChildren}
      </div>

      {helpText && !error && (
        <p id={helpId} className="text-xs text-neutral-500 leading-relaxed">
          {helpText}
        </p>
      )}

      {error && errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-xs text-error-600 leading-relaxed"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
