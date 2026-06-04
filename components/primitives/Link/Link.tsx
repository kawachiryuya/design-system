import React from 'react';
import { tv } from 'tailwind-variants';
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
 * @see principles/README.mdx
 * @see principles/Interaction/state/overview.mdx
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
 * Link のスタイル定義 — `tailwind-variants` で variant マップを宣言的に保持。
 *
 * - base: 全 color/size 共通 (フォーカスリング / トランジション)
 * - variants.color: 文字色 + hover/active overlay
 *   primary は `--color-state-hover-on-primary` で薄緑、neutral/muted は中性 overlay
 * - variants.size: text-size のみ
 * - variants.underline: 下線の表示タイミング
 * - variants.disabled: 操作不能化 (opacity + pointer-events)
 *
 * ## なぜ text 色に `!` (Tailwind important) を付けているか
 * Storybook docs 環境の `.sbdocs a` 標準スタイル (specificity 0,1,1) が
 * Tailwind text utility (0,1,0) に勝ってしまうため、Link がどの環境でも
 * 自身の色を保証する意図的な ! 付与。data-ds-link 属性で CSS リセット併用。
 */
const linkVariants = tv({
  base: [
    'inline-flex',
    'items-center',
    'gap-1',
    'rounded-xs',
    // ホバー領域をテキストの周辺まで少し広げる (横 4px / 縦 2px)。
    // 縦を 2px に抑えるのは、段落内インラインで行間が広がりすぎないため。
    'px-1',
    'py-0.5',
    'transition-colors',
    'duration-normal',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-border-focus',
    'focus-visible:ring-offset-1',
  ],
  variants: {
    color: {
      primary: '!text-onSurface-primary hover:bg-state-hover-on-primary active:bg-state-active-on-primary',
      neutral: '!text-onSurface hover:bg-state-hover active:bg-state-active',
      muted:   '!text-onSurface-muted hover:bg-state-hover active:bg-state-active',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    // text-decoration 系は `!important` (`!underline` / `!no-underline`) で勝たせる。
    // Storybook docs の `.sbdocs a` 標準スタイル (specificity 0,1,1) が Tailwind の
    // text-decoration ユーティリティ (0,1,0) に勝ってしまうのを上書きするため。
    // color の `!text-onSurface-*` と同じ意図的コスト。
    underline: {
      always: '!underline underline-offset-2',
      hover: '!no-underline hover:!underline hover:underline-offset-2',
      none: '!no-underline',
    },
    disabled: {
      true: 'opacity-40 cursor-not-allowed pointer-events-none',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
    underline: 'hover',
    disabled: false,
  },
});

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
      size,
      color,
      underline,
      disabled = false,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
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
        // data-ds-link で Storybook docs (.sbdocs a の青色リンク標準スタイル) と
        // 識別。.storybook/tailwind.css で color: inherit / text-decoration: none に
        // リセットし、Tailwind の text-* / underline 系クラスを当てさせる。
        data-ds-link="true"
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={linkVariants({ color, size, underline, disabled, className })}
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
