'use client';

import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Button } from '../../primitives/Button';
import { tv } from '../../_internal/tv';
import { HIDE_FOCUS_RING_ATTR, hideFocusRingUntilKeyOrBlur } from '../../_internal/useHideFocusRingUntilKey';
import { ToastStoryContext } from '../../_internal/toastStory';

/**
 * Toast の種類。`success` (できた) と `error` (できなかった) の 2 つ。
 * 秒数・色・アイコン・閉じるボタンの有無・読み上げの急ぎ方は、種類から部品が決める。
 */
export type ToastVariant = 'success' | 'error';

/** Toast に 1 つだけ置ける操作。「元に戻す」「再試行」のような短い言葉で */
export interface ToastAction {
  /** ボタンの文言 (短い動詞。「元に戻す」「再試行」)。別の画面への案内には使わない */
  label: string;
  /** 押したときに呼ぶ。呼んだ後、その Toast は閉じる */
  onClick: () => void;
}

/** `showToast()` に渡すもの: いまの操作の結果を 1 文で + 操作 1 つまで */
export interface ToastOptions {
  /**
   * 種類。`success` は自動で消える (5 秒、操作つきは 7 秒)。`error` は消えず、「閉じる」を持つ。
   * @default 'success'
   */
  variant?: ToastVariant;
  /** 結果の 1 文 (「保存しました」「送信できませんでした」)。見出しは持たない */
  message: string;
  /** 操作 (1 つまで)。押すと `onClick` を呼んでから閉じる */
  action?: ToastAction;
}

/** 秒数は部品が決める: できた 5 秒・操作つき 7 秒・できなかったは消えない (#91) */
function durationOf({ variant = 'success', action }: ToastOptions): number {
  if (variant === 'error') return 0;
  return action ? 7000 : 5000;
}

/** 下へこれより多く動かして離すと消える */
const SWIPE_PX = 24;
/** 出入りの動き (duration.normal) */
const MOTION_MS = 200;
/** 払っている間の指の位置・薄さ (CSS 変数で渡す。スタイリング3規律 3) */
const DRAG_VAR = '--ds-toast-drag';
const FADE_VAR = '--ds-toast-fade';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─────────────────────────────────────────────
// 見た目
// ─────────────────────────────────────────────

const toastVariants = tv({
  slots: {
    root: [
      'pointer-events-auto flex py-2 pl-4 rounded-md shadow-lg touch-none select-none',
      // 濃い面に白い文字。できなかった、だけ赤い面 (#91)
      'bg-surface-neutral-strong text-onSurface-inverse data-[variant=error]:bg-surface-error',
      // 動き: 位置と薄さは払っている間の CSS 変数を読む。出る前・消えるときは data-state で決める
      'translate-y-[var(--ds-toast-drag,0px)] opacity-[var(--ds-toast-fade,1)]',
      'transition-[transform,opacity] duration-normal ease-out motion-reduce:transition-none data-[dragging]:transition-none',
      'data-[state=entering]:translate-y-4 data-[state=entering]:opacity-0',
      'data-[state=exiting]:translate-y-[calc(var(--ds-toast-drag,0px)+100%)] data-[state=exiting]:opacity-0 data-[state=exiting]:pointer-events-none',
    ],
    // 文とボタン (群) の並び: flex-wrap。文の箱は 1 行のときの幅 (basis auto)、ボタンは margin-left: auto。
    // 両方が 1 行に入れば横並び (ボタンは右端)、入らなければボタンが次の行へ回って右に寄り、文は面の幅いっぱいで折り返す (測らない)
    row: 'flex min-w-0 flex-1 flex-wrap items-center',
    text: 'flex min-w-0 flex-[1_1_auto] items-start gap-3 py-2.5',
    // アイコンは 1 行目に固定: 入れ物を 1 行の高さ (type-supporting の行間 1.5em) にして、その中で上下の真ん中
    icon: 'type-supporting flex h-[1.5em] shrink-0 items-center',
    message: 'type-supporting min-w-0',
    buttons: 'ml-auto flex shrink-0 items-center gap-1 pl-2',
    // 濃い面の上のボタン: 白い文字、ホバーは黒 8% (DDR-1 の「濃い塗り・役割色の面」)、
    // フォーカスは白い内側の輪 (border.focus は濃い面で 1.62:1・赤い面で 1.21:1 で見えない、DDR-2)、押せる高さ 44px
    button: [
      'shrink-0 whitespace-nowrap min-h-[44px] text-onSurface-inverse focus-ring-on-fill',
      'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)] active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]',
    ],
  },
  variants: {
    hasButtons: {
      true: { root: 'pr-2' },
      false: { root: 'pr-4' },
    },
  },
});

