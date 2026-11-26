/**
 * 出荷する非 utility の部品の CSS の「期待する一覧」と、その検査 (#178)。
 *
 * 規則の正本は tokens/preset.cjs (部品の CSS の plugin)。ここはそれが「どの配信の形にも、
 * 要るセレクタ (擬似クラスまで) と、効いている宣言で出ているか」を確かめるための一覧で、
 * check:styles (モード 1、dist/styles.css) と check:preset-styles (モード 2 の最小ビルド) の 2 つが読む。
 * クラスがあるだけでは足りない: `.ds-checkbox:indeterminate` が消えても、`.ds-radio:checked` が
 * `.ds-radio:hover` に変わっても、宣言が別のプロパティに変わっても、見た目は壊れる。
 *
 * 部品に `ds-*` のクラスや `animate-[name_…]` を足したら、preset に規則を書き、ここにも足す
 * (check:preset-styles は source に出てくるのにここに無いクラス・keyframes も落とす)。
 */
import postcss from 'postcss';

/** 要る規則: セレクタ (完全一致) と、値を持っていなければならない宣言 */
export const COMPONENT_RULES = [
  { selector: '.ds-checkbox:checked', props: ['background-image'] },
  { selector: '.ds-checkbox:indeterminate', props: ['background-color', 'background-image'] },
  { selector: '.ds-radio:checked', props: ['box-shadow'] },
];

/** 要る @keyframes: 名前と、段の中で値を持っていなければならない宣言 */
export const COMPONENT_KEYFRAMES = [{ name: 'indeterminate', props: ['width'] }];

/** 一覧に出てくる ds-* のクラス名 */
export const COMPONENT_CLASSES = [
  ...new Set(COMPONENT_RULES.flatMap((r) => r.selector.match(/\.ds-[a-z][a-z0-9-]*/g).map((c) => c.slice(1)))),
];

/**
 * CSS (文字列) を読み、一覧の規則がそれぞれ 1 回だけ、要る宣言を持って出ているかを確かめる。
 * `orderBefore` を渡すと、一覧の規則がそのセレクタ (性質を争う utility) より前に出ているかも見る。
 * @returns {string[]} 問題の一覧 (空なら合格)
 */
export function checkComponentCss(css, { mode, orderBefore } = {}) {
  const root = postcss.parse(css);
  const fails = [];
  const where = `(${mode})`;

  // @media 等の中の規則は数えない (部品の規則はトップレベルに出す)
  const topRules = [];
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    if (rule.parent?.type !== 'root') return;
    topRules.push(rule);
  });
  const indexOf = (rule) => root.index(rule);

  let orderIdx = -1;
  if (orderBefore) {
    const r = topRules.find((x) => x.selectors.includes(orderBefore));
    if (!r) fails.push(`${where} 順序の比べ先 \`${orderBefore}\` が無い — content の走査が壊れている可能性`);
    else orderIdx = indexOf(r);
  }

  for (const { selector, props } of COMPONENT_RULES) {
    const hits = topRules.filter((r) => r.selectors.includes(selector));
    if (hits.length === 0) {
      fails.push(`${where} \`${selector}\` の規則が無い — tokens/preset.cjs の部品の CSS を確かめる (#178)`);
      continue;
    }
    if (hits.length > 1) fails.push(`${where} \`${selector}\` の規則が ${hits.length} 回出ている — 二重に持たない`);
    for (const prop of props) {
      const ok = hits.some((r) => r.nodes.some((d) => d.type === 'decl' && d.prop === prop && d.value.trim() !== ''));
      if (!ok) fails.push(`${where} \`${selector}\` に \`${prop}\` の宣言が無い — 見た目が出ない`);
    }
    if (orderIdx >= 0 && hits.some((r) => indexOf(r) > orderIdx))
      fails.push(`${where} \`${selector}\` が \`${orderBefore}\` より後に出ている — utility に勝ってしまう (components 層に置く)`);
  }

  for (const { name, props } of COMPONENT_KEYFRAMES) {
    const kfs = [];
    root.walkAtRules(/keyframes$/i, (at) => {
      if (at.params.trim() === name) kfs.push(at);
    });
    if (kfs.length === 0) {
      fails.push(`${where} \`@keyframes ${name}\` が無い — tokens/preset.cjs の部品の CSS を確かめる (#178)`);
      continue;
    }
    if (kfs.length > 1) fails.push(`${where} \`@keyframes ${name}\` が ${kfs.length} 回出ている — 二重に持たない`);
    for (const prop of props) {
      let steps = 0;
      kfs[0].walkDecls(prop, (d) => {
        if (d.value.trim() !== '') steps += 1;
      });
      if (steps < 2) fails.push(`${where} \`@keyframes ${name}\` の段に \`${prop}\` の宣言が 2 つ以上無い — 動かない`);
    }
  }
  return fails;
}
