'use client';

import React from 'react';
import { tv } from '../../_internal/tv';
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
   * - `none` 固定サイズ
   * - `vertical` 縦のみ (デフォルト、ユーザーが自由に高さ調整)
   * - `horizontal` 横のみ
   * - `both` 両方向
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
 * Textarea のスタイル定義 — `tailwind-variants` で error × fullWidth × resize × disabled を
 * 宣言的に保持。Input と同じ borderr/focus パターンだが、高さは rows 属性で制御するため
 * size variant は持たない。
 */
const textareaVariants = tv({
  base: [
    'block',
    'rounded-sm',
    'border',
    'text-onSurface',
    'placeholder:text-onSurface-muted',
    'px-3',
    'py-2',
    'text-base',
    'leading-normal',
    // transition-colors のみ (詳細は Input.tsx 同セクションのコメント参照)
    'transition-colors',
    'duration-normal',
    'focus:outline-none',
    // focus 表現は border 色変化 + inset ring (詳細は Input.tsx 同セクションのコメント参照)
    'focus:ring-1',
    'focus:ring-inset',
  ],
  variants: {
    error: {
      true:  'border-border-error-emphasis focus:border-border-error-emphasis focus:ring-border-error bg-surface-error-muted',
      false: 'border-border-default hover:border-border-strong focus:border-border-focus focus:ring-border-focus bg-surface',
    },
    fullWidth: {
      true:  'w-full',
      false: '',
    },
    resize: {
      none:       'resize-none',
      vertical:   'resize-y',
      horizontal: 'resize-x',
      both:       'resize',
    },
    disabled: {
      true:  'opacity-disabled cursor-not-allowed bg-surface-disabled',
      false: '',
    },
  },
  defaultVariants: { error: false, fullWidth: false, resize: 'vertical', disabled: false },
});

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
      className,
      ...rest
    } = props as _InternalTextareaProps;

    const reactId = React.useId();
    const textareaId = id || `textarea-${reactId}`;
    const errorId = `${textareaId}-error`;
    const helpId  = `${textareaId}-help`;

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const showCounter = maxLength !== undefined;
    const isOverLimit = currentLength !== undefined && maxLength !== undefined && currentLength > maxLength;

    return (
      <div data-ds-root className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <div className="flex items-center justify-between">
            <Label htmlFor={textareaId} size="md" required={required} disabled={disabled}>
              {label}
            </Label>
            {showCounter && (
              <span className={`text-caption ${isOverLimit ? 'text-onSurface-error font-medium' : 'text-onSurface-muted'}`}>
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
          className={textareaVariants({ error, fullWidth, resize, disabled, className })}
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
