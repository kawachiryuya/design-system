import React from 'react';

/** Spinner のサイズ */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Spinner の色 */
export type SpinnerColor = 'primary' | 'neutral' | 'white';

/**
 * Spinner Props
 *
 * 処理中を示すローディングインジケーター。`role="status"` `aria-live="polite"` 自動付与。
 *
 * @example
 *   // 基本（中央 24px）
 *   <Spinner />
 *
 * @example
 *   // ボタン内に小さく（送信中表示）
 *   <Spinner size="sm" color="white" label="送信中" />
 *
 * @example
 *   // ページ全体ローディング
 *   <Spinner size="xl" label="データを読み込んでいます" />
 *
 * @example
 *   // インラインテキスト隣
 *   <Spinner size="xs" /> 確認中…
 *
 * @example
 *   // ニュートラル色（カード内）
 *   <Spinner size="md" color="neutral" />
 *
 * @see principles/interaction/feedback/loading-indicators.md
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * スピナーのサイズ（用途に合わせて選択）。
   * - `xs` 12px: インライン、テキスト隣
   * - `sm` 16px: ボタン内
   * - `md` 24px: コンポーネント内標準（デフォルト）
   * - `lg` 32px: コンポーネント中央
   * - `xl` 48px: 全画面オーバーレイ
   * - `2xl` 64px: 特大、ページローディング
   * @default 'md'
   */
  size?: SpinnerSize;
  /**
   * スピナーの色。
   * - `primary` プライマリ（CTA・主要操作の待機）
   * - `neutral` ミュート（カード内・控えめ）
   * - `white` 白色（色面ボタン内・ダーク背景上）
   * @default 'primary'
   */
  color?: SpinnerColor;
  /**
   * スクリーンリーダー向けラベル（`aria-label` + `.sr-only` テキスト）。
   * @default '読み込み中'
   */
  label?: string;
}

/**
 * Spinner — Atomic Design: Atom
 *
 * @see SpinnerProps for usage examples.
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      label = '読み込み中',
      className = '',
      ...props
    },
    ref
  ) => {
    // principles/Typography/iconography/sizes.md に準拠
    const sizePx = {
      xs: 'w-3 h-3',   // 12px インライン（テキストと同じ高さ）
      sm: 'w-4 h-4',   // 16px インライン
      md: 'w-6 h-6',   // 24px コンポーネント内標準
      lg: 'w-8 h-8',   // 32px コンポーネント中央
      xl: 'w-12 h-12', // 48px 全画面オーバーレイ
      '2xl': 'w-16 h-16', // 64px 特大
    }[size];

    const strokeColor = {
      primary: 'text-onSurface-primary',
      neutral: 'text-onSurface-muted',
      white:   'text-onSurface-inverse',
    }[color];

    const wrapperClasses = ['inline-flex', 'items-center', 'justify-center', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        aria-live="polite"
        className={wrapperClasses}
        {...props}
      >
        <svg
          className={`animate-spin ${sizePx} ${strokeColor}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
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
        {/* スクリーンリーダー専用テキスト */}
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
