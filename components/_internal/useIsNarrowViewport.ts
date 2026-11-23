'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { BREAKPOINTS } from '../../tokens';

/**
 * 画面の幅が狭い (breakpoint `sm` = 640px 未満) かを返す (#157)。
 *
 * 重なる部品のうち、背景を押すと閉じる軽いもの (選ぶ = Menu、補足 = Popover) が、
 * 狭い幅では下から出る面 (`BottomSheet`) に切り替えるための判定。境目は**画面の幅**
 * (置かれた場所の幅ではない。下から出る面は画面の下端に出るので、画面で決める)。
 *
 * - 境目の値は breakpoint の token (`tokens/source/breakpoints.json` の `sm`) から読む。数値を二重に持たない
 * - SSR セーフ: サーバーの描画と hydration の最初の描画では `window` を触らず、`false` (広い幅) を返す
 *   (`useSyncExternalStore` の `getServerSnapshot`)。hydration の後に測り直し、幅が変わるたびに追従する
 * - クライアントだけで描くとき (hydration でない描き始め・描き直し) は、`useSyncExternalStore` が**描画中に**
 *   `matchMedia` を読む (`getSnapshot`)。AGENTS §5-2 の「render で window を触らない」の字面には当たるが、
 *   `useEffect` で測る形にすると、狭い幅でも最初の 1 回は広い幅の形で描かれ、開いた状態で描くと形が一瞬で
 *   切り替わるため、こちらにしている (#157 の仮決め)
 *
 * 注: preset (Tailwind) の `screens.sm` を利用側で上書きしても、この判定は token の値のまま
 * (Tailwind の breakpoint と同じく、ビルド時に決まる値として扱う)。
 */
const QUERY = `(min-width: ${BREAKPOINTS.sm})`;

const getServerSnapshot = () => false;

export function useIsNarrowViewport(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
    const mql = window.matchMedia(QUERY);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return !window.matchMedia(QUERY).matches;
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
