import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Grid } from './Grid';
import { Caption } from '@sb-blocks/Caption';

/**
 * Grid stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * 状態を持たない layout composite (size/icon prop なし)。
 * Grid は列数が**コンテナ幅で決まる**ため、全デモを **幅 680px に固定**して挙動を判別可能にし、
 * VR の決定性も担保する (画面幅依存でスナップショットが揺れないように)。
 *
 * Docs (Guideline) は Grid.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Grid> = {
  title: 'Composites/Grid',
  component: Grid,
  argTypes: {
    minItemWidth: { control: 'text' },
    className: { control: false },
    children: { control: false },
  },
  args: {
    minItemWidth: '12rem',
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const Card = ({ label }: { label: string }) => (
  <div className="bg-surface border border-border-default rounded-md p-4 text-sm text-center">
    {label}
  </div>
);

const cards = (n: number, prefix = 'Card') =>
  Array.from({ length: n }, (_, i) => <Card key={i} label={`${prefix} ${i + 1}`} />);

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────
// Grid は 3 モードが型レベルで排他 (minItemWidth / cols / layout は互いに `?: never`)。
// 1 つの Grid に複数モードは渡せないので、story 専用の `mode` arg で切り替えて探索する。
// 関連 Controls は `if` で当該モードの時だけ表示する。

type GridMode = 'auto-fit' | 'cols' | 'page';

export const Playground: StoryObj = {
  args: { mode: 'auto-fit', minItemWidth: '12rem', cols: 3 },
  argTypes: {
    mode: { control: 'radio', options: ['auto-fit', 'cols', 'page'], name: 'mode (story 用)' },
    minItemWidth: { control: 'text', if: { arg: 'mode', eq: 'auto-fit' } },
    cols: { control: { type: 'number', min: 1, max: 12 }, if: { arg: 'mode', eq: 'cols' } },
  },
  render: (args) => {
    const { mode, minItemWidth, cols } = args as { mode: GridMode; minItemWidth: string; cols: number };
    return (
      <div className="w-[680px] max-w-full p-4 bg-surface-layer-2">
        {mode === 'page' ? (
          <Grid layout="page">
            <Grid.Item span={3}><Card label="aside (span 3)" /></Grid.Item>
            <Grid.Item span={6}><Card label="main (span 6)" /></Grid.Item>
            <Grid.Item span={3}><Card label="aside (span 3)" /></Grid.Item>
          </Grid>
        ) : mode === 'cols' ? (
          <Grid cols={cols}>{cards(6)}</Grid>
        ) : (
          <Grid minItemWidth={minItemWidth}>{cards(6)}</Grid>
        )}
      </div>
    );
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '`mode` で 3 排他モードを切替: auto-fit (`minItemWidth`、自分の幅で列数自動・推奨) / cols (固定 N 列) / page (`layout="page"` の 12 カラム + `Grid.Item span`)。コンテナは 680px 固定。gutter は grid.gutter トークン。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Card 1')).toBeInTheDocument();
    await expect(canvas.getByText('Card 6')).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる 3 モードを集約: 反復 auto-fit (minItemWidth) / 固定 N (cols) / placement (layout="page")。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '3 モードの比較: 反復 auto-fit (`minItemWidth`, 推奨) / 反復 固定 N (`cols`) / placement (`layout="page"` + `<Grid.Item span>`)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text='minItemWidth="12rem" (auto-fit, 推奨) — 幅で列数が自動決定'>
        <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
          <Grid minItemWidth="12rem">{cards(5)}</Grid>
        </div>
      </Caption>

      <Caption text='cols={3} (固定 N) — サイズに関わらず厳密に 3 列'>
        <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
          <Grid cols={3}>{cards(3)}</Grid>
        </div>
      </Caption>

      <Caption text='layout="page" + Grid.Item span (placement) — 12 カラム上に 3/6/3 配置'>
        <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
          <Grid layout="page">
            <Grid.Item span={3}><Card label="aside (span 3)" /></Grid.Item>
            <Grid.Item span={6}><Card label="main (span 6)" /></Grid.Item>
            <Grid.Item span={3}><Card label="aside (span 3)" /></Grid.Item>
          </Grid>
        </div>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存のレイアウト挙動: アイテム数が少ない時の auto-fit / 非連続 placement。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'auto-fit でアイテムが少ない場合 (余った列は 1fr で伸びる) / `layout="page"` + `start` による非連続配置など、アイテム数・配置に依存する文脈ケース。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text='minItemWidth でアイテム 2 つ — 余った列は空き (1fr で伸びる)'>
        <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
          <Grid minItemWidth="12rem">{cards(2)}</Grid>
        </div>
      </Caption>

      <Caption text='layout="page" + start — span 4 を 5 列目から開始 (中央寄せ的配置)'>
        <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
          <Grid layout="page">
            <Grid.Item span={4} start={5}><Card label="span 4 / start 5" /></Grid.Item>
          </Grid>
        </div>
      </Caption>
    </div>
  ),
};
