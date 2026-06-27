#!/usr/bin/env node
/**
 * check:preset-deps — mode② consumer の preset 解決を守るスモークテスト。
 *
 * 背景: consumer (mode②) は `tailwind.config.js` で `presets: [require('@kawachiryuya/design-system/tokens/preset.cjs')]`
 * のように DS の preset を継承し、preset.cjs を **consumer のビルド時に評価**する。その中で
 * `require('@tailwindcss/container-queries')` 等の外部パッケージを解決するため、これらが
 * **devDependency にあるだけだと consumer のツリーに入らず `Cannot find module` で落ちる**
 * (6.0.0 で実際に起きた回帰、6.0.1 で修正)。
 *
 * 本チェックは preset.cjs が require する外部パッケージが、すべて package.json の
 * `dependencies` (常時インストール) か `peerDependencies` (consumer 提供前提) に宣言されて
 * いることを静的に検証する。type/lint では拾えない packaging の silent break (§10-2) を機械ガードする。
 */
import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const presetPath = path.join(root, 'tokens', 'preset.cjs');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

const declared = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]);
const builtins = new Set(builtinModules);

const src = readFileSync(presetPath, 'utf8');
// 文字列リテラルの require のみ抽出。`require(path.join(__dirname, ...))` 等の動的 require は
// 実行時に相対パスを解決するだけなので対象外 (consumer の依存解決には関与しない)。
const specifiers = [...src.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);

// `@scope/pkg/sub` → `@scope/pkg` / `pkg/sub` → `pkg` に正規化 (subpath を落とす)。
const toPackageName = (spec) => {
  const clean = spec.replace(/^node:/, '');
  return clean.startsWith('@') ? clean.split('/').slice(0, 2).join('/') : clean.split('/')[0];
};

const violations = [];
const checked = new Set();
for (const spec of specifiers) {
  if (spec.startsWith('.') || spec.startsWith('/')) continue; // 相対 / 絶対パス
  const name = toPackageName(spec);
  if (builtins.has(name)) continue; // node 組み込み
  if (checked.has(name)) continue;
  checked.add(name);
  if (!declared.has(name)) violations.push({ spec, name });
}

if (violations.length > 0) {
  console.error('✗ check:preset-deps — tokens/preset.cjs が require する外部パッケージが dependencies / peerDependencies に未宣言:');
  for (const { spec, name } of violations) {
    console.error(`  - require('${spec}') → '${name}' が未宣言`);
  }
  console.error('\n  devDependency にあるだけだと mode② consumer (preset 継承 + 自前 Tailwind) のツリーに入らず');
  console.error('  build が "Cannot find module" で落ちる。常時必要なら dependencies、consumer 提供前提なら');
  console.error('  peerDependencies (mode① で不要なら peerDependenciesMeta で optional) に追加する。');
  process.exit(1);
}

console.log(`✓ check:preset-deps OK — preset.cjs の外部 require ${checked.size} 件すべて dependencies / peerDependencies に宣言済み.`);
