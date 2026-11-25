/**
 * 背景 (html と body) のスクロール止め — 重なる部品の共有 (#157)。
 *
 * 開いている重なり (下から出る面など) の**数を数える**。最初の 1 つが止めるときに、html と body の
 * inline の `overflow-x` / `overflow-y` (`overflow` は両方をまとめた書き方) を値と `!important` ごと覚え、
 * 最後の 1 つが外すときにだけ、覚えた値に戻す。面の数・開いた順・閉じた順によらず、全部が外れたら元に戻る
 * (「前の値を覚えて戻す」を面ごとに持つと、開いた順と逆に閉じるときしか正しく戻らない)。
 *
 * 使い方: `const release = lockScroll();` … 閉じるときに `release()`。`release` は何度呼んでも 1 回だけ数える。
 * ブラウザでだけ呼ぶ (effect / handler の中)。描画中には呼ばない。
 *
 * 使っている部品: 下から出る面 (`BottomSheet`)・`ConfirmDialog`・`FormDialog` (土台 `DialogBase`)。背景を止める重なりを足すときは、ここに乗せる
 * (自前で overflow を書き換えると、閉じる順によって止まったまま残る)。
 */

const PROPS = ['overflow-x', 'overflow-y'] as const;

interface Saved {
  el: HTMLElement;
  values: { prop: (typeof PROPS)[number]; value: string; priority: string }[];
}

let count = 0;
let saved: Saved[] = [];

function save(el: HTMLElement): Saved {
  return {
    el,
    values: PROPS.map((prop) => ({
      prop,
      value: el.style.getPropertyValue(prop),
      priority: el.style.getPropertyPriority(prop),
    })),
  };
}

function restore({ el, values }: Saved) {
  for (const { prop, value, priority } of values) {
    if (value) el.style.setProperty(prop, value, priority);
    else el.style.removeProperty(prop);
  }
}

/** 背景のスクロールを止める。戻す関数を返す (最後の 1 つが戻したときにだけ、元の inline の指定に戻る) */
export function lockScroll(): () => void {
  if (count === 0) {
    const targets = [document.documentElement, document.body];
    saved = targets.map(save);
    for (const el of targets) el.style.setProperty('overflow', 'hidden');
  }
  count++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    count--;
    if (count === 0) {
      saved.forEach(restore);
      saved = [];
    }
  };
}
