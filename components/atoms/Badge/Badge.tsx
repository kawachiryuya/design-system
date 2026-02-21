import React from 'react';

/**
 * Badge Props
 * Reference: principles/color/semantic-colors.md
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** バッジのバリアント（セマンティックカラー） */
  variant?: 'neutral' | 'primary' | 'success' | 'error' | 'warning' | 'info';
  /** バッジのスタイル */
  appearance?: 'solid' | 'soft' | 'outline';
  /** サイズ */
  size?: 'small' | 'medium';
  /** 先頭のドット表示 */
  dot?: boolean;
  /** バッジの内容 */
  children: React.ReactNode;
}

/**
 * Badge Component
 *
 * Atomic Design: Atom
 *
 * ステータス・カテゴリ・数値などを簡潔に表示するラベル。
 *
 * @example
 * <Badge variant="success">完了</Badge>
 * <Badge variant="error" appearance="soft">エラー</Badge>
 * <Badge variant="warning" dot>注意</Badge>
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      appearance = 'soft',
      size = 'medium',
      dot = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Solid: 塗りつぶし
    const solidStyles: Record<BadgeProps['variant'] & string, string> = {
      neutral: 'bg-neutral-700 text-white',
      primary: 'bg-primary-600 text-white',
      success: 'bg-success-600 text-white',
      error:   'bg-error-600 text-white',
      warning: 'bg-warning-600 text-white',
      info:    'bg-info-600 text-white',
    };

    // Soft: 薄い背景
    const softStyles: Record<string, string> = {
      neutral: 'bg-neutral-100 text-neutral-700',
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-success-100 text-success-700',
      error:   'bg-error-100 text-error-700',
      warning: 'bg-warning-100 text-warning-700',
      info:    'bg-info-100 text-info-700',
    };

    // Outline: 枠線のみ
    const outlineStyles: Record<string, string> = {
      neutral: 'border border-neutral-400 text-neutral-700',
      primary: 'border border-primary-500 text-primary-600',
      success: 'border border-success-500 text-success-700',
      error:   'border border-error-500 text-error-600',
      warning: 'border border-warning-500 text-warning-600',
      info:    'border border-info-500 text-info-600',
    };

    const dotColors: Record<string, string> = {
      neutral: 'bg-neutral-500',
      primary: 'bg-primary-600',
      success: 'bg-success-600',
      error:   'bg-error-600',
      warning: 'bg-warning-600',
      info:    'bg-info-600',
    };

    const appearanceStyle =
      appearance === 'solid'
        ? solidStyles[variant!]
        : appearance === 'outline'
        ? outlineStyles[variant!]
        : softStyles[variant!];

    const sizeStyle = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

    const badgeClasses = [
      'inline-flex',
      'items-center',
      'gap-1.5',
      'font-medium',
      'rounded-full',
      'leading-none',
      'whitespace-nowrap',
      sizeStyle,
      appearanceStyle,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const v = variant ?? 'neutral';

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {dot && (
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              appearance === 'solid' ? 'bg-white/70' : dotColors[v]
            }`}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
