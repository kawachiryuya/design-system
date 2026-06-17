/**
 * 非推奨シグナル — dev 限定の warn-once ヘルパー (AGENTS §10-5 / SUPPORT.md)。
 *
 * `stable → deprecated` にした API / prop / トークンの利用箇所で呼ぶと、開発時に一度だけ
 * `console.warn` を出す。本番ビルド (`process.env.NODE_ENV === 'production'`) では no-op。
 *
 * 信号は3点セット (§10-5): この dev warn + `@deprecated` JSDoc + CHANGELOG。
 * 非推奨ごとに codemod / 移行手順を添えること。
 *
 * @example
 *   // 非推奨 prop を受けたら
 *   if (legacyProp !== undefined) {
 *     deprecate('Foo: `legacyProp` は非推奨です。`newProp` を使ってください (削除: 次の MAJOR)。');
 *   }
 */
const warned = new Set<string>();

export function deprecate(message: string): void {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return;
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[design-system][deprecated] ${message}`);
}
