import React from 'react';

/**
 * Pagination Props
 * Reference: principles/patterns/navigation.md
 *
 * Molecule: ページ番号ナビゲーション
 */
export interface PaginationProps {
  /** 現在のページ番号（1始まり） */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** ページ変更コールバック */
  onPageChange: (page: number) => void;
  /** 表示するページボタンの最大数（省略記号で折りたたむ） */
  maxVisible?: number;
  /** 最初・最後のページボタンを表示する */
  showEdges?: boolean;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 追加CSSクラス */
  className?: string;
}

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const ChevronsLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
  </svg>
);

const ChevronsRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
  </svg>
);

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

const sizeStyles = {
  sm: 'h-7 min-w-[1.75rem] text-xs',
  md: 'h-8 min-w-[2rem] text-sm',
  lg: 'h-10 min-w-[2.5rem] text-base',
};

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
  size = 'md',
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages, maxVisible);
  const s = sizeStyles[size];

  const btnBase = [
    'inline-flex items-center justify-center rounded font-medium',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
    'px-1',
    s,
  ].join(' ');

  const pageBtn = (page: number) => {
    const isActive = page === currentPage;
    return [
      btnBase,
      isActive
        ? 'bg-primary-600 text-white pointer-events-none'
        : 'text-neutral-700 hover:bg-neutral-100',
    ].join(' ');
  };

  const navBtn = (disabled: boolean) => [
    btnBase,
    disabled
      ? 'text-neutral-300 cursor-not-allowed'
      : 'text-neutral-600 hover:bg-neutral-100',
  ].join(' ');

  return (
    <nav aria-label="ページネーション" className={['flex items-center gap-1', className].join(' ')}>
      {showEdges && (
        <button
          type="button"
          aria-label="最初のページ"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className={navBtn(currentPage === 1)}
        >
          <ChevronsLeft />
        </button>
      )}

      <button
        type="button"
        aria-label="前のページ"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={navBtn(currentPage === 1)}
      >
        <ChevronLeft />
      </button>

      {pages.map((page, i) =>
        page === null ? (
          <span key={`ellipsis-${i}`} className={['inline-flex items-center justify-center text-neutral-400', s].join(' ')}>
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
        <ChevronRight />
      </button>

      {showEdges && (
        <button
          type="button"
          aria-label="最後のページ"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className={navBtn(currentPage === totalPages)}
        >
          <ChevronsRight />
        </button>
      )}
    </nav>
  );
};

Pagination.displayName = 'Pagination';
