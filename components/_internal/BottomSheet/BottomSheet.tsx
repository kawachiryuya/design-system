'use client';

import React from 'react';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { tv } from '../tv';
import { useFocusStop } from '../useFocusStop';
import { lockScroll } from '../scrollLock';

/**
 * BottomSheet Props
 *
 * **外に出さない土台** (#157)。`components/index.ts` から export せず、部品の一覧にも出さない。
 * 使う側は役割の部品 (選ぶ = `Menu`、補足 = `Popover`) を選び、その部品が画面の幅が狭いとき
 * (640px 未満、`useIsNarrowViewport`) にこの面で出る。背景を押すと閉じる軽いものにだけ使う
 * (確認・作業のように外を押しても閉じないものには使わない)。
 *
 * 決まり (Issue #157 の「下から出る形の決まり」):
 * - 土台は `<dialog>` の `showModal()`。トップレイヤーに出て、フォーカスを中に閉じ込め、背景は `surface.overlay`
 * - 高さは中身なり、上限 85dvh。本体だけスクロールし、見出しは固定。下端に端末の余白 (safe-area) を足す
 * - 閉じ方: 外を押す (押し始めと離した場所の両方が背景のときだけ) / 閉じるボタン (48px) / Esc / 上端の帯を下に引く
 * - 上端の帯 (つまみと見出しの行。閉じるボタンは除く) を下に引いて離したとき、引いた距離が高さの 25% を超えるか、
 *   下向きの速さ (直近 100ms) が 0.5px/ms を超えると閉じる。ただし速さで閉じるのは、引いた距離が 10px を超えたときだけ
 *   (10px 以下は指のぶれ。触っただけで閉じない)。それ以外と pointercancel は元に戻る。中身を引いても動かない
 * - 開閉は 200ms (duration normal・easing out)。閉じるときも下へ抜ける。動きを減らす設定では即時 (背景の暗さも)
 * - 開いている間は背景 (html と body) をスクロールさせない (`scrollLock` の共有の止め方。面が重なっても、最後の 1 つが閉じたときに元へ戻る)。
 *   閉じたらフォーカスを開く前の要素に戻す
 * - 開いてから 300ms は、ポインタの操作 (面の中を押す・背景を押して閉じる・帯を引く) を受け付けない。入口を素早く 2 回押したとき、
 *   2 回目が上がってくる面の項目に当たって選ばれたり、背景に当たってすぐ閉じたりしないため。この間に押し始めた操作は、
 *   300ms を越えて離しても受け付けない (止めるのはその押下から出る click だけで、印は押下が終わると消える)。時間は動きの有無によらず同じ。
 *   キーボード (Esc・矢印・Enter・Space)・`el.click()`・読み上げの「実行」(detail が 0 の click) は、いつでも受ける
 * - 閉じる動きの間は面を `inert` にして、二度押し・Esc の連打を受けない (もう一度開く `open` は受ける)
 *
 * 配信契約 (AGENTS §10-2): `data-state="open" | "closed"` (閉じる動きの間も `closed`)、引いている間の `data-dragging`、
 * 引いた距離の CSS 変数 `--ds-bottom-sheet-drag` (px、下向き)。どれも `<dialog>` に付く。
 *
 * @example
 *   // Menu (狭い幅) から使う。開いた直後のフォーカスは選択中の項目へ
 *   <BottomSheet open={open} onClose={close} title="並び順" initialFocusRef={selectedItemRef} bodyPadding="none">
 *     <div role="menu">…</div>
 *   </BottomSheet>
 *
 * @example
 *   // Popover (狭い幅) から使う。フォーカスは最初の押せるもの、無ければ面そのもの (既定)
 *   <BottomSheet open={open} onClose={close} title="自由席について">
 *     <p className="type-body">…</p>
 *   </BottomSheet>
 */
