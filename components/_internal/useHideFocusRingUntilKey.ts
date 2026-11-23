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
