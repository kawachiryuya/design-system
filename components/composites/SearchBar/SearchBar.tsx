import React, { useId, useRef } from 'react';
import { Icon } from '../../primitives/Icon';

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
    className="animate-spin text-onSurface-subtle"
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
      icon: 'left-2',
      trailing: 'right-2',
      iconSize: 'sm' as const,
      spinnerPx: 16,
    },
    medium: {
      container: 'h-10',
      input: 'text-base pl-8 pr-10',
      icon: 'left-2',
      trailing: 'right-3',
      iconSize: 'sm' as const,
      spinnerPx: 20,
    },
    large: {
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

  const inputClass = [
    'w-full',
    'rounded',
    'border',
    'border-border',
    'bg-surface',
    'text-onSurface',
    'placeholder:text-onSurface-subtle',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:border-border-focus',
    'focus:ring-2',
    'focus:ring-border-focus',
    'disabled:bg-surface-disabled',
    'disabled:text-onSurface-disabled',
    'disabled:cursor-not-allowed',
    '[&::-webkit-search-cancel-button]:appearance-none',
    '[&::-webkit-search-decoration]:appearance-none',
    s.container,
    s.input,
  ].join(' ');

  const leadingClass = [
    'absolute',
    'pointer-events-none',
    'text-onSurface-subtle',
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
        <Icon name="search" size={s.iconSize} />
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
          <LoadingSpinner size={s.spinnerPx} />
        ) : value && !disabled ? (
          <button
            type="button"
            aria-label="検索をクリア"
            onClick={handleClear}
            className="flex items-center justify-center text-onSurface-subtle hover:text-onSurface-muted transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-sm"
          >
            <Icon name="close" size={s.iconSize} />
          </button>
        ) : null}
      </span>
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
