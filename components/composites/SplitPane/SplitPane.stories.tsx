import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SplitPane } from './SplitPane';

const meta: Meta<typeof SplitPane> = {
  title: 'Composites/SplitPane',
  component: SplitPane,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    listWidth: { control: 'text' },
    divider: { control: 'boolean' },
    height: { control: 'text' },
    children: { control: false },
  },
  args: {
    listWidth: '360px',
    divider: true,
    height: 'calc(100vh - 4rem)',
  },
};

export default meta;
type Story = StoryObj<typeof SplitPane>;

// ── mock 子要素 ──────────────────────────────────────────────

const MockList = ({ count = 20 }: { count?: number }) => (
  <div className="p-4 space-y-2">
    <div className="text-sm font-semibold mb-3">予約一覧 (list pane)</div>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-surface border border-border-default rounded-md p-3 hover:bg-surface-layer-2 cursor-pointer">
        <div className="text-sm font-medium">予約 #{String(i + 1).padStart(3, '0')}</div>
        <div className="text-xs text-onSurface-muted mt-1">2026/06/{(i % 28) + 1} 東京 → 新大阪</div>
      </div>
    ))}
  </div>
);

const MockDetail = () => (
  <div className="p-6 space-y-4">
    <div className="text-lg font-bold">予約詳細 (detail pane)</div>
    <div className="bg-surface border border-border-default rounded-md p-4">
      <div className="text-sm font-medium mb-2">予約番号: RD-001</div>
      <div className="text-sm text-onSurface-muted">
        list / detail の独立スクロールを確認できるよう、両 pane を長くしておく。
      </div>
    </div>
    {Array.from({ length: 15 }, (_, i) => (
      <div key={i} className="bg-surface-layer-2 border border-border-default rounded-md p-4 text-sm">
        <div className="font-medium mb-1">セクション {i + 1}</div>
        <div className="text-onSurface-muted">scroll させて確認。</div>
      </div>
    ))}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <SplitPane {...args}>
      <MockList />
      <MockDetail />
    </SplitPane>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Controls の `listWidth` / `divider` / `height` を切り替えて挙動確認。PC では左右 grid、両 pane が独立スクロール (各 pane 内を scroll しても他方は動かない)。Storybook を viewport switcher で mobile に切り替えると縦積みに。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/予約一覧/)).toBeInTheDocument();
    await expect(canvas.getByText(/予約詳細/)).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────

export const NarrowList: Story = {
  name: 'listWidth="280px" (狭め)',
  render: () => (
    <SplitPane listWidth="280px">
      <MockList count={10} />
      <MockDetail />
    </SplitPane>
  ),
};

export const WideList: Story = {
  name: 'listWidth="480px" (広め)',
  render: () => (
    <SplitPane listWidth="480px">
      <MockList count={10} />
      <MockDetail />
    </SplitPane>
  ),
};

export const NoDivider: Story = {
  name: 'divider={false}',
  render: () => (
    <SplitPane divider={false}>
      <MockList count={10} />
      <MockDetail />
    </SplitPane>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const ConsumerHidesListOnMobile: Story = {
  name: 'mobile で list 非表示 (rail-demo pattern)',
  render: () => (
    <SplitPane>
      <div className="hidden lg:block">
        <MockList count={10} />
      </div>
      <MockDetail />
    </SplitPane>
  ),
  parameters: {
    docs: {
      description: {
        story: 'rail-demo の ReservationsLayout pattern: detail 選択時に mobile で list pane を `hidden lg:block` で隠す。consumer 側の router state に応じて表示制御。Storybook を mobile viewport で見ると detail のみが見える。',
      },
    },
  },
};

export const SingleChild: Story = {
  name: 'children 1 つ (list のみ)',
  render: () => (
    <SplitPane>
      <MockList count={10} />
    </SplitPane>
  ),
  parameters: {
    docs: {
      description: {
        story: 'detail 未選択時に list のみを描画したいケース。detail pane の wrapper div は描画されず、list が grid 内の唯一の child として残る。',
      },
    },
  },
};

export const CustomHeight: Story = {
  name: 'height="600px" (固定高さ)',
  render: () => (
    <div className="p-4">
      <SplitPane height="600px">
        <MockList count={20} />
        <MockDetail />
      </SplitPane>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AppShell の外で利用する等で viewport 高さ計算ができない場合の固定高さ指定例。両 pane の独立スクロールは機能。',
      },
    },
  },
};
