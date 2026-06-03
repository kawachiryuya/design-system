import React from 'react';
import { Label } from '../Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/** Input の HTML type。HTML `<input type="...">` 属性のサブセット。 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';

/** Input のサイズ。WCAG 2.5.5 AAA（44px）保証のため最小 40px。 */
export type InputSize = 'small' | 'medium' | 'large';

interface InputBaseProps {
  /**
   * 入力タイプ。HTML `<input type="...">` に対応。
   * - `text` 汎用、`email` メール、`password` パスワード、`number` 数値
   * - `tel` 電話、`url` URL、`search` 検索、`date` 日付
   * @default 'text'
   */
  type?: InputType;
  /**
   * サイズ。
   * - `small` 40px、密集 UI 用
   * - `medium` 48px、標準
   * - `large` 64px、モバイル CTA フォーム
   * @default 'medium'
   */
  size?: InputSize;
  /** 全幅表示（親要素の幅に追従）。フォーム内の入力で全幅を占めるレイアウトに使う。 */
  fullWidth?: boolean;
  /** 入力左側に表示するアイコン（検索・通貨記号等）。 */
  leadingIcon?: React.ReactNode;
  /** 入力右側に表示するアイコン（クリアボタン・ヘルプアイコン等）。 */
  trailingIcon?: React.ReactNode;
  /** ラベルテキスト。指定すると `<label>` 要素が自動生成され `htmlFor`/`aria-*` 関連付けされる。 */
  label?: string;
  /** ヘルプテキスト（補助説明）。エラー時は非表示になり `errorMessage` に置き換わる。 */
  helpText?: string;
  /** 一意の ID（aria-describedby 等の関連付けに使用）。未指定なら label から自動生成。 */
  id?: string;
}

/** エラー状態の Input — `errorMessage` が必須 */
interface InputErrorProps extends InputBaseProps {
  /** エラー状態。`true` で枠線赤・背景色変化・`aria-invalid="true"` 自動付与。 */
  error: true;
  /** エラーメッセージ（必須）。`aria-describedby` で input に関連付けられ、スクリーンリーダーが読み上げる。 */
  errorMessage: string;
}

/** 通常状態の Input */
interface InputNormalProps extends InputBaseProps {
  /** @default false */
  error?: false;
  /** 通常状態では使用不可。エラーメッセージは `error: true` と組で指定。 */
  errorMessage?: never;
}

/**
 * Input Props — discriminated union
 *
 * `error` の値で型が分岐する:
 * - `error: true` → `errorMessage` 必須（aria 関連付けに使用）
 * - `error: false`（または省略） → `errorMessage` 使用不可（書いても無視されるため型で弾く）
 *
 * @example
 *   // 基本（type + label + placeholder）
 *   <Input label="メールアドレス" type="email" placeholder="example@email.com" />
 *
 * @example
 *   // 必須 + ヘルプテキスト
 *   <Input label="ユーザー名" required helpText="3〜16文字の英数字" />
 *
 * @example
 *   // エラー状態（errorMessage が型レベルで必須）
 *   <Input
 *     label="パスワード"
 *     type="password"
 *     error
 *     errorMessage="8文字以上で入力してください"
 *   />
 *
 * @example
 *   // 検索入力（左アイコン）
 *   <Input
 *     label="検索"
 *     type="search"
 *     placeholder="キーワード"
 *     leadingIcon={<Icon name="search" />}
 *   />
 *
 * @example
 *   // モバイル CTA フォーム（全幅 + large）
 *   <Input label="メール" type="email" size="large" fullWidth required />
 *
 * @see principles/Patterns/forms.mdx
 */
export type InputProps =
  (InputErrorProps | InputNormalProps) &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

/** Internal flexible type to allow destructuring across both discriminants */
type _InternalInputProps = InputBaseProps & {
  error?: boolean;
  errorMessage?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

/**
 * Input — Atomic Design: Atom
 *
 * @see InputProps for usage examples.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      type = 'text',
      size = 'medium',
      error = false,
      errorMessage,
      helpText,
      fullWidth = false,
      leadingIcon,
      trailingIcon,
      label,
      id,
      disabled,
      required,
      className = '',
      ...rest
    } = props as _InternalInputProps;

    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helpId = inputId ? `${inputId}-help` : undefined;

    // Base wrapper styles
    const wrapperStyles = ['flex', 'flex-col', 'gap-1', fullWidth ? 'w-full' : 'w-auto'].join(' ');

    // Base input styles
    const baseStyles = [
      'block',
      'rounded-xs',
      'border',
      'bg-surface',
      'text-onSurface',
      'placeholder:text-onSurface-subtle',
      'transition-all',
      'duration-normal',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:bg-surface-disabled',
      fullWidth ? 'w-full' : '',
    ];

    // State styles
    const stateStyles = error
      ? [
          'border-border-error',
          'focus:border-border-error',
          'focus:ring-border-error',
          'bg-surface-error-muted',
        ]
      : [
          'border-border',
          'hover:border-border-strong',
          'focus:border-border-focus',
          'focus:ring-border-focus',
        ];

    // Size styles (tokens/spacing.json)
    // 明示的 height でタッチターゲットを保証（WCAG 2.5.5 AAA: 44px）
    const sizeStyles = {
      small: [
        'h-10',  // 40px
        leadingIcon ? 'pl-10' : 'px-3',
        trailingIcon ? 'pr-10' : 'px-3',
        'text-sm',
      ],
      medium: [
        'h-12',  // 48px
        leadingIcon ? 'pl-12' : 'px-3',
        trailingIcon ? 'pr-12' : 'px-3',
        'text-base',
      ],
      large: [
        'h-16',  // 64px
        leadingIcon ? 'pl-12' : 'px-4',
        trailingIcon ? 'pr-12' : 'px-4',
        'text-lg',
      ],
    };

    const inputClasses = [
      ...baseStyles,
      ...stateStyles,
      ...sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Icon container positioning
    const leadingIconPosition = {
      small: 'left-3',
      medium: 'left-3',
      large: 'left-4',
    }[size];

    const trailingIconPosition = {
      small: 'right-3',
      medium: 'right-3',
      large: 'right-4',
    }[size];

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={wrapperStyles}>
        {/* Label */}
        {label && (
          <Label htmlFor={inputId} size={size === 'large' ? 'large' : 'medium'} required={required} disabled={disabled}>
            {label}
          </Label>
        )}

        {/* Input wrapper（アイコン配置のため） */}
        <div className="relative">
          {leadingIcon && (
            <span
              className={`absolute ${leadingIconPosition} top-1/2 -translate-y-1/2 text-onSurface-subtle pointer-events-none flex items-center justify-center`}
            >
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className={inputClasses}
            {...rest}
          />

          {trailingIcon && (
            <span
              className={`absolute ${trailingIconPosition} top-1/2 -translate-y-1/2 text-onSurface-subtle pointer-events-none flex items-center justify-center`}
            >
              {trailingIcon}
            </span>
          )}
        </div>

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

Input.displayName = 'Input';
