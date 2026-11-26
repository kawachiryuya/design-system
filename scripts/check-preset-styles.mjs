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
 *  - 出荷する部品の string literal に出てくる `ds-*` のクラス (data-ds-* / --ds-* の変数は除く) の規則が出ている
 *  - 部品が `animate-[name_…]` で参照する @keyframes name が出ている
 *  - 上の部品の規則は 1 回だけ出る (二重に持たない)
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
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

// 部品の規則と性質を争う variant 付き utility のうち、最初に出るもの (Tailwind は variant 付きを utilities の後ろに出す)
const firstUtility = css.search(/\n\.checked\\:bg-surface-primary:checked\s*\{/);
if (firstUtility < 0)
  fails.push('`checked:bg-surface-primary` の utility が無い — content の走査が壊れている可能性');

for (const cls of dsClasses) {
  const rules = [...css.matchAll(new RegExp(`(^|[\\s,}])\\.${esc(cls)}(?![\\w-])[^{]*\\{`, 'g'))];
  if (rules.length === 0) {
    fails.push(`.${cls} の規則がモード 2 に届いていない — 部品が使う非 utility の CSS は preset (tokens/preset.cjs) に書く (#178)`);
    continue;
  }
  const selectors = rules.map((r) => r[0].replace(/^[\s,}]+/, '').replace(/\s*\{$/, ''));
  const dup = selectors.filter((s, i) => selectors.indexOf(s) !== i);
  if (dup.length) fails.push(`.${cls} の規則が 2 回出ている (${[...new Set(dup)].join(', ')}) — 二重に持たない`);
  if (firstUtility >= 0 && rules.some((r) => r.index > firstUtility))
    fails.push(`.${cls} の規則が \`checked:bg-surface-primary\` の utility より後に出ている — \`checked:*\` / \`hover:*\` の utility に勝ってしまう (components 層に置く)`);
}
for (const k of keyframes) {
  const n = (css.match(new RegExp(`@keyframes\\s+${esc(k)}\\s*\\{`, 'g')) || []).length;
  if (n === 0)
    fails.push(`@keyframes ${k} がモード 2 に届いていない — 部品が animate-[${k}_…] で参照している (preset に書く、#178)`);
  if (n > 1) fails.push(`@keyframes ${k} が ${n} 回出ている — 二重に持たない`);
}

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
  `✓ check:preset-styles OK — モード 2 の最小ビルドに、部品の CSS (${[...dsClasses].map((c) => '.' + c).join(' / ')}${
    keyframes.size ? ' / ' + [...keyframes].map((k) => '@keyframes ' + k).join(' / ') : ''
  }) と focus-ring*・reduced-motion・type-* が出ている (部品の規則は 1 回ずつ、checked:* の utility より前).`
);