// ─────────────────────────────────────────────
// 置き場 (画面の下の中央)
// ─────────────────────────────────────────────

// どの幅も下の中央。狭い幅は左右に余白、広い幅も中央で最大幅 28rem (content.max-width.sm)。
// 下のもの (AppShell の下のナビ・FormDialog のフッター) は避けずに重ねる。使う側は選べない (#91)。
// 反対側の辺は `auto`・幅と高さは `auto` と書く: dialog を開いている間は置き場が `popover` になり、ブラウザの既定
// (`inset: 0`・`margin: auto`・`width/height: fit-content`・余白・枠・背景・はみ出しの切り取り・文字色) が当たるため (#169)。
// ふだんの div では既定と同じ値なので、見た目は変わらない
const layerStyles =
  'fixed z-toast inset-x-0 bottom-0 top-auto w-auto h-auto m-0 border-0 bg-transparent overflow-visible text-inherit ' +
  'pointer-events-none flex justify-center px-4 pb-4 shell:px-6 shell:pb-6';
/** story だけの「その場に置く」(固定しない) 置き場 */
const inlineLayerStyles = 'flex justify-center';

/** layout effect はブラウザでだけ (サーバーでは何もしない effect にして、React の警告を出さない) */
const useLayoutEffectOnClient = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// ─────────────────────────────────────────────
// dialog の上に出す (#169)
// ─────────────────────────────────────────────

/** 置き場 1 つ分 (ToastProvider 1 つ) */
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
 * 閉じたら元の場所 (`host` の親、描いた場所) へ戻し、`popover` を外す。dialog が無いときは何もしない。
 * 動かすのは DOM の要素だけなので、React は描き直さない (出ている Toast・タイマーはそのまま)。
 *
 * 仕組み:
 * - ページで 1 つの見張り (`watch`): 開いた順の dialog の一覧と、文書の `open` 属性・要素の出し入れを見る `MutationObserver`。
 *   最初の置き場が描かれたときに始め、最後の置き場が外れたら止める。どの置き場も同じ順を使う
 * - 置き場ごとの `keydown` (capture): Toast の中でキーが押されたら、今いる dialog の `data-ds-hide-focus-ring` を外す
 *   (指・マウスで開いた dialog の中は、キーが押されるまで輪を出さない決まり。AGENTS §3-2。
 *   Toast は React では dialog の外の部品なので、dialog の「キーが押されたら外す」が Toast の中のキーに届かない)
 * - 置き場ごとの `focusout`: dialog の中で、フォーカスを持ったまま Toast が消えて body に落ちたら
 *   (戻し先 `restoreFocus` が使えなかったとき)、フォーカスを dialog そのものに置く (DialogBase と同じ線)。
 *   残っている別の Toast へは移さない。dialog が無いページでは何もしない
 *
 * 外すとき (アンマウント) は置き場を元の場所へ戻す (dialog の中に置き去りにしない)。
 */
function useAboveModalDialogs(hostRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useLayoutEffectOnClient(() => {
    const host = hostRef.current;
    const home = host?.parentElement;
    if (!enabled || !host || !home || typeof host.showPopover !== 'function') return;

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
  }, [hostRef, enabled]);
}

