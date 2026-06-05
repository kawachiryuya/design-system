import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Button } from '../../primitives/Button';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

/** Toast のセマンティックカラーバリアント */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

/** Toast 表示位置 (Provider レベルで指定) */
export type ToastPosition = 'top' | 'top-right' | 'bottom' | 'bottom-right';

/** Toast の表示内容 (Provider 経由・直接利用の共通プロパティ) */
export interface ToastContent {
  /**
   * セマンティックカラーバリアント。`error` は aria-live="assertive" で即時通知、それ以外は polite。
   * @default 'info'
   */
  variant?: ToastVariant;
  /** タイトル (省略可、description のみでも成立)。 */
  title?: React.ReactNode;
  /** 本文 (必須)。 */
  description: React.ReactNode;
  /** action ボタン (省略可)。 */
  action?: { label: string; onClick: () => void };
}

/**
 * Toast Props (controlled 単発利用版)
 *
 * 単独で `<Toast />` を描画する API。`open` と `onClose` を親が管理する。
 * 自動消滅やスタック管理が必要な場合は `ToastProvider` + `useToast()` を使う。
 *
 * @example
 *   const [open, setOpen] = useState(false);
 *   <Toast
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     variant="success"
 *     description="保存しました"
 *   />
 *
 * @see principles/Interaction/feedback/toast-notifications.mdx
 */
export interface ToastProps extends ToastContent {
  /** 表示状態。 */
  open: boolean;
  /** 閉じる要求 (close ボタン / 自動消滅) で呼ばれる。 */
  onClose: () => void;
  /**
   * 表示位置。
   * @default 'bottom-right'
   */
  position?: ToastPosition;
  /**
   * 自動消滅までの ms。`0` で無期限。
   * @default 5000
   */
  duration?: number;
}

const variantConfig: Record<ToastVariant, {
  container: string;
  icon: string;
  iconName: 'check_circle' | 'error' | 'warning' | 'info';
  ariaLive: 'polite' | 'assertive';
  role: 'status' | 'alert';
}> = {
  success: {
    container: 'bg-surface-success-muted border border-border-success-muted text-onSurface-success',
    icon: 'text-success-500',
    iconName: 'check_circle',
    ariaLive: 'polite',
    role: 'status',
  },
  error: {
    container: 'bg-surface-error-muted border border-border-error-muted text-onSurface-error',
    icon: 'text-error-500',
    iconName: 'error',
    ariaLive: 'assertive',
    role: 'alert',
  },
  warning: {
    container: 'bg-surface-warning-muted border border-border-warning-muted text-onSurface-warning',
    icon: 'text-warning-600',
    iconName: 'warning',
    ariaLive: 'polite',
    role: 'status',
  },
  info: {
    container: 'bg-surface-info-muted border border-border-info-muted text-onSurface-info',
    icon: 'text-info-500',
    iconName: 'info',
    ariaLive: 'polite',
    role: 'status',
  },
  neutral: {
    container: 'bg-surface-inset border border-border-muted text-onSurface',
    icon: 'text-onSurface-muted',
    iconName: 'info',
    ariaLive: 'polite',
    role: 'status',
  },
};

const positionStyles: Record<ToastPosition, string> = {
  'top':          'top-4 left-1/2 -translate-x-1/2',
  'top-right':    'top-4 right-4',
  'bottom':       'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

/**
 * Toast 本体の見た目だけを描画する内部コンポーネント。Provider と単発 API 両方で使う。
 */
const ToastBody: React.FC<ToastContent & { onClose?: () => void }> = ({
  variant = 'info',
  title,
  description,
  action,
  onClose,
}) => {
  const config = variantConfig[variant];
  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      aria-atomic="true"
      className={[
        'flex gap-3 rounded-md p-4 shadow-md min-w-[20rem] max-w-[28rem]',
        config.container,
      ].join(' ')}
    >
      <span className={['flex-shrink-0 mt-px flex', config.icon].join(' ')}>
        <Icon name={config.iconName} size="sm" />
      </span>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-body-sm font-semibold leading-snug mb-1">{title}</p>
        )}
        <div className="text-body-sm leading-relaxed">{description}</div>
        {action && (
          <div className="mt-2">
            <Button variant="tertiary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>

      {onClose && (
        <Button variant="tertiary" size="sm" onClick={onClose}>
          <Icon name="close" size="sm" />
          <VisuallyHidden>閉じる</VisuallyHidden>
        </Button>
      )}
    </div>
  );
};

