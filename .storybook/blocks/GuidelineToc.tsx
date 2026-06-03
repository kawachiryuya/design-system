import React from 'react';
import { SBDOCS_CLASS } from './classNames';

/**
 * GuidelineToc — Guideline mdx 冒頭に置く目次 (Table of Contents)
 *
 * ページ全体の大枠をパッと把握しつつ、各セクションへジャンプできる横並びチップ群を描画する。
 * リンク先 id は rehype-slug が h2に自動付与する slug (見出しテキストそのもの) を使う。
 *
 * @example
 *   <GuidelineToc items={[
 *     { label: '概要', href: '#概要' },
 *     { label: '使うとき', href: '#使うとき' },
 *     { label: '使わないとき', href: '#使わないとき' },
 *     { label: 'Playground', href: '#playground' },
 *     { label: '利用ガイド', href: '#利用ガイド' },
 *     { label: 'アクセシビリティ', href: '#アクセシビリティ' },
 *     { label: 'カタログ', href: '#カタログ' },
 *     { label: '関連', href: '#関連' },
 *   ]} />
 */
export interface GuidelineTocItem {
  /** 表示ラベル */
  label: string;
  /** ジャンプ先 (例: `#概要`)。h2のテキストと同じ slug を rehype-slug が生成する。 */
  href: string;
}

export interface GuidelineTocProps {
  items: GuidelineTocItem[];
  /** 上部に表示する小見出し。省略時は「目次」 */
  title?: string;
}

/**
 * クリック時に preventDefault してページ内スクロール (smooth) を実行する。
 * Storybook の docs 内で `<a href="#...">` をネイティブに任せると path 変更として
 * 解釈されてしまうため、明示的に scrollIntoView を呼ぶ。
 */
const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('#')) return;
  e.preventDefault();
  const id = href.slice(1);
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const GuidelineToc: React.FC<GuidelineTocProps> = ({ items, title = '目次' }) => (
  // title は aria-label として SR にのみ提供する (視覚的な見出しは表示しない)
  <nav aria-label={title} className="mt-2 mb-10">
    {/* <ul>/<li> を使うと .sbdocs ul の list-style が復活して bullet が出るため <div> で実装 */}
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={(e) => handleAnchorClick(e, item.href)}
          className={`${SBDOCS_CLASS.guidelineTocLink} inline-flex items-center justify-center h-10 px-4 min-w-[6rem] text-sm font-medium rounded-sm border border-border-muted bg-surface hover:bg-surface-inset hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1 transition-colors`}
        >
          {item.label}
        </a>
      ))}
    </div>
  </nav>
);
