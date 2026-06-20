import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TwoColumn } from './TwoColumn';
import { Caption } from '@sb-blocks/Caption';

/**
 * TwoColumn stories — VR 集約モデル (§5-3): Playground / Overview / EdgeCases
 *
 * - Overview = props で作れる内在パターン (`split` 比率 4 種)。
 * - EdgeCases = mobileReverse / sidebar 省略 / cols:sticky 等、prop・className 駆動の構造ケース。
 * - 状態を持たない layout primitive のため States は無し。size/icon prop も無し。
 * - 視覚回帰は meta の `chromatic.viewports=[375,1280]` で縦スタック↔2カラム grid の breakpoint 挙動を撮る。
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
    // split 切替時に総幅を一定に保ち、比率変化だけを感じられるよう max-w 枠で固定
    <div className="p-4 bg-surface-layer-2 max-w-[960px]">
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターン: split 比率 4 種。

export const Overview: Story = {
  parameters: {
    // split 比率は cols breakpoint (>= 1024px) でのみ効き、mobile では全て縦積みで同一になるため
    // Overview は desktop (1280) のみ撮る。mobile の縦積み / mobileReverse 等は EdgeCases ([375,1280]) で検証。
    chromatic: { viewports: [1280] },
    docs: {
      description: {
        story: '視覚回帰用の総覧。`split` 4 種 (6/6 / 7/5 / 8/4 / 9/3) を desktop 幅で比較。比率は cols breakpoint (>= 1024px) でのみ効くため Overview は 1280 のみ撮る (mobile では全て縦積みで同一)。mobile の breakpoint 挙動は EdgeCases ([375,1280]) で検証。gutter は grid.gutter トークン (16/16/24) 固定。',
      },
    },
  },
  // 比率の違いを正しく比較するため全 split を同じ横幅に揃える。
  // Caption (items-start で shrink) だと grid が max-content に縮み比率ごとに総幅が変わるため使わず、
  // 共通の max-w 枠 + stretch ラベルにする (mobile は max-w で viewport 幅に収まり縦積み)。
  render: () => (
    <div className="flex flex-col gap-8 max-w-[960px]">
      {(['6/6', '7/5', '8/4', '9/3'] as const).map((s) => (
        <div key={s} className="flex flex-col gap-1.5">
          <span className="text-caption text-onSurface-muted font-mono">split=&quot;{s}&quot;</span>
          <div className="p-3 bg-surface-layer-2 rounded-md">
            <TwoColumn split={s} sidebar={<Sidebar />}>
              <Main />
            </TwoColumn>
          </div>
        </div>
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
