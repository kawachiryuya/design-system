'use client';

import React from 'react';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

/**
 * 検討用の部品 (Issue #157): 下から出る形 / 画面いっぱい。
 *
 * このファイルは検討の置き場 (components/explorations/overlay-roles/) の中だけで使う。
 * 出荷する部品ではなく、決まりもすべて仮。
 *
 * 仮の決まり:
 * - 土台は `<dialog>` の `showModal()` (フォーカスの閉じ込め・Esc・背景はブラウザに任せる)。背景の色は Modal と同じ
 * - 背景を押すと閉じる (`closeOnBackdrop={false}` で閉じない。確認で使う)
 * - 画面の下端に付く・幅いっぱい・上の角だけ丸い (Modal と同じ rounded-md)
 * - 高さは中身なり、上限 85dvh。本体だけがスクロールし、見出しとフッターは固定
 * - 下端に `env(safe-area-inset-bottom)` の余白
 * - 開くときは下から 200ms (duration normal・easing out)。prefers-reduced-motion では動かさない。閉じる動きは無し
 * - 開いている間は背景をスクロールさせない。閉じたらフォーカスを開く前の要素 (押した要素) に戻す
 * - `full` = 画面いっぱい: 100dvh・角なし。上に見出しと閉じる、下にフッター固定
 * - `handle="drag"` (引いて閉じる。`form="sheet"` かつ背景を押して閉じるシートだけ):
 *   - 掴めるのは上端の帯 (つまみの行と見出しの行。閉じるボタンは除く) だけ。本体は引いても動かない
 *   - 掴む領域は touch-action: none。Pointer Events で指に付いて下へ動く (上へは動かない)。値は CSS 変数 --x-sheet-drag
 *   - 離したとき、引いた距離が高さの 25% を超える か 下向きの速さが 0.5px/ms を超える → 下へ抜けて閉じる (200ms の後に onClose)。
 *     それ以外 → 元の位置へ戻る (200ms)。prefers-reduced-motion: reduce では動きを付けずに即時
 *   - つまみは aria-hidden でフォーカスも受けない (閉じるボタンと Esc が代わりの手段)
 */

/** つまみ: なし / あり・見た目だけ / あり・引いて閉じる */
export type SheetHandle = 'none' | 'visual' | 'drag';

/** 引いて閉じる、の閾値 (仮) */
export const DRAG_CLOSE_RATIO = 0.25;
export const DRAG_CLOSE_VELOCITY = 0.5; // px/ms
/** 速さを測る区間 (直近この時間ぶんの動き) */
const VELOCITY_WINDOW_MS = 100;
/** 抜ける・戻る動きの長さ (token の duration normal と同じ値。終わりを待つのに使う) */
const SETTLE_MS = 200;
export interface SheetProps {
  /** 開いているか */
  open: boolean;
  /** 閉じる要求 (Esc / 背景 / 閉じるボタン / 選んだとき) */
  onClose: () => void;
  /** 見出し */
  title: string;
  /** 下から (`sheet`) / 画面いっぱい (`full`) */
  form?: 'sheet' | 'full';
  /**
   * 背景を押して閉じるか。確認は false
   * @default true
   */
  closeOnBackdrop?: boolean;
  /**
   * 上端の短い横棒。`none` 出さない / `visual` 見た目だけ / `drag` 引いて閉じる。
   * `full` では出さない。`drag` は `form="sheet"` かつ `closeOnBackdrop` のときだけ効き、ほかでは `visual` と同じ
   * @default 'none'
   */
  handle?: SheetHandle;
  /** フッター (固定)。確定・取り消しなど */
  footer?: React.ReactNode;
  /**
   * 本体の左右の余白を付けるか。行を端から端まで並べる「選ぶ」では false
   * @default true
   */
  padded?: boolean;
  children: React.ReactNode;
}

