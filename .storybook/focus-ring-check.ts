import type { Page } from 'playwright';

/**
 * フォーカスの輪の検査 (DDR-2 #131 / #139、AGENTS §3-2「フォーカスの規則」/ §8-4)。
 *
 * story の中を Tab キーで順に進み、フォーカスが来た要素ごとに「輪が出ているか」を確かめる。
 * 部品の見た目は lint (§3-7) で書き方を縛っているが、実際に描画された結果は見ていない。
 * ここでは描画後の computed style を見るので、次のものが捕まる:
 *   - フォーカスが来るのに何も出ない要素 (tabIndex=0 の領域に focus-ring-* を付け忘れた等)
 *   - ブラウザ任せの輪 (`outline-style: auto`。focus-ring-* が無く、UA の既定が出ているだけ)
 *   - 決めた色以外の輪 (border.focus / onSurface.inverse 以外)
 *
 * 合格の条件 (どれも computed style で判定):
 *   - outline-style が solid、outline-width が 2px 以上
 *   - 色が `--color-border-focus`、または `--color-on-surface-inverse` (濃い塗りの内側の白)。
 *     白は塗りに挟まれて初めて見えるので、白のときは outline-offset が負 (内側) であること
 *
 * 範囲 (含めないものは理由と一緒に AGENTS §8-4 に書く):
 *   - Tab で順に来る要素だけを見る。矢印キーで中を動く部品 (Tabs / DropdownMenu / SegmentedControl /
 *     Radio) は、Tab で来る 1 つ (選択中など) だけを見る
 *   - 開いてからフォーカスが移る overlay は、story が開いた状態で描いているもの (Overview の open /
 *     defaultOpen) だけを見る。トリガーを押して開く操作はしない
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

const MARK = 'data-focus-check-seen';

export async function findFocusRingViolations(page: Page): Promise<FocusRingFinding[]> {
  // Tab の起点を文書の先頭に置く。play 関数が残したフォーカスを外し、body の先頭に
  // フォーカスできるだけの (Tab 順に入らない) 印を置いてそこにフォーカスする。
  await page.evaluate((mark) => {
    document.querySelectorAll(`[${mark}]`).forEach((el) => el.removeAttribute(mark));
    (document.activeElement as HTMLElement | null)?.blur?.();
    const start = document.createElement('div');
    start.tabIndex = -1;
    start.id = '__focus-check-start';
    document.body.prepend(start);
    start.focus();
  }, MARK);

  const findings: FocusRingFinding[] = [];
  try {
    for (let i = 0; i < MAX_TABS; i++) {
      await page.keyboard.press('Tab');
      const step = await page.evaluate((mark) => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body || el === document.documentElement) return { done: true as const };
        // 一周して戻ってきたら終わり
        if (el.hasAttribute(mark)) return { done: true as const };
        el.setAttribute(mark, '');

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
          (text ? ` "${text}"` : '');

        let reason: string | null = null;
        if (style === 'none' || width === 0) reason = '輪が出ていない';
        else if (style === 'auto') reason = 'ブラウザ任せの輪 (outline-style: auto)';
        else if (style !== 'solid') reason = `輪が実線でない (${style})`;
        else if (width < 2) reason = `輪が 2px 未満 (${cs.outlineWidth})`;
        else if (color === focusColor) reason = null;
        else if (color === onFillColor) reason = offset < 0 ? null : '白の輪が塗りの内側にない (outline-offset が負でない)';
        else reason = `決めた色以外の輪 (${color})`;

        return {
          done: false as const,
          finding: reason
            ? { element: desc, reason, outline: `${cs.outlineWidth} ${style} ${color} / offset ${cs.outlineOffset}` }
            : null,
        };
      }, MARK);
      if (step.done) break;
      if (step.finding) findings.push(step.finding);
    }
  } finally {
    await page.evaluate((mark) => {
      document.getElementById('__focus-check-start')?.remove();
      document.querySelectorAll(`[${mark}]`).forEach((el) => el.removeAttribute(mark));
    }, MARK);
  }
  return findings;
}
