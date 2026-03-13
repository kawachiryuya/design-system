import React from 'react';
import { Icon } from '../../primitives/Icon';

/**
 * Breadcrumb Props
 * Reference: principles/patterns/navigation.md
 *
 * Molecule: Link Atom を連結したパンくずリスト
 */
export interface BreadcrumbItem {
  /** 表示ラベル */
  label: string;
  /** リンクURL（省略すると現在ページとして扱う） */
  href?: string;
}

export interface BreadcrumbProps {
  /** パンくずの項目リスト */
  items: BreadcrumbItem[];
  /** セパレーターの種類 */
  separator?: 'slash' | 'chevron' | 'dot';
  /** aria-label */
  ariaLabel?: string;
  /** 追加CSSクラス */
  className?: string;
}

const ChevronSeparator = () => (
  <Icon name="chevron_right" size="sm" className="text-onSurface-subtle flex-shrink-0" />
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
                  className="text-sm text-onSurface-muted font-normal truncate max-w-[200px]"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-sm text-onSurface hover:text-onSurface-primary transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-xs
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