// 開く動きと、背景の止め方を補う CSS。Tailwind は arbitrary な animation の @keyframes を作らないので、ここで書く。
// 値は token の CSS 変数 (duration normal / easing out) を読む。
const SHEET_CSS = `
@keyframes x-sheet-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
.x-sheet[open] { animation: x-sheet-in var(--duration-normal) var(--easing-out); }
@media (prefers-reduced-motion: reduce) { .x-sheet[open] { animation: none; } }
/* 引いて閉じる: 位置は CSS 変数で受ける。引いている間は動きなし、離した後 (data-drag=settle) だけ transition */
.x-sheet { transform: translateY(var(--x-sheet-drag, 0px)); }
.x-sheet[data-drag="settle"] { transition: transform var(--duration-normal) var(--easing-out); }
@media (prefers-reduced-motion: reduce) { .x-sheet[data-drag="settle"] { transition: none; } }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lockCount = 0;
/** 背景のスクロールを止める (html と body の両方。重ねて開いても最後に閉じたときに戻す) */
function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return () => { lockCount -= 1; };
  const html = document.documentElement;
  const body = document.body;
  const prev = { html: html.style.overflow, body: body.style.overflow };
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  return () => {
    lockCount -= 1;
    html.style.overflow = prev.html;
    body.style.overflow = prev.body;
  };
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  title,
  form = 'sheet',
  closeOnBackdrop = true,
  handle = 'none',
  footer,
  padded = true,
  children,
}) => {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const returnTo = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const full = form === 'full';
  const showHandle = handle !== 'none' && !full;
  const draggable = handle === 'drag' && !full && closeOnBackdrop;

  // 引いている間の値は再描画せずに ref と CSS 変数で持つ
  const drag = React.useRef<{
    pointerId: number;
    startY: number;
    height: number;
    samples: { y: number; t: number }[];
  } | null>(null);
  const settleTimer = React.useRef<number | null>(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  /** 位置を 0 に戻し、引く状態を全部捨てる (開くとき・閉じるときに必ず呼ぶ) */
  const resetDrag = React.useCallback(() => {
    drag.current = null;
    if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    settleTimer.current = null;
    const d = ref.current;
    if (!d) return;
    d.style.removeProperty('--x-sheet-drag');
    delete d.dataset.drag;
    delete d.dataset.dragging;
  }, []);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      resetDrag();
      delete dialog.dataset.dragResult;
      returnTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      resetDrag();
      dialog.close();
      // ブラウザも戻すが、戻さないブラウザに備えて明示する
      returnTo.current?.focus();
    }
  }, [open, resetDrag]);

  React.useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  React.useEffect(() => resetDrag, [resetDrag]);

  const setOffset = (px: number) => ref.current?.style.setProperty('--x-sheet-drag', `${px}px`);

  const onGrabDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = ref.current;
    if (!draggable || !d || !d.open || drag.current || settleTimer.current !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // 閉じるボタンは今までどおり押せるように、ボタンの上では掴まない
    if ((e.target as Element).closest('button')) return;
    // 開く動きの途中で掴んだら、動きを終わらせてから指に付ける (animation と transform がぶつからないように)
    d.getAnimations().forEach((a) => a.finish());
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      height: d.getBoundingClientRect().height,
      samples: [{ y: e.clientY, t: e.timeStamp }],
    };
    delete d.dataset.drag;
    d.dataset.dragging = '';
  };

  const onGrabMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g || e.pointerId !== g.pointerId) return;
    e.preventDefault();
    setOffset(Math.max(0, e.clientY - g.startY));
    g.samples.push({ y: e.clientY, t: e.timeStamp });
    while (g.samples.length > 2 && e.timeStamp - g.samples[0].t > VELOCITY_WINDOW_MS) g.samples.shift();
  };

  /** 離したとき (cancel は戻すだけ) */
  const finish = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = drag.current;
    const d = ref.current;
    if (!g || e.pointerId !== g.pointerId || !d) return;
    drag.current = null;
    delete d.dataset.dragging;
    const dist = Math.max(0, e.clientY - g.startY);
    const first = g.samples[0];
    const dt = e.timeStamp - first.t;
    const velocity = dt > 0 ? (e.clientY - first.y) / dt : 0;
    const shouldClose = !cancelled && (dist > g.height * DRAG_CLOSE_RATIO || velocity > DRAG_CLOSE_VELOCITY);
    // 検討の確かめ用 (見た目には使わない): 結果と、引いた距離 px・速さ px/ms
    d.dataset.dragResult = shouldClose ? 'close' : 'back';
    d.dataset.dragMeasure = `${Math.round(dist)}px ${velocity.toFixed(2)}px/ms`;

    if (prefersReducedMotion()) {
      if (shouldClose) onCloseRef.current();
      else resetDrag();
      return;
    }
    d.dataset.drag = 'settle';
    // 下へ抜ける: 高さ + 影のぶんだけ下へ
    setOffset(shouldClose ? g.height + 16 : 0);
    settleTimer.current = window.setTimeout(() => {
      settleTimer.current = null;
      if (shouldClose) onCloseRef.current();
      else resetDrag();
    }, SETTLE_MS);
  };

  return (
    <dialog
      data-ds-root
      ref={ref}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === ref.current) onClose();
      }}
      className={[
        'x-sheet p-0 m-0 inset-x-0 bottom-0 top-auto w-full max-w-none',
        'bg-surface text-onSurface shadow-lg backdrop:bg-surface-overlay',
        'open:flex open:flex-col',
        full ? 'h-[100dvh] max-h-[100dvh] rounded-none' : 'max-h-[85dvh] rounded-t-md',
      ].join(' ')}
    >
      <style>{SHEET_CSS}</style>
      {/* 上端の帯 (つまみの行 + 見出しの行)。drag のときだけここが掴む領域になる */}
      <div
        data-sheet-grab={draggable ? '' : undefined}
        onPointerDown={draggable ? onGrabDown : undefined}
        onPointerMove={draggable ? onGrabMove : undefined}
        onPointerUp={draggable ? (e) => finish(e, false) : undefined}
        onPointerCancel={draggable ? (e) => finish(e, true) : undefined}
        className={draggable ? 'touch-none select-none cursor-grab' : undefined}
      >
        {showHandle && (
          <div aria-hidden className="flex justify-center pt-2">
            <span className="block h-1 w-10 rounded-full bg-surface-neutral" />
          </div>
        )}
        <header className={['flex items-center justify-between gap-3 pl-4 pr-2', showHandle ? 'pt-1' : 'pt-2', 'pb-1'].join(' ')}>
          <h2 id={titleId} className="type-section-title text-onSurface flex-1 min-w-0">
            {title}
          </h2>
          <Button variant="tertiary" size="md" iconOnly icon={<Icon name="close" />} aria-label="閉じる" onClick={onClose} />
        </header>
      </div>
      <div
        className={[
          // flex-auto: 高さが中身なりの入れ物の中で flex-1 (basis 0%) にすると、Safari では本体の高さが 0 に潰れることがある
          'flex-auto min-h-0 overflow-y-auto overscroll-contain type-body text-onSurface',
          padded ? 'px-4 pb-4' : 'pb-2',
          // フッターが無いときは本体の下に安全域の余白
          footer ? '' : 'pb-[calc(theme(spacing.4)+env(safe-area-inset-bottom))]',
        ].join(' ')}
      >
        {children}
      </div>
      {footer && (
        <footer className="border-t border-border-subtle px-4 pt-3 pb-[calc(theme(spacing.3)+env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      )}
    </dialog>
  );
};

/** 「選ぶ」の 1 行 */
export interface SheetOptionProps {
  /** 表示する文言 */
  label: string;
  /** 補足 (1 行) */
  description?: string;
  /** 選択中か。true で右にチェックの印 (選択肢に印が無い「操作の一覧」では undefined のまま) */
  selected?: boolean;
  /** 押したとき */
  onSelect: () => void;
  /** 破壊的な操作 */
  destructive?: boolean;
}

/**
 * 「選ぶ」の行。高さ 48px 以上、選択中は右にチェックの印。押したら onSelect (閉じるのは呼ぶ側)。
 * 選択中は「選択中」を読み上げ用の文字でも持つ (印は見た目だけ)。
 */
export const SheetOption: React.FC<SheetOptionProps> = ({ label, description, selected, onSelect, destructive }) => (
  <button
    type="button"
    onClick={onSelect}
    className={[
      'flex w-full min-h-12 items-center gap-3 px-4 py-2 text-left transition-colors focus-ring-inset',
      destructive ? 'text-onSurface-error hover:bg-state-hover-error' : 'text-onSurface hover:bg-state-hover-primary',
    ].join(' ')}
  >
    <span className="flex-1 min-w-0">
      <span className="block type-body">{label}</span>
      {description && <span className="block type-supporting text-onSurface-subtle">{description}</span>}
    </span>
    {selected && (
      <>
        <Icon size="md" color="primary">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Icon>
        <VisuallyHidden>（選択中）</VisuallyHidden>
      </>
    )}
  </button>
);
