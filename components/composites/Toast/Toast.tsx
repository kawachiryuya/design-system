import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Button } from '../../primitives/Button';

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
   * 自動消滅までの ms。`0` で無期限。**`action` がある場合は到達性のため自動消滅を無期限化**し、
   * 明示指定しても最低 10000ms にクランプする (WCAG 2.2.1)。hover / focus 中は一時停止する。
   * @default 5000
   */
  duration?: number;
}

const variantConfig: Record<ToastVariant, {
  container: string;
  icon: string;
  closeBtn: string;
  iconName: 'check_circle' | 'error' | 'warning' | 'info';
  ariaLive: 'polite' | 'assertive';
  role: 'status' | 'alert';
}> = {
  success: {
    container: 'bg-surface-success-muted border border-border-success-subtle text-onSurface-success',
    icon: 'text-onSurface-success',
    closeBtn: 'text-onSurface-success hover:bg-state-hover',
    iconName: 'check_circle',
    ariaLive: 'polite',
    role: 'status',
  },
  error: {
    container: 'bg-surface-error-muted border border-border-error-subtle text-onSurface-error',
    icon: 'text-onSurface-error',
    closeBtn: 'text-onSurface-error hover:bg-state-hover',
    iconName: 'error',
    ariaLive: 'assertive',
    role: 'alert',
  },
  warning: {
    container: 'bg-surface-warning-muted border border-border-warning-subtle text-onSurface-warning',
    icon: 'text-onSurface-warning',
    closeBtn: 'text-onSurface-warning hover:bg-state-hover',
    iconName: 'warning',
    ariaLive: 'polite',
    role: 'status',
  },
  info: {
    container: 'bg-surface-info-muted border border-border-info-subtle text-onSurface-info',
    icon: 'text-onSurface-info',
    closeBtn: 'text-onSurface-info hover:bg-state-hover',
    iconName: 'info',
    ariaLive: 'polite',
    role: 'status',
  },
  neutral: {
    container: 'bg-surface-layer-2 border border-border-subtle text-onSurface',
    icon: 'text-onSurface-muted',
    closeBtn: 'text-onSurface-muted hover:bg-state-hover',
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
 * 実効 duration を解決する。`action` 付き Toast は SR / キーボードユーザーが操作ボタンへ
 * 到達するのに時間が要るため自動消滅を抑制する: 未指定 (または 0 以下) は無期限、明示指定でも
 * 最低 10 秒を保証する。`action` なしは従来どおり `raw ?? fallback`。
 */
function resolveDuration(raw: number | undefined, hasAction: boolean, fallback: number): number {
  if (hasAction) {
    return raw === undefined || raw <= 0 ? 0 : Math.max(raw, 10000);
  }
  return raw ?? fallback;
}

/**
 * 自動消滅タイマー。`duration <= 0` で無効。
 * hover / focus 中は `pause()` で停止し、離脱時の `resume()` で**残り時間から**再開する
 * (WCAG 2.2.1 Timing Adjustable: 読んでいる / 操作しようとしている途中に消えない)。
 */
function useAutoDismiss(duration: number, onClose: () => void) {
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = React.useRef(duration);
  const startedAtRef = React.useRef(0);

  const clear = React.useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const run = React.useCallback(() => {
    clear();
    if (remainingRef.current <= 0) return;
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => onCloseRef.current(), remainingRef.current);
  }, [clear]);

  const pause = React.useCallback(() => {
    if (timerRef.current === null) return;
    clear();
    remainingRef.current -= Date.now() - startedAtRef.current;
  }, [clear]);

  React.useEffect(() => {
    remainingRef.current = duration;
    run();
    return clear;
  }, [duration, run, clear]);

  return { pause, resume: run };
}

/**
 * Toast 本体の見た目だけを描画する内部コンポーネント。Provider と単発 API 両方で使う。
 */
const ToastBody: React.FC<ToastContent & {
  onClose?: () => void;
  /** hover / focus 中に自動消滅タイマーを止める / 再開するハンドラ (`useAutoDismiss` と連動)。 */
  onPause?: () => void;
  onResume?: () => void;
}> = ({
  variant = 'info',
  title,
  description,
  action,
  onClose,
  onPause,
  onResume,
}) => {
  const config = variantConfig[variant];
  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      aria-atomic="true"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      className={[
        'relative flex gap-3 rounded-md p-4 shadow-md min-w-[20rem] max-w-[28rem]',
        onClose ? 'pr-12' : '',
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

      {/* 閉じるボタンは absolute 配置 (Alert と同じ pattern)。
          Toast は description のみ (text-body-sm leading-relaxed) と title 付き両方で使われる。
          top-4 + mt-px (= 17px) で左 icon span (同じ y=17 offset) と左右対称にし、
          icon center y=27 を description (leading-relaxed glyph center y≈27) /
          title (leading-snug glyph center y≈25.6) いずれにも近づける。 */}
      {onClose && (
        <button
          type="button"
          aria-label="閉じる"
          onClick={onClose}
          className={[
            'absolute top-4 right-4 mt-px inline-flex items-center justify-center h-5 w-5 rounded',
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
  duration,
  ...content
}) => {
  const effectiveDuration = resolveDuration(duration, !!content.action, 5000);
  // 閉じている間はタイマーを動かさない (duration <= 0 で useAutoDismiss が no-op)。
  const { pause, resume } = useAutoDismiss(open ? effectiveDuration : 0, onClose);

  if (!open) return null;

  return (
    <div className={['fixed z-toast', positionStyles[position]].join(' ')}>
      <ToastBody {...content} onClose={onClose} onPause={pause} onResume={resume} />
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
   * `action` 付きの場合は到達性のため自動消滅を無期限化する (明示 `duration` も最低 10000ms にクランプ)。
   * hover / focus 中は自動消滅を一時停止する。
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
      const duration = resolveDuration(content.duration, !!content.action, defaultDuration);
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
          'fixed z-toast flex flex-col gap-2',
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
  const { pause, resume } = useAutoDismiss(entry.duration, onDismiss);
  return <ToastBody {...entry} onClose={onDismiss} onPause={pause} onResume={resume} />;
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
