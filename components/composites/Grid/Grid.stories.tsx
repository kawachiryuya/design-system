import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Grid } from './Grid';
import { Caption } from '@sb-blocks/Caption';

/**
 * Grid stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。状態を持たない layout composite。
 *
 * Grid は 2 カテゴリ・3 モード (型レベル排他):
 * - **反復**: `minItemWidth` (auto-fit, 幅で列数自動) / `cols` (固定 N 列)
 * - **placement**: `layout="page"` (12 カラムに `Grid.Item span` で非対称配置)
 *
 * 列数はコンテナ幅で決まるため、**VR 対象 (Overview / EdgeCases) は幅 680px 固定**で
 * スナップショットを決定的にする。**Playground は撮影外なので幅可変**にし、auto-fit が
 * 幅で列数を変える様子を実際に確認できるようにする。
 */
const meta: Meta<typeof Grid> = {
  title: 'Composites/Grid',
  component: Grid,
  // Grid は layout component なので全幅で見せる (global の layout='centered' だと中身幅に
  // shrink して auto-fit の幅可変が確認できない)。
  parameters: { layout: 'fullscreen' },
  argTypes: {
    minItemWidth: { control: 'text' },
    cols: { control: false },
    layout: { control: false },
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

/** layout="page" 上に span で配置した 1 行を組む helper。 */
const PageRow = ({ spans }: { spans: number[] }) => (
  <Grid layout="page">
    {spans.map((s, i) => (
      <Grid.Item key={i} span={s}>
        <Card label={`span ${s}`} />
      </Grid.Item>
    ))}
  </Grid>
);

// ── 1. Playground (視覚回帰対象外・幅可変) ──────────────────────
// 推奨の反復 auto-fit モードを探索する。撮影外なので幅は固定せず、Storybook の幅を
// 変えると列数が自動で変わる様子を確認できる。cols / placement は Overview を参照。

export const Playground: Story = {
  render: (args) => (
    <div className="p-4 bg-surface-layer-2">
      <Grid minItemWidth={args.minItemWidth ?? '12rem'}>{cards(6)}</Grid>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '反復 auto-fit (推奨): `minItemWidth` で列数が自動。**Storybook の幅 (ブラウザ / viewport addon) を縮めると列数が自動で減る**のを確認できる (撮影外なので幅を固定していない)。固定 N 列 (`cols`) と placement (`layout="page"`) は Overview を参照。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Card 1')).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象・幅 680px 固定) ────────────────────
// 反復 (auto-fit / cols) と placement (page の span 比率いくつか) を 2 グループで集約。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '反復モード (auto-fit / cols) と placement モード (`layout="page"` の span 比率いくつか) を集約。列数はコンテナ幅で決まるため幅 680px 固定で VR を決定的にする (auto-fit の幅可変は Playground で確認)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="text-xs text-onSurface-muted">反復モード — 同種アイテムを並べる (列数の決め方が違う)</div>
        <Caption text='auto-fit (minItemWidth="12rem") — 幅で列数が自動 (推奨)'>
          <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
            <Grid minItemWidth="12rem">{cards(5)}</Grid>
          </div>
        </Caption>
        <Caption text="cols={3} — サイズに関わらず厳密に 3 列">
          <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
            <Grid cols={3}>{cards(3)}</Grid>
          </div>
        </Caption>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-xs text-onSurface-muted">placement モード — layout="page" の 12 カラムに Grid.Item span で非対称配置</div>
        {([
          { label: '3 / 6 / 3 (aside / main / aside)', spans: [3, 6, 3] },
          { label: '4 / 4 / 4 (3 等分)', spans: [4, 4, 4] },
          { label: '8 / 4 (main / aside)', spans: [8, 4] },
          { label: '6 / 6 (2 等分)', spans: [6, 6] },
          { label: '9 / 3', spans: [9, 3] },
        ] as const).map(({ label, spans }) => (
          <Caption key={label} text={label}>
            <div className="w-[680px] max-w-full p-3 bg-surface-layer-2">
              <PageRow spans={[...spans]} />
            </div>
          </Caption>
        ))}
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象・幅 680px 固定) ───────────────────
// props だけでは作れない文脈依存のレイアウト挙動: アイテム数が少ない時の auto-fit / 非連続 placement。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'auto-fit でアイテムが少ない場合 (余った列は 1fr で伸びる) / `layout="page"` + `start` による非連続配置など、アイテム数・配置に依存する文脈ケース。幅 680px 固定。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text="minItemWidth でアイテム 2 つ — 余った列は空き (1fr で伸びる)">
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
