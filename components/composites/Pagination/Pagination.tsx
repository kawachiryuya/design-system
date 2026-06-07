import React from 'react';
import { Icon } from '../../primitives/Icon';

/**
 * Pagination Props
 *
 * ページ番号ナビゲーション。`<nav aria-label>` でラップ、`aria-current="page"` 自動付与。
 *
 * @example
 *   // 基本
 *   <Pagination
 *     currentPage={page}
 *     totalPages={totalPages}
 *     onPageChange={setPage}
 *   />
 *
 * @example
 *   // 最初/最後ジャンプボタン付き（管理画面のテーブル等）
 *   <Pagination
 *     currentPage={page}
 *     totalPages={50}
 *     onPageChange={setPage}
 *     showEdges
 *   />
 *
 * @example
 *   // 表示するページボタン数を減らす (モバイル向け compact)
 *   <Pagination
 *     currentPage={page}
 *     totalPages={20}
 *     onPageChange={setPage}
 *     maxVisible={5}
 *   />
 *
 * @see principles/README.mdx
 */
export interface PaginationProps {
  /** 現在のページ番号（1 始まり）。 */
  currentPage: number;
  /** 総ページ数。`<= 1` の場合は描画されない。 */
  totalPages: number;
  /** ページ変更コールバック。新しいページ番号が引数。 */
  onPageChange: (page: number) => void;
  /**
   * 表示するページボタンの最大数。これを超えると省略記号 (`…`) で折りたたむ。
   * @default 7
   */
  maxVisible?: number;
  /**
   * 最初/最後のページボタン（`«` `»`）を表示。長いリストでの一気ジャンプに便利。
   * @default false
   */
  showEdges?: boolean;
  /** 追加 CSS クラス。 */
  className?: string;
}

/** 表示するページ番号の配列を生成（省略符号は null で表現） */
function buildPages(current: number, total: number, maxVisible: number): (number | null)[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current - half <= 2) end = Math.min(total - 1, maxVisible - 1);
  if (current + half >= total - 1) start = Math.max(2, total - maxVisible + 2);

  const pages: (number | null)[] = [1];
  if (start > 2) pages.push(null);
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push(null);
  pages.push(total);

  return pages;
}

// 40×40 固定 (shadcn / Material 3 と同等)。サイズバリエーションは廃止し
// touch target を WCAG 2.5.5 (44px) に近い 40px に統一。
const buttonSizeStyle = 'h-10 min-w-10 text-sm';

/**
 * Pagination Component
 *
 * Atomic Design: Molecule
 *
 * @example
 * <Pagination
 *   currentPage={3}
 *   totalPages={20}
 *   onPageChange={setPage}
 * />
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 7,
  showEdges = false,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages, maxVisible);

  const btnBase = [
    'inline-flex items-center justify-center rounded-sm font-medium',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-focus focus-visible:ring-border-focus focus-visible:ring-offset-focus',
    'px-1',
    buttonSizeStyle,
  ].join(' ');

  const pageBtn = (page: number) => {
    const isActive = page === currentPage;
    return [
      btnBase,
      isActive
        ? 'bg-surface-primary text-onSurface-inverse pointer-events-none'
        : 'text-onSurface hover:bg-state-hover-primary',
    ].join(' ');
  };

  const navBtn = (disabled: boolean) => [
    btnBase,
    disabled
      ? 'text-onSurface-disabled cursor-not-allowed'
      : 'text-onSurface-muted hover:bg-state-hover-primary',
  ].join(' ');

  return (
    <nav aria-label="ページネーション" className={['flex flex-wrap items-center gap-1', className].join(' ')}>
      {showEdges && (
        <button
          type="button"
          aria-label="最初のページ"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className={navBtn(currentPage === 1)}
        >
          <Icon name="first_page" size="sm" />
        </button>
      )}

      <button
        type="button"
        aria-label="前のページ"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={navBtn(currentPage === 1)}
      >
        <Icon name="chevron_left" size="sm" />
      </button>

      {pages.map((page, i) =>
        page === null ? (
          <span key={`ellipsis-${i}`} className={['inline-flex items-center justify-center text-onSurface-muted', buttonSizeStyle].join(' ')}>
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`${page}ページ目`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={pageBtn(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="次のページ"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={navBtn(currentPage === totalPages)}
      >
        <Icon name="chevron_right" size="sm" />
      </button>

      {showEdges && (
        <button
          type="button"
          aria-label="最後のページ"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className={navBtn(currentPage === totalPages)}
        >
          <Icon name="last_page" size="sm" />
        </button>
      )}
    </nav>
  );
};

Pagination.displayName = 'Pagination';
