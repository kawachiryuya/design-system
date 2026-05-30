import React from 'react';
import { Icon } from '../../primitives/Icon';

/** Alert のセマンティックカラーバリアント */
export type AlertVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

/**
 * Alert Props
 *
 * インラインアラート。アイコン + タイトル + 本文 + 閉じるボタンの構成。
 * `role="alert"` 自動付与でスクリーンリーダーに即時通知。
 *
 * @example
 *   // 成功通知（タイトル + 本文）
 *   <Alert variant="success" title="保存しました">
 *     変更内容が正常に保存されました。
 *   </Alert>
 *
 * @example
 *   // 閉じるボタン付きエラー（dismissible）
 *   <Alert variant="error" onClose={() => setVisible(false)}>
 *     入力内容に誤りがあります。
 *   </Alert>
 *
 * @example
 *   // 警告（簡潔）
 *   <Alert variant="warning">未保存の変更があります</Alert>
 *
 * @example
 *   // 情報（リンク含む）
 *   <Alert variant="info" title="新機能">
 *     ベータ版が公開されました。<Link href="/beta">詳細を見る</Link>
 *   </Alert>
 *
 * @example
 *   // ニュートラル + アイコン非表示（情報量を抑えた controle）
 *   <Alert variant="neutral" hideIcon>
 *     データの更新中です。しばらくお待ちください。
 *   </Alert>
 *
 * @see principles/Color/semantic-colors.md
 * @see principles/README.md
 */
export interface AlertProps {
  /**
   * セマンティックカラーバリアント。
   * - `success` 成功・完了・正常終了
   * - `error` エラー・失敗
   * - `warning` 警告・注意喚起
   * - `info` 情報・通知（デフォルト）
   * - `neutral` その他・進捗情報など意味色を避けたい場合
   * @default 'info'
   */
  variant?: AlertVariant;
  /** アラートのタイトル（任意）。指定すると本文より太字で目立つ。 */
  title?: string;
  /** アラートの本文（必須）。テキストや React 要素 OK。 */
  children: React.ReactNode;
  /**
   * 閉じるボタンのハンドラー。**指定しない場合は閉じるボタン非表示**。
   * dismissible にしたい時は必ず指定する。
   */
  onClose?: () => void;
  /**
   * アイコンを非表示。コンパクト表示用。
   * @default false
   */
  hideIcon?: boolean;
  /** 追加 CSS クラス。 */
  className?: string;
}

const variantConfig = {
  success: {
    container: 'bg-surface-success-muted border border-border-success-muted text-onSurface-success',
    icon: 'text-success-500',
    title: 'text-onSurface-success',
    closeBtn: 'text-success-600 hover:text-success-800 hover:bg-success-100',
    iconName: 'check_circle' as const,
  },
  error: {
    container: 'bg-surface-error-muted border border-border-error-muted text-onSurface-error',
    icon: 'text-error-500',
    title: 'text-onSurface-error',
    closeBtn: 'text-error-600 hover:text-error-800 hover:bg-error-100',
    iconName: 'error' as const,
  },
  warning: {
    container: 'bg-surface-warning-muted border border-border-warning-muted text-onSurface-warning',
    icon: 'text-warning-600',
    title: 'text-onSurface-warning',
    closeBtn: 'text-warning-700 hover:text-warning-900 hover:bg-warning-100',
    iconName: 'warning' as const,
  },
  info: {
    container: 'bg-surface-info-muted border border-border-info-muted text-onSurface-info',
    icon: 'text-info-500',
    title: 'text-onSurface-info',
    closeBtn: 'text-info-600 hover:text-info-800 hover:bg-info-100',
    iconName: 'info' as const,
  },
  neutral: {
    container: 'bg-surface-inset border border-border-muted text-onSurface',
    icon: 'text-onSurface-muted',
    title: 'text-onSurface',
    closeBtn: 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200',
    iconName: 'info' as const,
  },
};

/**
 * Alert Component
 *
 * Atomic Design: Molecule
 *
 * @example
 * <Alert variant="success" title="保存しました">変更内容が正常に保存されました。</Alert>
 * <Alert variant="error" onClose={() => setVisible(false)}>入力内容に誤りがあります。</Alert>
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  hideIcon = false,
  className = '',
}) => {
  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 rounded-md p-4',
        config.container,
        className,
      ].join(' ')}
    >
      {!hideIcon && (
        <span className={['flex-shrink-0 flex', title ? 'mt-px' : 'mt-[2.5px]', config.icon].join(' ')}>
          <Icon name={config.iconName} size="sm" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <p className={['text-sm font-semibold leading-snug mb-1', config.title].join(' ')}>
            {title}
          </p>
        )}
        <div className="text-sm leading-relaxed">
          {children}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          aria-label="閉じる"
          onClick={onClose}
          className={[
            'flex-shrink-0 self-start -mt-0.5 -mr-0.5 p-1 rounded',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1',
            config.closeBtn,
          ].join(' ')}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
