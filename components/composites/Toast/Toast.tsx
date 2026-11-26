'use client';

import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Button } from '../../primitives/Button';
import { HIDE_FOCUS_RING_ATTR } from '../../_internal/useHideFocusRingUntilKey';

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
    container: 'bg-surface-success-muted border border-border-success-muted text-onSurface-success',
    icon: 'text-onSurface-success',
    closeBtn: 'text-onSurface-success hover:bg-state-hover',
    iconName: 'check_circle',
    ariaLive: 'polite',
    role: 'status',
  },
  error: {
    container: 'bg-surface-error-muted border border-border-error-muted text-onSurface-error',
    icon: 'text-onSurface-error',
    closeBtn: 'text-onSurface-error hover:bg-state-hover',
    iconName: 'error',
    ariaLive: 'assertive',
    role: 'alert',
  },
  warning: {
    container: 'bg-surface-warning-muted border border-border-warning-muted text-onSurface-warning',
    icon: 'text-onSurface-warning',
    closeBtn: 'text-onSurface-warning hover:bg-state-hover',
    iconName: 'warning',
    ariaLive: 'polite',
    role: 'status',
  },
  info: {
    container: 'bg-surface-info-muted border border-border-info-muted text-onSurface-info',
    icon: 'text-onSurface-info',
    closeBtn: 'text-onSurface-info hover:bg-state-hover',
    iconName: 'info',
    ariaLive: 'polite',
    role: 'status',
  },
  neutral: {
    container: 'bg-surface-subtle border border-border-subtle text-onSurface',
    icon: 'text-onSurface-subtle',
    closeBtn: 'text-onSurface-subtle hover:bg-state-hover',
    iconName: 'info',
    ariaLive: 'polite',
    role: 'status',
  },
};

// 反対側の辺は `auto` と書く: dialog を開いている間は置き場が `popover` になり、ブラウザの既定 (`inset: 0`・`margin: auto`) が
// 当たるため (#169)。ふだんの div では既定と同じ値なので、見た目は変わらない
const positionStyles: Record<ToastPosition, string> = {
  'top':          'top-4 bottom-auto left-1/2 right-auto -translate-x-1/2',
  'top-right':    'top-4 bottom-auto right-4 left-auto',
  'bottom':       'bottom-4 top-auto left-1/2 right-auto -translate-x-1/2',
  'bottom-right': 'bottom-4 top-auto right-4 left-auto',
};

/**
 * 置き場 (固定して出す入れ物) の見た目。`popover` になったときのブラウザの既定 (余白・枠・背景・はみ出しの切り取り・文字色。
 * 位置の `inset: 0` は `positionStyles` の反対側の辺で消す) を打ち消す。ふだんの div では既定と同じ値なので、見た目は変わらない
 * (幅・高さの `fit-content` は、固定した div の中身なりの大きさと同じなので打ち消さない)
 */
const layerStyles = 'fixed z-toast m-0 p-0 border-0 bg-transparent overflow-visible text-inherit';

/** layout effect はブラウザでだけ (サーバーでは何もしない effect にして、React の警告を出さない) */
const useLayoutEffectOnClient = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// ─────────────────────────────────────────────
// dialog の上に出す (#169)
// ─────────────────────────────────────────────

/** 置き場 1 つ分 (ToastProvider 1 つ・開いている単発の Toast 1 つ) */
interface ToastLayer {
  /** 置き場 (固定して出す入れ物) */
  host: HTMLDivElement;
  /** 元の場所 (`display: contents` の目印) */
  home: HTMLElement;
}

/**
 * ページで 1 つの見張り。置き場が 1 つでもある間だけ動き、最後の置き場が外れたら止まって空になる。
 * module では値を作るだけで、文書には触らない (触るのは最初の置き場が描かれた後、AGENTS §5-2)
 */
const watch = {
  /** 今ある置き場 */
  layers: new Set<ToastLayer>(),
  /** 開いている modal の dialog を、開いた順に並べたもの (一番上は最後) */
  modals: [] as HTMLDialogElement[],
  /** 文書の `open` 属性と、要素の出し入れを見る */
  observer: null as MutationObserver | null,
};

/** 一番上の modal の dialog。閉じた・文書から外れたものは一覧から抜く */
function topModal(): HTMLDialogElement | undefined {
  const { modals } = watch;
  for (let i = modals.length - 1; i >= 0; i -= 1) {
    if (!modals[i].isConnected || !modals[i].matches(':modal')) modals.splice(i, 1);
  }
  return modals[modals.length - 1];
}

