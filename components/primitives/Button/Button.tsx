import React from 'react';
import { tv } from '../../_internal/tv';

/** ボタンの優先度（1画面に primary は通常1個に絞る） */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';

/** ボタンのサイズ。タッチターゲット保証のため最小 40px（sm / iconOnly） */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Variant / size など全 Button が共有するプロパティ */
interface ButtonBaseProps {
  /**
   * ボタンのバリアント（優先度）。
   * - `primary`: 主要アクション（保存・送信等）。1画面1個推奨
   * - `secondary`: 副次アクション（キャンセル・戻る等）
   * - `tertiary`: 補助アクション（テキストリンク的）
   * - `destructive`: 破壊的アクション（削除・取り消し等）。**色だけに頼らずアイコン + 動詞ラベルで意図を補強する**
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * サイズ。WCAG 2.5.5 AAA（44px）を満たす。Radius は size に連動 (`sm→rounded-sm` / `md→rounded-md` / `lg→rounded-lg`)。
   * - `sm`: 40px、密集 UI 用
   * - `md`: 48px、標準
   * - `lg`: 64px、モバイル CTA / メインアクション
   * @default 'md'
   */
  size?: ButtonSize;
  /** ローディング状態。`true` で disabled + spinner 表示。 */
  isLoading?: boolean;
  /** 全幅表示（親要素の幅に追従）。フォーム送信ボタン等で使用。 */
  fullWidth?: boolean;
  /**
   * 操作不能化。`true` で視覚的に opacity-disabled、DOM にも `disabled` 属性が付く。
   * `isLoading` 時には自動で disabled になる。
   */
  disabled?: boolean;
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
 * 用途に応じて2つの形のいずれかで使う:
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
 *   <Button variant="primary" size="lg" fullWidth>
 *     購入する
 *   </Button>
 *
 * @example
 *   // Icon-only（aria-label 必須、TS が強制）
 *   <Button iconOnly icon={<Icon name="close" />} aria-label="閉じる" />
 *
 * @see principles/Interaction/button/priority.mdx
 */
export type ButtonProps =
  (ButtonIconOnlyProps | ButtonRegularProps) &
  // `disabled` は ButtonBaseProps で再宣言して JSDoc を付与しているため、
  // React 由来 (JSDoc なし) の型を Omit して衝突を避ける。
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'disabled'>;

/**
 * Button のスタイル定義 — `tailwind-variants` で variant マップを宣言的に保持。
 *
 * - base: 全 variant 共通 (フォーカスリング / disabled / アクティブ scale)
 * - variants.variant: 4 種の見た目 (primary / secondary / tertiary / destructive)
 *   hover/active overlay は `--color-state-*` semantic token を参照する
 * - variants.size: text-size と gap (高さや幅は compoundVariants で iconOnly と組合せ)
 * - variants.iconOnly: 形状 (rounded-full かどうか)
 * - variants.fullWidth: w-full の付与
 * - compoundVariants: iconOnly × size の組合せ (正方形 vs 通常モード)
 *
 * ## なぜ hover/active を `shadow-[inset_0_0_0_9999px_<token>]` で当てているか
 *
 * 各 variant の **背景色は既に決まっている** (`bg-surface-primary` / `bg-surface` / `bg-transparent`)
 * ため、hover/active 時に `bg-` を当てると下地の variant 色を **置換** してしまう。
 * inset box-shadow を巨大なオフセット (9999px) で重ねれば、下地を残したまま **半透明
 * オーバーレイ** を被せられる (= Material Design の state layer と同等)。
 * `--color-state-hover-*` は rgba 値なので、下地色に応じた自然な hover/active が出る。
 */
const buttonVariants = tv({
  base: [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-normal', // 200ms (tokens/animation.json)
    'focus:outline-none',
    'focus-visible:ring-focus',
    'focus-visible:ring-offset-focus',
    'disabled:opacity-disabled',
    'disabled:cursor-not-allowed',
    'active:scale-[0.98]',
    'disabled:active:scale-100',
  ],
  variants: {
    variant: {
      // 緑背景 + 白文字 → 中性 (黒) の hover overlay
      primary: [
        'bg-surface-primary',
        'text-onSurface-inverse',
        'focus-visible:ring-border-focus',
        'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)]',
        'active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]',
        'disabled:hover:shadow-none',
        'disabled:active:shadow-none',
      ],
      // 白背景 + 緑文字 → primary 色味の hover overlay
      secondary: [
        'bg-surface',
        'text-onSurface-primary',
        'border',
        'border-primary-600',
        'focus-visible:ring-border-focus',
        'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover-on-primary)]',
        'active:shadow-[inset_0_0_0_9999px_var(--color-state-active-on-primary)]',
        'disabled:hover:shadow-none',
        'disabled:active:shadow-none',
      ],
      // 透明背景 + 緑文字 → 文字色に合わせて primary 色味 overlay
      tertiary: [
        'bg-transparent',
        'text-onSurface-primary',
        'focus-visible:ring-border-focus',
        'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover-on-primary)]',
        'active:shadow-[inset_0_0_0_9999px_var(--color-state-active-on-primary)]',
        'disabled:hover:shadow-none',
        'disabled:active:shadow-none',
      ],
      // 白背景 + 赤文字 → error 色味の hover overlay
      destructive: [
        'bg-surface',
        'text-onSurface-error',
        'border',
        'border-border-error',
        'focus-visible:ring-border-error',
        'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover-on-error)]',
        'active:shadow-[inset_0_0_0_9999px_var(--color-state-active-on-error)]',
        'disabled:hover:shadow-none',
        'disabled:active:shadow-none',
      ],
    },
    size: {
      // 文字サイズと gap だけ。高さ・余白・角丸は iconOnly との compoundVariants で
      sm: 'text-sm gap-1',
      md: 'text-base gap-2',
      lg: 'text-lg gap-2',
    },
    iconOnly: {
      true: 'rounded-full',
      false: '',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  compoundVariants: [
    // icon-only モード: 正方形 (h × w 固定)
    { iconOnly: true, size: 'sm', class: 'h-10 w-10' },
    { iconOnly: true, size: 'md', class: 'h-12 w-12' },
    { iconOnly: true, size: 'lg', class: 'h-16 w-16' },
    // 通常モード: min-h でタッチターゲット確保、py で長文時の上下余白
    // Radius は size と連動 (sm→rounded-sm / md→rounded-md / lg→rounded-lg)
    {
      iconOnly: false,
      size: 'sm',
      class: 'min-h-10 py-2 px-3 min-w-16 rounded-sm',
    },
    {
      iconOnly: false,
      size: 'md',
      class: 'min-h-12 py-3 px-4 min-w-20 rounded-md',
    },
    {
      iconOnly: false,
      size: 'lg',
      class: 'min-h-16 py-4 px-6 min-w-24 rounded-lg',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    iconOnly: false,
    fullWidth: false,
  },
});

/**
 * Button — Atomic Design: Atom
 *
 * @see ButtonProps for usage examples.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    // Spinner サイズは button size に追従させて視覚バランスを取る
    // (sm/lg でも 16px だと小さく見える / 大きく見えるため)
    const spinnerSize =
      props.size === 'sm' ? 'h-4 w-4' : props.size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    const loadingSpinner = (
      <svg
        className={`animate-spin flex-shrink-0 ${spinnerSize}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-spinner-track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-spinner-spin"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // iconOnly モード: TS は props を ButtonIconOnlyProps に絞り込む (icon 必須、children/iconPosition は never)
    if (props.iconOnly) {
      const {
        iconOnly,
        icon,
        variant,
        size,
        isLoading = false,
        fullWidth,
        disabled,
        className,
        type = 'button',
        ...rest
      } = props;
      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled || isLoading}
          className={buttonVariants({ variant, size, iconOnly, fullWidth, className })}
          {...rest}
        >
          {isLoading ? loadingSpinner : (
            <span className="flex-shrink-0 inline-flex items-center">{icon}</span>
          )}
        </button>
      );
    }

    // 通常モード: TS は props を ButtonRegularProps に絞り込む (children 必須)
    const {
      iconOnly,
      icon,
      iconPosition = 'left',
      variant,
      size,
      isLoading = false,
      fullWidth,
      disabled,
      children,
      className,
      type = 'button',
      ...rest
    } = props;
    const iconWrap = icon && (
      <span className="flex-shrink-0 inline-flex items-center">{icon}</span>
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonVariants({ variant, size, iconOnly, fullWidth, className })}
        {...rest}
      >
        {isLoading && loadingSpinner}
        {!isLoading && iconPosition === 'left' && iconWrap}
        {children}
        {!isLoading && iconPosition === 'right' && iconWrap}
      </button>
    );
  }
);

Button.displayName = 'Button';
