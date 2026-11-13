#!/usr/bin/env node
/**
 * テーマ契約の完全性チェック (AGENTS §3-8 / §5-5-1、#109 Color-3)。
 *
 * tokens/theme-contract.json は semantic color token を themeable の 3 層 (required / optional / fixed)
 * に振り分ける manifest。ここでは「契約が semantic 層の実態と一致しているか」だけを機械検証する:
 *   - semantic-colors.json の全 token が、どれか 1 層にちょうど 1 回出る (抜け / 重複なし)
 *   - manifest にあるのに semantic に無い token が無い (rename / 削除の取り残し)
 * 層の中身の妥当性 (何を必須にするか) は人間の判断 (§3-8)。テーマ値の検証 (コントラスト / 距離) は別。
 *
 * 失敗で exit 1。
 */
import fs from 'node:fs';

const SEMANTIC = 'tokens/source/semantic-colors.json';
const CONTRACT = 'tokens/theme-contract.json';

const color = JSON.parse(fs.readFileSync(SEMANTIC, 'utf8')).color;
const semantic = new Set();
for (const [group, tokens] of Object.entries(color)) for (const key of Object.keys(tokens)) semantic.add(`${group}.${key}`);

const contract = JSON.parse(fs.readFileSync(CONTRACT, 'utf8'));
const layers = contract.layers ?? {};
const seen = new Map(); // token → [layer...]
for (const [layer, def] of Object.entries(layers)) {
  for (const t of def.tokens ?? []) {
    if (!seen.has(t)) seen.set(t, []);
    seen.get(t).push(layer);
  }
}

const fails = [];
for (const t of semantic) {
  const where = seen.get(t);
  if (!where) fails.push(`${t} が theme-contract.json のどの層にも無い → required / optional / fixed のどれかに追記する`);
  else if (where.length > 1) fails.push(`${t} が複数の層に出ている (${where.join(', ')}) → 1 層にする`);
}
for (const [t, where] of seen) {
  if (!semantic.has(t)) fails.push(`${t} (${where.join(', ')}) は semantic-colors.json に無い → rename / 削除の取り残し`);
}
for (const layer of ['required', 'optional', 'fixed']) {
  if (!layers[layer]) fails.push(`層 "${layer}" が無い (3 層は固定)`);
}

if (fails.length) {
  console.error(`\n✗ check:theme-contract — ${fails.length} 件:\n`);
  fails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
const n = (l) => (layers[l]?.tokens ?? []).length;
console.log(
  `✓ check:theme-contract OK — semantic ${semantic.size} token がすべて 1 層にちょうど 1 回 (required ${n('required')} / optional ${n('optional')} / fixed ${n('fixed')}).`
);
