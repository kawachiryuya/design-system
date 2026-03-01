import React from 'react';

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
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    className="text-neutral-400 flex-shrink-0">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const SlashSeparator = () => (
  <span aria-hidden="true" className="text-neutral-300 select-none">/</span>
);

const DotSeparator = () => (
  <span aria-hidden="true" className="text-neutral-300 select-none">·</span>
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
                  className="text-sm text-neutral-500 font-normal truncate max-w-[200px]"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-sm text-neutral-700 hover:text-primary-600 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-sm
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
