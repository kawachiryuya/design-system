import React, { useId, useRef } from 'react';

/**
 * SearchBar Props
 * Reference: principles/patterns/forms.md / principles/interaction/state/interactive-states.md
 *
 * Molecule: Icon + Input[type=search] + Clear Button を組み合わせた検索フィールド
 */
export interface SearchBarProps {
  /** 入力値（制御コンポーネント） */
  value: string;
  /** 値変更ハンドラー */
  onChange: (value: string) => void;
  /** 検索実行ハンドラー（Enter / 検索ボタン押下） */
  onSearch?: (value: string) => void;
  /** クリアハンドラー（省略時はデフォルト動作） */
  onClear?: () => void;
  /** プレースホルダー */
  placeholder?: string;
  /** サイズ */
  size?: 'small' | 'medium' | 'large';
  /** 全幅 */
  fullWidth?: boolean;
  /** ローディング状態（スピナーをトレイリングアイコンとして表示） */
  isLoading?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** aria-label（label を持たない場合に必須） */
  ariaLabel?: string;
  /** 追加CSSクラス */
  className?: string;
}

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin text-neutral-400"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/**
 * SearchBar Component
 *
 * Atomic Design: Molecule（Icon + Input + ClearButton）
 *
 * @example
 * const [query, setQuery] = useState('');
 * <SearchBar
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={(v) => console.log('search:', v)}
 *   placeholder="記事を検索..."
 * />
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = '検索...',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  ariaLabel = '検索',
  className = '',
}) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    small: {
      container: 'h-8',
      input: 'text-sm pl-8 pr-8',
      icon: 'left-2.5',
      trailing: 'right-2',
    },
    medium: {
      container: 'h-10',
      input: 'text-base pl-10 pr-10',
      icon: 'left-3',
      trailing: 'right-2.5',
    },
    large: {
      container: 'h-12',
      input: 'text-lg pl-12 pr-12',
      icon: 'left-3.5',
      trailing: 'right-3',
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

  const inputClass = [
    'w-full',
    'rounded',
    'border',
    'border-neutral-300',
    'bg-white',
    'text-neutral-800',
    'placeholder:text-neutral-400',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:border-primary-500',
    'focus:ring-2',
    'focus:ring-primary-200',
    'disabled:bg-neutral-50',
    'disabled:text-neutral-400',
    'disabled:cursor-not-allowed',
    s.container,
    s.input,
  ].join(' ');

  const leadingClass = [
    'absolute',
    'pointer-events-none',
    'text-neutral-400',
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
    <div className={containerClass}>
      {/* 検索アイコン */}
      <span className={leadingClass}>
        <SearchIcon />
      </span>

      <input
        ref={inputRef}
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

      {/* トレイリング: ローディング or クリアボタン */}
      <span className={trailingClass}>
        {isLoading ? (
          <LoadingSpinner />
        ) : value && !disabled ? (
          <button
            type="button"
            aria-label="検索をクリア"
            onClick={handleClear}
            className="text-neutral-400 hover:text-neutral-600 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-sm"
          >
            <ClearIcon />
          </button>
        ) : null}
      </span>
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
