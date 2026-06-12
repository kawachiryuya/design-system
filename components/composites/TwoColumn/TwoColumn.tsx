import React from 'react';

/**
 * TwoColumn の split 比率。
 *
 * 値ごとの grid base と用途:
 * - `'6/6'` — grid-cols-12、左右 6/6 等分。SearchPage の form + preview。
 * - `'7/3'` — grid-cols-10、左 7 (main) + 右 3 (sidebar)。ResultsPage の検索結果 + 条件 sidebar。
 * - `'8/4'` — grid-cols-12、左 8 (main) + 右 4 (sidebar)。SeatPage / SeatMapPage の座席 + 料金 sidebar。
 *
 * mobile (< lg) では常に縦積み (full width × 2)、`lg` 以上で grid 化。
 */
export type TwoColumnSplit = '6/6' | '7/3' | '8/4';

/**
 * TwoColumn の column 間 gap 段階。
 *
 * - `sm` (16px) — gap-4 のみ、全 breakpoint 一定。compact UI 向け。
 * - `md` (16/24/32px) — gap-4 md:gap-6 xl:gap-8。**default**、consumer 4 ページ全てこの値。
 * - `lg` (24/32/48px) — gap-6 lg:gap-8 xl:gap-12。ゆったり配置。
 */
export type TwoColumnGap = 'sm' | 'md' | 'lg';

/**
 * TwoColumn Props
 *
 * 2 列レイアウト (main + sidebar) を mobile 縦積み → PC 横並び grid で表現する composite。
 *
 * **positional children**: 1 番目の子要素が main、2 番目が sidebar として render される。
 * 3 つ以上 children を渡しても無視される (TwoColumn は 2 col 固定)。
 *
 * `mobileReverse` で mobile 時の表示順を入れ替え可能 (SearchPage の form 下 + preview 上 pattern)。
 *
 * @example
 *   // 標準 (Results: 検索結果 + 条件 sidebar)
 *   <TwoColumn split="7/3">
 *     <main>...検索結果...</main>
 *     <aside>...条件 sidebar...</aside>
 *   </TwoColumn>
 *
 * @example
 *   // 8/4 (Seat: 座席選択 + 料金 sidebar)
 *   <TwoColumn split="8/4" className="lg:py-4">
 *     <section>...座席選択...</section>
 *     <aside className="lg:sticky lg:top-4">...料金 sidebar...</aside>
 *   </TwoColumn>
 *
 * @example
 *   // 6/6 + mobileReverse (Search: form 上 + preview 下、mobile では逆)
 *   <TwoColumn split="6/6" mobileReverse>
 *     <form>...form...</form>
 *     <aside>...preview...</aside>
 *   </TwoColumn>
 */
export interface TwoColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 列の分割比率。必須 — TwoColumn の存在意義そのものなので default を持たない。 */
  split: TwoColumnSplit;
  /**
   * 列間の gap 段階。
   * @default 'md'
   */
  gap?: TwoColumnGap;
  /**
   * `true` で mobile 時に 2nd child を上、1st child を下に配置する。
   * PC では positional 順 (main 左 / sidebar 右) を維持。
   * SearchPage のように「form (1st child) を下、preview (2nd child) を上」と
   * mobile UX を最適化したいときに使う。
   * @default false
   */
  mobileReverse?: boolean;
  /**
   * 子要素 (1 番目が main、2 番目が sidebar として配置される)。
   * 3 つ以上は無視。1 つだけの場合は sidebar が空のまま grid に乗る。
   */
  children: React.ReactNode;
}

/** split ごとの内部 class マッピング。grid base と各 child の col-span を保持。 */
const splitClasses: Record<TwoColumnSplit, { cols: string; main: string; sidebar: string }> = {
  '6/6': { cols: 'lg:grid-cols-12', main: 'lg:col-span-6', sidebar: 'lg:col-span-6' },
  '7/3': { cols: 'lg:grid-cols-10', main: 'lg:col-span-7', sidebar: 'lg:col-span-3' },
  '8/4': { cols: 'lg:grid-cols-12', main: 'lg:col-span-8', sidebar: 'lg:col-span-4' },
};

/** gap 段階ごとの Tailwind utility class。consumer の実態 (`gap-4 md:gap-6 xl:gap-8`) を `md` に。 */
const gapClasses: Record<TwoColumnGap, string> = {
  sm: 'gap-4',
  md: 'gap-4 md:gap-6 xl:gap-8',
  lg: 'gap-6 lg:gap-8 xl:gap-12',
};

/**
 * TwoColumn — Atomic Design: Composite (Layout)
 *
 * 内部構造:
 * - 外側: mobile `flex flex-col gap-* ` → `lg:grid lg:grid-cols-{N} lg:gap-*`
 *   (gap は mobile/lg 共通の class、Tailwind の gap は flex/grid 両対応)
 * - 1st child を wrap (main): `lg:col-span-{main}`
 * - 2nd child を wrap (sidebar): `lg:col-span-{sidebar}`
 * - `mobileReverse=true` 時、1st child に `order-2 lg:order-1`、2nd に `order-1 lg:order-2`
 *
 * @see TwoColumnProps for usage examples.
 */
export const TwoColumn: React.FC<TwoColumnProps> = ({
  split,
  gap = 'md',
  mobileReverse = false,
  children,
  className,
  ...rest
}) => {
  const childArray = React.Children.toArray(children);
  const main = childArray[0];
  const sidebar = childArray[1];
  const { cols, main: mainCol, sidebar: sidebarCol } = splitClasses[split];
  const gapCls = gapClasses[gap];
  const containerClass = [
    'flex flex-col lg:grid',
    cols,
    gapCls,
    className,
  ].filter(Boolean).join(' ');
  const mainClass = mobileReverse
    ? `${mainCol} order-2 lg:order-1`
    : mainCol;
  const sidebarClass = mobileReverse
    ? `${sidebarCol} order-1 lg:order-2`
    : sidebarCol;
  return (
    <div {...rest} className={containerClass}>
      <div className={mainClass}>{main}</div>
      {sidebar !== undefined && <div className={sidebarClass}>{sidebar}</div>}
    </div>
  );
};

TwoColumn.displayName = 'TwoColumn';
