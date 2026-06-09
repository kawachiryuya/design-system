import React from 'react';

/**
 * SplitPane Props
 *
 * **Master-detail layout** を提供する composite。固定幅 list pane + 流動 detail pane。
 *
 * - **mobile (< lg)**: 単純に縦積み (両 pane が full width で順に表示)。
 *   consumer 側で router state に応じて `list` か `detail` に `hidden lg:block` を当てて
 *   表示制御するのが典型 (rail-demo の ReservationsLayout pattern)。
 * - **PC (>= lg)**: grid `[listWidth]_1fr` で左右並び。両 pane が **独立スクロール** (`overflow-y-auto`)、
 *   `divider` で境界線、高さは consumer 指定 (default `calc(100vh - 3rem)` = AppShell main padding 込み)。
 *
 * **positional children**: 1 番目が list pane、2 番目が detail pane。Router の `<Outlet />` を
 * detail pane に渡すのが定番。
 *
 * @example
 *   // 標準 (rail-demo の ReservationsLayout pattern)
 *   <SplitPane listWidth="360px">
 *     <div className="hidden lg:block">
 *       <ReservationsPage />
 *     </div>
 *     <div ref={rightRef} key={selectedId}>
 *       <Outlet />
 *     </div>
 *   </SplitPane>
 *
 * @example
 *   // divider なし
 *   <SplitPane listWidth="320px" divider={false}>
 *     <List />
 *     <Detail />
 *   </SplitPane>
 *
 * @example
 *   // custom height (AppShell の subBar 込みの場合等)
 *   <SplitPane listWidth="360px" height="calc(100vh - 5rem)">
 *     <List />
 *     <Detail />
 *   </SplitPane>
 */
export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * - rail-demo の `py-6` 旧実装は 3rem → `calc(100vh - 3rem)`
   *
   * @default 'calc(100vh - 4rem)'
   */
  height?: string;
  /** 子要素 (1 番目が list pane、2 番目が detail pane)。 */
  children: React.ReactNode;
}

/**
 * SplitPane — Atomic Design: Composite (Layout)
 *
 * 内部構造:
 * - 外側: `lg:grid lg:grid-cols-[var(--sp-cols)] lg:h-[var(--sp-height)]`
 *   (mobile では block layout、CSS variable で動的値を渡す)
 * - list pane: `lg:pr-8 lg:overflow-y-auto` (右 padding + 独立スクロール)
 * - detail pane: `lg:pl-8 lg:overflow-y-auto` (左 padding + 独立スクロール)
 * - `divider` 時: `lg:divide-x lg:divide-border-subtle`
 *
 * @see SplitPaneProps for usage examples.
 */
export const SplitPane: React.FC<SplitPaneProps> = ({
  listWidth = '360px',
  divider = true,
  height = 'calc(100vh - 4rem)',
  children,
  className,
  style,
  ...rest
}) => {
  const childArray = React.Children.toArray(children);
  const list = childArray[0];
  const detail = childArray[1];
  const containerClass = [
    'lg:grid lg:grid-cols-[var(--sp-cols)] lg:h-[var(--sp-height)]',
    divider ? 'lg:divide-x lg:divide-border-subtle' : '',
    className,
  ].filter(Boolean).join(' ');
  const mergedStyle: React.CSSProperties = {
    ...style,
    ['--sp-cols' as string]: `${listWidth} 1fr`,
    ['--sp-height' as string]: height,
  };
  return (
    <div {...rest} className={containerClass} style={mergedStyle}>
      <div className="lg:pr-8 lg:overflow-y-auto">{list}</div>
      {detail !== undefined && (
        <div className="lg:pl-8 lg:overflow-y-auto">{detail}</div>
      )}
    </div>
  );
};

SplitPane.displayName = 'SplitPane';
