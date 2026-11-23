'use client';

import React from 'react';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { lockScroll } from './scrollLock';
import { HIDE_FOCUS_RING_ATTR, hideFocusRingUntilKeyOrBlur } from './useHideFocusRingUntilKey';
import { lastInputWasPointer, trackInputModality } from './inputModality';

/**
 * `ConfirmDialog` (確認)・`FormDialog` (作業) に共通の土台 (#157)。**外に出さない** (`components/index.ts` から export しない)。
 *
 * 決まり (Issue #157 の「本実装が従う形」):
 * - `<dialog>` の `showModal()`。トップレイヤーに出て、フォーカスを中に閉じ込め、背景は `surface.overlay`
 * - **外 (背景) を押しても閉じない**。Esc は取り消しとして閉じる要求 (`onClose`) を出す。閉じるのは親 (`open` を false に)
 * - 開いている間は背景 (html と body) をスクロールさせない (`scrollLock`。`open` の prop に合わせて止め・外す)
 * - 開いた直後のフォーカスは `getInitialFocus` が返す要素 (無ければ dialog そのもの)
 * - 閉じたとき、フォーカスが中にあれば `returnFocusRef` へ戻す。省略時はブラウザが開く前の要素へ戻す
 * - 指・マウスで開いた (直前の操作が指・マウス) ときは、中でキーが押されるまで輪を出さない。閉じて戻したフォーカスも同じ
 *
 * 開閉は**状態を持たない**: 描くたびに「`open` と dialog の開閉」を見比べ、違えば合わせる。
 * ブラウザが勝手に閉じた (親が閉じる要求を断ったまま Esc が続いた・`<form method="dialog">`・外からの `dialog.close()`)
 * ときは、閉じる要求を出して描き直す。親が閉じれば閉じたまま、`open` が true のままなら次の描画で出し直す
 * (「開いているはずなのに消えたまま」にしない)。
 *
 * 中に置いた別の `<dialog>` (Menu・Popover の狭い幅の面) の `cancel`・`close` は、React では親のこの dialog まで届く。
 * 自分宛て (`e.target` が自分) でないものは扱わない。
 */
export interface DialogBaseProps
  extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel' | 'title'> {
  /** 開閉の状態。 */
  open: boolean;
  /** 取り消して閉じる要求 (Esc・×・取り消しボタン・ブラウザが閉じた)。親が `open` を false にする。 */
  onClose: () => void;
  /** 開いた直後のフォーカス先。null なら dialog そのもの。 */
  getInitialFocus: (dialog: HTMLDialogElement) => HTMLElement | null;
  /** 閉じたときにフォーカスを戻す要素。省略時は開く前にフォーカスがあった要素 (ブラウザが戻す)。 */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

/** layout effect はブラウザでだけ (サーバーでは何もしない effect にして、React の警告を出さない) */
const useLayoutEffectOnClient = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/** 閉じた後のフォーカス: `returnFocusRef` があればそこへ。直前の操作が指・マウスなら、戻した先に輪を出さない */
function settleFocusAfterClose(returnFocusRef: React.RefObject<HTMLElement | null> | undefined) {
  const target = returnFocusRef?.current;
  if (target?.isConnected) target.focus();
  const active = document.activeElement;
  if (lastInputWasPointer() && active instanceof HTMLElement && active !== document.body) {
    hideFocusRingUntilKeyOrBlur(active);
  }
}

