#!/usr/bin/env node
/**
 * 適合率レポート (conformance-report) — デザインシステムの「使われ度」を測る計測層 (AGENTS §9-5)。
 *
 * 既存検査 (check:contrast / check:conventions / lint / Chromatic) はすべて pass/fail のゲート。
 * 本スクリプトは「token/utility がどれだけ使われているか」を測る **レポート** で、**常に exit 0**
 * (思想は check:contrast の APCA / ΔEOK warn レンズと同じ)。十分高くなった次元は将来 check:* へ昇格する。
 *
 * v1 の対象次元: spacing / サイズ (色は ESLint で約 100% 強制済みなので測らない)。
 * 走査範囲は ESLint と一致 (components/**\/*.tsx、除外 **\/*.stories.tsx と components/tokens/**)。
 *
 * 各「寸法指定」(utility 1 出現 = 1 decision point) を 4 分類:
 *   - on-system : 数値サフィックスが spacing token に解決 (gap-3 / p-4 / w-80 / min-w-0)
 *   - immediate : bracket/static-px だが deltaPx=0 (スケール値を bracket で書いただけ。ピクセル不変の安全置換)
 *   - near-miss : bracket/static-px で 0<deltaPx≤ε (snap すると描画が変わる。修正 or 承認の判断対象)
 *   - off-system: static-px で deltaPx>ε (該当 token 無し = 穴候補)
 * 動的値 (calc/min/max/clamp/var/% / rem 等) と非数値 utility (w-full 等) は skip (分母に入れない)。
 * 行に /* conformance-ignore: 理由 *\/ があれば承認例外として母数から外す。
 *
 * 主指標は「未承認 finding の絶対件数」(比率は ~99.5% で張り付くため補助)。
 *   node scripts/conformance-report.mjs [--epsilon 2] [--json conformance/report.json]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const arg = (flag, def) => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : def; };
const EPSILON = Number(arg('--epsilon', '2'));
const JSON_OUT = arg('--json', 'conformance/report.json');

// ── spacing スケール (preset.cjs の tailwindSpacing と同じ変換: キー _→. 、"2px"→2) ──
const spacingSrc = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/source/spacing.json'), 'utf8')).spacing;
const SCALE = Object.entries(spacingSrc).map(([k, v]) => ({
  key: k.replace(/_/g, '.'),
  px: parseFloat(String(v.value)),
}));
const SCALE_KEYS = new Set(SCALE.map((s) => s.key));

// 最寄りスケール値 (px) を返す。タイは px の大きい方を優先 (1px → 0px でなく 2px=*-0.5 を提案)。
function nearest(px) {
  let best = null;
  for (const s of SCALE) {
    const d = Math.abs(s.px - px);
    if (!best || d < best.d || (d === best.d && s.px > best.px)) best = { ...s, d };
  }
  return best;
}

// ── 対象 utility (長い順 alternation = 最長一致) ──
const UTIL = 'gap-x|gap-y|gap|max-w|max-h|min-w|min-h|px|py|pt|pr|pb|pl|p|mx|my|mt|mr|mb|ml|m|space-x|space-y|size|w|h';
// boundary (行頭/空白/引用符/バッククォート/: = variant 区切り) + 任意の先頭 - + utility (アンカー)
// + 値 (-[..] / -px / -<number>[/<denom>])。値が続かないトークン (w-full / m-auto 等) は不採用。
const TOKEN_RE = new RegExp(
  `(?<=^|[\\s"'\`:])(-?)(${UTIL})(-\\[[^\\]]*\\]|-px(?![\\w-])|-[0-9][0-9.]*(?:\\/[0-9]+)?)`,
  'g'
);

// ── 値を分類して { cls, px?, nearest?, delta? } を返す。skip は null。 ──
function classify(util, rawVal) {
  // bracket: -[...]  /  -[ ... の中身
  if (rawVal.startsWith('[') || rawVal.startsWith('-[')) {
    const inner = rawVal.slice(rawVal.indexOf('[') + 1, rawVal.lastIndexOf(']')).trim();
    const m = inner.match(/^-?(\d+(?:\.\d+)?)px$/); // 静的 px のみ
    if (!m) return null; // calc/min/max/clamp/var/% / rem 等 = 動的 → skip
    return classifyPx(util, parseFloat(m[1]));
  }
  // -px (literal 1px)
  if (rawVal === '-px') return classifyPx(util, 1);
  // -<number>(/<denom>)
  const num = rawVal.slice(1);
  if (num.includes('/')) return null;            // 分数 (w-1/2 等) → skip
  if (SCALE_KEYS.has(num)) return { cls: 'on-system' };
  // スケール外の素の数値 (preset がスケールを置換しているため style の出ない dead class)。穴候補扱い。
  // px 換算でなくスケール index 距離で最寄りキーを提示。
  const v = Number(num);
  let nk = null;
  for (const s of SCALE) { const d = Math.abs(Number(s.key) - v); if (nk === null || d < nk.d) nk = { key: s.key, d }; }
  return { cls: 'off-system', nearest: nk ? `${util}-${nk.key}` : null, delta: null, note: `スケール外の値 ${num}` };
}

function classifyPx(util, px) {
  const n = nearest(Math.abs(px));
  const delta = n.d;
  const nearestUtil = `${util}-${n.key}`;
  if (delta === 0) return { cls: 'immediate', px, nearest: nearestUtil, delta };
  if (delta <= EPSILON) return { cls: 'near-miss', px, nearest: nearestUtil, delta };
  return { cls: 'off-system', px, nearest: nearestUtil, delta };
}

// ── 走査範囲 (ESLint 一致): components 配下の *.tsx、除外 *.stories.tsx / components/tokens/** ──
function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.isFile()) acc.push(full);
  }
  return acc;
}
const COMPONENTS = path.join(ROOT, 'components');
const files = walk(COMPONENTS)
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
  .filter((f) => !path.relative(COMPONENTS, f).split(path.sep).includes('tokens'))
  .sort();

// path → { name, layer }
function meta(file) {
  const rel = path.relative(COMPONENTS, file).split(path.sep); // [layer, Name, file] 想定
  const layer = ['primitives', 'composites'].includes(rel[0]) ? rel[0] : 'other';
  const name = rel.length >= 2 ? rel[1] : rel[0];
  return { name, layer };
}

// line 番号 (1-origin) を index から
function lineAt(offsets, idx) {
  let lo = 0, hi = offsets.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (offsets[mid] <= idx) lo = mid; else hi = mid - 1; }
  return lo + 1;
}

const components = new Map(); // key layer/name → { name, layer, findings:[] }
const exempt = [];
let onSystem = 0, immediate = 0, nearMiss = 0, offSystem = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const offsets = [0];
  for (let i = 0; i < lines.length; i++) offsets.push(offsets[i] + lines[i].length + 1);
  const { name, layer } = meta(file);
  const relFile = path.relative(ROOT, file);

  for (const m of src.matchAll(TOKEN_RE)) {
    const util = m[2];
    const res = classify(util, m[3]);
    if (!res) continue; // skip
    const raw = `${m[1]}${util}${m[3]}`;
    const line = lineAt(offsets, m.index);

    if (res.cls === 'on-system') { onSystem++; continue; }

    // 承認例外: 当該行 or 直前行に conformance-ignore
    const ctx = (lines[line - 1] || '') + '\n' + (lines[line - 2] || '');
    const ig = ctx.match(/conformance-ignore:\s*([^\n*]*)/);
    if (ig) { exempt.push({ file: relFile, line, raw, reason: ig[1].trim() }); continue; }

    if (res.cls === 'immediate') immediate++;
    else if (res.cls === 'near-miss') nearMiss++;
    else offSystem++;

    const key = `${layer}/${name}`;
    if (!components.has(key)) components.set(key, { name, layer, findings: [] });
    components.get(key).findings.push({
      file: relFile, line, raw, class: res.cls,
      nearest: res.nearest ?? null,
      deltaPx: res.delta ?? null,
      ...(res.note ? { note: res.note } : {}),
    });
  }
}

const denom = onSystem + immediate + nearMiss + offSystem;
const score = denom === 0 ? 1 : onSystem / denom;
const round = (n) => Math.round(n * 1000) / 1000;

// ── JSON 出力 ──
const compArr = [...components.values()]
  .map((c) => {
    const fc = c.findings.length;
    const on = 0; // component 単位 on-system は集計対象外 (finding 中心の v1)
    return { name: c.name, layer: c.layer, findingCount: fc, findings: c.findings };
  })
  .sort((a, b) => b.findingCount - a.findingCount || a.name.localeCompare(b.name));

const report = {
  generatedAt: new Date().toISOString(),
  scope: { include: 'components/**/*.tsx', exclude: ['**/*.stories.tsx', 'components/tokens/**'] },
  epsilon: EPSILON,
  overall: { score: round(score), onSystem, immediate, nearMiss, offSystem, exempt: exempt.length },
  dimensions: { spacing: { score: round(score), onSystem, immediate, nearMiss, offSystem } },
  components: compArr,
  exempt,
};
const outPath = path.resolve(ROOT, JSON_OUT);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');

// ── コンソール出力 (件数主役) ──
const unapproved = immediate + nearMiss + offSystem;
const fix = (f) => {
  if (f.class === 'immediate') return `→ ${f.nearest} (${f.deltaPx}px 差 = ピクセル不変の安全置換)`;
  if (f.class === 'near-miss') return `→ 最寄り ${f.nearest} (差 ${f.deltaPx}px) ※snap で描画変化、修正 or 承認`;
  return f.note ? `→ 該当 token 無し = 穴候補 (${f.note})` : `→ 該当 token 無し = 穴候補 (最寄り ${f.nearest}, 差 ${f.deltaPx}px)`;
};

console.log(`\n適合率レポート (conformance-report) — spacing 次元 / ε=${EPSILON}px`);
console.log('─'.repeat(72));
console.log(`未承認 finding: ${unapproved} 件  (immediate ${immediate} / near-miss ${nearMiss} / off-system ${offSystem})`);
console.log(`適合率 (参考): ${(score * 100).toFixed(1)}%  (on-system ${onSystem} / 寸法指定 ${denom})`);

if (compArr.length) {
  console.log('\nコンポーネント別 (finding 数の多い順):');
  for (const c of compArr) {
    console.log(`  ${c.name} (${c.layer}) — ${c.findingCount} 件`);
    for (const f of c.findings) {
      console.log(`    - ${f.file}:${f.line}  ${f.raw}  ${fix(f)}  [${f.class}]`);
    }
  }
}
console.log(`\n承認例外 (conformance-ignore): ${exempt.length} 件`);
console.log(`\nℹ レポート (ゲートではない / 常に exit 0)。読み方: immediate=即 token 置換可 (昇格筆頭) / near-miss=要判断 / off-system=穴候補。`);
console.log(`  詳細: ${path.relative(ROOT, outPath)} (AGENTS §9-5)`);

process.exit(0);
