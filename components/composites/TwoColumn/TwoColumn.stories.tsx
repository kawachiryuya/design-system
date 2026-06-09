import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TwoColumn } from './TwoColumn';
import { Caption } from '@sb-blocks/Caption';

const meta: Meta<typeof TwoColumn> = {
  title: 'Composites/TwoColumn',
  component: TwoColumn,
  argTypes: {
    split: { control: 'radio', options: ['6/6', '7/3', '8/4'] },
    gap: { control: 'radio', options: ['sm', 'md', 'lg'] },
    mobileReverse: { control: 'boolean' },
    className: { control: false },
    children: { control: false },
  },
  args: {
    split: '7/3',
    gap: 'md',
    mobileReverse: false,
  },
};

export default meta;
type Story = StoryObj<typeof TwoColumn>;

const Main = () => (
  <div className="bg-surface border border-border-default rounded-md p-4 min-h-[160px]">
    <div className="text-sm font-semibold mb-2">Main (1st child)</div>
    <div className="text-sm text-onSurface-muted">主コンテンツ領域。検索結果 / 座席選択 / form 等。</div>
  </div>
);

const Sidebar = () => (
  <div className="bg-surface-layer-2 border border-border-default rounded-md p-4 min-h-[160px]">
    <div className="text-sm font-semibold mb-2">Sidebar (2nd child)</div>
    <div className="text-sm text-onSurface-muted">補助コンテンツ。条件 / 料金 / preview 等。</div>
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div className="p-4 bg-surface-layer-2">
      <TwoColumn {...args}>
        <Main />
        <Sidebar />
      </TwoColumn>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Controls の `split` を切り替えて grid base + col-span の変化を確認。`mobileReverse` を true にすると mobile で sidebar が上に来る。viewport switcher で mobile / PC 切替推奨。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Main \(1st child\)/)).toBeInTheDocument();
    await expect(canvas.getByText(/Sidebar \(2nd child\)/)).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '3 種の split (6/6 / 7/3 / 8/4) を縦に並べて比較。lg breakpoint (>= 1024px) で grid 化、mobile では縦積みになる挙動が見える。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['6/6', '7/3', '8/4'] as const).map((s) => (
        <Caption key={s} text={`split="${s}"`}>
          <div className="p-3 bg-surface-layer-2">
            <TwoColumn split={s}>
              <Main />
              <Sidebar />
            </TwoColumn>
          </div>
        </Caption>
      ))}
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const MobileReverse: Story = {
  name: 'mobileReverse=true (SearchPage pattern)',
  render: () => (
    <div className="p-3 bg-surface-layer-2">
      <TwoColumn split="6/6" mobileReverse>
        <div className="bg-surface border border-border-default rounded-md p-4">
          <div className="text-sm font-semibold mb-2">Form (1st child = main)</div>
          <div className="text-sm text-onSurface-muted">mobile では下、PC では左に表示される。</div>
        </div>
        <div className="bg-surface-layer-2 border border-border-default rounded-md p-4">
          <div className="text-sm font-semibold mb-2">Preview (2nd child = sidebar)</div>
          <div className="text-sm text-onSurface-muted">mobile では上、PC では右に表示される。</div>
        </div>
      </TwoColumn>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SearchPage の form (下) + preview (上) パターン。mobile UX で「結果を見せてから form を出す」順序を実現。PC では positional 通り (main 左 / sidebar 右)。',
      },
    },
  },
};

export const GapVariants: Story = {
  name: 'gap=sm / md / lg の比較',
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((g) => (
        <Caption key={g} text={`gap="${g}"`}>
          <div className="p-3 bg-surface-layer-2">
            <TwoColumn split="7/3" gap={g}>
              <Main />
              <Sidebar />
            </TwoColumn>
          </div>
        </Caption>
      ))}
    </div>
  ),
};

export const SingleChild: Story = {
  name: 'children 1 つ (sidebar なし)',
  render: () => (
    <div className="p-3 bg-surface-layer-2">
      <TwoColumn split="7/3">
        <Main />
      </TwoColumn>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'child を 1 つだけ渡した場合、sidebar は描画されず main のみが col-span を取る (mobile も PC も)。検索結果なし時の placeholder 等で利用可能。',
      },
    },
  },
};

export const StickyContent: Story = {
  name: 'sidebar に lg:sticky (Seat pattern)',
  render: () => (
    <div className="p-3 bg-surface-layer-2">
      <TwoColumn split="8/4">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-surface border border-border-default rounded-md p-4 text-sm">
              Main item {i + 1} — main を長くしてスクロール挙動を見る
            </div>
          ))}
        </div>
        <div className="bg-surface-layer-2 border border-border-default rounded-md p-4 lg:sticky lg:top-4">
          <div className="text-sm font-semibold mb-2">Sticky Sidebar</div>
          <div className="text-sm text-onSurface-muted">consumer 側で `lg:sticky lg:top-X` を className に付けるだけで、PC スクロール時に固定表示される。SeatPage の料金 sidebar pattern。</div>
        </div>
      </TwoColumn>
    </div>
  ),
};