/** 置き場を、一番上の dialog の中 (無ければ元の場所) に置く。もうそこにあれば何もしない */
function placeLayer({ host, home }: ToastLayer, top: HTMLDialogElement | undefined) {
  if (top) {
    if (host.parentElement === top && host.matches(':popover-open')) return;
    if (host.matches(':popover-open')) host.hidePopover();
    top.appendChild(host);
    host.setAttribute('popover', 'manual');
    host.showPopover();
  } else {
    if (host.parentElement === home && !host.hasAttribute('popover')) return;
    if (host.matches(':popover-open')) host.hidePopover();
    host.removeAttribute('popover');
    home.appendChild(host);
  }
}

function placeAll() {
  const top = topModal();
  watch.layers.forEach((layer) => placeLayer(layer, top));
}

/**
 * 見張りを始める。始める前から開いている dialog は、開いた順が分からないので文書の順に並べ、
 * フォーカスを含む dialog があればそれを一番上とみなす (使う人が今操作している dialog)
 */
function startWatch() {
  const open = Array.from(document.querySelectorAll<HTMLDialogElement>('dialog:modal'));
  const focused = open.find((d) => d.contains(document.activeElement));
  watch.modals = [...open.filter((d) => d !== focused), ...(focused ? [focused] : [])];
  watch.observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type !== 'attributes' || !(r.target instanceof HTMLDialogElement)) continue;
      // 開いた・開き直した dialog は一番上へ、閉じたものは抜く (知らせの順 = 本当に開いた順)
      const i = watch.modals.indexOf(r.target);
      if (i >= 0) watch.modals.splice(i, 1);
      if (r.target.matches(':modal')) watch.modals.push(r.target);
    }
    // 要素の出し入れ (childList) も見る: 開いたまま dialog が外された・中身を丸ごと置き換えられて置き場ごと外れた、を戻す
    placeAll();
  });
  watch.observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] });
}

function stopWatch() {
  watch.observer?.disconnect();
  watch.observer = null;
  watch.modals = [];
}

/**
 * Toast の置き場を、開いている modal の dialog の上に出す (#169)。
 *
 * `<dialog>.showModal()` (ConfirmDialog・FormDialog・狭い幅の Menu・Popover の下から出る面) が開いている間、
 * ブラウザは一番上の dialog の外をすべて押せなくする (inert。一番上の層 `popover` に出しても同じ。#169 で測った)。
 * そこで、開いている間は置き場 (`host`) を**一番上の modal の dialog の中**へ移し、`popover="manual"` で一番上の層に出す
 * (dialog の中なので押せる・フォーカスが入る・読み上げられる。一番上の層なので、dialog の変形・はみ出しの切り取りに左右されない)。
 * 閉じたら元の場所 (`host` の親、描いた場所) へ戻し、`popover` を外す。dialog が無いときは何もしない (今までと同じ)。
 * 動かすのは DOM の要素だけなので、React は描き直さない (出ている Toast・タイマーはそのまま)。
 *
 * 仕組み:
 * - ページで 1 つの見張り (`watch`): 開いた順の dialog の一覧と、文書の `open` 属性・要素の出し入れを見る `MutationObserver`。
 *   最初の置き場が描かれたときに始め、最後の置き場が外れたら止める。どの置き場も同じ順を使う
 * - 置き場ごとの `keydown` (capture): Toast の中でキーが押されたら、今いる dialog の `data-ds-hide-focus-ring` を外す
 *   (指・マウスで開いた dialog の中は、キーが押されるまで輪を出さない決まり。AGENTS §3-2。
 *   Toast は React では dialog の外の部品なので、dialog の「キーが押されたら外す」が Toast の中のキーに届かない)
 * - 置き場ごとの `focusout`: dialog の中で、フォーカスを持ったまま Toast が消えたら (閉じる・操作ボタン・自動で消える)、
 *   フォーカスを dialog そのものに置く (body に落ちると、次の Tab でブラウザの外へ出る。DialogBase と同じ線)。
 *   残っている別の Toast へは移さない。dialog が無いページでは何もしない
 *
 * 外すとき (アンマウント) は置き場を元の場所へ戻す (dialog の中に置き去りにしない)。
 */
