#!/usr/bin/env node
/**
 * コントラスト検証 (AGENTS §8-5)。
 *
 * 1. tokens/contrast-pairs.json の semantic ペアを WCAG 2 比で判定 (fail → exit 1)。
 *    APCA Lc は参考目標未達を warn 出力 (exit code に影響しない = 設計レンズ)。
 * 2. 階調不変条件 (パレット構造の保証) を検証 (fail → exit 1):
 *    - アンカー: 全色相 (bright-hue 除く) で step 700=白文字≥4.5 / step 500=白≥3:1
 *    - step 差ルール: bg step ≤100 × text step ≥700 が全色相組合せで ≥4.5
 *    - L 正規化: chromatic の同一 step で OKLCH L 差が閾値内 (override 互換の保証)
 *    - bright-hue: yellow の塗り step (50〜600) + neutral-900 文字 ≥4.5
 *
 * WCAG 比 / OKLCH L は culori、APCA Lc は apca-w3 に委譲 (自前実装しない)。
 * テーマ切替 (将来ダークモード) のため vars/pairs/colors はオプション引数化。
 *   node scripts/check-contrast.mjs [--vars tokens/build/variables.css] [--pairs tokens/contrast-pairs.json] [--colors tokens/source/colors.json]
 */
import fs from 'node:fs';
import { parse, oklch, wcagContrast } from 'culori';
import { APCAcontrast, sRGBtoY } from 'apca-w3';

// ── 設定 ──
const BRIGHT_HUES = ['yellow']; // L 正規化・白文字アンカーの例外 (濃色文字前提、contrast-policy C-7=B)
const L_NORM_MAX = 0.03;        // chromatic 同一 step の OKLCH L 差の上限 (実測 max 0.023 + 余裕)
const WHITE = '#ffffff';
// APCA Lc 参考目標 (warn 基準、AGENTS §8-5)
const LC_TARGET = { body: 75, 'large-text': 60, 'non-text': 45, decorative: 0 };

const arg = (flag, def) => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : def; };
const VARS = arg('--vars', 'tokens/build/variables.css');
const PAIRS = arg('--pairs', 'tokens/contrast-pairs.json');
const COLORS = arg('--colors', 'tokens/source/colors.json');

// ── variables.css の var() チェーンを hex まで解決 ──
const css = fs.readFileSync(VARS, 'utf8');
const varMap = {};
for (const m of css.matchAll(/(--color-[a-z0-9-]+):\s*([^;]+);/g)) varMap[m[1]] = m[2].trim();
function resolve(name) {
  const key = name.startsWith('--') ? name : `--color-${name}`;
  const v = varMap[key];
  if (!v) return { error: 'unresolved' };
  const ref = v.match(/var\((--color-[a-z0-9-]+)\)/);
  if (ref) return resolve(ref[1]);
  if (v.includes('color-mix')) return { dynamic: v }; // overlay 等は検証対象外
  return { hex: v };
}

// ── 算出ヘルパ ──
const wcag = (fg, bg) => wcagContrast(fg, bg);
function lc(fgHex, bgHex) {
  const rgb = h => { const c = parse(h); return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)]; };
  return Math.abs(APCAcontrast(sRGBtoY(rgb(fgHex)), sRGBtoY(rgb(bgHex))));
}
const floorFor = (usage) => (usage === 'body' ? 4.5 : usage === 'decorative' ? 0 : 3.0);

const fails = [];
const warns = [];
const rows = [];

// ── 1. ペア検証 ──
const { pairs } = JSON.parse(fs.readFileSync(PAIRS, 'utf8'));
for (const p of pairs) {
  const fg = resolve(p.fg);
  const bg = resolve(p.bg);
  const label = `${p.fg} / ${p.bg}`;
  if (fg.error || bg.error) { fails.push(`${label}: 解決不能 (${fg.error || ''}${bg.error || ''})`); continue; }
  if (fg.dynamic || bg.dynamic) { rows.push([label, p.usage, 'skip', 'dynamic (color-mix)', '']); continue; }
  const ratio = wcag(fg.hex, bg.hex);
  const lcv = lc(fg.hex, bg.hex);
  const floor = floorFor(p.usage);
  const pass = ratio >= floor;
  let verdict;
  if (!pass) { verdict = 'FAIL'; fails.push(`${label} (${p.usage}): ${ratio.toFixed(2)} < ${floor}`); }
  else if (p.usage === 'decorative') verdict = '装飾(免除)';
  else if (ratio < 4.5) verdict = '条件付き';
  else verdict = '合格';
  if (pass && lcv < (LC_TARGET[p.usage] ?? 0)) { verdict += ' ⚠Lc'; warns.push(`${label} (${p.usage}): AA 適合だが Lc ${lcv.toFixed(0)} < 目標 ${LC_TARGET[p.usage]}`); }
  rows.push([label, p.usage, ratio.toFixed(2), `Lc ${lcv.toFixed(0)}`, verdict]);
}

