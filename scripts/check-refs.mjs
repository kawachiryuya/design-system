#!/usr/bin/env node
/**
 * ドキュメント間 §参照の整合チェック (AGENTS.md §5-5-1)。
 *
 * コマンド・PR テンプレ・スクリプト・eslint config が参照する `§N` / `§N-M` / `§N-M-K` が、
 * AGENTS.md の実在見出し (`## N.` / `### N-M.` / `#### N-M-K.`) を指しているか検証する。
 * § の改番でドキュメントがサイレントに古い規約を指す事故 (Principles リンク切れと同型) の予防。
 * 不在なら fail → exit 1 (エラーは file:line + 不在 § + 修正方向)。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

// 1. AGENTS.md の見出しから有効な §id を集める
const agents = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');
const valid = new Set();
for (const m of agents.matchAll(/^#{2,4}\s+(\d+(?:-\d+)*)\./gm)) valid.add(m[1]);

// 2. 参照元ファイル群
const sources = [
  ...fs.readdirSync(path.join(ROOT, '.claude/commands')).filter((f) => f.endsWith('.md')).map((f) => `.claude/commands/${f}`),
  '.github/pull_request_template.md',
  ...fs.readdirSync(path.join(ROOT, 'scripts')).filter((f) => f.endsWith('.mjs')).map((f) => `scripts/${f}`),
  'eslint.config.mjs',
];

// 3. 各ファイルの §参照を抽出し、有効見出しに実在するか検証
const fails = [];
for (const rel of sources) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/§(\d+(?:-\d+)*)/g)) {
      if (!valid.has(m[1])) {
        fails.push(`${rel}:${i + 1}: §${m[1]} が AGENTS.md の見出しに無い → §番号を確認 (改番された可能性)`);
      }
    }
  });
}

// 4. レポート
if (fails.length) {
  console.error(`\n✗ check:refs — ${fails.length} 件のダングリング §参照:\n`);
  fails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(`✓ check:refs OK — ${sources.length} ファイルの §参照がすべて AGENTS.md の見出しに実在 (有効 ${valid.size} 見出し).`);
