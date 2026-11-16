import type { Page } from 'playwright';

/**
 * フォーカスの輪の検査 (DDR-2 #131 / #139、AGENTS §3-2「フォーカスの規則」/ §8-4)。
 *
 * story の中でフォーカスが来る要素ごとに「輪が出ているか」を、描画後の computed style で確かめる。
 * 部品の書き方は lint (§3-7) で縛っているが、実際に描画された結果は見ていない。ここで次のものを捕まえる:
 *   - フォーカスが来るのに何も出ない要素 (tabIndex=0 の領域に focus-ring-* を付け忘れた等)
 *   - ブラウザ任せの輪 (`outline-style: auto`。focus-ring-* が無く、UA の既定が出ているだけ)
 *   - 決めた色以外の輪 (border.focus / onSurface.inverse 以外)
 *
 * 見る要素は 2 種類:
 *   1. 検査を始めた時点でフォーカスがある要素 (= 部品がプログラムから移したフォーカス。例: 中に押せるものが
 *      無い Popover のパネル。Tab の順には入らないので 2 では来ない)。キーボードで操作した状態で見るため、
 *      先に Shift を押す (クリックの後のプログラムからのフォーカスは :focus-visible にならないことがある)
 *   2. 文書の先頭から Tab で順に来る要素
 *
 * 合格の条件 (どれも computed style で判定):
 *   - outline-style が solid、outline-width が 2px 以上
 *   - 色が `--color-border-focus`、または `--color-on-surface-inverse` (濃い塗りの内側の白)。
 *     白は塗りに挟まれて初めて見えるので、白のときは outline-offset が負 (内側) であること
 *
 * 範囲 (含めないものは理由と一緒に AGENTS §8-4 に書く):
 *   - 矢印キーで中を動く部品は、Tab で来る 1 つ (選択中など) だけを見る。矢印キーでだけ来る項目の
 *     形が違う場合 (SegmentedControl の未選択) は、それが Tab で来る状態を story に用意して見る
 *   - overlay は押して開く操作をしない。story が開いた状態で描いているもの (Overview の open /
 *     defaultOpen、play の最後に開いたまま残したもの) だけを見る
 */

export interface FocusRingFinding {
  /** 要素の見分け用の短い説明 (tag#id[role] "text") */
  element: string;
  /** 何が規則に合わないか */
  reason: string;
  outline: string;
}

/** 1 story で Tab を押す上限。部品の story は多くても数十。超えたら打ち切る (無限ループ防止) */
const MAX_TABS = 100;

/** Tab で来た要素の印 (一周して戻ったら終わり) */
const SEEN = 'data-focus-check-seen';
/** 始めた時点でフォーカスがあった要素の印 (Tab で再び来ても二重に数えない) */
const INITIAL = 'data-focus-check-initial';

type Step = { done: true } | { done: false; finding: FocusRingFinding | null };

/** いまフォーカスがある要素を見る (ブラウザ側で実行)。mode=initial は印を付けて見るだけ、mode=tab は一周の判定もする */
function inspectActiveElement({ mode, seen, initial }: { mode: 'initial' | 'tab'; seen: string; initial: string }): Step {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body || el === document.documentElement) return { done: true };
  if (el.id === '__focus-check-start') return { done: true };
  if (mode === 'tab') {
    // 一周して戻ってきたら終わり
    if (el.hasAttribute(seen)) return { done: true };
    el.setAttribute(seen, '');
    // 始めた時点で見た要素は数えない (歩くのは続ける)
    if (el.hasAttribute(initial)) return { done: false, finding: null };
  } else {
    el.setAttribute(initial, '');
  }

  // 許した色を、いま効いている CSS 変数から解決する (テーマで上書きされても追従する)
  const probe = document.createElement('span');
  document.body.appendChild(probe);
  probe.style.color = 'var(--color-border-focus)';
  const focusColor = getComputedStyle(probe).color;
  probe.style.color = 'var(--color-on-surface-inverse)';
  const onFillColor = getComputedStyle(probe).color;
  probe.remove();

  // `transition-all` の部品は outline も遷移するので、途中の値 (初期値の 3px / currentColor) を
  // 読まないよう、走っている遷移を終わらせてから見る (preVisit の reduced-motion に頼らない)
  el.getAnimations().forEach((a) => a.finish());
  const cs = getComputedStyle(el);
  const style = cs.outlineStyle;
  const width = parseFloat(cs.outlineWidth) || 0;
  const color = cs.outlineColor;
  const offset = parseFloat(cs.outlineOffset) || 0;

  const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
  const role = el.getAttribute('role');
  const desc =
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : '') +
    (role ? `[role=${role}]` : '') +
    (text ? ` "${text}"` : '') +
    (mode === 'initial' ? ' (始めた時点のフォーカス)' : '');

  let reason: string | null = null;
  if (style === 'none' || width === 0) reason = '輪が出ていない';
  else if (style === 'auto') reason = 'ブラウザ任せの輪 (outline-style: auto)';
  else if (style !== 'solid') reason = `輪が実線でない (${style})`;
  else if (width < 2) reason = `輪が 2px 未満 (${cs.outlineWidth})`;
  else if (color === focusColor) reason = null;
  else if (color === onFillColor) reason = offset < 0 ? null : '白の輪が塗りの内側にない (outline-offset が負でない)';
  else reason = `決めた色以外の輪 (${color})`;

  return {
    done: false,
    finding: reason
      ? { element: desc, reason, outline: `${cs.outlineWidth} ${style} ${color} / offset ${cs.outlineOffset}` }
      : null,
  };
}

export async function findFocusRingViolations(page: Page): Promise<FocusRingFinding[]> {
  const marks = { seen: SEEN, initial: INITIAL };
  await page.evaluate(({ seen, initial }) => {
    document.querySelectorAll(`[${seen}],[${initial}]`).forEach((el) => {
      el.removeAttribute(seen);
      el.removeAttribute(initial);
    });
  }, marks);

  const findings: FocusRingFinding[] = [];
  try {
    // 1. 始めた時点でフォーカスがある要素。Shift はフォーカスを動かさず、キーボードで操作した状態にする
    await page.keyboard.press('Shift');
    const first = await page.evaluate(inspectActiveElement, { mode: 'initial' as const, ...marks });
    if (!first.done && first.finding) findings.push(first.finding);

    // 2. Tab の起点を文書の先頭に置く。body の先頭にフォーカスできるだけの (Tab 順に入らない) 印を置き、
    //    そこにフォーカスしてから Tab で順に進む
    await page.evaluate(() => {
      const start = document.createElement('div');
      start.tabIndex = -1;
      start.id = '__focus-check-start';
      document.body.prepend(start);
      start.focus();
    });
    for (let i = 0; i < MAX_TABS; i++) {
      await page.keyboard.press('Tab');
      const step = await page.evaluate(inspectActiveElement, { mode: 'tab' as const, ...marks });
      if (step.done) break;
      if (step.finding) findings.push(step.finding);
    }
  } finally {
    await page.evaluate(({ seen, initial }) => {
      document.getElementById('__focus-check-start')?.remove();
      document.querySelectorAll(`[${seen}],[${initial}]`).forEach((el) => {
        el.removeAttribute(seen);
        el.removeAttribute(initial);
      });
    }, marks);
  }
  return findings;
}