// ─────────────────────────────────────────────
// 残り時間
// ─────────────────────────────────────────────

type PauseReason = 'hover' | 'focus' | 'press';

/**
 * 自動で消えるまでの残り時間。止める理由 (触れている・マウスが乗っている・中にフォーカスがある) が
 * 1 つでもある間は止め、無くなったら残りから再開する (WCAG 2.2.1)。`duration` 0 は消えない
 */
function useRemaining(duration: number, onTimeout: () => void) {
  const onTimeoutRef = React.useRef(onTimeout);
  onTimeoutRef.current = onTimeout;
  const reasons = React.useRef(new Set<PauseReason>());
  const remaining = React.useRef(duration);
  const startedAt = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = React.useCallback(() => {
    if (timer.current === null) return;
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - startedAt.current;
  }, []);

  const start = React.useCallback(() => {
    if (duration <= 0 || timer.current !== null || reasons.current.size > 0) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => {
      timer.current = null;
      onTimeoutRef.current();
    }, Math.max(0, remaining.current));
  }, [duration]);

  React.useEffect(() => {
    remaining.current = duration;
    start();
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [duration, start]);

  const pause = React.useCallback((why: PauseReason) => {
    reasons.current.add(why);
    stop();
  }, [stop]);
  const resume = React.useCallback((why: PauseReason) => {
    reasons.current.delete(why);
    start();
  }, [start]);

  return { pause, resume };
}

// ─────────────────────────────────────────────
// 1 枚
// ─────────────────────────────────────────────

interface ToastEntry extends ToastOptions {
  id: string;
  /** 出したときにフォーカスがあった要素 (#176 の戻し先) */
  returnFocus: HTMLElement | null;
  /** 消える途中 (動きのあと、DOM から外す) */
  exiting: boolean;
}

/** 消し方: 指・マウスで消したときは、戻したフォーカスにキーが押されるまで輪を出さない */
type DismissBy = 'pointer' | 'keyboard' | 'program';

/**
 * Toast の中にフォーカスがあるまま消えるとき、フォーカスを body に落とさない (#176)。戻し先は順に:
 * 1. 出したときにフォーカスがあった要素 (今も文書にあり、見えていて、フォーカスが入るもの)
 * 2. Toast に入る直前にフォーカスがあった要素 (1 が消えた・押せない: 押した行が消えた・dialog の後ろになった等)
 * 3. Toast が dialog の中にあるなら、その dialog そのもの (DialogBase と同じ線)
 * どれも使えなければ何もしない (ブラウザは body に戻す)
 */
function restoreFocus(item: HTMLElement, candidates: (HTMLElement | null)[], by: DismissBy) {
  if (!item.contains(document.activeElement)) return;
  for (const el of candidates) {
    if (!el || !el.isConnected || item.contains(el) || el.getClientRects().length === 0) continue;
    const clear = by === 'pointer' ? hideFocusRingUntilKeyOrBlur(el) : () => {};
    el.focus({ preventScroll: true });
    if (document.activeElement === el) return;
    clear();
  }
  const dialog = item.closest('dialog');
  if (dialog?.open) dialog.focus();
}

