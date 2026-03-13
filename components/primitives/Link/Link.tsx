import React from 'react';
import { Icon } from '../Icon';

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
      primary: 'text-onSurface-primary',
      neutral: 'text-onSurface',
      muted:   'text-onSurface-muted',
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
      'rounded-xs',
      'transition-colors',
      'duration-normal',
      'hover:bg-state-hover',
      'active:bg-state-active',
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-border-focus',
      'focus-visible:ring-offset-1',
    ];

    const disabledStyles = disabled
      ? ['opacity-40', 'cursor-not-allowed', 'pointer-events-none']
      : ['cursor-pointer'];

    const classes = [
      ...baseStyles,
      sizeStyles[size],
      colorStyles[color],
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
          <Icon name="open_in_new" size="sm" label="外部リンク" className="flex-shrink-0 opacity-70" />
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';
