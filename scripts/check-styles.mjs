#!/usr/bin/env node
/**
 * 配信バンドル (dist/styles.css) の健全性チェック (AGENTS.md §5-5-1)。
 *
 * A2 配信 (#57): コンポーネント CSS をプリコンパイル同梱し消費側の Tailwind 依存を外す。
 * その生成物が「過剰でも不足でもない」ことを機械検証する。tailwind.dist.config.cjs + styles/dist.css
 * を temp にコンパイルし、下記の不変条件を assert する (型では catch されない silent break の床)。
 *
 * MUST 含む:
 *  - semantic utility が焼き込まれている (例 .bg-surface-primary)
 *  - 出荷する非 utility コンポーネント CSS (.ds-checkbox / .ds-radio / @keyframes indeterminate)
 *  - a11y の reduced-motion base (preflight off でも addBase は出る)
 *  - utility は var(--color-...) 参照のまま (テーマ override 追従)
 * MUST 含まない:
 *  - preflight グローバルリセット (同梱すると消費側を壊す)
 *  - primitive hue 直参照 utility (.bg-teal-500 等。未 themeable な hex 焼付き)
 *
 * 失敗で exit 1。
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const out = path.join(os.tmpdir(), `ds-styles-check-${process.pid}.css`);

try {
  execSync(
    `npx tailwindcss -c tailwind.dist.config.cjs -i styles/dist.css -o ${out} --minify`,
    { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] }
  );
} catch (e) {
  console.error('\n✗ check:styles — 配信 CSS のビルドに失敗:\n');
  console.error(String(e.stderr || e.message));
  process.exit(1);
}

const css = fs.readFileSync(out, 'utf8');
fs.rmSync(out, { force: true });

const count = (re) => (css.match(re) || []).length;
const fails = [];

// ── MUST 含む ──
if (!css.includes('.bg-surface-primary'))
  fails.push('semantic utility (.bg-surface-primary) が無い — content スキャン / preset が壊れている可能性');
if (count(/\.ds-checkbox/g) < 1)
  fails.push('.ds-checkbox の出荷コンポーネント CSS が無い — styles/components.css の @import が効いていない');
if (!css.includes('.ds-radio'))
  fails.push('.ds-radio の出荷コンポーネント CSS が無い — styles/components.css の @import が効いていない');
if (!/@keyframes\s+indeterminate/.test(css))
  fails.push('@keyframes indeterminate が無い — ProgressBar の indeterminate アニメーションが壊れる');
if (!css.includes('prefers-reduced-motion'))
  fails.push('reduced-motion (a11y) base が無い — preset の addBase が出力されていない');
if (!css.includes('var(--color-'))
  fails.push('var(--color-...) 参照が無い — 色が焼き付いてテーマ override に追従しない');

// ── MUST 含まない ──
if (/\*,::before,::after\{box-sizing/.test(css))
  fails.push('preflight グローバルリセットが混入 — corePlugins.preflight:false を確認 (消費側を壊す)');
const hueRe =
  /\.(?:bg|text|border|ring|fill|stroke|from|via|to|divide|decoration|accent|caret|placeholder|outline)-(?:teal|neutral|green|red|orange|blue|yellow|lime|cyan|sky|violet|purple|pink)-[0-9]{2,3}\{/g;
const hues = [...new Set((css.match(hueRe) || []).map((s) => s.replace(/\{$/, '')))];
if (hues.length)
  fails.push(
    `primitive hue 直参照 utility が混入 (${hues.join(', ')}) — 出荷 component / コメントに hue 直参照が残っている (未 themeable)`
  );

if (fails.length) {
  console.error(`\n✗ check:styles — ${fails.length} 件の問題:\n`);
  fails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

const kb = (css.length / 1024).toFixed(1);
console.log(
  `✓ check:styles OK — dist 配信 CSS ${kb}KB / semantic utility + 出荷コンポーネント CSS + reduced-motion を含み、preflight リセット・primitive hue utility を含まない.`
);
