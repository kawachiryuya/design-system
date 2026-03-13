import React from 'react';
import { Label } from '../Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/**
 * Textarea Props
 * Reference: principles/patterns/forms.md
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** ラベル */
  label?: string;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 全幅 */
  fullWidth?: boolean;
  /** 現在の文字数（表示用） */
  currentLength?: number;
  /** 最大文字数（カウンター表示用） */
  maxLength?: number;
  /** リサイズ挙動 */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Textarea Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Textarea label="お問い合わせ内容" rows={5} required maxLength={500} />
 * <Textarea label="備考" helpText="任意で入力してください" />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
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
      ...props
    },
    ref
  ) => {
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
      'placeholder:text-onSurface-subtle',
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
              <span className={`text-xs ${isOverLimit ? 'text-onSurface-error font-medium' : 'text-onSurface-subtle'}`}>
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
          {...props}
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
