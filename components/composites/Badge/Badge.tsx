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
    // Solid: 塗りつぶし（セマンティックトークン）
    const solidStyles: Record<BadgeProps['variant'] & string, string> = {
      neutral: 'bg-neutral-700 text-onSurface-inverse',
      primary: 'bg-surface-primary text-onSurface-inverse',
      success: 'bg-surface-success text-onSurface-inverse',
      error:   'bg-surface-error text-onSurface-inverse',
      warning: 'bg-surface-warning text-onSurface-inverse',
      info:    'bg-surface-info text-onSurface-inverse',
    };

    // Soft: 薄い背景（セマンティックトークン）
    const softStyles: Record<string, string> = {
      neutral: 'bg-surface-disabled text-onSurface',
      primary: 'bg-surface-secondary text-onSurface-primary',
      success: 'bg-surface-success-muted text-onSurface-success',
      error:   'bg-surface-error-muted text-onSurface-error',
      warning: 'bg-surface-warning-muted text-onSurface-warning',
      info:    'bg-surface-info-muted text-onSurface-info',
    };

    // Outline: 枠線のみ（セマンティックトークン）
    const outlineStyles: Record<string, string> = {
      neutral: 'border border-border-strong text-onSurface',
      primary: 'border border-border-primary text-onSurface-primary',
      success: 'border border-border-success text-onSurface-success',
      error:   'border border-border-error text-onSurface-error',
      warning: 'border border-border-warning text-onSurface-warning',
      info:    'border border-border-info text-onSurface-info',
    };

    const dotColors: Record<string, string> = {
      neutral: 'bg-neutral-500',
      primary: 'bg-surface-primary',
      success: 'bg-surface-success',
      error:   'bg-surface-error',
      warning: 'bg-surface-warning',
      info:    'bg-surface-info',
    };

    const appearanceStyle =
      appearance === 'solid'
        ? solidStyles[variant!]
        : appearance === 'outline'
        ? outlineStyles[variant!]
        : softStyles[variant!];

    const sizeStyle = size === 'small' ? 'px-2 py-[2px] text-xs' : 'px-[10px] py-1 text-xs';

    const badgeClasses = [
      'inline-flex',
      'items-center',
      'gap-[6px]',
      'font-medium',
      'rounded-xs',
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
            className={`inline-block w-[6px] h-[6px] rounded-full flex-shrink-0 ${
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
