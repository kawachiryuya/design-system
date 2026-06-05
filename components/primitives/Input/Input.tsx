import React from 'react';
import { tv } from '../../_internal/tv';
import { Label } from '../Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/** Input の HTML type。HTML `<input type="...">` 属性のサブセット。 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';

/** Input のサイズ。WCAG 2.5.5 AAA（44px）保証のため標準 md 以上推奨。 */
export type InputSize = 'sm' | 'md' | 'lg';

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
   * - `sm` 40px、密集 UI 用 (WCAG 2.5.5 未満なので限定使用)
   * - `md` 48px、標準
   * - `lg` 64px、モバイル CTA フォーム
   * @default 'md'
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
 *   <Input label="メール" type="email" size="lg" fullWidth required />
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
 * Input のスタイル定義 — `tailwind-variants` で size × error × fullWidth × icon 有無を
 * 宣言的に保持。padding は size × icon 有無の組合せで決まるため compoundVariants で導出。
 *
 * - base: 全 variant 共通 (border / bg / placeholder / transition / focus / disabled)
 * - variants.size: 高さ + テキストサイズ (パディングは compound で決定)
 * - variants.error: 通常 (border-border) vs エラー (border-error + bg-error-muted + focus 色)
 * - variants.fullWidth: w-full の付与
 * - variants.hasLeadingIcon / hasTrailingIcon: padding 計算用 (見た目に直接影響しない)
 * - compoundVariants: size × hasLeadingIcon / hasTrailingIcon で左右の padding を決定
 *   (アイコンスペース確保のため `pl-{N}` / `pr-{N}`)
 */
const inputVariants = tv({
  base: [
    'block',
    'rounded-sm',
    'border',
    // :focus (click + keyboard) で border を 1px → 2px に。box-sizing: border-box
    // (Tailwind preflight) のおかげで外形サイズは不変、内側のコンテンツ領域だけ 1px 縮む。
    // 「マウスクリック = border 強調のみ」「キーボード Tab = + ring」の二段階表現
    'focus:border-2',
    'bg-surface',
    'text-onSurface',
    'placeholder:text-onSurface-muted',
    'transition-all',
    'duration-normal',
    'focus:outline-none',
    // ring は **キーボード Tab のみ** (:focus-visible)。border は :focus で常に出る
    'focus-visible:ring-focus',
    'focus-visible:ring-offset-focus',
    'disabled:opacity-disabled',
    'disabled:cursor-not-allowed',
    'disabled:bg-surface-disabled',
  ],
  variants: {
    size: {
      sm: 'h-10 text-sm',
      md: 'h-12 text-base',
      lg: 'h-16 text-lg',
    },
    error: {
      true:  'border-border-error focus:border-border-error focus-visible:ring-border-error bg-surface-error-muted',
      false: 'border-border-default hover:border-border-strong focus:border-border-focus focus-visible:ring-border-focus',
    },
    fullWidth: {
      true:  'w-full',
      false: '',
    },
    hasLeadingIcon: { true: '', false: '' },
    hasTrailingIcon: { true: '', false: '' },
  },
  compoundVariants: [
    // 左パディング: アイコン有時はアイコンスペース確保
    { size: 'sm', hasLeadingIcon: true,  class: 'pl-10' },
    { size: 'sm', hasLeadingIcon: false, class: 'pl-3' },
    { size: 'md', hasLeadingIcon: true,  class: 'pl-12' },
    { size: 'md', hasLeadingIcon: false, class: 'pl-3' },
    { size: 'lg', hasLeadingIcon: true,  class: 'pl-12' },
    { size: 'lg', hasLeadingIcon: false, class: 'pl-4' },
    // 右パディング (mirror)
    { size: 'sm', hasTrailingIcon: true,  class: 'pr-10' },
    { size: 'sm', hasTrailingIcon: false, class: 'pr-3' },
    { size: 'md', hasTrailingIcon: true,  class: 'pr-12' },
    { size: 'md', hasTrailingIcon: false, class: 'pr-3' },
    { size: 'lg', hasTrailingIcon: true,  class: 'pr-12' },
    { size: 'lg', hasTrailingIcon: false, class: 'pr-4' },
  ],
  defaultVariants: { size: 'md', error: false, fullWidth: false, hasLeadingIcon: false, hasTrailingIcon: false },
});

/** アイコン absolute 配置の left/right クラス (size 別) */
const iconPositionClass = {
  leading:  { sm: 'left-3',  md: 'left-3',  lg: 'left-4'  },
  trailing: { sm: 'right-3', md: 'right-3', lg: 'right-4' },
} as const;

/**
 * Input — Atomic Design: Atom
 *
 * @see InputProps for usage examples.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      type = 'text',
      size = 'md',
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
      className,
      ...rest
    } = props as _InternalInputProps;

    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helpId  = inputId ? `${inputId}-help`  : undefined;

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={['flex flex-col gap-1', fullWidth ? 'w-full' : 'w-auto'].join(' ')}>
        {/* Label */}
        {label && (
          <Label htmlFor={inputId} size={size === 'lg' ? 'lg' : 'md'} required={required} disabled={disabled}>
            {label}
          </Label>
        )}

        {/* Input wrapper (アイコン absolute 配置のため) */}
        <div className="relative">
          {leadingIcon && (
            <span
              className={`absolute ${iconPositionClass.leading[size]} top-1/2 -translate-y-1/2 text-onSurface-muted pointer-events-none flex items-center justify-center`}
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
            className={inputVariants({
              size,
              error,
              fullWidth,
              hasLeadingIcon: Boolean(leadingIcon),
              hasTrailingIcon: Boolean(trailingIcon),
              className,
            })}
            {...rest}
          />

          {trailingIcon && (
            <span
              className={`absolute ${iconPositionClass.trailing[size]} top-1/2 -translate-y-1/2 text-onSurface-muted pointer-events-none flex items-center justify-center`}
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
