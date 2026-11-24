'use client';

import React from 'react';

/**
 * 入口 (`trigger` に渡された要素) の ref を、部品の ref と合成する (#157)。Menu・Popover が使う。
 *
 * - 入口自身に付いていた `ref` にも要素を渡す (使う側が入口を指せるように。`ConfirmDialog` の `returnFocusRef` に渡すなど)
 * - React 19 は ref を `props.ref` に持ち、`element.ref` を読むと開発ビルドで警告が出る。React 18 は `element.ref` に持ち、
 *   `props.ref` を読むと警告が出る。版で読み分ける
 * - 合成した ref は、入口自身の ref が変わらない限り同じ関数を返す (描き直しのたびに null → 要素 と呼び直さない)
 */
const REF_IN_PROPS = parseInt(React.version, 10) >= 19;

function ownRefOf(element: React.ReactElement): React.Ref<HTMLElement> | undefined {
  if (REF_IN_PROPS) return (element.props as { ref?: React.Ref<HTMLElement> }).ref;
  return (element as unknown as { ref?: React.Ref<HTMLElement> }).ref ?? undefined;
}

export function useTriggerRef(
  trigger: React.ReactElement,
  innerRef: React.MutableRefObject<HTMLElement | null>,
): React.RefCallback<HTMLElement> {
  const own = ownRefOf(trigger);
  return React.useCallback(
    (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof own === 'function') own(node);
      else if (own) (own as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [own, innerRef],
  );
}