function useAboveModalDialogs(hostRef: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffectOnClient(() => {
    const host = hostRef.current;
    const home = host?.parentElement;
    if (!host || !home || typeof host.showPopover !== 'function') return;

    const layer: ToastLayer = { host, home };
    if (watch.layers.size === 0) startWatch();
    watch.layers.add(layer);
    placeLayer(layer, topModal());

    const showRingOnKey = () => host.closest('dialog')?.removeAttribute(HIDE_FOCUS_RING_ATTR);
    const keepFocusInDialog = (e: FocusEvent) => {
      if (e.relatedTarget) return;
      const lost = e.target as Element;
      queueMicrotask(() => {
        const dialog = host.parentElement;
        const active = document.activeElement;
        if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
        if (active && active !== document.body) return;
        // 外れた要素が今も見えるなら、わざと外した (`blur()`) もの。扱わない
        if (lost.isConnected && lost.getClientRects().length > 0) return;
        dialog.focus();
      });
    };
    host.addEventListener('keydown', showRingOnKey, true);
    host.addEventListener('focusout', keepFocusInDialog);

    return () => {
      host.removeEventListener('keydown', showRingOnKey, true);
      host.removeEventListener('focusout', keepFocusInDialog);
      watch.layers.delete(layer);
      placeLayer(layer, undefined);
      if (watch.layers.size === 0) stopWatch();
    };
  }, [hostRef]);
}

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
  // role / aria-live は常設の live region コンテナ側に持たせる (告知の確実性向上)。
  // ToastBody 自体は視覚表現のみを担う。
  return (
    <div data-ds-root
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
      <span className={['flex-shrink-0 flex', config.icon].join(' ')}>
        <Icon name={config.iconName} size="sm" />
      </span>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="type-supporting font-bold mb-1">{title}</p>
        )}
        <div className="type-supporting">{description}</div>
        {action && (
          <div className="mt-2">
            <Button variant="tertiary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>

      {/* 閉じるボタンは absolute 配置 (Alert と同じ pattern)。
          Toast は description のみ (type-supporting) と title 付き両方で使われる。
          top-4 (= 16px) で左 icon span (同じ y=16 offset) と左右対称にし、
          icon center y=26 を description (leading-relaxed glyph center y≈27) /
          title (leading-snug glyph center y≈25.6) いずれにも近づける。 */}
      {onClose && (
        <button
          type="button"
          aria-label="通知を閉じる"
          onClick={onClose}
          className={[
            'absolute top-4 right-4 inline-flex items-center justify-center h-5 w-5 rounded',
            // フォーカスの輪は面の色に合わせず border.focus の一色、すき間は塗らない (AGENTS §3-2「フォーカスの規則」)
            'transition-colors focus-ring',
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
  return <ToastSingleLayer {...content} position={position} onClose={onClose} onPause={pause} onResume={resume} />;
};

/** 単発 API の置き場 (開いている間だけ描く)。dialog を開いている間はその上に出す (`useAboveModalDialogs`) */
const ToastSingleLayer: React.FC<React.ComponentProps<typeof ToastBody> & { position: ToastPosition }> = ({
  position,
  ...body
}) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  useAboveModalDialogs(hostRef);
  // 単発 API は live region コンテナを持たないため、ラッパに role/aria-live を付与する。
  const liveConfig = variantConfig[body.variant ?? 'info'];
  // 外側の div は元の場所の目印 (`display: contents` で箱を作らない)。dialog を閉じたら置き場をここへ戻す
  return (
    <div className="contents">
      <div
        ref={hostRef}
        role={liveConfig.role}
        aria-live={liveConfig.ariaLive}
        aria-atomic="true"
        className={[layerStyles, positionStyles[position]].join(' ')}
      >
        <ToastBody {...body} />
      </div>
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
  const hostRef = React.useRef<HTMLDivElement>(null);
  useAboveModalDialogs(hostRef);

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

  // error は assertive (role=alert)、それ以外は polite (role=status) のコンテナへ振り分ける。
  // 両コンテナは空でも DOM に常設し、内容注入を確実に告知させる (live region のマウント遅延を回避)。
  const assertiveToasts = toasts.filter((t) => t.variant === 'error');
  const politeToasts = toasts.filter((t) => t.variant !== 'error');
  const stackClass = [
    'flex flex-col gap-2',
    position.startsWith('bottom') ? 'flex-col-reverse' : '',
  ].filter(Boolean).join(' ');

  const renderEntries = (entries: ToastEntry[]) =>
    entries.map((t) => (
      <ToastEntryView key={t.id} entry={t} onDismiss={() => dismissToast(t.id)} />
    ));

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 外側の div は元の場所の目印 (`display: contents` で箱を作らない)。dialog を開いている間、置き場はその中へ移り、閉じたらここへ戻る */}
      <div className="contents">
        <div ref={hostRef} className={[layerStyles, 'flex flex-col gap-2', positionStyles[position]].join(' ')}>
          <div role="status" aria-live="polite" aria-relevant="additions" className={stackClass}>
            {renderEntries(politeToasts)}
          </div>
          <div role="alert" aria-live="assertive" aria-relevant="additions" className={stackClass}>
            {renderEntries(assertiveToasts)}
          </div>
        </div>
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