export interface BottomSheetProps {
  /** 開閉の状態。閉じる要求 (外を押す・閉じるボタン・Esc・帯を引く) では `onClose` が呼ばれるので、親が `false` にする。 */
  open: boolean;
  /**
   * 閉じる要求が起きたときに呼ばれる。親で `open` を `false` にすると、下へ抜ける動き (200ms) の後に閉じる。
   * 閉じる動きの間の操作では呼ばれない (二度呼ばない)。
   */
  onClose: () => void;
  /** 見出し (必須)。面の名前として読み上げにも使う (`aria-labelledby`)。 */
  title: string;
  /**
   * 開いた直後にフォーカスを当てる要素。Menu は項目 (選択中か先頭)、Popover は最初の押せるもの。
   * 省略時は、本体の中の最初の押せるもの、無ければ面そのもの。閉じるボタンには最初のフォーカスを当てない。
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /**
   * 本体の余白。`default` は左右 16px・下 16px。`none` は余白なし (Menu の行のように、行が端まで届くもの。行が自分で余白を持つ)。
   * @default 'default'
   */
  bodyPadding?: 'default' | 'none';
  /** `<dialog>` の id (入口の `aria-controls` 用)。 */
  id?: string;
  /**
   * 閉じた後にフォーカスを戻す要素 (Menu の入口など)。省略時は、開く前にフォーカスがあった要素。
   * 使う側の部品が別の場所から開かれる (別のメニューで選んだら開く等) とき、開く前のフォーカスは入口ではないので指定する。
   * 戻すのは、閉じたときにフォーカスが面の中か、どこにも無い (body) ときだけ。
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

/** 引いて閉じる: 引いた距離が高さのこの割合を超えると閉じる */
const DISMISS_DISTANCE_RATIO = 0.25;
/** 引いて閉じる: 下向きの速さ (px/ms) がこれを超えると閉じる */
const DISMISS_VELOCITY = 0.5;
/** 速さを測る時間の幅 (ms)。離す直前のこの時間の動きで測る */
const VELOCITY_WINDOW = 100;
/** 引いて閉じる: 速さで閉じるのは、引いた距離がこれ (px) を超えたときだけ。これ以下は指のぶれとして扱う */
const VELOCITY_MIN_DISTANCE = 10;
/** 開いてからこの時間 (ms) は、ポインタの操作を受け付けない (入口の二度押しが面に当たらないように) */
const OPEN_POINTER_GUARD_MS = 300;
/** pointerup の後、その押下から出る click を待つ時間 (ms)。click はふつう pointerup と同じ瞬間に来る */
const CLICK_AFTER_UP_MS = 500;
/** 引いた距離の CSS 変数 (配信契約) */
const DRAG_VAR = '--ds-bottom-sheet-drag';

const sheet = tv({
  slots: {
    dialog: [
      // 画面の下端に、幅いっぱいで出す (UA の中央寄せ・最大幅・最大高さを上書き)
      'fixed inset-x-0 bottom-0 top-auto m-0 p-0 w-full max-w-none max-h-[85dvh] overflow-hidden',
      'open:flex open:flex-col',
      'bg-surface text-onSurface rounded-t-md shadow-lg',
      // 端末の下端の余白 (ホームバー等)
      'pb-[env(safe-area-inset-bottom)]',
      // 位置: 引いた距離を足す。閉じている (閉じる動きの間を含む) ときは高さぶん下 (画面の外)
      'translate-y-[var(--ds-bottom-sheet-drag,0px)] data-[state=closed]:translate-y-full',
      'transition-transform duration-normal ease-out data-[dragging]:transition-none',
      'backdrop:bg-surface-overlay backdrop:transition-opacity backdrop:duration-normal backdrop:ease-out',
      'data-[state=closed]:backdrop:opacity-0',
      // 動きを減らす設定: preset の共通の規則 (transition-duration 0.01ms) は ::backdrop に当たらないので、ここで止める
      'motion-reduce:backdrop:transition-none',
      // 面そのものにフォーカスが来たとき (中に押せるものが無いとき) の輪
      'focus-ring-inset',
    ],
    // 上端の帯 (つまみの行 + 見出しの行)。ここだけ引ける
    grab: 'shrink-0 touch-none select-none',
    handleRow: 'flex justify-center pt-2 pb-1',
    handle: 'block h-1 w-10 rounded-full bg-surface-neutral',
    titleRow: 'flex items-center gap-2 pl-4 pr-1',
    title: 'flex-1 min-w-0 type-section-title text-onSurface',
    // 本体の高さは flex-auto (flex-1 は iPhone の Safari で高さが潰れた、#157)
    body: 'flex-auto min-h-0 overflow-y-auto overscroll-contain focus-ring-inset',
  },
  variants: {
    bodyPadding: {
      default: { body: 'px-4 pb-4' },
      none: { body: '' },
    },
  },
  defaultVariants: { bodyPadding: 'default' },
});

const TABBABLE =
  'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable=""],[contenteditable="true"],audio[controls],video[controls]';

/** root の中で最初の、Tab で来られる要素 (root 自身は含まない) */
function firstTabbable(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null;
  for (const el of root.querySelectorAll<HTMLElement>(TABBABLE)) {
    if (el.tabIndex < 0 || el.matches(':disabled')) continue;
    if (el instanceof HTMLInputElement && el.type === 'hidden') continue;
    if (el.getClientRects().length === 0 || el.closest('[inert]')) continue;
    return el;
  }
  return null;
}

/** 要素の transition の長さ (ms、最大の duration + delay)。動きを減らす設定では 0 に近い値になる */
function transitionMs(el: HTMLElement): number {
  const style = getComputedStyle(el);
  const toMs = (v: string) => (v.trim().endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000) || 0;
  const durations = style.transitionDuration.split(',').map(toMs);
  const delays = style.transitionDelay.split(',').map(toMs);
  return Math.max(0, ...durations.map((d, i) => d + (delays[i % delays.length] ?? 0)));
}

type Phase = 'closed' | 'open' | 'closing';

interface DragState {
  pointerId: number;
  startY: number;
  height: number;
  samples: { t: number; y: number }[];
}

/**
 * BottomSheet — 下から出る面 (外に出さない共通の土台)。
 *
 * @see BottomSheetProps 決まりと使い方
 */
export const BottomSheet = React.forwardRef<HTMLDialogElement, BottomSheetProps>(
  ({ open, onClose, title, initialFocusRef, bodyPadding, id, returnFocusRef, children }, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);
    const bodyRef = React.useRef<HTMLDivElement | null>(null);
    const grabRef = React.useRef<HTMLDivElement | null>(null);
    const titleId = React.useId();
    const styles = sheet({ bodyPadding });

    // 最新の props を effect / handler から読む (effect を開閉以外で走らせ直さない)
    const onCloseRef = React.useRef(onClose);
    const initialFocusRefRef = React.useRef(initialFocusRef);
    const returnFocusRefRef = React.useRef(returnFocusRef);
    onCloseRef.current = onClose;
    initialFocusRefRef.current = initialFocusRef;
    returnFocusRefRef.current = returnFocusRef;

    const phaseRef = React.useRef<Phase>('closed');
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const unlockRef = React.useRef<(() => void) | null>(null);
    const openerRef = React.useRef<HTMLElement | null>(null);
    const dragRef = React.useRef<DragState | null>(null);
    const pressOnBackdropRef = React.useRef(false);
    /** 開いた (開き直した) 時刻 (performance.now)。この後 OPEN_POINTER_GUARD_MS はポインタを受け付けない */
    const openedAtRef = React.useRef(0);
    /** いまの押下が、受け付けない間に押し始めたものか (押下が終わる = pointerup / pointercancel で消える) */
    const pressGuardedRef = React.useRef(false);
    /**
     * 受け付けない間に押し始めた押下が pointerup で終わった: その押下から出る click (ポインタの click、detail > 0) を 1 回だけ止める。
     * click が来なかったとき (引いた・離れた所で離した) に残らないよう、次の押し始めと、少し後 (CLICK_AFTER_UP_MS) に消す
     */
    const swallowClickRef = React.useRef(false);
    const swallowTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const inPointerGuard = () => performance.now() - openedAtRef.current < OPEN_POINTER_GUARD_MS;

    const bodyFocusStop = useFocusStop(bodyRef, 'scrollable-without-tabbable');

    const setDialogRef = React.useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const setDrag = (px: number) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (px > 0) dialog.style.setProperty(DRAG_VAR, `${px}px`);
      else dialog.style.removeProperty(DRAG_VAR);
    };

