import React from 'react';
import { Icon } from '../Icon';

/** Link のテキストサイズ */
export type LinkSize = 'sm' | 'md' | 'lg';

/** Link のテキストカラー */
export type LinkColor = 'primary' | 'neutral' | 'muted';

/** Link のアンダーライン表示タイミング */
export type LinkUnderline = 'always' | 'hover' | 'none';

/**
 * Link Props
 *
 * `<a>` 要素のラッパー。a11y / 外部リンク安全策（rel="noopener noreferrer"）を自動適用。
 *
 * @example
 *   // 基本（内部リンク）
 *   <Link href="/about">会社概要</Link>
 *
 * @example
 *   // 外部リンク（target="_blank" + rel + 外部アイコン自動付与）
 *   <Link href="https://example.com" external>外部サイト</Link>
 *
 * @example
 *   // ミュート色 + ホバー時のみアンダーライン（フッター用）
 *   <Link href="/terms" color="muted" underline="hover">利用規約</Link>
 *
 * @example
 *   // 大サイズ + 常にアンダーライン（CTA リンク）
 *   <Link href="/start" size="lg" underline="always">今すぐ始める</Link>
 *
 * @example
 *   // 無効状態（クリック不可、aria-disabled 自動付与）
 *   <Link href="/admin" disabled>管理画面（権限が必要）</Link>
 *
 * @see principles/README.md
 * @see principles/Interaction/state.mdx
 */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /** リンク先 URL（必須）。`disabled` 時は href が削除される。 */
  href: string;
  /**
   * 外部リンクフラグ。`true` で以下を自動付与:
   * - `target="_blank"` `rel="noopener noreferrer"`（セキュリティ対策）
   * - 外部アイコン（`open_in_new`）を末尾に表示
   * @default false
   */
  external?: boolean;
  /**
   * テキストサイズ。
   * @default 'md'
   */
  size?: LinkSize;
  /**
   * テキストカラー。
   * - `primary` プライマリ色（CTA 的リンク）
   * - `neutral` 通常テキスト色
   * - `muted` 控えめ色（フッター・補足等）
   * @default 'primary'
   */
  color?: LinkColor;
  /**
   * アンダーライン表示タイミング。a11y のため `none` は `color` で十分な区別ができる場合のみ。
   * @default 'hover'
   */
  underline?: LinkUnderline;
  /**
   * 無効状態。クリック不可・視覚的に非活性・`aria-disabled` 自動付与。
   * @default false
   */
  disabled?: boolean;
  /** リンクのテキスト内容（必須）。 */
  children: React.ReactNode;
}

/**
 * Link — Atomic Design: Atom
 *
 * @see LinkProps for usage examples.
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
