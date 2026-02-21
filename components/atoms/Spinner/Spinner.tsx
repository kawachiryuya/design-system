import React from 'react';

/**
 * Spinner Props
 * Reference: principles/interaction/feedback/loading-indicators.md
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** スピナーのサイズ（用途に合わせて選択） */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** スピナーの色 */
  color?: 'primary' | 'neutral' | 'white';
  /**
   * スクリーンリーダー用のラベル。
   * 省略時はデフォルトの「読み込み中」が使用される。
   */
  label?: string;
}

/**
 * Spinner Component
 *
 * Atomic Design: Atom
 *
 * 処理中を示すローディングインジケーター。
 * `role="status"` と `aria-label` でスクリーンリーダーに通知する。
 *
 * @example
 * <Spinner />
 * <Spinner size="sm" color="white" label="送信中" />
 * <Spinner size="lg" label="データを読み込んでいます" />
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
    }[size];

    const strokeColor = {
      primary: 'text-primary-600',
      neutral: 'text-neutral-600',
      white:   'text-white',
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
