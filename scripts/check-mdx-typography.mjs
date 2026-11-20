#!/usr/bin/env node
/**
 * mdx の文字の直書きの検査 (AGENTS.md §3-7、#145 / #155)。
 *
 * 文字の大きさ・行間・字間は `type-*` で書く決まりを、tsx は lint (eslint.config.mjs) が守る。
 * eslint は mdx を読まないので、guideline などの mdx はここで見る。
 *
 * 仕組み: mdx の `className=` (`innerClassName=` のような `…ClassName=` も) の値を読み
 * (散文の「text-sm」などの言葉は対象外)、lint と同じパターン (scripts/typography-pattern.mjs) で探す。
 *   - `className="…"`: 引用符の中身。複数行にまたがっていてもよい
 *   - `className={…}`: 式の中の文字列をすべて読む (#155)。`cond ? 'text-sm' : 'type-body'` の両方、
 *     `cn('a', b && 'text-sm')` の引数、template の地の文と `${…}` の中の文字列。複数行でもよい
 * 見るのは className の値に直接書かれた文字列だけ。別の場所で定義した変数 (`className={styles}`) の
 * 中身までは追わない。
 *
 * 対象: components/**\/*.mdx と .storybook/**\/*.mdx。Tokens のカタログ (components/tokens/**) は
 * 大きさの段そのものを見せるのが目的なので対象外 (§3-6)。
 *
 * 例外: 直書きの語と同じ行か直前の行に `type-ignore: <理由>` を書く (mdx では `{/* type-ignore: … *\/}`)。
 * 複数行の className では、`className=` の行かその直前の行でもよい。
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

/**
 * JS の式を `open` の次の文字から読み、対応する閉じ括弧までに現れる文字列を集める。
 * 文字列・template・コメントの中の括弧は数えない。template は地の文を 1 つの文字列として集め
 * (`${…}` の位置は空白に置き換える)、`${…}` の中は式として読み直す。
 * @returns 閉じ括弧の次の位置 (閉じが無ければ src の終わり)
 */
const readExpr = (src, start, out) => {
  let depth = 1;
  let i = start;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      i = e === -1 ? src.length : e + 2;
    } else if (c === '/' && src[i + 1] === '/') {
      const e = src.indexOf('\n', i);
      i = e === -1 ? src.length : e;
    } else if (c === "'" || c === '"') {
      i = readQuoted(src, i, out);
    } else if (c === '`') {
      i = readTemplate(src, i, out);
    } else if (c === '{' || c === '(' || c === '[') {
      depth++;
      i++;
    } else if (c === '}' || c === ')' || c === ']') {
      depth--;
      i++;
      if (depth === 0) return i;
    } else i++;
  }
  return i;
};

/** `'…'` / `"…"` を読む。start は開きの引用符の位置。閉じの次の位置を返す */
const readQuoted = (src, start, out) => {
  const q = src[start];
  let i = start + 1;
  while (i < src.length && src[i] !== q) i += src[i] === '\\' ? 2 : 1;
  out.push({ text: src.slice(start + 1, i), index: start + 1 });
  return i + 1;
};

/** template を読む。start は開きの ` の位置。閉じの次の位置を返す */
const readTemplate = (src, start, out) => {
  let i = start + 1;
  let text = '';
  while (i < src.length && src[i] !== '`') {
    if (src[i] === '\\') {
      text += src.slice(i, i + 2);
      i += 2;
    } else if (src[i] === '$' && src[i + 1] === '{') {
      const end = readExpr(src, i + 2, out);
      // 位置がずれないよう、`${…}` と同じ長さの空白にする (改行は残す)
      text += src.slice(i, end).replace(/[^\n]/g, ' ');
      i = end;
    } else text += src[i++];
  }
  out.push({ text, index: start + 1 });
  return i + 1;
};

/** className の値に書かれた文字列を列挙する。attrIndex は `className=` の位置、index は文字列の中身の位置 */
const classNameStrings = (src) => {
  const found = [];
  for (const m of src.matchAll(/\b\w*[cC]lassName=/g)) {
    const at = m.index + m[0].length;
    const strings = [];
    if (src[at] === '"' || src[at] === "'") readQuoted(src, at, strings);
    else if (src[at] === '{') readExpr(src, at + 1, strings);
    for (const s of strings) found.push({ ...s, attrIndex: m.index });
  }
  return found;
};

/** 文字列の中の、文字の直書きの語の位置 (無ければ -1)。先頭の空白は飛ばして語の位置を返す */
const directTypographyAt = (text) => {
  const m = TYPO.exec(text);
  return m ? m.index + m[1].length : -1;
};

const lineOf = (src, index) => src.slice(0, index).split('\n').length - 1;

const violations = [];
const badMarks = [];
let checked = 0;

for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const lines = src.split('\n');
  const usedMarks = new Set();
  for (const { text, index, attrIndex } of classNameStrings(src)) {
    checked++;
    const at = directTypographyAt(text);
    if (at === -1) continue;
    // 印を書ける所: 直書きの語がある行とその直前、className= がある行とその直前
    // (複数行の className では、要素の手前に `{/* type-ignore: … */}` を書けるように)
    const hitLine = lineOf(src, index + at);
    const attrLine = lineOf(src, attrIndex);
    const markLine = [hitLine, hitLine - 1, attrLine, attrLine - 1].find((j) => j >= 0 && MARK.test(lines[j]));
    if (markLine === undefined) violations.push(`${f}:${hitLine + 1} — "${text.replace(/\s+/g, ' ').trim()}"`);
    else usedMarks.add(markLine);
  }
  lines.forEach((line, i) => {
    const m = line.match(MARK);
    if (!m) return;
    if (!reasonOf(m)) badMarks.push(`${f}:${i + 1} — 理由が無い`);
    else if (!usedMarks.has(i)) badMarks.push(`${f}:${i + 1} — 印が掛かる所に文字の直書きが無い (直したなら印を消す)`);
  });
}

if (violations.length || badMarks.length) {
  if (violations.length) {
    console.error(`\n✗ check:mdx-typography — mdx の className に文字の直書きが ${violations.length} か所 (text-{xs〜5xl} / leading-* / tracking-*、任意の値・variant 付きも):`);
    for (const v of violations) console.error(`  - ${v}`);
    console.error('\n  `type-*` (type-body / type-supporting / type-label / type-caption / type-*-title) に置き換える。');
    console.error('  置き換え表は AGENTS.md §3-7「story と guideline の文字の置き換え」。');
    console.error('  わざと残すときは、同じ行か直前の行 (複数行の className は `className=` の行かその直前でもよい) に `{/* type-ignore: <理由> */}` を書く。');
  }
  if (badMarks.length) {
    console.error(`\n✗ check:mdx-typography — type-ignore の印の誤り ${badMarks.length} か所:`);
    for (const b of badMarks) console.error(`  - ${b}`);
  }
  process.exit(1);
}

console.log(`✓ check:mdx-typography OK — mdx ${files.length} ファイル / className の文字列 ${checked} か所に文字の直書きなし.`);
