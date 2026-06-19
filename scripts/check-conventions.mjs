#!/usr/bin/env node
/**
 * 規約適合の機械検査 (AGENTS.md §5 / §5-5-1)。audit-drift の機械化可能項目を CI に移管したもの。
 * エラーは lint 流儀で「§番号 + 現状 + 修正方向」を含める (エージェントの自己修正可能性を最優先)。
 *
 * 検査 (fail → exit 1):
 *  1. forwardRef (§5-2): primitive は forwardRef 必須 (allowlist 除く)
 *  2. JSDoc (§5-2): 各 Props interface のメンバに JSDoc コメント
 *  3. 4 ファイル構成 (§5-1): .tsx / .stories.tsx / .guideline.mdx / index.ts
 *  4. barrel 同期: components/index.ts の export と実 dir / 件数コメントの一致
 *  5. ストーリー構造 (§5-3): title 命名 / tags:['autodocs'] 誤付与 / 標準節の順序
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LAYERS = { primitives: 'Primitives', composites: 'Composites' };

// forwardRef 未対応の既知 primitive (§5-2 の debt)。polymorphic (as) / wrapper 構造で ref 化が非自明。
// 新規 primitive は forwardRef 必須 (このリストに足さない)。forwardRef 化の要否は /audit-drift の判断項目。
const FORWARDREF_ALLOWLIST = new Set(['Stack', 'Cluster', 'Center', 'Divider', 'Image', 'Skeleton']);

// 標準ストーリー節の正準順序 (§5-3)。これ以外の節 (InitialFocus 等) は無視し、存在する節の相対順序のみ検査。
// VR 集約モデル (§5-3): 正準は Playground → Overview → EdgeCases。
// Variants/Sizes/States/WithIcon/WithDescription は旧カタログで、Overview への移行途中の
// コンポーネントにのみ残る (移行完了で消える)。移行中の順序を保つため当面リストに残す。
const SECTION_ORDER = ['Docs', 'Playground', 'Overview', 'Variants', 'Sizes', 'States', 'WithIcon', 'WithDescription', 'EdgeCases'];

// JSDoc 必須から除外する普遍プロップ (自明・定型のため description 不要)。
const JSDOC_EXEMPT = new Set(['children', 'className']);

const fails = [];
const add = (msg) => fails.push(msg);

const listDirs = (layer) => {
  const base = path.join(ROOT, 'components', layer);
  return fs.readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
};

// ── 1. forwardRef / 2. JSDoc / 3. 4ファイル / 5. story (コンポーネント単位) ──
for (const [layer, Cap] of Object.entries(LAYERS)) {
  for (const name of listDirs(layer)) {
    const dir = path.join(ROOT, 'components', layer, name);
    const tsx = path.join(dir, `${name}.tsx`);
    const stories = path.join(dir, `${name}.stories.tsx`);
    const guideline = path.join(dir, `${name}.guideline.mdx`);
    const index = path.join(dir, 'index.ts');

    // 3. 4 ファイル構成
    for (const [f, label] of [[tsx, `${name}.tsx`], [stories, `${name}.stories.tsx`], [guideline, `${name}.guideline.mdx`], [index, 'index.ts']]) {
      if (!fs.existsSync(f)) add(`§5-1: components/${layer}/${name}/ に ${label} が無い → 4 ファイル構成を揃える`);
    }
    if (!fs.existsSync(tsx)) continue;
    const src = fs.readFileSync(tsx, 'utf8');

    // 1. forwardRef (primitive 必須、allowlist 除く)
    if (layer === 'primitives' && !FORWARDREF_ALLOWLIST.has(name) && !/forwardRef/.test(src)) {
      add(`§5-2: components/primitives/${name}/${name}.tsx が forwardRef 未使用 → forwardRef で ref 透過する (単一要素なので ref 先が自明)`);
    }

    // 2. JSDoc: 各 export interface *Props のメンバに JSDoc
    for (const m of src.matchAll(/export interface (\w*Props)\s*(?:extends [^{]+)?\{([\s\S]*?)\n\}/g)) {
      const [, ifaceName, body] = m;
      const lines = body.split('\n');
      let depth = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // メンバ宣言 (interface 直下 depth 0、`name?:` / `name:`)。ネスト内・型継続は除外。
        const memberMatch = depth === 0 && line.match(/^\s{2,}(?:readonly\s+)?['"]?([\w$]+)['"]?\??\s*:/);
        if (memberMatch && !JSDOC_EXEMPT.has(memberMatch[1])) {
          // 直前の非空行が JSDoc (`*/`) か継続 (`*`) か `//` ならドキュメント済み
          let j = i - 1;
          while (j >= 0 && lines[j].trim() === '') j--;
          const prev = j >= 0 ? lines[j].trim() : '';
          const inlineDoc = /\/\*\*.*\*\//.test(line);
          if (!inlineDoc && !prev.endsWith('*/') && !prev.startsWith('*') && !prev.startsWith('//')) {
            add(`§5-2: ${ifaceName} のメンバ \`${line.trim().slice(0, 40)}\` に JSDoc が無い → /** ... */ を付与 (autodocs の Props 表に出る)`);
          }
        }
        depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      }
    }

    // 5. ストーリー構造
    if (fs.existsSync(stories)) {
      const st = fs.readFileSync(stories, 'utf8');
      // Meta の title は必ず layer 接頭辞付き (story 内の data の title: と区別するため)。
      const title = st.match(/title:\s*['"]((?:Primitives|Composites)\/[^'"]+)['"]/)?.[1];
      const expected = `${Cap}/${name}`;
      if (title && title !== expected) add(`§5-3: ${layer}/${name} の story title が "${title}" → "${expected}" にする`);
      if (/tags:\s*\[[^\]]*['"]autodocs['"]/.test(st)) add(`§5-3: ${layer}/${name} の stories に tags:['autodocs'] がある → guideline.mdx が Docs を兼ねるため付けない`);
      // 標準節の順序 (present のみ、extras 無視)
      const exported = [...st.matchAll(/export const (\w+):\s*Story/g)].map((x) => x[1]);
      const known = exported.filter((e) => SECTION_ORDER.includes(e));
      const sorted = [...known].sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b));
      if (known.join(',') !== sorted.join(',')) add(`§5-3: ${layer}/${name} の標準節の順序が ${known.join('→')} → ${sorted.join('→')} に並べ替え`);
    }
  }
}

