import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Grid } from './Grid';
import { Caption } from '@sb-blocks/Caption';

/**
 * Grid stories — 標準ストーリー構造に準拠 (Playground / Variants / EdgeCases)
 *
 * - States 省略: 状態を持たない layout composite のため (AGENTS.md §5-3 注)
 * - Sizes 省略: size prop なし (モード違いは Variants で扱う)
 * - WithIcon 省略: icon prop なし
 *
 * Playground は推奨の反復モード (`minItemWidth`) を Controls で探索する。
 * `cols` / `layout="page"` は Variants / EdgeCases で静的に見せる。
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

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div className="p-4 bg-surface-layer-2">
      <Grid {...args}>{cards(6)}</Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '推奨の反復モード (`minItemWidth`)。Controls で `minItemWidth` を変える、または Storybook の幅を変えると、列数が自分の幅で自動的に決まる (breakpoint 不要)。gutter は grid.gutter トークン固定。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Card 1')).toBeInTheDocument();
    await expect(canvas.getByText('Card 6')).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────

export const Variants: Story = {
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
        <div className="p-3 bg-surface-layer-2">
          <Grid minItemWidth="12rem">{cards(5)}</Grid>
        </div>
      </Caption>

      <Caption text='cols={3} (固定 N) — サイズに関わらず厳密に 3 列'>
        <div className="p-3 bg-surface-layer-2">
          <Grid cols={3}>{cards(3)}</Grid>
        </div>
      </Caption>

      <Caption text='layout="page" + Grid.Item span (placement) — 12 カラム上に 3/6/3 配置'>
        <div className="p-3 bg-surface-layer-2">
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

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'auto-fit でアイテムが少ない場合 (左詰め) / cols={2} 比較レイアウト / Grid.Item の start による非連続配置 を確認。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text='minItemWidth でアイテム 2 つ — 余った列は空き (1fr で伸びる)'>
        <div className="p-3 bg-surface-layer-2">
          <Grid minItemWidth="12rem">{cards(2)}</Grid>
        </div>
      </Caption>

      <Caption text='cols={2} — 2-up 比較レイアウト'>
        <div className="p-3 bg-surface-layer-2">
          <Grid cols={2}>{cards(2, '比較')}</Grid>
        </div>
      </Caption>

      <Caption text='layout="page" + start — span 4 を 5 列目から開始 (中央寄せ的配置)'>
        <div className="p-3 bg-surface-layer-2">
          <Grid layout="page">
            <Grid.Item span={4} start={5}><Card label="span 4 / start 5" /></Grid.Item>
          </Grid>
        </div>
      </Caption>
    </div>
  ),
};
