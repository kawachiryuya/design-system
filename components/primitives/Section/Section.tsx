import React from 'react';
import { tv } from '../../_internal/tv';

/**
 * Section の縦 padding 段階 (`py-section-*` トークンを消費)。
 *
 * - `none` — padding なし。gap 所有モデル (親が Stack/space-y で間隔を持つ) への脱出口。
 * - `sm`   — 32px (`py-section-sm`)。控えめな section 間リズム。
 * - `md`   — 64px (`py-section-md`)。標準。
 * - `lg`   — 96px (`py-section-lg`)。ゆったり (marketing 等)。
 *
 * **Model α (padding 所有)**: 隣接 section の padding が積み上がってリズムが生まれる
 * (padding は collapse しないので予測可能)。
 */
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg';

/** Section が描画する HTML 要素。既定は landmark を持つ `<section>`。 */
export type SectionElement = 'section' | 'div' | 'article' | 'aside' | 'main';

/**
 * Section Props
 *
 * ページの**縦リズム (section 分割)** を担う layout primitive。`<section>` 意味タグ +
 * `py-section-*` padding を第一級概念にする。
 *
 * **横幅制約は持たない (full-width 既定)**。読み列の幅は内側の `<Center>` が所有する。
 * この分離により、将来 `background` を optional 追加するだけで「full-bleed 背景 +
 * 中央 max-width コンテンツ」が `bleed` prop 無しで成立する (背景は full-width のまま、
 * コンテンツは内側 Center で絞られているため)。
 *
 * 無名 landmark を避けるため、複数 `<section>` を並べるときは `aria-label` / `aria-labelledby`
 * を付ける (rest props 経由)。
 *
 * @example
 *   // 標準: full-width section + 内側 Center で読み列を絞る
 *   <Section padding="md" aria-label="主な機能">
 *     <Center max="xl">...</Center>
 *   </Section>
 *
 * @example
 *   // padding なし (親が gap を持つ場合の脱出口)
 *   <Stack gap="lg">
 *     <Section padding="none">...</Section>
 *     <Section padding="none">...</Section>
 *   </Stack>
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 縦 padding 段階 (`py-section-*`)。必須 — Section の存在意義 (リズム所有) そのものなので
   * default を持たない。間隔を親に委ねるときは `none`。
   */
  padding: SectionPadding;
  /**
   * 描画する HTML 要素。
   * - `section` ページ内セクション (default、landmark)
   * - `div` 汎用 (landmark にしたくない場合)
   * - `article` 独立した記事
   * - `aside` 補足領域
   * - `main` ページ主コンテンツ (1 ページ 1 つ)
   * @default 'section'
   */
  as?: SectionElement;
  /** 子要素 (横幅を絞る場合は内側に `<Center>` を置く)。 */
  children: React.ReactNode;
  /** 追加 CSS クラス (text-align 等、Section 本体の責務外を載せる)。 */
  className?: string;
}

/**
 * Section のスタイル定義 — `tailwind-variants` で padding 段階を宣言的に保持。
 *
 * - base: `w-full` (= full-width。横幅制約は持たない。将来の full-bleed 背景の土台)
 * - padding variant: `py-section-*` (layout token 由来 = 32/64/96)、`none` は空
 */
const sectionVariants = tv({
  base: 'w-full',
  variants: {
    padding: {
      none: '',
      sm: 'py-section-sm',  // 32px
      md: 'py-section-md',  // 64px
      lg: 'py-section-lg',  // 96px
    },
  },
});

/**
 * Section — Atomic Design: Atom (Layout primitive)
 *
 * ref は描画要素 (`as` で指定した host 要素) に透過する。
 *
 * @see SectionProps for usage examples.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(function Section(
  { padding, as = 'section', children, className, ...rest },
  ref,
) {
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} {...rest} className={sectionVariants({ padding, className })}>
      {children}
    </Tag>
  );
});

Section.displayName = 'Section';
