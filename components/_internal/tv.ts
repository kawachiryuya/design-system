/**
 * 共有 `tv()` — tailwind-merge を本リポの semantic utility 名で拡張したもの。
 *
 * ## なぜ必要か
 * 既定の tailwind-merge は **Tailwind 標準スケール (text-sm / ring-2 / bg-red-500 等)**
 * しか認識しないため、本リポの semantic utility を知らないと、競合する class を両方残したり、
 * 同じ前置詞の別物と誤判定して片方を drop したりする。
 *
 * ## 解決
 * `extendTailwindMerge` で custom utility を **正しい classGroup に明示登録** する。
 *
 * - `font-size` group → type-*-title / type-body / type-supporting / type-label / type-caption
 * - `focus-ring` group → focus-ring / focus-ring-inset / focus-ring-on-fill (フォーカスの輪の形、DDR-2 #131)。
 *   同じ群なので、利用側が className で別の形を渡すと部品の既定の形を置き換える (両方は残らない)
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
              'hero-title',
              'page-title',
              'section-title',
              'item-title',
              'body',
              'supporting',
              'label',
              'caption',
            ],
          },
        ],
        'focus-ring': ['focus-ring', { 'focus-ring': ['inset', 'on-fill'] }],
      },
    },
  },
});