// ── 4. barrel 同期 (components/index.ts) ──
const barrel = fs.readFileSync(path.join(ROOT, 'components', 'index.ts'), 'utf8');
for (const [layer, Cap] of Object.entries(LAYERS)) {
  const dirs = listDirs(layer);
  // export 漏れ / 余分
  for (const name of dirs) {
    if (!barrel.includes(`./${layer}/${name}'`)) add(`§5-1: components/index.ts に ${layer}/${name} の export が無い → barrel に追加`);
  }
  for (const m of barrel.matchAll(new RegExp(`\\./${layer}/(\\w+)'`, 'g'))) {
    if (!dirs.includes(m[1])) add(`§5-1: components/index.ts が存在しない ${layer}/${m[1]} を export → 削除`);
  }
  // 件数コメント
  const cnt = barrel.match(new RegExp(`── ${Cap} \\((\\d+)\\)`))?.[1];
  if (cnt !== undefined && Number(cnt) !== dirs.length) {
    add(`§5-1: components/index.ts の ${Cap} 件数コメント (${cnt}) と実数 (${dirs.length}) が不一致 → コメントを ${dirs.length} に更新`);
  }
}

// ── レポート ──
if (fails.length) {
  console.error(`\n✗ check:conventions — ${fails.length} 件の規約違反:\n`);
  fails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
const total = Object.keys(LAYERS).reduce((n, l) => n + listDirs(l).length, 0);
console.log(`✓ check:conventions OK — ${total} コンポーネント / 5 検査すべて pass.`);
