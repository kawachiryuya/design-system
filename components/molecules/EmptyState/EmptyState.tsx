import React from 'react';
import { Button } from '../../atoms/button/Button';

/**
 * EmptyState Props
 * Reference: principles/patterns/data-display.md
 *
 * Molecule: データなし・エラー・検索結果ゼロ時のプレースホルダー
 */
export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export interface EmptyStateProps {
  /** アイコン（SVG要素またはカスタムコンテンツ） */
  icon?: React.ReactNode;
  /** タイトル */
  title: string;
  /** 説明文 */
  description?: string;
  /** プライマリアクション */
  action?: EmptyStateAction;
  /** セカンダリアクション */
  secondaryAction?: EmptyStateAction;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 追加CSSクラス */
  className?: string;
}

const DefaultIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full text-neutral-300"
    aria-hidden="true"
  >
    <rect x="8" y="16" width="48" height="36" rx="4"/>
    <path d="M8 24h48"/>
    <path d="M24 16V8M40 16V8"/>
    <circle cx="32" cy="40" r="6"/>
    <path d="M32 34v6M32 46v.5"/>
  </svg>
);

const sizeConfig = {
  sm: { icon: 'w-12 h-12', title: 'text-base', desc: 'text-sm', gap: 'gap-2', py: 'py-6' },
  md: { icon: 'w-16 h-16', title: 'text-lg', desc: 'text-sm', gap: 'gap-3', py: 'py-10' },
  lg: { icon: 'w-24 h-24', title: 'text-xl', desc: 'text-base', gap: 'gap-4', py: 'py-16' },
};

/**
 * EmptyState Component
 *
 * Atomic Design: Molecule
 *
 * @example
 * <EmptyState
 *   title="データがありません"
 *   description="まだ登録されているアイテムがありません。"
 *   action={{ label: '新規作成', onClick: handleCreate }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
}) => {
  const s = sizeConfig[size];

  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        s.gap,
        s.py,
        'px-4',
        className,
      ].join(' ')}
    >
      <div className={s.icon}>
        {icon ?? <DefaultIcon />}
      </div>

      <div className={['flex flex-col', size === 'sm' ? 'gap-1' : 'gap-2'].join(' ')}>
        <p className={['font-semibold text-neutral-700', s.title].join(' ')}>
          {title}
        </p>
        {description && (
          <p className={['text-neutral-500 max-w-sm', s.desc].join(' ')}>
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {action && (
            <Button
              variant={action.variant ?? 'primary'}
              size={size === 'sm' ? 'small' : 'medium'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant ?? 'tertiary'}
              size={size === 'sm' ? 'small' : 'medium'}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
