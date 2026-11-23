'use client';

import { useEffect, useState } from 'react';

/**
 * ポインタで開いた重なりの中で、キーが押されるまでフォーカスの輪を出さない (#157、AGENTS §3-2「フォーカスの規則」)。
 *
 * Menu などは開いた直後に項目へフォーカスを移す (読み上げと、外付けキーボードの続きの操作のため)。
 * 輪は「キーボードで操作する人の現在地」なので、指やマウスで開いたときには出さない。ただし、
 * 開いた後にキーを押したら (キーボードに持ち替えた) そこから出す。
 * プログラムから移したフォーカスが `:focus-visible` になるかはブラウザごとに違う (iOS の Safari は指で開いても
 * 出す) ので、ブラウザの判断に頼らず、部品が「どうやって開いたか」を持って属性で決める。
 *
 * 使い方: `hide` には「今開いていて、ポインタで開いた」ときに true を渡す。返る `hidden` が true の間、
 * 重なりの最も外側の要素に `data-ds-hide-focus-ring` を付け (preset の `focus-ring*` がその中では輪を出さない)、
 * `onKeyDownCapture` をその要素に付ける。`hide` が false になる (閉じる) と、キーを押した印も消える。
 */
export const HIDE_FOCUS_RING_ATTR = 'data-ds-hide-focus-ring';

export function useHideFocusRingUntilKey(hide: boolean) {
  const [keyed, setKeyed] = useState(false);
  useEffect(() => {
    if (!hide) setKeyed(false);
  }, [hide]);
  return {
    hidden: hide && !keyed,
    onKeyDownCapture: () => {
      if (hide && !keyed) setKeyed(true);
    },
  };
}

const clearers = new WeakMap<HTMLElement, () => void>();

/**
 * 閉じた重なりから入口へ戻したフォーカスに、輪を出さない (#157)。ポインタで閉じたとき (外を押す・帯を引く・
 * 閉じるボタンや項目を指・マウスで押す) に使う。入口に `data-ds-hide-focus-ring` を付け、**次にキーが押されるか、
 * 入口からフォーカスが外れたら**外す (その後に Tab で戻ってきたときは、ふつうに輪が出る)。
 * 入口は使う側の要素なので、付けるのはこの属性だけで、ほかの属性・ハンドラには触らない。返る関数で、すぐ外せる。
 * 属性は輪の出し方 (`focus-ring*`) にだけ効くので、入口が `focus-ring*` を持たない要素なら何も変わらない。
 */
export function hideFocusRingUntilKeyOrBlur(el: HTMLElement | null | undefined): () => void {
  if (!el || !el.isConnected) return () => {};
  clearers.get(el)?.();
  const doc = el.ownerDocument;
  const clear = () => {
    el.removeAttribute(HIDE_FOCUS_RING_ATTR);
    doc.removeEventListener('keydown', clear, true);
    el.removeEventListener('blur', clear);
    if (clearers.get(el) === clear) clearers.delete(el);
  };
  el.setAttribute(HIDE_FOCUS_RING_ATTR, '');
  doc.addEventListener('keydown', clear, true);
  el.addEventListener('blur', clear);
  clearers.set(el, clear);
  return clear;
}
