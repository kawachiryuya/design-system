/**
 * 共有 `tv()` — tailwind-merge を本リポの semantic utility 名で拡張したもの。
 *
 * ## なぜ必要か
 * 既定の tailwind-merge は **Tailwind 標準スケール (text-sm / ring-2 / bg-red-500 等)**
 * しか認識しないため、本リポの semantic utility (`text-heading-display` / `ring-focus`
 * / `ring-border-focus` 等) を **同じ前置詞の競合** と誤判定して片方を drop する。
 *
 * 例: tv() の出力で
 *   `'focus-visible:ring-focus focus-visible:ring-border-focus'`
 * が
 *   `'focus-visible:ring-border-focus'` (ring-focus が drop)
 * になり、focus 時にリング太さが当たらず細い緑 border だけが見える症状。
 *
 * ## 解決
 * `extendTailwindMerge` で custom utility を **正しい classGroup に明示登録** する。
 *
 * - `font-size` group → text-heading-* / text-body-* / text-label / text-caption
 * - `ring-w` group → ring-focus
 * - `ring-color` group → ring-border-focus / ring-border-error
 *   (ring-current は Tailwind 既定で対応済み)
 * - `ring-offset-w` group → ring-offset-focus
 *
 * 新しい semantic utility を増やすときは、ここの classGroups にも追記すること。
 */

import { createTV } from 'tailwind-variants';

export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        'font-size': [
          {
            text: [
              'heading-display',
              'heading-xl',
              'heading-lg',
              'heading-md',
              'heading-sm',
              'body-lg',
              'body-md',
              'body-sm',
              'label',
              'caption',
            ],
          },
        ],
        'ring-w': [{ ring: ['focus'] }],
        'ring-color': [
          {
            ring: [
              'border-focus',
              'border-error',
              'border-success',
              'border-warning',
              'border-info',
            ],
          },
        ],
        'ring-offset-w': [{ 'ring-offset': ['focus'] }],
      },
    },
  },
});
