import React from 'react';

/** ボタンの優先度（1 画面に primary は通常 1 個に絞る） */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

/** ボタンのサイズ。タッチターゲット保証のため最小 40px（small/iconOnly） */
export type ButtonSize = 'small' | 'medium' | 'large';

/** Variant / size など全 Button が共有するプロパティ */
interface ButtonBaseProps {
  /**
   * ボタンのバリアント（優先度）。
   * - `primary`: 主要アクション（保存・送信等）。1 画面 1 個推奨
   * - `secondary`: 副次アクション（キャンセル・戻る等）
   * - `tertiary`: 補助アクション（テキストリンク的）
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * サイズ。WCAG 2.5.5 AAA（44px）を満たす。
   * - `small`: 40px、密集 UI 用
   * - `medium`: 48px、標準
   * - `large`: 64px、モバイル CTA / メインアクション
   * @default 'medium'
   */
  size?: ButtonSize;
  /** ローディング状態。`true` で disabled + spinner 表示。 */
  isLoading?: boolean;
  /** 全幅表示（親要素の幅に追従）。フォーム送信ボタン等で使用。 */
  fullWidth?: boolean;
}

/**
 * Icon-only ボタン（アイコンのみ、テキストラベルなし）。
 *
 * アクセシビリティのため `aria-label` を必須にする。
 * `iconPosition` / `children` は使用不可（型レベルで弾く）。
 */
interface ButtonIconOnlyProps extends ButtonBaseProps {
  /** Icon-only モード（テキストラベルなし）。 */
  iconOnly: true;
  /** 表示するアイコン。 */
  icon: React.ReactNode;
  /** Icon-only モードでは使用不可。 */
  iconPosition?: never;
  /** Icon-only モードでは children 不可。`aria-label` でラベルを指定。 */
  children?: never;
  /** スクリーンリーダー向けラベル（必須）。 */
  'aria-label': string;
}

/**
 * 通常のボタン（テキストラベル + 任意のアイコン）。
 */
interface ButtonRegularProps extends ButtonBaseProps {
  /** 通常モード（デフォルト）。 */
  iconOnly?: false;
  /** アイコン要素（任意）。`iconPosition` で左右指定。 */
  icon?: React.ReactNode;
  /**
   * アイコンの位置。
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /** ボタンラベル（必須）。 */
  children: React.ReactNode;
}

/**
 * Button Props — discriminated union
 *
 * 用途に応じて 2 つの形のいずれかで使う:
 * - **通常**: `<Button variant="primary">保存</Button>` — children 必須、icon は任意
 * - **Icon-only**: `<Button iconOnly icon={...} aria-label="..." />` — テキストなし、aria-label 必須
 *
 * @example
 *   // 主要アクション
 *   <Button variant="primary">保存</Button>
 *
 * @example
 *   // 副次アクション + 左アイコン
 *   <Button variant="secondary" icon={<Icon name="check_circle" />}>
 *     確定
 *   </Button>
 *
 * @example
 *   // ローディング中（送信中）
 *   <Button variant="primary" isLoading>送信中</Button>
 *
 * @example
 *   // 全幅 + large（モバイル CTA）
 *   <Button variant="primary" size="large" fullWidth>
 *     購入する
 *   </Button>
 *
 * @example
 *   // Icon-only（aria-label 必須、TS が強制）
 *   <Button iconOnly icon={<Icon name="close" />} aria-label="閉じる" />
 *
 * @see principles/interaction/button/priority.md
 */
export type ButtonProps =
  (ButtonIconOnlyProps | ButtonRegularProps) &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'>;

/** Internal flexible type to allow destructuring across both discriminants */
type _InternalButtonProps = ButtonBaseProps & {
  iconOnly?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/**
 * Button — Atomic Design: Atom
 *
 * @see ButtonProps for usage examples.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      icon,
      iconPosition = 'left',
      iconOnly = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      type = 'button',
      ...rest
    } = props as _InternalButtonProps;

    // Base styles - すべてのボタンに共通
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      iconOnly ? 'rounded-full' : '', // 角丸は sizeStyles で個別指定
      'transition-all',
      'duration-normal', // 200ms (tokens/animation.json)
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      // State overlay — inset box-shadow で背景色を維持したまま透過レイヤーを重ねる
      // disabled 時は無効（shadow-none で上書き）
      'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)]',
      'active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]',
      'active:scale-[0.98]',
      'disabled:hover:shadow-none',
      'disabled:active:shadow-none',
      'disabled:active:scale-100',
    ];

    // Variant styles
    const variantStyles = {
      primary: [
        'bg-surface-primary',
        'text-onSurface-inverse',
        'focus-visible:ring-border-focus',
      ],
      secondary: [
        'bg-surface',
        'text-onSurface-primary',
        'border',
        'border-primary-600',
        'hover:!shadow-[inset_0_0_0_9999px_rgba(0,137,101,0.08)]',
        'active:!shadow-[inset_0_0_0_9999px_rgba(0,137,101,0.12)]',
        'focus-visible:ring-border-focus',
      ],
      tertiary: [
        'bg-transparent',
        'text-onSurface-primary',
        'focus-visible:ring-border-focus',
      ],
    };

    // Size styles (tokens/spacing.json)
    // 明示的 height でタッチターゲットを保証（WCAG 2.5.5 AAA: 44px）
    const sizeStyles = iconOnly
      ? {
          small: ['h-10', 'w-10', 'text-sm'],
          medium: ['h-12', 'w-12', 'text-base'],
          large: ['h-16', 'w-16', 'text-lg'],
        }
      : {
          small: [
            'h-10',  // 40px
            'px-3',  // 12px
            'text-sm', // 14px
            'gap-1', // 4px (アイコンとテキストの間)
            'min-w-16', // 64px — 短いラベルでも潰れない
            'rounded-xs', // 4px
          ],
          medium: [
            'h-12',  // 48px
            'px-4',  // 16px
            'text-base', // 16px
            'gap-2', // 8px
            'min-w-20', // 80px
            'rounded-sm', // 8px
          ],
          large: [
            'h-16',  // 64px
            'px-6',  // 24px
            'text-lg', // 18px
            'gap-2', // 8px
            'min-w-24', // 96px
            'rounded-md', // 12px
          ],
        };

    // Width styles
    const widthStyles = fullWidth ? ['w-full'] : [];

    // すべてのスタイルを結合
    const buttonClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...widthStyles,
      className,
    ].join(' ');

    // アイコンの順序を決定
    const iconElement = icon && (
      <span className="flex-shrink-0 flex items-center">{icon}</span>
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses}
        {...rest}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && iconPosition === 'left' && iconElement}
        {children}
        {!isLoading && iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

Button.displayName = 'Button';
