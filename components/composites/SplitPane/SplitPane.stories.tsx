import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SplitPane } from './SplitPane';
import { Caption } from '@sb-blocks/Caption';

/**
 * SplitPane stories — 標準ストーリー構造に準拠 (Playground / Variants / EdgeCases)
 *
 * - States 省略: 状態を持たない layout primitive のため (AGENTS.md §5-3 注)
 * - Sizes 省略: size prop なし (`listWidth` は Variants で扱う)
 * - WithIcon 省略: icon prop なし
 *
 * Variants / EdgeCases は full-screen layout を固定高さ container で wrap して
 * 1 story 内に縦に並べる方式 (Center.stories.tsx と同じ pattern)。
 */
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

export const Variants: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '`listWidth` 3 段階 (280 / 360 / 480px) と `divider={false}` を縦に並べて比較。各 sub-render は固定高さ container で wrap し、視覚的に list 幅の差を比較しやすくしている。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Caption text='listWidth="280px" (狭め)'>
        <PanePreview>
          <SplitPane listWidth="280px" height="500px">
            <MockList count={10} />
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='listWidth="360px" (default、rail-demo の ReservationsLayout 採用値)'>
        <PanePreview>
          <SplitPane listWidth="360px" height="500px">
            <MockList count={10} />
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='listWidth="480px" (広め)'>
        <PanePreview>
          <SplitPane listWidth="480px" height="500px">
            <MockList count={10} />
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='divider={false} — 両 pane 間の縦境界線なし'>
        <PanePreview>
          <SplitPane divider={false} height="500px">
            <MockList count={10} />
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'mobile で list 非表示 (rail-demo pattern) / children 1 つ (detail 未選択時) / custom height (AppShell 外で利用) を確認。consumer が SplitPane を別の文脈で使う時に守るべき挙動。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Caption text='mobile で list 非表示 (rail-demo pattern) — consumer 側で hidden lg:block'>
        <PanePreview>
          <SplitPane height="500px">
            <div className="hidden lg:block">
              <MockList count={10} />
            </div>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='children 1 つ (list のみ) — detail pane wrapper は描画されない'>
        <PanePreview>
          <SplitPane height="500px">
            <MockList count={10} />
          </SplitPane>
        </PanePreview>
      </Caption>

      <Caption text='height="600px" 固定 (AppShell の外で利用するケース)'>
        <div className="h-[600px]">
          <SplitPane height="600px">
            <MockList count={20} />
            <MockDetail />
          </SplitPane>
        </div>
      </Caption>
    </div>
  ),
};
