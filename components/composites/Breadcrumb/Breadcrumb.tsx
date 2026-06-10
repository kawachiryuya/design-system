import React from 'react';
import { Icon } from '../../primitives/Icon';

/** Breadcrumb のセパレーター種類 */
export type BreadcrumbSeparator = 'slash' | 'chevron' | 'dot';

/** Breadcrumb の 1 項目 */
export interface BreadcrumbItem {
  /** 表示ラベル。 */
  label: string;
  /** リンク URL。**省略すると現在ページとして扱われる**（最後の項目は href なしが自然）。 */
  href?: string;
}

/**
 * Breadcrumb Props
 *
 * パンくずナビゲーション。最後の項目は `aria-current="page"` 自動付与で a11y 対応。
 *
 * @example
 *   // 基本（chevron 区切り）
 *   <Breadcrumb items={[
 *     { label: 'ホーム', href: '/' },
 *     { label: 'ブログ', href: '/blog' },
 *     { label: 'デザインシステムとは' },
 *   ]} />
 *
 * @example
 *   // スラッシュ区切り（テキスト密集 UI）
 *   <Breadcrumb
 *     separator="slash"
 *     items={[
 *       { label: 'プロジェクト', href: '/projects' },
 *       { label: 'design-system', href: '/projects/design-system' },
 *       { label: 'コンポーネント一覧' },
 *     ]}
 *   />
 *
 * @example
 *   // ドット区切り（ミニマル）
 *   <Breadcrumb
 *     separator="dot"
 *     items={[
 *       { label: 'Tag', href: '/tag' },
 *       { label: 'TypeScript' },
 *     ]}
 *   />
 */
export interface BreadcrumbProps {
  /** パンくずの項目リスト。最後の項目は通常 `href` なし（現在ページ）。 */
  items: BreadcrumbItem[];
  /**
   * セパレーターの種類。
   * - `chevron` 矢印（標準、視認性高）
   * - `slash` スラッシュ（密集 UI）
   * - `dot` 中点（ミニマル）
   * @default 'chevron'
   */
  separator?: BreadcrumbSeparator;
  /**
   * `aria-label`。
   * @default 'パンくずリスト'
   */
  ariaLabel?: string;
  /** 追加 CSS クラス。 */
  className?: string;
}

const ChevronSeparator = () => (
  <Icon name="chevron_right" size="sm" className="text-onSurface-muted flex-shrink-0" />
);

const SlashSeparator = () => (
  <span aria-hidden="true" className="text-onSurface-disabled select-none">/</span>
);

const DotSeparator = () => (
  <span aria-hidden="true" className="text-onSurface-disabled select-none">·</span>
);

const separatorMap = {
  slash: SlashSeparator,
  chevron: ChevronSeparator,
  dot: DotSeparator,
};

/**
 * Breadcrumb Component
 *
 * Atomic Design: Molecule
 *
 * @example
 * <Breadcrumb items={[
 *   { label: 'ホーム', href: '/' },
 *   { label: 'ブログ', href: '/blog' },
 *   { label: 'デザインシステムとは' },
 * ]} />
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = 'chevron',
  ariaLabel = 'パンくずリスト',
  className = '',
}) => {
  const Separator = separatorMap[separator];

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast || !item.href;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <Separator />}
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="text-body-sm text-onSurface-muted truncate max-w-[200px]"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-body-sm text-onSurface hover:text-onSurface-primary hover:underline transition-colors
                    focus:outline-none focus-visible:ring-focus focus-visible:ring-border-focus focus-visible:ring-offset-focus rounded-sm
                    truncate max-w-[200px]"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
