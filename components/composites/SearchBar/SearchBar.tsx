'use client';

import React, { forwardRef, useCallback, useId, useRef } from 'react';
import { Icon } from '../../primitives/Icon';

/** SearchBar のサイズ */
export type SearchBarSize = 'sm' | 'md' | 'lg';

/**
 * SearchBar Props
 *
 * 検索専用入力。Icon + `<input type="search">` + Clear Button を組み合わせた Molecule。
 * Enter で `onSearch` 発火、Escape でクリアして blur、value がある時にクリアボタン自動表示。
 *
 * @example
 *   // 基本（controlled、Enter で検索実行）
 *   const [query, setQuery] = useState('');
 *   <SearchBar
 *     value={query}
 *     onChange={setQuery}
 *     onSearch={(v) => fetchResults(v)}
 *     placeholder="記事を検索..."
 *   />
 *
 * @example
 *   // 全幅 + 大サイズ（モバイルヘッダー）
 *   <SearchBar value={q} onChange={setQ} size="lg" fullWidth />
 *
 * @example
 *   // ローディング中（onSearch から非同期処理中）
 *   <SearchBar value={q} onChange={setQ} isLoading={isFetching} />
 *
 * @example
 *   // カスタム onClear（クリア時に追加処理）
 *   <SearchBar
 *     value={q}
 *     onChange={setQ}
 *     onClear={() => { setQ(''); resetFilters(); }}
 *   />
 *
 * @example
 *   // a11y: 用途固有の aria-label
 *   <SearchBar value={q} onChange={setQ} ariaLabel="商品名で検索" />
 */
export interface SearchBarProps {
  /** 入力値（controlled）。 */
  value: string;
  /** 値変更ハンドラー。タイプ毎に発火。 */
  onChange: (value: string) => void;
  /** 検索実行ハンドラー。Enter キー押下時に発火。省略時は Enter 操作なし。 */
  onSearch?: (value: string) => void;
  /** クリアハンドラー。省略時は `onChange('')` でデフォルト動作。 */
  onClear?: () => void;
  /**
   * プレースホルダーテキスト。
   * @default '検索...'
   */
  placeholder?: string;
  /**
   * サイズ。
   * - `small` 32px、密集 UI 用（テーブルヘッダー等）
   * - `medium` 40px、標準
   * - `large` 48px、目立たせる検索（ヘッダー）
   * @default 'md'
   */
  size?: SearchBarSize;
  /** 全幅表示（親要素の幅に追従）。 */
  fullWidth?: boolean;
  /**
   * ローディング状態。`true` でクリアボタンの位置にスピナー表示。
   * @default false
   */
  isLoading?: boolean;
  /**
   * 無効状態。
   * @default false
   */
  disabled?: boolean;
  /**
   * `aria-label`。視覚的ラベルがない（このコンポーネントは Label を持たない）ため必ず指定推奨。
   * @default '検索'
   */
  ariaLabel?: string;
  /** 追加 CSS クラス。 */
  className?: string;
}

const LoadingSpinner: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin text-onSurface-muted"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/**
 * SearchBar — Atomic Design: Molecule（Icon + Input + ClearButton）
 *
 * @see SearchBarProps for usage examples.
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = '検索...',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  ariaLabel = '検索',
  className = '',
}, ref) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 外部 ref と内部 inputRef の両方へ代入 (Escape clear / clear ボタンの blur/focus 制御で内部 ref が必要)。
  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const sizeStyles = {
    sm: {
      container: 'h-8',
      input: 'text-sm pl-8 pr-8',
      icon: 'left-2',
      trailing: 'right-2',
      iconSize: 'sm' as const,
      spinnerPx: 16,
    },
    md: {
      container: 'h-10',
      input: 'text-base pl-8 pr-10',
      icon: 'left-2',
      trailing: 'right-3',
      iconSize: 'sm' as const,
      spinnerPx: 20,
    },
    lg: {
      container: 'h-12',
      input: 'text-lg pl-10 pr-12',
      icon: 'left-3',
      trailing: 'right-3',
      iconSize: 'md' as const,
      spinnerPx: 20,
    },
  };

  const s = sizeStyles[size];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
    if (e.key === 'Escape') {
      handleClear();
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange('');
    }
    inputRef.current?.focus();
  };

  const containerClass = [
    'relative',
    'inline-flex',
    'items-center',
    fullWidth ? 'w-full' : 'w-auto',
    className,
  ].join(' ');

  // Input / Select と統一: border 色変化 + inset ring (1px) で focus 表現、hover で border 濃化
  const inputClass = [
    'w-full',
    'rounded-sm',
    'border',
    'border-border',
    'bg-surface',
    'text-onSurface',
    'placeholder:text-onSurface-muted',
    'transition-colors',
    'duration-normal',
    'hover:border-border-strong',
    'focus:outline-none',
    'focus:border-border-focus',
    'focus:ring-1',
    'focus:ring-inset',
    'focus:ring-border-focus',
    'disabled:bg-surface-disabled',
    'disabled:text-onSurface-disabled',
    'disabled:cursor-not-allowed',
    'disabled:hover:border-border',
    '[&::-webkit-search-cancel-button]:appearance-none',
    '[&::-webkit-search-decoration]:appearance-none',
    s.container,
    s.input,
  ].join(' ');

  const leadingClass = [
    'absolute',
    'pointer-events-none',
    'text-onSurface-muted',
    'flex',
    'items-center',
    'justify-center',
    s.icon,
    'top-1/2',
    '-translate-y-1/2',
  ].join(' ');

  const trailingClass = [
    'absolute',
    'flex',
    'items-center',
    'justify-center',
    'top-1/2',
    '-translate-y-1/2',
    s.trailing,
  ].join(' ');

  return (
    <div data-ds-root className={containerClass}>
      {/* 検索アイコン */}
      <span className={leadingClass}>
        <Icon name="search" size={s.iconSize} />
      </span>

      <input
        ref={setInputRef}
        id={id}
        type="search"
        role="searchbox"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={inputClass}
      />

      {/* トレイリング: ローディング or クリアボタン。
          クリアボタンは Alert / Toast の close ボタンと同じ pattern (inline-flex + h-5 w-5)、
          hover overlay は NumberInput と同じ branded teal tint (state-hover-primary)。 */}
      <span className={trailingClass}>
        {isLoading ? (
          <LoadingSpinner size={s.spinnerPx} />
        ) : value && !disabled ? (
          <button
            type="button"
            aria-label="検索をクリア"
            onClick={handleClear}
            className={[
              'inline-flex items-center justify-center h-5 w-5 rounded-sm',
              'text-onSurface-muted hover:text-onSurface hover:bg-state-hover-primary',
              'transition-colors focus:outline-none focus-visible:ring-focus focus-visible:ring-inset focus-visible:ring-border-focus',
            ].join(' ')}
          >
            <Icon name="close" size={s.iconSize} />
          </button>
        ) : null}
      </span>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
