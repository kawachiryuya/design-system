'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * 領域そのものに Tab で止まる必要があるかを、描画後に測る (#136、AGENTS §8-2)。
 *
 * 領域に `tabIndex=0` を付ける理由は 2 つだけで、理由が無いときは付けない
 * (意味のない所にフォーカスが来ると、キーボードの人は何もできないまま Tab を 1 回余計に押す):
 *
 * - `no-tabbable-inside` — 中に Tab で来られる要素が**無い**ときだけ止まる。
 *   タブのパネル用 (WAI-ARIA Authoring Practices: 中に押せるものがあれば、Tab は中へ直接進む)
 * - `scrollable-without-tabbable` — **実際に縦にスクロールでき**、かつ中に Tab で来られる要素が
 *   **無い**ときだけ止まる。独立してスクロールする領域用 (キーボードでスクロールするため。
 *   axe の scrollable-region-focusable と同じ条件。中に押せるものがあれば、そこへのフォーカスでスクロールできる)
 *
 * 中身と大きさは変わるので、prop で渡させず、要素を見て決める (中身の変化・リサイズに追従する)。
 * 最初の描画 (SSR を含む) は「止まる」にしておき、測ってから外す (測れない環境でも、
 * キーボードで届かない領域を作らない側に倒す)。
 */
export type FocusStopWhen = 'no-tabbable-inside' | 'scrollable-without-tabbable';

const CANDIDATES =
  'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable=""],[contenteditable="true"],audio[controls],video[controls]';

/** root の中に、Tab で来られる要素があるか (無効・非表示・tabindex が負のものは数えない) */
function hasTabbableInside(root: HTMLElement): boolean {
  for (const el of root.querySelectorAll<HTMLElement>(CANDIDATES)) {
    if (el.tabIndex < 0) continue;
    if ((el as HTMLButtonElement).disabled) continue;
    if (el instanceof HTMLInputElement && el.type === 'hidden') continue;
    // 表示されていない (display:none / hidden の中 / inert の中) ものは来られない
    if (el.getClientRects().length === 0) continue;
    const inert = el.closest('[inert]');
    if (inert && root.contains(inert)) continue;
    return true;
  }
  return false;
}

/** 実際に縦にスクロールできるか (スクロールの枠で、中身があふれている) */
function isScrollableY(el: HTMLElement): boolean {
  const overflowY = getComputedStyle(el).overflowY;
  if (overflowY !== 'auto' && overflowY !== 'scroll') return false;
  return el.scrollHeight - el.clientHeight > 1;
}

export function useFocusStop(ref: RefObject<HTMLElement | null>, when: FocusStopWhen): boolean {
  const [needed, setNeeded] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      // 領域ごと表示されていない間は測れないので、前の値のままにする (表示されたら測り直す)
      if (el.getClientRects().length === 0) return;
      const tabbable = hasTabbableInside(el);
      setNeeded(when === 'no-tabbable-inside' ? !tabbable : isScrollableY(el) && !tabbable);
    };

    // 大きさの変化: 領域そのもの (幅で縦積みに変わる等) と、直下の中身 (あふれ方が変わる)
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    const observeSizes = () => {
      if (!resize) return;
      resize.disconnect();
      resize.observe(el);
      for (const child of el.children) resize.observe(child);
    };
    // 中身の変化: 要素の出入りと、Tab で来られるかを変える属性
    const mutation =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            observeSizes();
            measure();
          });
    mutation?.observe(el, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'href', 'hidden', 'inert', 'contenteditable', 'class', 'style'],
    });
    observeSizes();
    measure();

    return () => {
      resize?.disconnect();
      mutation?.disconnect();
    };
  }, [ref, when]);

  return needed;
}
