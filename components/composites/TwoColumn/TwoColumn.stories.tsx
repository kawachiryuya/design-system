import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TwoColumn } from './TwoColumn';
import { Caption } from '@sb-blocks/Caption';

/**
 * TwoColumn stories — 標準ストーリー構造に準拠 (Playground / Variants / EdgeCases)
 *
 * - States 省略: 状態を持たない layout primitive のため (AGENTS.md §5-3 注)
 * - Sizes 省略: size prop なし (`split` 比率は Variants で扱う)
 * - WithIcon 省略: icon prop なし
 */
const meta: Meta<typeof TwoColumn> = {
  title: 'Composites/TwoColumn',
  component: TwoColumn,
  parameters: {
    // 視覚回帰 (Chromatic): mobile / desktop の 2 幅で撮影。1280px は cols breakpoint (= 1024px)
    // を超え、縦スタック → 2 カラム grid に切り替わった姿を捉える。
    chromatic: { viewports: [375, 1280] },
  },
  argTypes: {
    split: { control: 'radio', options: ['6/6', '7/5', '8/4', '9/3'] },
    mobileReverse: { control: 'boolean' },
    className: { control: false },
    children: { control: false },
    sidebar: { control: false },
  },
  args: {
    split: '8/4',
    mobileReverse: false,
  },
};

export default meta;
type Story = StoryObj<typeof TwoColumn>;

const Main = () => (
  <div className="bg-surface border border-border-default rounded-md p-4 min-h-[160px]">
    <div className="text-sm font-semibold mb-2">Main (children)</div>
    <div className="text-sm text-onSurface-muted">主コンテンツ領域。検索結果 / 座席選択 / form 等。</div>
  </div>
);

const Sidebar = () => (
  <div className="bg-surface-layer-2 border border-border-default rounded-md p-4 min-h-[160px]">
    <div className="text-sm font-semibold mb-2">Sidebar (sidebar slot)</div>
    <div className="text-sm text-onSurface-muted">補助コンテンツ。条件 / 料金 / preview 等。</div>
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div className="p-4 bg-surface-layer-2">
      <TwoColumn {...args} sidebar={<Sidebar />}>
        <Main />
      </TwoColumn>
    </div>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls の `split` を切り替えて fr テンプレート (2fr_1fr 等) の比率変化を確認。`mobileReverse` を true にすると mobile で sidebar が上に来る。viewport switcher で mobile / PC (cols breakpoint) 切替推奨。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Main \(children\)/)).toBeInTheDocument();
    await expect(canvas.getByText(/Sidebar \(sidebar slot\)/)).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '`split` 4 種 (6/6 / 7/5 / 8/4 / 9/3) を縦に並べて比較。`cols` breakpoint (>= 1024px) で grid 化、mobile では縦積みになる挙動が見える。gutter は grid.gutter トークン (16/16/24) 固定。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(['6/6', '7/5', '8/4', '9/3'] as const).map((s) => (
        <Caption key={s} text={`split="${s}"`}>
          <div className="p-3 bg-surface-layer-2">
            <TwoColumn split={s} sidebar={<Sidebar />}>
              <Main />
            </TwoColumn>
          </div>
        </Caption>
      ))}
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'mobileReverse (SearchPage pattern) / sidebar 省略 (単一カラム) / sidebar に cols:sticky (Seat pattern) を確認。consumer の典型 edge case を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text='mobileReverse=true (SearchPage pattern) — mobile で sidebar 上 / main 下 (DOM 順は main→sidebar 固定)'>
        <div className="p-3 bg-surface-layer-2">
          <TwoColumn
            split="6/6"
            mobileReverse
            sidebar={
              <div className="bg-surface-layer-2 border border-border-default rounded-md p-4">
                <div className="text-sm font-semibold mb-2">Preview (sidebar)</div>
                <div className="text-sm text-onSurface-muted">mobile では上、PC では右に表示される。</div>
              </div>
            }
          >
            <div className="bg-surface border border-border-default rounded-md p-4">
              <div className="text-sm font-semibold mb-2">Form (children = main)</div>
              <div className="text-sm text-onSurface-muted">mobile では下、PC では左に表示される。</div>
            </div>
          </TwoColumn>
        </div>
      </Caption>

      <Caption text='sidebar 省略 — main のみ full width (単一カラム)'>
        <div className="p-3 bg-surface-layer-2">
          <TwoColumn split="8/4">
            <Main />
          </TwoColumn>
        </div>
      </Caption>

      <Caption text='sidebar に cols:sticky (Seat pattern) — 列切替と sticky が cols で同期'>
        <div className="p-3 bg-surface-layer-2">
          <TwoColumn
            split="8/4"
            sidebar={
              <div className="bg-surface-layer-2 border border-border-default rounded-md p-4 cols:sticky cols:top-4">
                <div className="text-sm font-semibold mb-2">Sticky Sidebar</div>
                <div className="text-sm text-onSurface-muted">consumer 側で `cols:sticky cols:top-X` を className に付けるだけで、2 カラム化と sticky が同じ breakpoint で同期する。SeatPage の料金 sidebar pattern。</div>
              </div>
            }
          >
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="bg-surface border border-border-default rounded-md p-4 text-sm">
                  Main item {i + 1} — main を長くしてスクロール挙動を見る
                </div>
              ))}
            </div>
          </TwoColumn>
        </div>
      </Caption>
    </div>
  ),
};
