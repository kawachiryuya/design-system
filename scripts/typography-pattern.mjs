/**
 * 文字の直書き (primitive typography) の検出パターン (AGENTS.md §3-7、#109 Typo-2 / #145)。
 *
 * `text-{xs〜5xl}` / `leading-*` / `tracking-*` を 1 語として含む class 文字列にマッチする。
 * lint (eslint.config.mjs、tsx の string literal) と check:mdx-typography (mdx の className) の
 * 両方がこれを読むので、規則を変えるときはここだけを直す。
 *
 * esquery の regex literal (`/.../`) にも埋め込むので、`/` を含めない。
 */
export const TYPOGRAPHY_PATTERN =
  '(^|\\s)(text-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl)|leading-(none|tight|snug|normal|relaxed)|tracking-(tight|normal|wide))(\\s|$)';
