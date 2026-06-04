import React from 'react';
import { Label } from '../Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/** Textarea のリサイズ挙動 */
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

interface TextareaBaseProps {
  /** ラベルテキスト。指定すると `<label>` 要素が自動生成され `htmlFor`/`aria-*` 関連付けされる。 */
  label?: string;
  /** ヘルプテキスト（補助説明）。エラー時は非表示になり `errorMessage` に置き換わる。 */
  helpText?: string;
  /** 全幅表示（親要素の幅に追従）。 */
  fullWidth?: boolean;
  /** 現在の文字数（カウンター表示用）。`maxLength` と組で使う。 */
  currentLength?: number;
  /** 最大文字数。指定するとラベル横にカウンター（`{currentLength}/{maxLength}`）が表示される。 */
  maxLength?: number;
  /**
   * リサイズ挙動。
   * @default 'vertical'
   */
  resize?: TextareaResize;
}

/** エラー状態の Textarea — `errorMessage` が必須 */
interface TextareaErrorProps extends TextareaBaseProps {
  /** エラー状態。`true` で枠線赤・背景色変化・`aria-invalid="true"` 自動付与。 */
  error: true;
  /** エラーメッセージ（必須）。`aria-describedby` で textarea に関連付けられる。 */
  errorMessage: string;
}

/** 通常状態の Textarea */
interface TextareaNormalProps extends TextareaBaseProps {
  /** @default false */
  error?: false;
  /** 通常状態では使用不可。 */
  errorMessage?: never;
}

/**
 * Textarea Props — discriminated union
 *
 * `error` の値で型が分岐する（Input と同パターン）:
 * - `error: true` → `errorMessage` 必須
 * - `error: false`（または省略） → `errorMessage` 使用不可
 *
 * @example
 *   // 基本（rows + required）
 *   <Textarea label="お問い合わせ内容" rows={5} required />
 *
 * @example
 *   // 文字数カウンター付き
 *   <Textarea
 *     label="自己紹介"
 *     maxLength={500}
 *     currentLength={value.length}
 *     value={value}
 *     onChange={(e) => setValue(e.target.value)}
 *   />
 *
 * @example
 *   // エラー状態（errorMessage が型レベルで必須）
 *   <Textarea
 *     label="コメント"
 *     error
 *     errorMessage="500 文字以内で入力してください"
 *   />
 *
 * @example
 *   // ヘルプテキスト + リサイズ無効
 *   <Textarea label="備考" helpText="任意で入力してください" resize="none" />
 *
 * @example
 *   // 全幅 + 大きめ
 *   <Textarea label="議事録" rows={10} fullWidth />
 *
 * @see principles/Patterns/forms.mdx
 */
export type TextareaProps =
  (TextareaErrorProps | TextareaNormalProps) &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Internal flexible type to allow destructuring across both discriminants */
type _InternalTextareaProps = TextareaBaseProps & {
  error?: boolean;
  errorMessage?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea — Atomic Design: Atom
 *
 * @see TextareaProps for usage examples.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      label,
      error = false,
      errorMessage,
      helpText,
      fullWidth = false,
      currentLength,
      maxLength,
      resize = 'vertical',
      disabled,
      required,
      id,
      className = '',
      ...rest
    } = props as _InternalTextareaProps;

    const textareaId = id || (label ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = textareaId ? `${textareaId}-error` : undefined;
    const helpId = textareaId ? `${textareaId}-help` : undefined;

    const resizeClass = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }[resize];

    const stateStyles = error
      ? 'border-border-error focus:border-border-error focus:ring-border-error bg-surface-error-muted'
      : 'border-border hover:border-border-strong focus:border-border-focus focus:ring-border-focus bg-surface';

    const textareaClasses = [
      'block',
      'rounded-xs',
      'border',
      'text-onSurface',
      'placeholder:text-onSurface-muted',
      'px-3',
      'py-2',
      'text-base',
      'leading-normal',
      'transition-all',
      'duration-normal',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',
      disabled ? 'opacity-50 cursor-not-allowed bg-surface-disabled' : '',
      fullWidth ? 'w-full' : '',
      resizeClass,
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

    const showCounter = maxLength !== undefined;
    const isOverLimit = currentLength !== undefined && maxLength !== undefined && currentLength > maxLength;

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <div className="flex items-center justify-between">
            <Label htmlFor={textareaId} size="medium" required={required} disabled={disabled}>
              {label}
            </Label>
            {showCounter && (
              <span className={`text-xs ${isOverLimit ? 'text-onSurface-error font-medium' : 'text-onSurface-muted'}`}>
                {currentLength ?? 0}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={textareaClasses}
          {...rest}
        />
        <FormMessage
          helpText={helpText}
          helpId={helpId}
          error={error}
          errorMessage={errorMessage}
          errorId={errorId}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