// ── 2. 階調不変条件 ──
const palette = JSON.parse(fs.readFileSync(COLORS, 'utf8')).color;
const hues = Object.keys(palette).filter((h) => h !== 'base' && palette[h]['700']);
const chromatic = hues.filter((h) => h !== 'neutral' && !BRIGHT_HUES.includes(h));
const hex = (h, s) => palette[h][s].value;
const inv = [];

// アンカー (bright-hue 除く)
for (const h of hues.filter((x) => !BRIGHT_HUES.includes(x))) {
  if (wcag(WHITE, hex(h, '700')) < 4.5) inv.push(`アンカー: ${h}-700 が白文字 ${wcag(WHITE, hex(h, '700')).toFixed(2)} < 4.5`);
  if (wcag(WHITE, hex(h, '500')) < 3.0) inv.push(`アンカー: ${h}-500 が白 ${wcag(WHITE, hex(h, '500')).toFixed(2)} < 3.0 (非テキスト)`);
}
// step 差ルール: bg(50/100) × text(700/800/900) ≥ 4.5 (bright-hue 除く)
let sdMin = Infinity;
for (const tb of ['700', '800', '900']) for (const th of chromatic.concat('neutral')) for (const bb of ['50', '100']) for (const bh of chromatic.concat('neutral')) {
  const c = wcag(hex(th, tb), hex(bh, bb)); if (c < sdMin) sdMin = c;
  if (c < 4.5) inv.push(`step差: text ${th}-${tb} on bg ${bh}-${bb} = ${c.toFixed(2)} < 4.5`);
}
// L 正規化 (chromatic 同一 step)
for (const s of ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']) {
  const Ls = chromatic.map((h) => oklch(parse(hex(h, s))).l);
  const spread = Math.max(...Ls) - Math.min(...Ls);
  if (spread > L_NORM_MAX) inv.push(`L正規化: step ${s} の chromatic L 差 ${spread.toFixed(3)} > ${L_NORM_MAX}`);
}
// bright-hue: yellow 塗り step 50〜600 + neutral-900 文字 ≥ 4.5
const n900 = hex('neutral', '900');
for (const h of BRIGHT_HUES) for (const s of ['50', '100', '200', '300', '400', '500', '600']) {
  const c = wcag(n900, hex(h, s)); if (c < 4.5) inv.push(`bright-hue: ${h}-${s} + neutral-900 文字 = ${c.toFixed(2)} < 4.5`);
}
inv.forEach((m) => fails.push(`[不変条件] ${m}`));

// ── レポート ──
const pad = (s, n) => String(s).padEnd(n);
console.log('\nペア / usage / WCAG / APCA / 判定');
console.log('─'.repeat(72));
for (const [label, usage, ratio, lcStr, verdict] of rows) {
  console.log(`${pad(label, 40)} ${pad(usage, 10)} ${pad(ratio, 6)} ${pad(lcStr, 7)} ${verdict}`);
}
console.log('─'.repeat(72));
console.log(`不変条件: アンカー / step差(min ${sdMin === Infinity ? '-' : sdMin.toFixed(2)}) / L正規化 / bright-hue`);

if (warns.length) {
  console.log(`\n⚠ APCA Lc 注意 (${warns.length}件、AA 適合・知覚レンズ、exit には影響しない):`);
  warns.forEach((w) => console.log(`  - ${w}`));
}

if (fails.length) {
  console.error(`\n✗ check:contrast — ${fails.length} 件の fail:\n`);
  fails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(`\n✓ check:contrast OK — ${pairs.length} ペア / 不変条件すべて pass${warns.length ? ` (Lc 注意 ${warns.length}件)` : ''}.`);
