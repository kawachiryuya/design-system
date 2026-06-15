import React from 'react';

/**
 * TwoColumn の split 比率 (main / sidebar)。
 *
 * 12 カラム整数比率を **fr テンプレート**で表現する (生 col-span は持たない):
 * - `'6/6'` — `1fr 1fr` (50/50)。等分。SearchPage の form + preview。
 * - `'7/5'` — `7fr 5fr` (58/42)。やや main 寄り。
 * - `'8/4'` — `2fr 1fr` (66.7/33.3)。**既定・主用途**。main + sidebar の標準。
 * - `'9/3'` — `3fr 1fr` (75/25)。細い sidebar。
 *
 * mobile (< `cols`) では常に縦積み (full width × 2)、`cols` 以上で grid 化。
 */
export type TwoColumnSplit = '6/6' | '7/5' | '8/4' | '9/3';

/**
 * TwoColumn Props
 *
 * 2 領域 (main + sidebar) を mobile 縦積み → PC 横並び grid で表現する composite。
 *
 * **名前付き slot**: `children` が main、`sidebar` prop が副次領域。AppShell の
 * `children`(main) + `header`/`sidebar`(名前付き) と同じ流儀。位置依存 children を廃し、
 * 順序取り違え (main↔sidebar 逆) を原理的に防ぐ。`sidebar` 省略で単一カラム。
 *
 * gutter は `grid.gutter` トークン (16/16/24) 由来 (`.gap-grid`)。DOM 順は常に
 * main→sidebar で固定され、`mobileReverse` は **CSS order で視覚順のみ**反転する
 * (SR は常に main を主役として読む)。
 *
 * @example
 *   // 標準 (Seat: 座席選択 + 料金 sidebar)
 *   <TwoColumn split="8/4" sidebar={<aside>...料金...</aside>}>
 *     <section>...座席選択...</section>
 *   </TwoColumn>
 *
 * @example
 *   // 6/6 + mobileReverse (Search: form を下、preview を上に mobile 反転)
 *   <TwoColumn split="6/6" mobileReverse sidebar={<aside>...preview...</aside>}>
 *     <form>...form...</form>
 *   </TwoColumn>
 *
 * @example
 *   // sidebar 省略 = 単一カラム
 *   <TwoColumn split="8/4">
 *     <article>...本文のみ...</article>
 *   </TwoColumn>
 */
export interface TwoColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 列の分割比率。必須 — TwoColumn の存在意義そのものなので default を持たない。
   * (fr テンプレートに compile-down され、生 col-span は露出しない)
   */
  split: TwoColumnSplit;
  /**
   * 副次領域 (sidebar)。省略すると単一カラム (main のみ full width)。
   * DOM 順は常に main の後に置かれる (`mobileReverse` でも DOM 順は不変)。
   */
  sidebar?: React.ReactNode;
  /**
   * `true` で mobile 時に sidebar を上、main を下に**視覚順のみ**入れ替える (CSS order)。
   * `cols` 以上では常に main 左 / sidebar 右。DOM 順は main→sidebar 固定のまま。
   * SearchPage のように「form(main) を下、preview(sidebar) を上」と mobile UX を
   * 最適化したいときに使う。
   * @default false
   */
  mobileReverse?: boolean;
  /** main コンテンツ。 */
  children: React.ReactNode;
}

/** split ごとの grid-template-columns (fr テンプレート)。`cols` breakpoint で適用。 */
const splitTemplate: Record<TwoColumnSplit, string> = {
  '6/6': 'cols:grid-cols-[1fr_1fr]',
  '7/5': 'cols:grid-cols-[7fr_5fr]',
  '8/4': 'cols:grid-cols-[2fr_1fr]',
  '9/3': 'cols:grid-cols-[3fr_1fr]',
};

/**
 * TwoColumn — Atomic Design: Composite (Layout)
 *
 * 内部構造:
 * - 外側: mobile `flex flex-col gap-grid` → `cols:grid cols:grid-cols-[Xfr_Yfr]`
 *   (gutter は `.gap-grid` = grid.gutter トークン由来。fr テンプレートで col-span を隠蔽)
 * - main (children) と sidebar を直接 grid セルに配置 (ラッパ div で order 制御)
 * - `mobileReverse=true` 時、main に `order-2 cols:order-1`、sidebar に `order-1 cols:order-2`
 * - `sidebar` 省略時は grid を組まず main を full width で描画 (単一カラム)
 *
 * @see TwoColumnProps for usage examples.
 */
export const TwoColumn: React.FC<TwoColumnProps> = ({
  split,
  sidebar,
  mobileReverse = false,
  children,
  className,
  ...rest
}) => {
  // sidebar 省略 = 単一カラム (grid を組まない)
  if (sidebar === undefined || sidebar === null) {
    return (
      <div {...rest} className={className}>
        {children}
      </div>
    );
  }

  const containerClass = [
    'flex flex-col cols:grid gap-grid',
    splitTemplate[split],
    className,
  ].filter(Boolean).join(' ');
  const mainClass = mobileReverse ? 'order-2 cols:order-1' : undefined;
  const sidebarClass = mobileReverse ? 'order-1 cols:order-2' : undefined;
  return (
    <div {...rest} className={containerClass}>
      <div className={mainClass}>{children}</div>
      <div className={sidebarClass}>{sidebar}</div>
    </div>
  );
};

TwoColumn.displayName = 'TwoColumn';