    /** 引いている途中をやめる (位置は変えない) */
    const endDrag = () => {
      const drag = dragRef.current;
      const dialog = dialogRef.current;
      dragRef.current = null;
      if (!dialog) return;
      dialog.removeAttribute('data-dragging');
      const grab = grabRef.current;
      if (drag && grab?.hasPointerCapture(drag.pointerId)) grab.releasePointerCapture(drag.pointerId);
    };

    const focusInitial = () => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const target = initialFocusRefRef.current?.current ?? firstTabbable(bodyRef.current) ?? dialog;
      target.focus();
    };

    /** 閉じ終える: dialog を閉じ、背景のスクロールとフォーカスを戻す。何度呼んでもよい */
    const finishClose = () => {
      const dialog = dialogRef.current;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      if (phaseRef.current === 'closed') return;
      phaseRef.current = 'closed';
      endDrag();
      if (dialog) {
        dialog.inert = false;
        dialog.setAttribute('data-state', 'closed');
        if (dialog.open) dialog.close();
        dialog.style.removeProperty(DRAG_VAR);
      }
      unlockRef.current?.();
      unlockRef.current = null;
      const opener = returnFocusRefRef.current?.current ?? openerRef.current;
      openerRef.current = null;
      const active = document.activeElement;
      const focusLost = !active || active === document.body || (!!dialog && dialog.contains(active));
      if (opener?.isConnected && focusLost) opener.focus();
    };

    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (open) {
        if (phaseRef.current === 'closing') {
          // 閉じる動きの途中でもう一度開く: 止めて、上へ戻す
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = null;
          phaseRef.current = 'open';
          openedAtRef.current = performance.now();
          dialog.inert = false;
          dialog.style.removeProperty(DRAG_VAR);
          dialog.setAttribute('data-state', 'open');
          focusInitial();
          return;
        }
        if (phaseRef.current === 'closed' && !dialog.open) {
          const active = document.activeElement;
          openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
          unlockRef.current?.();
          unlockRef.current = lockScroll();
          dialog.style.removeProperty(DRAG_VAR);
          dialog.setAttribute('data-state', 'closed');
          dialog.showModal();
          // 閉じた位置 (画面の外) を一度描いてから開いた位置へ移す (transition で下から出る)
          void dialog.offsetHeight;
          dialog.setAttribute('data-state', 'open');
          phaseRef.current = 'open';
          openedAtRef.current = performance.now();
          focusInitial();
        }
        return;
      }
      if (phaseRef.current === 'open') {
        // 閉じる: 下へ抜ける動きの後に dialog を閉じる。その間は inert で操作を受けない
        endDrag();
        phaseRef.current = 'closing';
        dialog.setAttribute('data-state', 'closed');
        dialog.inert = true;
        const ms = transitionMs(dialog);
        if (ms < 1) finishClose();
        else timerRef.current = setTimeout(finishClose, ms);
      }
      // focusInitial / finishClose / endDrag は ref だけを読むので、開閉 (open) のときだけ走らせる
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // アンマウント: 開いたまま・閉じる途中で消えても、背景のスクロールとフォーカスを残さない
    React.useEffect(
      () => () => {
        clearSwallow();
        finishClose();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- アンマウントのときだけ
      [],
    );

    /**
     * Esc。ブラウザに閉じさせず、親に閉じる要求を出す。
     * cancel / close は React では DOM の親へ伝わる: この面が Modal など別の `<dialog>` の中に置かれていると、
     * 親の dialog の onCancel / onClose まで呼ばれて親も閉じる。自分の分はここで止め、自分宛てでないもの (中に置いた別の面の分) は扱わない
     */
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      if (e.target !== e.currentTarget) return;
      e.stopPropagation();
      e.preventDefault();
      if (phaseRef.current === 'open') onCloseRef.current();
    };

    /**
     * dialog がブラウザの都合で閉じた (Esc の連打で cancel を飛ばされた、form method="dialog" 等)。
     * close イベントは閉じた後に遅れて届くので、自分が閉じた分 (finishClose) の close が、開き直した後に届くことがある
     * (StrictMode の描き直し・閉じてすぐ開き直す)。届いた時点で dialog が開いていれば、古い知らせとして無視する
     */
    const handleNativeClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      if (e.target !== e.currentTarget) return;
      e.stopPropagation();
      if (dialogRef.current?.open) return;
      const wasOpen = phaseRef.current === 'open';
      if (phaseRef.current !== 'closed') finishClose();
      if (wasOpen) onCloseRef.current();
    };

    const isOutside = (e: { clientX: number; clientY: number }) => {
      const dialog = dialogRef.current;
      if (!dialog) return false;
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    // 開いた直後の守り: 押し始めを capture で見て、受け付けない間に始まった押下を覚える (離すまで)
    const clearSwallow = () => {
      swallowClickRef.current = false;
      if (swallowTimerRef.current) clearTimeout(swallowTimerRef.current);
      swallowTimerRef.current = null;
    };
    const handlePointerDownCapture = () => {
      clearSwallow();
      pressGuardedRef.current = inPointerGuard();
    };
    // 押下が終わったら印は必ず消す。pointerup で終わったときだけ、その押下から出る click を止める印に移す
    const handlePointerUpCapture = () => {
      const guarded = pressGuardedRef.current;
      pressGuardedRef.current = false;
      if (!guarded) return;
      clearSwallow();
      swallowClickRef.current = true;
      swallowTimerRef.current = setTimeout(clearSwallow, CLICK_AFTER_UP_MS);
    };
    const handlePointerCancelCapture = () => {
      pressGuardedRef.current = false;
    };
    // 止めるのはポインタの click (detail > 0) だけ: 受け付けない間に押し始めた押下から出た click と、受け付けない間の click。
    // キーボード (Enter・Space)・el.click()・読み上げの「実行」(detail が 0) は止めない
    const handleClickCapture = (e: React.MouseEvent<HTMLDialogElement>) => {
      const fromPointer = e.detail > 0;
      const guarded = fromPointer && (swallowClickRef.current || pressGuardedRef.current || inPointerGuard());
      if (fromPointer) clearSwallow();
      if (!guarded) return;
      e.preventDefault();
      e.stopPropagation();
      pressOnBackdropRef.current = false;
    };

    // 外を押して閉じる: 押し始めと離した場所の両方が背景のときだけ (中で押して外で離しても閉じない)
    const handlePointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
      pressOnBackdropRef.current = !pressGuardedRef.current && e.target === dialogRef.current && isOutside(e);
    };
    const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      const startedOnBackdrop = pressOnBackdropRef.current;
      pressOnBackdropRef.current = false;
      if (phaseRef.current !== 'open') return;
      if (startedOnBackdrop && e.target === dialogRef.current && isOutside(e)) onCloseRef.current();
    };

    // ── 帯を引いて閉じる ──
    const handleGrabDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const dialog = dialogRef.current;
      if (!dialog || phaseRef.current !== 'open' || dragRef.current) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // 開いた直後に押し始めたものは引かない (dialog の capture で、この押下は受け付けない印が付いている)
      if (pressGuardedRef.current) return;
      // 閉じるボタンの上では掴まない
      if ((e.target as Element).closest('button')) return;
      try {
        // 指が帯の外へ出ても追う。合成のイベント等で捕まえられないときは、捕まえずに追う
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* no active pointer */
      }
      dragRef.current = {
        pointerId: e.pointerId,
        startY: e.clientY,
        height: dialog.offsetHeight,
        samples: [{ t: e.timeStamp, y: e.clientY }],
      };
      dialog.setAttribute('data-dragging', '');
    };

    const track = (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return null;
      drag.samples.push({ t: e.timeStamp, y: e.clientY });
      const from = e.timeStamp - VELOCITY_WINDOW;
      while (drag.samples.length > 2 && drag.samples[1].t <= from) drag.samples.shift();
      return drag;
    };

    const handleGrabMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = track(e);
      if (drag) setDrag(Math.max(0, e.clientY - drag.startY));
    };

    const handleGrabUp = (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = track(e);
      if (!drag) return;
      const distance = Math.max(0, e.clientY - drag.startY);
      // 直近 100ms の動きで速さを測る (窓の中で最も古い点から、離した点まで)
      const from = e.timeStamp - VELOCITY_WINDOW;
      const first = drag.samples.find((s) => s.t >= from) ?? drag.samples[drag.samples.length - 1];
      const last = drag.samples[drag.samples.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 0 ? (last.y - first.y) / dt : 0;
      endDrag();
      const dismiss =
        distance > drag.height * DISMISS_DISTANCE_RATIO ||
        (distance > VELOCITY_MIN_DISTANCE && velocity > DISMISS_VELOCITY);
      if (!dismiss) {
        setDrag(0);
        return;
      }
      onCloseRef.current();
      // 親が閉じなかったとき (open のまま) は元へ戻す
      requestAnimationFrame(() => {
        if (phaseRef.current === 'open') setDrag(0);
      });
    };

    const handleGrabCancel = (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      // ブラウザが指を取り上げた: 距離によらず元へ戻す
      endDrag();
      setDrag(0);
    };

    return (
      <dialog
        data-ds-root
        ref={setDialogRef}
        id={id}
        tabIndex={-1}
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.dialog()}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onPointerDownCapture={handlePointerDownCapture}
        onPointerUpCapture={handlePointerUpCapture}
        onPointerCancelCapture={handlePointerCancelCapture}
        onClickCapture={handleClickCapture}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <div
          ref={grabRef}
          className={styles.grab()}
          onPointerDown={handleGrabDown}
          onPointerMove={handleGrabMove}
          onPointerUp={handleGrabUp}
          onPointerCancel={handleGrabCancel}
          onLostPointerCapture={handleGrabCancel}
        >
          <div className={styles.handleRow()}>
            <span aria-hidden className={styles.handle()} />
          </div>
          <div className={styles.titleRow()}>
            <h2 id={titleId} className={styles.title()}>
              {title}
            </h2>
            <Button
              variant="tertiary"
              size="md"
              iconOnly
              icon={<Icon name="close" />}
              aria-label="閉じる"
              onClick={() => {
                if (phaseRef.current === 'open') onCloseRef.current();
              }}
            />
          </div>
        </div>
        <div ref={bodyRef} tabIndex={bodyFocusStop ? 0 : undefined} className={styles.body()}>
          {children}
        </div>
      </dialog>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
