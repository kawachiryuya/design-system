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
 * @see principles/Color/semantic-colors.mdx
 * @see principles/README.mdx
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
    container: 'bg-surface-success-muted border border-border-success-subtle text-onSurface-success',
    icon: 'text-onSurface-success',
    title: 'text-onSurface-success',
    closeBtn: 'text-onSurface-success hover:bg-state-hover',
    iconName: 'check_circle' as const,
  },
  error: {
    container: 'bg-surface-error-muted border border-border-error-subtle text-onSurface-error',
    icon: 'text-onSurface-error',
    title: 'text-onSurface-error',
    closeBtn: 'text-onSurface-error hover:bg-state-hover',
    iconName: 'error' as const,
  },
  warning: {
    container: 'bg-surface-warning-muted border border-border-warning-subtle text-onSurface-warning',
    icon: 'text-onSurface-warning',
    title: 'text-onSurface-warning',
    closeBtn: 'text-onSurface-warning hover:bg-state-hover',
    iconName: 'warning' as const,
  },
  info: {
    container: 'bg-surface-info-muted border border-border-info-subtle text-onSurface-info',
    icon: 'text-onSurface-info',
    title: 'text-onSurface-info',
    closeBtn: 'text-onSurface-info hover:bg-state-hover',
    iconName: 'info' as const,
  },
  neutral: {
    container: 'bg-surface-layer-2 border border-border-subtle text-onSurface',
    icon: 'text-onSurface-muted',
    title: 'text-onSurface',
    closeBtn: 'text-onSurface-muted hover:bg-state-hover',
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
        'relative flex gap-3 rounded-md p-4',
        onClose ? 'pr-12' : '',
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
          <p className={['text-body-sm font-semibold leading-snug mb-1', config.title].join(' ')}>
            {title}
          </p>
        )}
        <div className="text-body-sm leading-relaxed">
          {children}
        </div>
      </div>

      {/* 閉じるボタンは absolute 配置で右上に固定 (shadcn / Material 3 pattern)。
          h-5 w-5 (= icon sm 20×20) を明示してフォーカスリングが line-height で
          縦長にならないようにする。top-3 right-3 (12px) で icon center が
          title の視覚中央 (cap height center、y≈21) と揃う。 */}
      {onClose && (
        <button
          type="button"
          aria-label="閉じる"
          onClick={onClose}
          className={[
            'absolute top-3 right-3 inline-flex items-center justify-center h-5 w-5 rounded',
            'transition-colors focus:outline-none focus-visible:ring-focus focus-visible:ring-current focus-visible:ring-offset-focus',
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