export const DialogBase = React.forwardRef<HTMLDialogElement, DialogBaseProps>(
  ({ open, onClose, getInitialFocus, returnFocusRef, children, onKeyDownCapture, ...rest }, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);
    // 最新の props を effect / handler から読む
    const latest = React.useRef({ open, onClose, getInitialFocus, returnFocusRef });
    latest.current = { open, onClose, getInitialFocus, returnFocusRef };
    const [, rerender] = React.useReducer((n: number) => n + 1, 0);

    const setDialogRef = React.useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      trackInputModality();
    }, []);

    // 開閉を `open` に合わせる。描くたびに走らせ、違うときだけ動かす (状態を持たない)
    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (open && !dialog.open) {
        // 指・マウスで開いたときは、輪を出さない印を先に付ける (showModal がフォーカスを動かす前に)
        if (lastInputWasPointer()) dialog.setAttribute(HIDE_FOCUS_RING_ATTR, '');
        else dialog.removeAttribute(HIDE_FOCUS_RING_ATTR);
        dialog.showModal();
        (latest.current.getInitialFocus(dialog) ?? dialog).focus();
      } else if (!open && dialog.open) {
        const active = document.activeElement;
        const focusInside = !active || active === document.body || dialog.contains(active);
        dialog.close();
        dialog.removeAttribute(HIDE_FOCUS_RING_ATTR);
        if (focusInside) settleFocusAfterClose(latest.current.returnFocusRef);
      }
    });

    // 背景のスクロール止め。`open` の prop に合わせる (ブラウザが dialog を閉じても、親が閉じるまでは止めたまま。出し直すので)
    React.useEffect(() => {
      if (!open) return;
      return lockScroll();
    }, [open]);

    // 開いたまま外される (アンマウント): DOM から外れる前に閉じ、ブラウザに開く前の要素へフォーカスを戻させる
    // (外れた後では、フォーカスは body に落ちていて、ブラウザは戻さない)。layout effect の後始末は、要素が外れる前に走る
    useLayoutEffectOnClient(
      () => () => {
        const dialog = dialogRef.current;
        if (!dialog?.open) return;
        const active = document.activeElement;
        const focusInside = !active || active === document.body || dialog.contains(active);
        dialog.close();
        if (focusInside) settleFocusAfterClose(latest.current.returnFocusRef);
      },
      [],
    );

    // Esc: ブラウザに閉じさせず、閉じる要求を出す。止められない cancel (要求を断られたまま Esc が続いた) は、
    // 続いて届く close の側で要求を出す (ここでも出すと 1 回の Esc で 2 回になる)
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      if (e.target !== e.currentTarget) return;
      e.preventDefault();
      if (!e.nativeEvent.cancelable) return;
      latest.current.onClose();
    };

    // ブラウザが dialog を閉じた (close は閉じた後に遅れて届く)
    const handleNativeClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      if (e.target !== e.currentTarget) return;
      // 届いた時点で開いている: 閉じてすぐ開き直した後に届いた古い知らせ。`open` が false: 自分で閉じた分
      if (e.currentTarget.open || !latest.current.open) return;
      e.currentTarget.removeAttribute(HIDE_FOCUS_RING_ATTR);
      settleFocusAfterClose(latest.current.returnFocusRef);
      latest.current.onClose();
      // 親が閉じなかった (`open` が true のまま) ときは、この描き直しで出し直す
      rerender();
    };

    return (
      <dialog
        {...rest}
        data-ds-root
        ref={setDialogRef}
        aria-modal="true"
        tabIndex={-1}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onKeyDownCapture={(e) => {
          onKeyDownCapture?.(e);
          // キーが押されたら、そこから輪を出す (キーボードに持ち替えた)
          e.currentTarget.removeAttribute(HIDE_FOCUS_RING_ATTR);
        }}
      >
        {children}
      </dialog>
    );
  },
);

DialogBase.displayName = 'DialogBase';

/** 見出しの行: 見出し (h2) と閉じるボタン (×、48px。取り消しと同じ働き) */
export function DialogHeader({ titleId, title, onClose, className = '' }: {
  titleId: string;
  title: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={['flex items-start gap-2 pl-5 pr-2 pt-2', className].filter(Boolean).join(' ')}>
      <h2 id={titleId} className="flex-1 min-w-0 pt-3 type-section-title text-onSurface">
        {title}
      </h2>
      <Button
        variant="tertiary"
        size="md"
        iconOnly
        icon={<Icon name="close" />}
        aria-label="閉じる"
        onClick={onClose}
      />
    </div>
  );
}
