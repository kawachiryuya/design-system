import React from 'react';

/**
 * SplitPane Props
 *
 * **Master-detail layout** を提供する composite。固定幅 list pane + 流動 detail pane。
 *
 * **名前付き slot**: `list` prop が固定幅ペイン (`listWidth` と対)、`children` が detail
 * (残り幅 = fluid 1fr)。TwoColumn / AppShell と同じ「主コンテンツ=children + 名前付き prop」流儀で、
 * 位置依存 children の順序取り違えを防ぐ。
 *
 * - **mobile (< `cols`)**: 単純に縦積み (両 pane が full width で順に表示)。
 *   consumer 側で router state に応じて `list` か detail に `hidden cols:block` を当てて
 *   表示制御するのが典型 (list + detail レイアウトの典型 pattern)。
 * - **PC (>= `cols`)**: grid `[listWidth]_1fr` で左右並び。両 pane が **独立スクロール** (`overflow-y-auto`)、
 *   `divider` で境界線、高さは consumer 指定 (default `calc(100vh - 4rem)` = AppShell main padding 込み)。
 *
 * @example
 *   // 標準 (list + detail レイアウトの典型 pattern)
 *   <SplitPane listWidth="360px" list={<ReservationsPage />}>
 *     <Outlet />
 *   </SplitPane>
 *
 * @example
 *   // divider なし
 *   <SplitPane listWidth="320px" divider={false} list={<List />}>
 *     <Detail />
 *   </SplitPane>
 *
 * @example
 *   // custom height (AppShell の subBar 込みの場合等)
 *   <SplitPane listWidth="360px" height="calc(100vh - 5rem)" list={<List />}>
 *     <Detail />
 *   </SplitPane>
 */
export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 固定幅 list pane の中身 (名前付き slot)。`listWidth` で幅を指定する。
   * mobile では detail の前 (上) に縦積みされる。
   */
  list: React.ReactNode;
  /**
   * List pane の固定幅。任意の CSS 値 (px / rem 等) を受け付ける。
   * @default '360px'
   */
  listWidth?: string;
  /**
   * 両 pane 間に縦境界線 (`divide-x divide-border-subtle`) を引くか。
   * @default true
   */
  divider?: boolean;
  /**
   * PC 時の SplitPane 自身の高さ。両 pane の独立スクロール (`overflow-y-auto`) を
   * 機能させるために**固定高さが必要**。`calc(100vh - X)` で AppShell の padding 分を引く想定。
   *
   * AppShell の default padding (mobile 16, lg desktop 32 = 2rem) を考慮:
   * - AppShell の `py-container` 利用時 = lg で `pt-8 pb-8` = 64px = 4rem → `calc(100vh - 4rem)`
   * - consumer の `py-6` 旧実装は 3rem → `calc(100vh - 3rem)`
   *
   * @default 'calc(100vh - 4rem)'
   */
  height?: string;
  /** detail pane の中身 (fluid 1fr)。Router の `<Outlet />` を渡すのが定番。 */
  children: React.ReactNode;
}

/**
 * SplitPane — Atomic Design: Composite (Layout)
 *
 * 内部構造:
 * - 外側: `cols:grid cols:grid-cols-[var(--sp-cols)] cols:h-[var(--sp-height)]`
 *   (mobile では block layout、CSS variable で動的値を渡す)
 * - list pane: `cols:pr-8 cols:overflow-y-auto` (右 padding + 独立スクロール)
 * - detail pane: `cols:pl-8 cols:overflow-y-auto` (左 padding + 独立スクロール)
 * - `divider` 時: `cols:divide-x cols:divide-border-subtle`
 *
 * @see SplitPaneProps for usage examples.
 */
export const SplitPane: React.FC<SplitPaneProps> = ({
  list,
  listWidth = '360px',
  divider = true,
  height = 'calc(100vh - 4rem)',
  children,
  className,
  style,
  ...rest
}) => {
  const containerClass = [
    'cols:grid cols:grid-cols-[var(--sp-cols)] cols:h-[var(--sp-height)]',
    divider ? 'cols:divide-x cols:divide-border-subtle' : '',
    className,
  ].filter(Boolean).join(' ');
  const mergedStyle: React.CSSProperties = {
    ...style,
    ['--sp-cols' as string]: `${listWidth} 1fr`,
    ['--sp-height' as string]: height,
  };
  return (
    <div data-ds-root {...rest} className={containerClass} style={mergedStyle}>
      {/* 独立スクロールする pane はキーボードでもスクロールできるよう tabindex=0 を付与
          (WCAG 2.1.1 / axe scrollable-region-focusable)。 */}
      <div tabIndex={0} className="cols:pr-8 cols:overflow-y-auto">{list}</div>
      <div tabIndex={0} className="cols:pl-8 cols:overflow-y-auto">{children}</div>
    </div>
  );
};

SplitPane.displayName = 'SplitPane';
