#!/usr/bin/env node
/**
 * 書いた Tailwind utility が実際に CSS を生成しているかの検査 (AGENTS.md §3-7 / §5-5-1、#109)。
 *
 * 背景: preset は token 名 → utility 名の写像を暗黙に持ち、`theme.X` の上書きで Tailwind 既定も
 * 落とす。そのため「存在しないクラス」を書いても型・lint・build のどこでも止まらず、見た目だけが
 * 黙って崩れる (silent break §10-2)。#107 (`border-border-default`)、#109 (`text-onSurface-subdued` /
 * `font-normal` / `ring-current` / Do/Don't の `bg-success-500` 等) はすべてこれ。
 *
 * 仕組み: Tailwind は content に現れたクラスだけを生成するので、「source に書かれているのに出力 CSS に
 * 無いクラス」= 認識されなかったクラス。2 系統を別々に突き合わせる:
 *   (1) 出荷コンポーネント (components/**\/*.tsx、stories / tokens カタログ / trials 除く)
 *       ↔ 配信 CSS (tailwind.dist.config.cjs) — string literal 内の utility 候補を全走査
 *   (2) Storybook 側 (stories / .storybook / mdx) ↔ Storybook CSS (tailwind.config.cjs)
 *       — className 属性の中だけを走査 (token カタログの 'font-size' 等のキー文字列や mdx 散文を除く)
 *
 * 対象 utility は色・タイポ・余白・枠・影・角丸・z・opacity・duration・easing の接頭辞 (下記 PREFIX)。
 * 動的なクラス (`${...}` を含む template) は検査不能なので skip。行に `utility-ignore` を含めると
 * その行は対象外 (理由を同じ行に書く)。
 *
 * 失敗で exit 1。
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const isFile = (p) => fs.statSync(path.join(ROOT, p)).isFile();
const glob = (pattern, ignore = []) =>
  fs.globSync(pattern, { cwd: ROOT }).filter((f) => isFile(f) && !ignore.some((re) => re.test(f))).sort();

// ── CSS を 2 系統コンパイル ──
const compile = (config, input) => {
  const out = path.join(os.tmpdir(), `ds-utilities-${process.pid}-${path.basename(config)}.css`);
  try {
    execSync(`npx tailwindcss -c ${config} -i ${input} -o ${out}`, { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (e) {
    console.error(`\n✗ check:utilities — ${config} のビルドに失敗:\n`);
    console.error(String(e.stderr || e.message));
    process.exit(1);
  }
  const css = fs.readFileSync(out, 'utf8');
  fs.rmSync(out, { force: true });
  return css;
};
const distCss = compile('tailwind.dist.config.cjs', 'styles/dist.css');
const sbCss = compile('tailwind.config.cjs', '.storybook/tailwind.css');

// ── utility 候補の判定 ──
const PREFIX =
  'bg|text|border|border-[xytblrse]|ring|ring-offset|divide|outline|placeholder|fill|stroke|accent|caret|decoration|' +
  'shadow|rounded|rounded-[tblrse]|rounded-[tb][lr]|z|opacity|gap|gap-[xy]|space-[xy]|font|leading|tracking|duration|ease';
const CANDIDATE = new RegExp(`^(?:[a-z0-9\\-\\[\\]&>*~+()=.":]+:)*-?(?:${PREFIX})-[A-Za-z0-9\\-\\[\\]\\/.%#(),_]+$`);
const isCandidate = (tok) => CANDIDATE.test(tok) && !tok.includes('${');
const cssHas = (css, cls) => css.includes('.' + cls.replace(/([^A-Za-z0-9_-])/g, '\\$1'));
const isCommentLine = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

/** string literal ('…' / "…" / `…`) の中身を列挙 */
const stringLiterals = (line) =>
  [...line.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)].map((m) => m[2]);
/** className="…" / className={'…'} / className={`…`} の中身を列挙 */
const classNameAttrs = (line) =>
  [...line.matchAll(/className=(?:"([^"]*)"|\{\s*(['"`])((?:(?!\2)[^\\\n]|\\.)*)\2\s*\})/g)].map((m) => m[1] ?? m[3]);

const scan = (files, css, extract) => {
  const missing = new Map(); // class → [file:line]
  let checked = 0;
  for (const f of files) {
    read(f).split('\n').forEach((line, i) => {
      if (isCommentLine(line) || line.includes('utility-ignore')) return;
      for (const s of extract(line)) {
        for (const tok of s.split(/\s+/)) {
          if (!isCandidate(tok)) continue;
          checked++;
          if (!cssHas(css, tok)) {
            if (!missing.has(tok)) missing.set(tok, []);
            missing.get(tok).push(`${f}:${i + 1}`);
          }
        }
      }
    });
  }
  return { missing, checked };
};

const shipped = glob('components/**/*.tsx', [/\.stories\.tsx$/, /^components\/tokens\//, /^components\/trials\//]);
const storybook = [
  ...glob('components/**/*.stories.tsx'),
  ...glob('components/**/*.mdx'),
  ...glob('.storybook/**/*.ts'),
  ...glob('.storybook/**/*.tsx'),
];

const a = scan(shipped, distCss, stringLiterals);
const b = scan(storybook, sbCss, classNameAttrs);

const report = (title, { missing }) => {
  if (!missing.size) return;
  console.error(`\n  [${title}]`);
  for (const [cls, locs] of [...missing].sort()) {
    console.error(`  - \`${cls}\` — ${locs.slice(0, 5).join(', ')}${locs.length > 5 ? ` …(+${locs.length - 5})` : ''}`);
  }
};

const total = a.missing.size + b.missing.size;
if (total) {
  console.error(`\n✗ check:utilities — CSS が生成されていないクラス ${total} 件 (書いても効いていない。preset の写像 / token 名 / Tailwind 既定の有無を確認):`);
  report('出荷コンポーネント ↔ dist CSS', a);
  report('stories / .storybook / mdx ↔ Storybook CSS', b);
  console.error('\n  意図的なもの (動的に組み立てる等) は同じ行に `utility-ignore: <理由>` を書く。');
  process.exit(1);
}

console.log(
  `✓ check:utilities OK — 出荷 ${shipped.length} ファイル / ${a.checked} utility が dist CSS に、Storybook ${storybook.length} ファイル / ${b.checked} utility が Storybook CSS にすべて生成されている.`
);