const ToastItem: React.FC<{
  entry: ToastEntry;
  frozen: boolean;
  onDismiss: (id: string) => void;
}> = ({ entry, frozen, onDismiss }) => {
  const { id, variant = 'success', message, action, exiting } = entry;
  const ref = React.useRef<HTMLDivElement>(null);
  /** Toast に入る直前にフォーカスがあった要素 (戻し先の 2 番目) */
  const cameFrom = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(() => frozen || prefersReducedMotion());
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef<{ pointerId: number; y0: number; dy: number } | null>(null);

  const leave = React.useCallback(
    (by: DismissBy) => {
      if (ref.current) restoreFocus(ref.current, [entry.returnFocus, cameFrom.current], by);
      onDismiss(id);
    },
    [entry.returnFocus, id, onDismiss],
  );

  const { pause, resume } = useRemaining(exiting || frozen ? 0 : durationOf(entry), () => leave('program'));

  // 入れ替えで外れる (動かさずに外す) ときも、フォーカスは戻す。layout effect の後片付けは DOM から外す前に走る
  React.useLayoutEffect(() => {
    const el = ref.current;
    return () => {
      if (el) restoreFocus(el, [entry.returnFocus, cameFrom.current], 'program');
    };
  }, [entry.returnFocus]);

  // 出る動き: 1 フレーム目は下にずらして透明、次のフレームで定位置へ (動きを減らす設定では最初から定位置)
  React.useEffect(() => {
    if (shown) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [shown]);

  const setOffset = (dy: number) => {
    const el = ref.current;
    if (!el) return;
    if (dy > 0) {
      el.style.setProperty(DRAG_VAR, `${dy}px`);
      el.style.setProperty(FADE_VAR, String(Math.max(0.3, 1 - dy / 120)));
    } else {
      el.style.removeProperty(DRAG_VAR);
      el.style.removeProperty(FADE_VAR);
    }
  };

  // 下へ払う: 指 (マウス) に付いて下へだけ動く。ボタンの上で始めた操作は払う動きにしない (押せるように)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exiting) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pause('press');
    if ((e.target as Element).closest('button')) return;
    drag.current = { pointerId: e.pointerId, y0: e.clientY, dy: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 合成の pointer (テスト) では捕まえられないことがある。動きは同じ要素の上で続く
    }
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    d.dy = Math.max(0, e.clientY - d.y0);
    setOffset(d.dy);
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    resume('press');
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (d.dy > SWIPE_PX && e.type === 'pointerup') leave('pointer');
    else setOffset(0);
  };

  const isError = variant === 'error';
  const hasButtons = isError || !!action;
  const s = toastVariants({ hasButtons });
  const byOf = (e: React.MouseEvent) => (e.detail > 0 ? 'pointer' : 'keyboard');

  return (
    <div
      ref={ref}
      data-ds-root
      data-variant={variant}
      data-state={exiting ? 'exiting' : shown ? 'open' : 'entering'}
      data-dragging={dragging ? '' : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerEnter={(e) => e.pointerType === 'mouse' && pause('hover')}
      onPointerLeave={(e) => e.pointerType === 'mouse' && resume('hover')}
      onFocus={(e) => {
        const from = e.relatedTarget;
        if (from instanceof HTMLElement && !e.currentTarget.contains(from) && !from.closest('[data-ds-toast-layer]')) {
          cameFrom.current = from;
        }
        pause('focus');
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume('focus');
      }}
      className={s.root()}
    >
      <div className={s.row()}>
        <div className={s.text()}>
          <span className={s.icon()} aria-hidden="true">
            <Icon name={isError ? 'error' : 'check_circle'} size="sm" />
          </span>
          <p className={s.message()}>{message}</p>
        </div>
        {hasButtons && (
          <div className={s.buttons()}>
            {/* 閉じるは、できなかった、にだけ。文字のボタンで、操作の左 (通常の太さ)。読み上げ名は dialog の × と分ける (§8-3) */}
            {isError && (
              <Button
                variant="tertiary"
                size="sm"
                aria-label="通知を閉じる"
                className={s.button({ class: 'font-regular' })}
                onClick={(e) => leave(byOf(e))}
              >
                閉じる
              </Button>
            )}
            {action && (
              <Button
                variant="tertiary"
                size="sm"
                className={s.button({ class: 'font-bold' })}
                onClick={(e) => {
                  action.onClick();
                  leave(byOf(e));
                }}
              >
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Provider + useToast
// ─────────────────────────────────────────────

interface ToastContextValue {
  /**
   * Toast を出す。返り値の id で `dismissToast` から閉じられる。
   * ふだんは 1 枚で入れ替え。できなかった (`error`) が出ている間はそれを残し、新しい 1 枚をその上に出す (最大 2 枚)。
   * できなかったが続けて出たら、新しいほうだけ残す。
   */
  showToast: (options: ToastOptions) => string;
  /** 指定 id の Toast を閉じる。 */
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * 枚数: ふだん 1 枚で入れ替え。できなかった、が出ている間はそれを残し、新しい 1 枚をその上に (最大 2 枚)。
 * できなかった、が続けて出たら新しいほうだけ残す (仮決め、#91)。消える途中のものは動きが終わるまで残す
 */
function nextStack(current: ToastEntry[], added: ToastEntry): ToastEntry[] {
  const leaving = current.filter((t) => t.exiting);
  const keptError = added.variant === 'error' ? undefined : current.find((t) => !t.exiting && t.variant === 'error');
  return [...leaving, ...(keptError ? [keptError] : []), added];
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * ToastProvider — 配下の `useToast()` から Toast を出す。アプリの root に 1 つ置く。
 *
 * 置き場所 (下の中央)・秒数・枚数は部品が決め、使う側は選べない。
 * modal の dialog を開いている間は、置き場を一番上の dialog の中へ移すので、dialog の上に見えて押せる (#169)。
 *
 * @example
 *   // アプリの root
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 * @example
 *   // 子のどこかで: できた (5 秒で消える)
 *   const { showToast } = useToast();
 *   showToast({ message: '保存しました' });
 *
 * @example
 *   // 操作つき (7 秒) / できなかった (消えない、「閉じる」つき)
 *   showToast({ message: 'アーカイブしました', action: { label: '元に戻す', onClick: undo } });
 *   showToast({ variant: 'error', message: '送信できませんでした', action: { label: '再試行', onClick: retry } });
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const story = React.useContext(ToastStoryContext);
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const counter = React.useRef(0);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());
  useAboveModalDialogs(hostRef, !story.inline);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => (prev.some((t) => t.id === id && !t.exiting) ? prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)) : prev));
    const delay = prefersReducedMotion() ? 0 : MOTION_MS;
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, delay);
    timers.current.add(timer);
  }, []);

  const showToast = React.useCallback((options: ToastOptions) => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    const entry: ToastEntry = {
      variant: 'success',
      ...options,
      id,
      exiting: false,
      returnFocus: active instanceof HTMLElement && active !== document.body ? active : null,
    };
    setToasts((prev) => nextStack(prev, entry));
    return id;
  }, []);

  const value = React.useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  // 読み上げ: できた = role="status" (polite、区切りを待つ)、できなかった = role="alert" (assertive、すぐ)。
  // 入れ物は空でも常に置く (中身を足したときに確実に読まれるように)。
  // 並び: 下に残る「できなかった」、その上に新しい「できた」。2 つの入れ物の順 (status が上) で決まる
  const successes = toasts.filter((t) => t.variant !== 'error');
  const errors = toasts.filter((t) => t.variant === 'error');
  const render = (list: ToastEntry[]) =>
    list.map((t) => <ToastItem key={t.id} entry={t} frozen={!!story.frozen} onDismiss={dismissToast} />);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 外側の div は元の場所の目印 (`display: contents` で箱を作らない)。dialog を開いている間、置き場はその中へ移り、閉じたらここへ戻る */}
      <div className="contents">
        <div ref={hostRef} data-ds-toast-layer="" className={story.inline ? inlineLayerStyles : layerStyles}>
          <div className="flex w-full max-w-content-sm flex-col gap-2">
            <div role="status" aria-live="polite" aria-relevant="additions" className="flex flex-col gap-2 empty:hidden">
              {render(successes)}
            </div>
            <div role="alert" aria-live="assertive" aria-relevant="additions" className="flex flex-col gap-2 empty:hidden">
              {render(errors)}
            </div>
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';

/**
 * ToastProvider の中で使う、Toast を出すフック。
 *
 * @example
 *   const { showToast } = useToast();
 *   <Button onClick={() => { save(); showToast({ message: '保存しました' }); }}>保存</Button>
 */
export const useToast = (): ToastContextValue => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
};
