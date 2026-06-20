import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SplitPane } from './SplitPane';
import { Caption } from '@sb-blocks/Caption';

/**
 * SplitPane stories — VR 集約モデル (§5-3): Playground / Overview / EdgeCases
 *
 * - Overview = props で作れる内在パターン (`listWidth` / `divider`)。
 * - EdgeCases = mobile で list 非表示 / detail 未選択 empty / custom height 等、className・文脈駆動の構造ケース。
 * - 状態を持たない layout primitive のため States は無し。size/icon prop も無し。
 * - 視覚回帰は meta の `chromatic.viewports=[375,1280]` で master-detail の縦スタック↔横分割を撮る。
 *   Overview / EdgeCases は full-screen layout を固定高さ container で wrap し 1 story 内に縦に並べる。
 */
const meta: Meta<typeof SplitPane> = {
  title: 'Composites/SplitPane',
  component: SplitPane,
  parameters: {
    layout: 'fullscreen',
    // 視覚回帰 (Chromatic): mobile / desktop の 2 幅で撮影し、master-detail が
    // 縦スタック ↔ 横分割に切り替わる breakpoint 挙動を捉える。
    chromatic: { viewports: [375, 1280] },
  },
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
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="bg-surface-layer-2 border border-border-default rounded-md p-4 text-sm">
        <div className="font-medium mb-1">セクション {i + 1}</div>
        <div className="text-onSurface-muted">scroll させて確認。</div>
      </div>
    ))}
  </div>
);

/** sub-render を 1 story に並べるための固定高さ wrapper。 */
const PanePreview = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[500px] overflow-hidden border border-border-default rounded-md">
    {children}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <SplitPane {...args} list={<MockList />}>
      <MockDetail />
    </SplitPane>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls の `listWidth` / `divider` / `height` を切り替えて挙動確認。PC (cols breakpoint) では左右 grid、両 pane が独立スクロール (各 pane 内を scroll しても他方は動かない)。Storybook を viewport switcher で mobile に切り替えると縦積みに。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/予約一覧/)).toBeInTheDocument();
    await expect(canvas.getByText(/予約詳細/)).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターン: listWidth 3 段階 + divider={false}。

export const Overview: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '視覚回帰用の総覧。`listWidth` 3 段階 (280 / 360 / 480px) と `divider={false}` を縦に並べて比較。meta の viewports=[375,1280] で desktop の横分割と mobile の縦積みの両方を撮る。',
      },
    },
  },
  // listWidth の大小を相対比較できるよう全 pane を同じ総幅に揃える。
  // Caption (items-start で shrink) だと listWidth ごとに総幅が変わり比較にならないため使わず、
  // 共通の max-w 枠 + stretch ラベルにする (mobile は viewport 幅に収まり縦積み)。
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-[860px]">
      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-onSurface-muted">listWidth=&quot;280px&quot; (狭め)</span>
        <PanePreview>
          <SplitPane listWidth="280px" height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-onSurface-muted">listWidth=&quot;360px&quot; (default、consumer の標準採用値)</span>
        <PanePreview>
          <SplitPane listWidth="360px" height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-onSurface-muted">listWidth=&quot;480px&quot; (広め)</span>
        <PanePreview>
          <SplitPane listWidth="480px" height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-onSurface-muted">divider=&#123;false&#125; — 両 pane 間の縦境界線なし</span>
        <PanePreview>
          <SplitPane divider={false} height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'mobile で list 非表示 (consumer pattern) / detail 未選択時の empty state / custom height (AppShell 外で利用) を確認。consumer が SplitPane を別の文脈で使う時に守るべき挙動。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Caption text='mobile で list 非表示 (consumer pattern) — consumer 側で hidden cols:block'>
        <PanePreview>
          <SplitPane height="500px" list={<div className="hidden cols:block"><MockList count={10} /></div>}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='detail 未選択時 — children に empty state を渡す'>
        <PanePreview>
          <SplitPane height="500px" list={<MockList count={10} />}>
            <div className="p-6 text-sm text-onSurface-muted">左の一覧から項目を選択してください。</div>
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='height="600px" 固定 (AppShell の外で利用するケース)'>
        <div className="h-[600px]">
          <SplitPane height="600px" list={<MockList count={20} />}>
            <MockDetail />
          </SplitPane>
        </div>
      </Caption>
    </div>
  ),
};
