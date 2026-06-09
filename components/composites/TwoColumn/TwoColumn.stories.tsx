import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TwoColumn } from './TwoColumn';
import { Caption } from '@sb-blocks/Caption';

/**
 * TwoColumn stories — 標準ストーリー構造に準拠 (Playground / Variants / EdgeCases)
 *
 * - States 省略: 状態を持たない layout primitive のため (AGENTS.md §5-3 注)
 * - Sizes 省略: size prop なし (`gap` の段階は Variants 内で扱う)
 * - WithIcon 省略: icon prop なし
 */
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
        story: '`split` 3 種 (6/6 / 7/3 / 8/4) と `gap` 3 段 (sm / md / lg) を縦に並べて比較。lg breakpoint (>= 1024px) で grid 化、mobile では縦積みになる挙動が見える。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
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

      {(['sm', 'md', 'lg'] as const).map((g) => (
        <Caption key={g} text={`gap="${g}" (split=7/3 で固定)`}>
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

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'mobileReverse (SearchPage pattern) / children 1 つ (sidebar なし) / sidebar に lg:sticky (Seat pattern) を確認。consumer の典型 edge case を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text='mobileReverse=true (SearchPage pattern) — mobile で sidebar 上 / main 下'>
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
      </Caption>

      <Caption text='children 1 つ (sidebar なし) — main のみが col-span を取る'>
        <div className="p-3 bg-surface-layer-2">
          <TwoColumn split="7/3">
            <Main />
          </TwoColumn>
        </div>
      </Caption>

      <Caption text='sidebar に lg:sticky (Seat pattern) — consumer が className で sticky 指定'>
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
      </Caption>
    </div>
  ),
};
