import React from 'react';

/**
 * Link Props
 * Reference: principles/content/ / principles/interaction/state/interactive-states.md
 */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /** リンク先URL */
  href: string;
  /** 外部リンク（target="_blank" + rel="noopener noreferrer" + 外部アイコン） */
  external?: boolean;
  /** テキストサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** テキストカラー */
  color?: 'primary' | 'neutral' | 'muted';
  /** アンダーラインの表示タイミング */
  underline?: 'always' | 'hover' | 'none';
  /** 無効状態（クリック不可・視覚的に非活性） */
  disabled?: boolean;
  /** リンクのテキスト内容 */
  children: React.ReactNode;
}

/**
 * Link Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Link href="/about">会社概要</Link>
 * <Link href="https://example.com" external>外部サイト</Link>
 * <Link href="/terms" color="muted" underline="hover">利用規約</Link>
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      external = false,
      size = 'md',
      color = 'primary',
      underline = 'hover',
      disabled = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const colorStyles = {
      primary: [
        'text-primary-600',
        'hover:text-primary-500',
        'active:text-primary-700',
        'focus:ring-primary-300',
      ],
      neutral: [
        'text-neutral-800',
        'hover:text-neutral-600',
        'active:text-neutral-900',
        'focus:ring-neutral-300',
      ],
      muted: [
        'text-neutral-500',
        'hover:text-neutral-700',
        'active:text-neutral-800',
        'focus:ring-neutral-300',
      ],
    };

    const underlineStyles = {
      always: 'underline underline-offset-2',
      hover: 'no-underline hover:underline hover:underline-offset-2',
      none: 'no-underline',
    };

    const baseStyles = [
      'inline-flex',
      'items-center',
      'gap-1',
      'rounded-sm',
      'transition-colors',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1',
    ];

    const disabledStyles = disabled
      ? ['opacity-40', 'cursor-not-allowed', 'pointer-events-none']
      : ['cursor-pointer'];

    const classes = [
      ...baseStyles,
      sizeStyles[size],
      ...colorStyles[color],
      underlineStyles[underline],
      ...disabledStyles,
      className,
    ].join(' ');

    const externalProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={classes}
        onClick={handleClick}
        {...externalProps}
        {...props}
      >
        {children}
        {external && !disabled && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="外部リンク"
            role="img"
            className="flex-shrink-0 opacity-70"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';
