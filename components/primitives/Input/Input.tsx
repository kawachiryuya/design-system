'use client';

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
   * - `lg` 56px、モバイル CTA / ヒーローフォーム (Material 3 max と同等)
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
 * - variants.error: 通常 (border-border) vs エラー (border-error + bg-error-muted)
 * - variants.fullWidth: w-full の付与
 * - variants.isDate: 日付の欄 (type="date") だけの指定 (iPhone の Safari のはみ出し対策 #181)。false は block
 * - variants.hasLeadingIcon / hasTrailingIcon: padding 計算用 (見た目に直接影響しない)
 * - compoundVariants: size × hasLeadingIcon / hasTrailingIcon で左右の padding を決定
 *   (アイコンスペース確保のため `pl-{N}` / `pr-{N}`)
 */
const inputVariants = tv({
  base: [
    'rounded-sm',
    'border',
    'bg-surface',
    'text-onSurface',
    'placeholder:text-onSurface-subtle',
    'transition-colors',
    'duration-normal',
    // フォーカス: ほかの部品と同じ「外側 2px＋すき間 2px」。枠線の色は変えない (エラーの赤い枠線と輪が別々に見える)。
    // 文字の入力欄はブラウザがクリックでも :focus-visible にするので、クリックでも出る。
    // 規則の正本は AGENTS §3-2「フォーカスの規則」(DDR-2 #131)
    'focus-ring',
    'disabled:opacity-disabled',
    'disabled:cursor-not-allowed',
    'disabled:bg-surface-disabled',
  ],
  variants: {
    size: {
      sm: 'h-10 type-supporting',
      md: 'h-12 type-body',
      lg: 'h-14 type-body',
    },
    error: {
      true:  'border-border-error-strong bg-surface-error-muted',
      false: 'border-border-default hover:border-border-strong',
    },
    fullWidth: {
      true:  'w-full',
      false: '',
    },
    // 日付の欄 (type="date") だけの指定 (#181)。iPhone の Safari は端末の見た目 (appearance: auto) の
    // 日付の欄に中身からの幅の下限を持たせ、w-full より広くなって親の右にはみ出す。
    // min-width / max-width だけでは直らず、appearance: none で端末の見た目を外すと直る (実機で確認)。
    // 外すと中の文字が上に寄るので、flex + items-center で縦の中央に置く (高さの数字を持たないので size を問わない)。
    // 中の値 (::-webkit-date-and-time-value) は Safari が中央寄せにするので左に揃える。
    // display は block と flex が同じ要素で争わないよう、ここで片方だけを付ける (出力の CSS の順序に頼らない)。
    isDate: {
      true: [
        'flex',
        'items-center',
        'appearance-none',
        '[-webkit-appearance:none]',
        'min-w-0',
        'max-w-full',
        '[&::-webkit-date-and-time-value]:text-left',
      ],
      false: 'block',
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
  defaultVariants: { size: 'md', error: false, fullWidth: false, isDate: false, hasLeadingIcon: false, hasTrailingIcon: false },
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

    const reactId = React.useId();
    const inputId = id || `input-${reactId}`;
    const errorId = `${inputId}-error`;
    const helpId  = `${inputId}-help`;

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div data-ds-root className={['flex flex-col gap-1', fullWidth ? 'w-full' : 'w-auto'].join(' ')}>
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
              className={`absolute ${iconPositionClass.leading[size]} top-1/2 -translate-y-1/2 text-onSurface-subtle pointer-events-none flex items-center justify-center`}
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
              isDate: type === 'date',
              hasLeadingIcon: Boolean(leadingIcon),
              hasTrailingIcon: Boolean(trailingIcon),
              className,
            })}
            {...rest}
          />

          {trailingIcon && (
            <span
              className={`absolute ${iconPositionClass.trailing[size]} top-1/2 -translate-y-1/2 text-onSurface-subtle pointer-events-none flex items-center justify-center`}
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
