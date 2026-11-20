#!/usr/bin/env node
/**
 * mdx の文字の直書きの検査 (AGENTS.md §3-7、#145)。
 *
 * 文字の大きさ・行間・字間は `type-*` で書く決まりを、tsx は lint (eslint.config.mjs) が守る。
 * eslint は mdx を読まないので、guideline などの mdx はここで見る。
 *
 * 仕組み: mdx の `className="…"` / `className={'…'}` / `className={`…`}` の中身だけを読み
 * (散文の「text-sm」などの言葉は対象外)、lint と同じパターン (scripts/typography-pattern.mjs) で探す。
 * 1 行に収まった className だけを読む (今の mdx はすべてそう)。
 *
 * 対象: components/**\/*.mdx と .storybook/**\/*.mdx。Tokens のカタログ (components/tokens/**) は
 * 大きさの段そのものを見せるのが目的なので対象外 (§3-6)。
 *
 * 例外: 同じ行か直前の行に `type-ignore: <理由>` を書く (mdx では `{/* type-ignore: … *\/}`)。
 * 理由の無い印と、何も外していない印 (直したのに印だけ残ったもの) も落とす。
 *
 * 失敗で exit 1。
 */
import fs from 'node:fs';
import path from 'node:path';
import { TYPOGRAPHY_PATTERN } from './typography-pattern.mjs';

const ROOT = process.cwd();
const TYPO = new RegExp(TYPOGRAPHY_PATTERN);
const MARK = /type-ignore:([^\n]*)/;
// 印の後ろの理由 (mdx の閉じ "*/}" は除く)
const reasonOf = (m) => m[1].replace(/\*\/\s*\}?\s*$/, '').trim();

const mdxFiles = (dir) => {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { recursive: true })
    .map((f) => path.posix.join(dir, String(f).split(path.sep).join('/')))
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('components/tokens/'))
    .sort();
};
const files = [...mdxFiles('components'), ...mdxFiles('.storybook')];

/** className の中身を列挙 (check-utilities.mjs と同じ形) */
const classNameAttrs = (line) =>
  [...line.matchAll(/className=(?:"([^"]*)"|\{\s*(['"`])((?:(?!\2)[^\\\n]|\\.)*)\2\s*\})/g)].map((m) => m[1] ?? m[3]);

/** template の `${a ? 'text-sm' : ''}` も見えるよう、引用符・括弧を区切りとして扱う */
const hasDirectTypography = (cls) => TYPO.test(cls.replace(/[`'"{}()]/g, ' '));

const violations = [];
const badMarks = [];
let checked = 0;

for (const f of files) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
  const usedMarks = new Set();
  lines.forEach((line, i) => {
    for (const cls of classNameAttrs(line)) {
      checked++;
      if (!hasDirectTypography(cls)) continue;
      const markLine = [i, i - 1].find((j) => j >= 0 && MARK.test(lines[j]));
      if (markLine === undefined) violations.push(`${f}:${i + 1} — className="${cls}"`);
      else usedMarks.add(markLine);
    }
  });
  lines.forEach((line, i) => {
    const m = line.match(MARK);
    if (!m) return;
    if (!reasonOf(m)) badMarks.push(`${f}:${i + 1} — 理由が無い`);
    else if (!usedMarks.has(i)) badMarks.push(`${f}:${i + 1} — 同じ行にも次の行にも文字の直書きが無い (直したなら印を消す)`);
  });
}

if (violations.length || badMarks.length) {
  if (violations.length) {
    console.error(`\n✗ check:mdx-typography — mdx の className に文字の直書きが ${violations.length} か所 (text-{xs〜5xl} / leading-* / tracking-*):`);
    for (const v of violations) console.error(`  - ${v}`);
    console.error('\n  `type-*` (type-body / type-supporting / type-label / type-caption / type-*-title) に置き換える。');
    console.error('  置き換え表は AGENTS.md §3-7「story と guideline の文字の置き換え」。');
    console.error('  わざと残すときは、同じ行か直前の行に `{/* type-ignore: <理由> */}` を書く。');
  }
  if (badMarks.length) {
    console.error(`\n✗ check:mdx-typography — type-ignore の印の誤り ${badMarks.length} か所:`);
    for (const b of badMarks) console.error(`  - ${b}`);
  }
  process.exit(1);
}

console.log(`✓ check:mdx-typography OK — mdx ${files.length} ファイル / className ${checked} か所に文字の直書きなし.`);
