#!/usr/bin/env node
/**
 * check:preset-styles — モード 2 (preset で使う利用側) に、部品の動きに要る CSS が届くかの検査 (#178)。
 *
 * check:styles の対。check:styles は配信バンドル (モード 1 の dist/styles.css) を見る。こちらは
 * モード 2 の最小のビルド — preset だけを継承し (preflight あり)、content に出荷する部品を含め、
 * `@tailwind base; @tailwind components; @tailwind utilities;` だけを入力にする — を temp にコンパイルし、
 * 下記を assert する。Storybook と dist は自分の入力 CSS を持つので、そこにだけある規則は
 * 型・lint・test-storybook のどれでも止まらない (#178 は選んだ Radio の点・Checkbox のチェックの絵が
 * モード 2 にだけ出なかった)。
 *
 * MUST:
 *  - 期待する一覧 (scripts/component-css-rules.mjs、check:styles と共有) の規則が、セレクタ (擬似クラスまで)
 *    と効いている宣言 (Radio は box-shadow、Checkbox は background-image など) で、1 回だけ出ている
 *  - 出荷する部品の string literal に出てくる `ds-*` のクラス (data-ds-* / --ds-* の変数は除く) と、
 *    `animate-[name_…]` で参照する @keyframes が、その一覧に載っている (足したのに書き忘れ・載せ忘れを落とす)
 *  - 部品の規則は、同じ性質を争う variant 付きの utility (`checked:bg-surface-primary` / `checked:hover:shadow-[…]` など) より
 *    前に出る (詳細度が同じとき utility が後で勝つ、今までの順序)
 *  - preset が持つ非 utility の CSS (focus-ring* と data-ds-hide-focus-ring・reduced-motion・type-*) が出ている
 *
 * content は出荷する部品の source (components/**\/*.tsx、stories と tokens カタログを除く)。
 * 利用側は dist の .js を content に入れるが、クラスの文字列は同じ。verify は build の前に走るので source を読む。
 *
 * 失敗で exit 1。
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { COMPONENT_CLASSES, COMPONENT_KEYFRAMES, COMPONENT_RULES, checkComponentCss } from './component-css-rules.mjs';

const ROOT = process.cwd();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-preset-styles-'));
const config = path.join(tmp, 'tailwind.config.cjs');
const input = path.join(tmp, 'in.css');
const out = path.join(tmp, 'out.css');

const shippedFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return p === path.join(ROOT, 'components', 'tokens') ? [] : shippedFiles(p);
    return e.name.endsWith('.tsx') && !e.name.endsWith('.stories.tsx') ? [p] : [];
  });
const files = shippedFiles(path.join(ROOT, 'components'));

// モード 2 の利用側の tailwind.config と同じ形: preset だけを継承する (preflight は既定のまま)
fs.writeFileSync(
  config,
  `module.exports = {
  presets: [require(${JSON.stringify(path.join(ROOT, 'tokens/preset.cjs'))})],
  content: [${JSON.stringify(path.join(ROOT, 'components/**/*.tsx'))}, '!**/*.stories.tsx', '!**/components/tokens/**'],
};\n`
);
fs.writeFileSync(input, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');

try {
  execSync(`npx tailwindcss -c ${config} -i ${input} -o ${out}`, {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'pipe'],
  });
} catch (e) {
  console.error('\n✗ check:preset-styles — モード 2 の最小ビルドに失敗:\n');
  console.error(String(e.stderr || e.message));
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}
const css = fs.readFileSync(out, 'utf8');
fs.rmSync(tmp, { recursive: true, force: true });

const fails = [];

// ── 部品が使う ds-* のクラスと keyframes を source から集める ──
const dsClasses = new Set();
const keyframes = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const lit of src.match(/(['"`])(?:(?!\1)[^\\\n]|\\.)*\1/g) || []) {
    for (const tok of lit.slice(1, -1).split(/\s+/)) {
      const m = tok.match(/^(?:[^\s:]+:)*(ds-[a-z][a-z0-9-]*)$/);
      if (m) dsClasses.add(m[1]);
      const k = tok.match(/(?:^|:)animate-\[([a-zA-Z][\w-]*)_/);
      if (k) keyframes.add(k[1]);
    }
  }
}
if (dsClasses.size === 0) fails.push('部品の source に ds-* のクラスが 1 つも見つからない — 走査が壊れている可能性');

// ── source に出てくる ds-* / keyframes が、期待する一覧 (component-css-rules.mjs) にあるか ──
for (const cls of dsClasses)
  if (!COMPONENT_CLASSES.includes(cls))
    fails.push(`部品が使う .${cls} が scripts/component-css-rules.mjs の一覧に無い — preset に規則を書き、一覧にも足す (#178)`);
for (const k of keyframes)
  if (!COMPONENT_KEYFRAMES.some((x) => x.name === k))
    fails.push(`部品が参照する @keyframes ${k} が scripts/component-css-rules.mjs の一覧に無い — preset に書き、一覧にも足す (#178)`);

// ── 一覧の規則が、セレクタ (擬似クラスまで) と効いている宣言で、1 回ずつ、utility より前に出ているか ──
fails.push(
  ...checkComponentCss(css, { mode: 'モード 2', orderBefore: '.checked\\:bg-surface-primary:checked' })
);

// ── preset が持つ非 utility の CSS ──
for (const [name, re] of [
  ['focus-ring (外側の輪)', /\.focus-ring:focus-visible:not\(:where\(\[data-ds-hide-focus-ring\]/],
  ['focus-ring の輪を消す規則 (data-ds-hide-focus-ring)', /\.focus-ring:focus-visible:where\(\[data-ds-hide-focus-ring\]/],
  ['focus-ring-inset', /\.focus-ring-inset:focus-visible/],
  ['focus-ring-on-fill', /\.focus-ring-on-fill:focus-visible/],
  ['reduced-motion (a11y)', /@media \(prefers-reduced-motion: reduce\)/],
  ['type-* (text style)', /\.type-body\s*\{/],
  ['dialog の ::backdrop (backdrop:bg-surface-overlay)', /backdrop\\:bg-surface-overlay::backdrop/],
]) {
  if (!re.test(css)) fails.push(`${name} がモード 2 に届いていない`);
}

if (fails.length) {
  console.error(`\n✗ check:preset-styles — ${fails.length} 件の問題:\n`);
  fails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(
  `✓ check:preset-styles OK — モード 2 の最小ビルドに、部品の CSS (${COMPONENT_RULES.map((r) => r.selector).join(' / ')} / ${COMPONENT_KEYFRAMES.map((k) => '@keyframes ' + k.name).join(' / ')}) が要る宣言を持って 1 回ずつ checked:* の utility より前に出ていて、focus-ring*・reduced-motion・type-*・::backdrop も出ている.`
);
