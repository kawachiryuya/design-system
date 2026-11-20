/**
 * 文字の直書き (primitive typography) の検出パターン (AGENTS.md §3-7、#109 Typo-2 / #145 / #155)。
 *
 * class 文字列の中の 1 語として、次のどれかにマッチする:
 *   - 名前の段:   `text-{xs〜5xl}` (行間つきの `text-sm/6` も) / `leading-{none〜relaxed}` / `tracking-{tight〜wide}`
 *   - 任意の値:   `text-[13px]` / `text-[length:var(--x)]` / `leading-[1.2]` / `tracking-[0.02em]`
 *                 `text-[…]` のうち色 (下の ARBITRARY_COLOR で始まるもの) は対象外。色は別の lint が見る
 *   - 上のどれにも、variant (`md:` / `hover:` / `cols:` / `[&_p]:` など `:` で終わる接頭辞) が
 *     いくつ付いていても、`!` (important) や `-` (負の値) が付いていても同じ
 *
 * `text-[…]` は「色と分かるもの以外は落とす」向きにしてある (知らない書き方を通さない)。
 * 色なのに落ちたときは `text-[color:…]` と型を書けば通る。
 *
 * lint (eslint.config.mjs、tsx の string literal) と check:mdx-typography (mdx の className) の
 * 両方がこれを読むので、規則を変えるときはここだけを直す。
 *
 * esquery の regex literal (`/.../`) にも埋め込むので、`/` を含めない (要るときは `\x2F`)。
 */

/** 語の前に付くもの: variant の接頭辞 (0 個以上)、important の `!`、負の値の `-` */
const PREFIX = String.raw`([^\s:]+:)*!?-?`;

/**
 * `text-[` の直後がこれなら色 (文字の大きさではない)。
 * `var(` は型が書かれていないと Tailwind 3 が色として CSS を生成するので、色に数える。
 */
const ARBITRARY_COLOR = String.raw`color:|#|rgb|hsl|hwb|lab\(|lch\(|oklab|oklch|color-mix|color\(|var\(|currentColor|transparent|inherit`;

const NAMED = [
  String.raw`text-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl)(\x2F\S+)?`,
  String.raw`leading-(none|tight|snug|normal|relaxed)`,
  String.raw`tracking-(tight|normal|wide)`,
].join('|');

const ARBITRARY = [String.raw`text-\[(?!${ARBITRARY_COLOR})`, String.raw`leading-\[`, String.raw`tracking-\[`].join('|');

export const TYPOGRAPHY_PATTERN = String.raw`(^|\s)${PREFIX}((${NAMED})!?(\s|$)|${ARBITRARY})`;