/**
 * Toast — Atomic Design: Molecule
 *
 * 単発 controlled API。自動消滅は `duration` (ms) で制御。
 *
 * @see ToastProps for usage examples.
 */
export const Toast: React.FC<ToastProps> = ({
  open,
  onClose,
  position = 'bottom-right',
  duration = 5000,
  ...content
}) => {
  React.useEffect(() => {
    if (!open || duration <= 0) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className={['fixed z-50', positionStyles[position]].join(' ')}>
      <ToastBody {...content} onClose={onClose} />
    </div>
  );
};

Toast.displayName = 'Toast';

// ─────────────────────────────────────────────
// Provider + useToast (複数管理 / 自動消滅)
// ─────────────────────────────────────────────

interface ToastEntry extends ToastContent {
  id: string;
  duration: number;
}

interface ToastContextValue {
  /**
   * Toast を表示する。返り値の id で個別に dismiss 可能。
   * `duration` 省略時は Provider のデフォルト (5000ms)。
   */
  showToast: (content: ToastContent & { duration?: number }) => string;
  /** 指定 id の Toast を即座に閉じる。 */
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  /**
   * 表示位置 (この Provider 配下の Toast すべてに適用)。
   * @default 'bottom-right'
   */
  position?: ToastPosition;
  /**
   * デフォルトの自動消滅 ms。個別 toast で `duration` 指定すれば上書き。`0` で無期限。
   * @default 5000
   */
  defaultDuration?: number;
  /**
   * 同時に表示する最大件数。超過時は古いものから削除。
   * @default 5
   */
  maxToasts?: number;
  children: React.ReactNode;
}

/**
 * ToastProvider
 *
 * 配下のコンポーネントから `useToast()` で複数 Toast を発火・管理できる。
 *
 * @example
 *   // 親
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 *   // 子のどこかで
 *   const { showToast } = useToast();
 *   <Button onClick={() => showToast({ variant: 'success', description: '保存しました' })}>
 *     保存
 *   </Button>
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = 'bottom-right',
  defaultDuration = 5000,
  maxToasts = 5,
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const counterRef = React.useRef(0);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback(
    (content: ToastContent & { duration?: number }) => {
      counterRef.current += 1;
      const id = `toast-${counterRef.current}`;
      const duration = content.duration ?? defaultDuration;
      setToasts((prev) => {
        const next = [...prev, { ...content, id, duration }];
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
      });
      return id;
    },
    [defaultDuration, maxToasts]
  );

  const value = React.useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={[
          'fixed z-50 flex flex-col gap-2',
          positionStyles[position],
          position.startsWith('bottom') ? 'flex-col-reverse' : '',
        ].join(' ')}
      >
        {toasts.map((t) => (
          <ToastEntryView key={t.id} entry={t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';

const ToastEntryView: React.FC<{ entry: ToastEntry; onDismiss: () => void }> = ({ entry, onDismiss }) => {
  React.useEffect(() => {
    if (entry.duration <= 0) return;
    const t = setTimeout(onDismiss, entry.duration);
    return () => clearTimeout(t);
  }, [entry.duration, onDismiss]);

  return <ToastBody {...entry} onClose={onDismiss} />;
};

/**
 * ToastProvider 配下で使う Toast 発火フック。
 */
export const useToast = (): ToastContextValue => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
};
