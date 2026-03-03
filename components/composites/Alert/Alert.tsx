import React from 'react';

/**
 * Alert Props
 * Reference: principles/color/semantic-colors.md / principles/interaction/feedback/
 *
 * Molecule: アイコン + タイトル + 本文 + 閉じるボタン のインラインアラート
 */
export interface AlertProps {
  /** セマンティックカラーバリアント */
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  /** アラートのタイトル（任意） */
  title?: string;
  /** アラートの本文 */
  children: React.ReactNode;
  /** 閉じるボタンのハンドラー（省略時は閉じるボタン非表示） */
  onClose?: () => void;
  /** アイコンを非表示にする */
  hideIcon?: boolean;
  /** 追加CSSクラス */
  className?: string;
}

const variantConfig = {
  success: {
    container: 'bg-surface-success-muted border border-border-success-muted text-onSurface-success',
    icon: 'text-success-500',
    title: 'text-onSurface-success',
    closeBtn: 'text-success-600 hover:text-success-800 hover:bg-success-100',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  error: {
    container: 'bg-surface-error-muted border border-border-error-muted text-onSurface-error',
    icon: 'text-error-500',
    title: 'text-onSurface-error',
    closeBtn: 'text-error-600 hover:text-error-800 hover:bg-error-100',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  warning: {
    container: 'bg-surface-warning-muted border border-border-warning-muted text-onSurface-warning',
    icon: 'text-warning-600',
    title: 'text-onSurface-warning',
    closeBtn: 'text-warning-700 hover:text-warning-900 hover:bg-warning-100',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  info: {
    container: 'bg-surface-info-muted border border-border-info-muted text-onSurface-info',
    icon: 'text-info-500',
    title: 'text-onSurface-info',
    closeBtn: 'text-info-600 hover:text-info-800 hover:bg-info-100',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  neutral: {
    container: 'bg-surface-inset border border-border-muted text-onSurface',
    icon: 'text-onSurface-muted',
    title: 'text-onSurface',
    closeBtn: 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
};

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

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
  const { Icon } = config;

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 rounded-lg p-4',
        config.container,
        className,
      ].join(' ')}
    >
      {!hideIcon && (
        <span className={['flex-shrink-0 mt-0.5', config.icon].join(' ')}>
          <Icon />
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
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
