import React from 'react';

/**
 * Grid の描画要素。
 */
export type GridElement = 'div' | 'ul' | 'ol' | 'section';

interface GridCommonProps extends React.HTMLAttributes<HTMLElement> {
  /** 描画する HTML 要素。 @default 'div' */
  as?: GridElement;
  /** 子要素。`layout="page"` 時は `<Grid.Item>` を、反復モード時はカード等を並べる。 */
  children: React.ReactNode;
  className?: string;
}

/** 反復モード (auto-fit): 自分の幅で列数が決まる。レスポンシブの既定・推奨。 */
interface GridAutoFitProps extends GridCommonProps {
  /** 各アイテムの最小幅 (例 `'16rem'`)。`repeat(auto-fit, minmax(minItemWidth, 1fr))`。 */
  minItemWidth: string;
  cols?: never;
  layout?: never;
}

/** 反復モード (固定 N): サイズに関わらず厳密に N 列。2-up 比較 / N-up スタット行等。 */
interface GridFixedColsProps extends GridCommonProps {
  /** 固定列数 (1〜12)。レスポンシブにしたい場合は `minItemWidth` を使う。 */
  cols: number;
  minItemWidth?: never;
  layout?: never;
}

/** placement モード: `.grid-base` (12 カラム) 上に `<Grid.Item span start>` で配置。 */
interface GridPlacementProps extends GridCommonProps {
  /** `'page'` で 12 カラムのページ格子 (`.grid-base`) を組む。子は `<Grid.Item>`。 */
  layout: 'page';
  minItemWidth?: never;
  cols?: never;
}

/**
 * Grid Props (排他 3 モード)
 *
 * - **反復 (auto-fit)**: `minItemWidth` — 自分の幅で列数が決まる。breakpoint も container query も
 *   不要で本質的に幅応答。**既定・推奨**のレスポンシブカードグリッド。
 * - **反復 (固定 N)**: `cols` — サイズに関わらず厳密に N 列。
 * - **placement**: `layout="page"` — `.grid-base` (12 カラム) 上に `<Grid.Item span start>` で配置。
 *
 * gutter は `grid.gutter` トークン (16/16/24) 固定 (`.gap-grid` / `.grid-base` 内蔵)。
 *
 * @example
 *   // 反復 (推奨): 自分の幅で列数が決まる
 *   <Grid minItemWidth="16rem">{cards}</Grid>
 *
 * @example
 *   // 固定 N 列 (厳密に 3 列)
 *   <Grid cols={3}>{cards}</Grid>
 *
 * @example
 *   // placement (非均等配置 3/6/3)
 *   <Grid layout="page">
 *     <Grid.Item span={3}>aside</Grid.Item>
 *     <Grid.Item span={6}>main</Grid.Item>
 *     <Grid.Item span={3}>aside</Grid.Item>
 *   </Grid>
 */
export type GridProps = GridAutoFitProps | GridFixedColsProps | GridPlacementProps;

/**
 * Grid.Item Props (placement モード用)。
 *
 * `span` / `start` は **desktop (`cols` breakpoint 以上) の 12 カラム配置**。
 * mobile では各 Item が full width (1 列 stack) になる。レスポンシブに細かく配置したい稀な
 * ケースは `.grid-base` utility を直接使い `col-span-* md:col-span-*` を書く。
 */
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 占有カラム数 (1〜12)。desktop で適用、mobile は full width。 */
  span?: number;
  /** 開始カラム (1〜12)。非均等配置の左右寄せに。desktop で適用。 */
  start?: number;
  children: React.ReactNode;
  className?: string;
}

// desktop (cols:) での col-span / col-start を静的 lookup で保持
// (Tailwind JIT が検出できるよう全値をリテラルで列挙)。mobile は col-span-full (= 1 列 stack)。
const COL_SPAN: Record<number, string> = {
  1: 'cols:col-span-1', 2: 'cols:col-span-2', 3: 'cols:col-span-3', 4: 'cols:col-span-4',
  5: 'cols:col-span-5', 6: 'cols:col-span-6', 7: 'cols:col-span-7', 8: 'cols:col-span-8',
  9: 'cols:col-span-9', 10: 'cols:col-span-10', 11: 'cols:col-span-11', 12: 'cols:col-span-12',
};
const COL_START: Record<number, string> = {
  1: 'cols:col-start-1', 2: 'cols:col-start-2', 3: 'cols:col-start-3', 4: 'cols:col-start-4',
  5: 'cols:col-start-5', 6: 'cols:col-start-6', 7: 'cols:col-start-7', 8: 'cols:col-start-8',
  9: 'cols:col-start-9', 10: 'cols:col-start-10', 11: 'cols:col-start-11', 12: 'cols:col-start-12',
};

const GridItem: React.FC<GridItemProps> = ({ span, start, children, className, ...rest }) => {
  const cls = [
    'col-span-full',
    span !== undefined ? COL_SPAN[span] : undefined,
    start !== undefined ? COL_START[start] : undefined,
    className,
  ].filter(Boolean).join(' ');
  return (
    <div {...rest} className={cls}>
      {children}
    </div>
  );
};
GridItem.displayName = 'Grid.Item';

/**
 * Grid — Atomic Design: Composite (Layout)
 *
 * 反復 (auto-fit / 固定 N) と placement (12 カラム) を 1 コンポーネントで提供する。
 * `<Grid.Item>` は placement モードの子。
 *
 * @see GridProps for usage examples.
 */
const GridRoot: React.FC<GridProps> = (props) => {
  const { as: Tag = 'div', children, className, ...rest } = props;

  // placement モード: .grid-base (12 カラム token 格子)
  if ('layout' in props && props.layout === 'page') {
    const { layout: _layout, ...domRest } = rest as Record<string, unknown>;
    void _layout;
    return (
      <Tag {...domRest} className={['grid-base', className].filter(Boolean).join(' ')}>
        {children}
      </Tag>
    );
  }

  // 反復モード: gap は .gap-grid (grid.gutter token)
  let gridTemplateColumns: string | undefined;
  if ('minItemWidth' in props && props.minItemWidth) {
    gridTemplateColumns = `repeat(auto-fit, minmax(${props.minItemWidth}, 1fr))`;
    const { minItemWidth: _m, ...domRest } = rest as Record<string, unknown>;
    void _m;
    return (
      <Tag
        {...domRest}
        className={['grid gap-grid', className].filter(Boolean).join(' ')}
        style={{ ...(props.style ?? {}), gridTemplateColumns }}
      >
        {children}
      </Tag>
    );
  }

  // 固定 N 列
  const cols = 'cols' in props ? props.cols : 1;
  const { cols: _c, ...domRest } = rest as Record<string, unknown>;
  void _c;
  return (
    <Tag
      {...domRest}
      className={['grid gap-grid', className].filter(Boolean).join(' ')}
      style={{ ...(props.style ?? {}), gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </Tag>
  );
};
GridRoot.displayName = 'Grid';

export const Grid = Object.assign(GridRoot, { Item: GridItem });
