import React from 'react';
import { Button } from '../../primitives/Button/Button';

/** EmptyState のサイズ */
export type EmptyStateSize = 'sm' | 'md' | 'lg';

/** EmptyState のアクション設定 */
export interface EmptyStateAction {
  /** ボタンラベル。 */
  label: string;
  /** クリックハンドラー。 */
  onClick?: () => void;
  /** リンク先 URL（指定時はリンクとして動作）。現状未対応、将来拡張用。 */
  href?: string;
  /** ボタンの variant。`action` のデフォルトは `primary`、`secondaryAction` は `tertiary`。 */
  variant?: 'primary' | 'secondary' | 'tertiary';
}

/**
 * EmptyState Props
 *
 * データなし・検索結果ゼロ・初回利用時のプレースホルダー UI。
 * アイコン + タイトル + 説明文 + アクションボタンの構成。
 *
 * @example
 *   // 基本（データなし + 新規作成 CTA）
 *   <EmptyState
 *     title="データがありません"
 *     description="まだ登録されているアイテムがありません。"
 *     action={{ label: '新規作成', onClick: handleCreate }}
 *   />
 *
 * @example
 *   // 検索結果ゼロ（カスタムアイコン）
 *   <EmptyState
 *     icon={<Icon name="search_off" size="xl" color="disabled" />}
 *     title="該当する結果がありません"
 *     description="別のキーワードでお試しください。"
 *     action={{ label: '検索条件をリセット', onClick: handleReset, variant: 'tertiary' }}
 *   />
 *
 * @example
 *   // 2 アクション（主要 + 補助）
 *   <EmptyState
 *     title="プロジェクトがまだありません"
 *     description="最初のプロジェクトを作成しましょう。"
 *     action={{ label: '新規作成', onClick: handleCreate }}
 *     secondaryAction={{ label: 'チュートリアルを見る', onClick: showTutorial }}
 *   />
 *
 * @example
 *   // コンパクト（サイドバー内・カード内）
 *   <EmptyState
 *     title="通知なし"
 *     size="sm"
 *   />
 *
 * @example
 *   // ヒーロー（オンボーディング画面）
 *   <EmptyState
 *     title="ようこそ！"
 *     description="始めるには下のボタンをクリックしてください。"
 *     size="lg"
 *     action={{ label: 'はじめる', onClick: startOnboarding }}
 *   />
 *
 * @see principles/README.mdx
 */
export interface EmptyStateProps {
  /** カスタムアイコン（SVG 要素や `<Icon>`）。未指定時はデフォルトアイコン。 */
  icon?: React.ReactNode;
  /** タイトル（必須）。簡潔な状況説明。 */
  title: string;
  /** 説明文（任意）。詳細・次のアクション提案。 */
  description?: string;
  /**
   * 主要アクション。デフォルト variant は `primary`。
   * `secondaryAction` と併用する場合、こちらが目立つ位置（右）に表示される。
   */
  action?: EmptyStateAction;
  /**
   * セカンダリアクション。デフォルト variant は `tertiary`。
   * 補助的な選択肢（チュートリアル・別の方法等）を提供する用途。
   */
  secondaryAction?: EmptyStateAction;
  /**
   * サイズ。
   * - `sm` コンパクト（サイドバー・カード内）
   * - `md` 標準
   * - `lg` ヒーロー（オンボーディング・ランディング）
   * @default 'md'
   */
  size?: EmptyStateSize;
  /** 追加 CSS クラス。 */
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
    className="w-full h-full text-onSurface-disabled"
    aria-hidden="true"
  >
    <circle cx="32" cy="32" r="24"/>
    <path d="M22 32l7 7 13-13"/>
  </svg>
);

// title は font-size を primitive (text-base/lg/xl) のまま、weight は font-semibold で
// 統一 (semantic typography は text-heading-X が 20px+ で base/lg と一致しないため不採用)。
// desc は semantic body-X に揃える。
const sizeConfig = {
  sm: { icon: 'w-12 h-12', title: 'text-base', desc: 'text-body-sm', gap: 'gap-2', py: 'py-6' },
  md: { icon: 'w-16 h-16', title: 'text-lg',   desc: 'text-body-sm', gap: 'gap-3', py: 'py-10' },
  lg: { icon: 'w-24 h-24', title: 'text-xl',   desc: 'text-body-md', gap: 'gap-4', py: 'py-16' },
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
        <p className={['font-semibold text-onSurface', s.title].join(' ')}>
          {title}
        </p>
        {description && (
          <p className={['text-onSurface-muted max-w-sm', s.desc].join(' ')}>
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant ?? 'tertiary'}
              size={size}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant={action.variant ?? 'primary'}
              size={size}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
