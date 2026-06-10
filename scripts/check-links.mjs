#!/usr/bin/env node
/**
 * 壊れリンクチェック (AGENTS.md §9-3)。
 *
 * `.mdx` 内の Storybook 内リンク (`?path=/docs/<id>` / `?path=/story/<id>`) が、
 * 実在する Storybook の Docs ページ / Story ID を指しているかを機械検証する。
 * 未定義 ID を指す参照が 1 つでもあれば exit 1。
 *
 * 既知 ID は以下から構築する:
 *  - `*.stories.tsx` の `title:` + 各 named export (= story) → `<title>--<story>`
 *  - `*.stories.tsx` に autodocs が付いていれば `<title>--docs`
 *  - `*.mdx` の `<Meta title="Z" />` → `<Z>--docs`
 *  - `*.mdx` の `<Meta of={X} name="Y" />` → import 解決した stories の title から `<title>--<Y>`
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../');
const COMPONENTS = join(ROOT, 'components');

// --- Storybook 互換の id 生成 (@storybook/csf の sanitize と同等) ---
const sanitize = (s) =>
  s
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

// export 名 → story 表示名 (storyNameFromExport ≒ startCase) → id
const exportToId = (name) =>
  sanitize(
    name
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/_/g, ' ')
  );

// --- ファイル走査 ---
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(COMPONENTS);
const storiesFiles = files.filter((f) => /\.stories\.tsx?$/.test(f));
const mdxFiles = files.filter((f) => f.endsWith('.mdx'));

const titleOf = (src) => {
  const m = src.match(/title:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
};

// --- 既知 ID 集合 ---
const validIds = new Set();
const titleByPath = new Map();

for (const sf of storiesFiles) {
  const src = readFileSync(sf, 'utf8');
  const title = titleOf(src);
  if (!title) continue;
  titleByPath.set(sf, title);
  const base = sanitize(title);
  if (/tags:\s*\[[^\]]*['"]autodocs['"]/.test(src)) validIds.add(`${base}--docs`);
  const re = /export\s+const\s+([A-Za-z0-9_]+)\s*[:=]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1] === 'default') continue;
    validIds.add(`${base}--${exportToId(m[1])}`);
  }
}

for (const mf of mdxFiles) {
  const src = readFileSync(mf, 'utf8');
  const titleMeta = src.match(/<Meta\s+title=['"]([^'"]+)['"]/);
  if (titleMeta) {
    validIds.add(`${sanitize(titleMeta[1])}--docs`);
    continue;
  }
  const ofMeta = src.match(/<Meta\s+of=\{([A-Za-z0-9_]+)\}\s+name=['"]([^'"]+)['"]/);
  if (!ofMeta) continue;
  const [, ident, name] = ofMeta;
  const imp = src.match(
    new RegExp(`import\\s+(?:\\*\\s+as\\s+)?${ident}\\s+from\\s+['"]([^'"]+)['"]`)
  );
  if (!imp) continue;
  const dir = dirname(mf);
  const candidates = [resolve(dir, imp[1] + '.tsx'), resolve(dir, imp[1] + '.ts'), resolve(dir, imp[1])];
  const found = candidates.find((c) => storiesFiles.includes(c));
  if (found) validIds.add(`${sanitize(titleByPath.get(found))}--${sanitize(name)}`);
}

// --- 参照を収集して検証 ---
const REF_RE = /\?path=\/(?:docs|story)\/([a-z0-9]+(?:-[a-z0-9]+)*--[a-z0-9]+(?:-[a-z0-9]+)*)/g;
const broken = [];
for (const mf of mdxFiles) {
  const lines = readFileSync(mf, 'utf8').split('\n');
  lines.forEach((line, i) => {
    REF_RE.lastIndex = 0;
    let m;
    while ((m = REF_RE.exec(line)) !== null) {
      if (!validIds.has(m[1])) {
        broken.push({ file: mf.replace(ROOT + '/', ''), line: i + 1, id: m[1] });
      }
    }
  });
}

if (broken.length > 0) {
  console.error(`✗ check:links — ${broken.length} broken Storybook link(s):\n`);
  for (const b of broken) console.error(`  ${b.file}:${b.line}  →  ${b.id}`);
  console.error(`\n既知ページ/ストーリー数: ${validIds.size}`);
  process.exit(1);
}
console.log(
  `✓ check:links OK — ${mdxFiles.length} mdx files scanned, ${validIds.size} known pages/stories, 0 broken links.`
);
