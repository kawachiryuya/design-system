import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AppShell } from './AppShell';
import { Caption } from '@sb-blocks/Caption';

/**
 * AppShell stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → EdgeCases
 *
 * Storybook ではフルスクリーン (min-h-screen) を扱うため、各 story の outer wrapper で
 * 高さ制限 + scale-down を適用、複数 layout を 1 画面で比較できるようにしている。
 */
const meta: Meta<typeof AppShell> = {
  title: 'Composites/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    contentMax: { control: 'radio', options: ['narrow', 'default', 'wide', 'full'] },
    showBottomNav: { control: 'boolean' },
    header: { control: false },
    sidebar: { control: false },
    bottomNav: { control: false },
    subBar: { control: false },
    children: { control: false },
  },
  args: {
    contentMax: 'default',
    showBottomNav: true,
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

// ── slot 用 mock コンポーネント (Storybook 表示用) ───────────────────

const MockHeader = () => (
  <header className="bg-surface border-b border-border-subtle px-4 h-12 flex items-center font-semibold">
    📱 Mobile Header
  </header>
);

const MockSidebar = () => (
  <div className="w-56 shrink-0 border-r border-border-subtle bg-surface sticky top-0 h-screen px-2">
    <div className="px-4 h-16 flex items-center font-bold">🖥 PC Sidebar (w-56)</div>
    <nav className="px-2 flex flex-col gap-1">
      <a href="#" className="px-3 py-2 rounded hover:bg-surface-inset text-sm">ホーム</a>
      <a href="#" className="px-3 py-2 rounded hover:bg-surface-inset text-sm">予約一覧</a>
      <a href="#" className="px-3 py-2 rounded hover:bg-surface-inset text-sm">マイページ</a>
    </nav>
  </div>
);

const MockBottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border-subtle shadow-sm">
    <div className="flex items-center justify-around h-16 text-xs">
      <div className="flex flex-col items-center gap-1">📌<span>ホーム</span></div>
      <div className="flex flex-col items-center gap-1">📋<span>予約一覧</span></div>
      <div className="flex flex-col items-center gap-1">👤<span>マイページ</span></div>
    </div>
  </nav>
);

const MockSubBar = ({ title }: { title: string }) => (
  <div className="hidden lg:block border-b border-border-subtle bg-surface px-container py-3">
    <div className="text-xs text-onSurface-muted">パンくず &gt; {title}</div>
    <div className="font-bold text-lg">{title}</div>
  </div>
);

const MockContent = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-surface-layer-2 border border-dashed border-border-subtle rounded-md p-4 min-h-[200px]">
    {children ?? (
      <div className="text-sm text-onSurface-muted">
        ここが children (= main 内コンテンツ)。Storybook 用に dashed border で可視化。
      </div>
    )}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <AppShell
      {...args}
      header={<MockHeader />}
      sidebar={<MockSidebar />}
      bottomNav={<MockBottomNav />}
      subBar={<MockSubBar title="Playground" />}
    >
      <MockContent />
    </AppShell>
  ),
  parameters: {
    docs: {
      description: {
        story: '4 slot (header / sidebar / bottomNav / subBar) 全て埋めた状態。Controls で `contentMax` / `showBottomNav` を変えて挙動確認。Storybook を viewport switcher で mobile / PC 切替すると breakpoint 挙動が見える。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/main 内コンテンツ/)).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────

export const ContentMaxNarrow: Story = {
  name: 'contentMax="narrow" (768px shell)',
  render: () => (
    <AppShell
      contentMax="narrow"
      sidebar={<MockSidebar />}
      subBar={<MockSubBar title="narrow shell" />}
    >
      <MockContent>
        <div className="text-sm">contentMax=&quot;narrow&quot; → 内側 main wrapper は <code>max-w-container-narrow</code> (= 768px)。Settings / reading 中心の画面向け。</div>
      </MockContent>
    </AppShell>
  ),
};

export const ContentMaxWide: Story = {
  name: 'contentMax="wide" (1536px shell)',
  render: () => (
    <AppShell
      contentMax="wide"
      sidebar={<MockSidebar />}
      subBar={<MockSubBar title="wide shell" />}
    >
      <MockContent>
        <div className="text-sm">contentMax=&quot;wide&quot; → 内側 main wrapper は <code>max-w-container-wide</code> (= 1536px)。Dashboard / 横長 content 向け。</div>
      </MockContent>
    </AppShell>
  ),
};

export const WithoutBottomNav: Story = {
  name: 'BottomNav なし (settings / detail)',
  render: () => (
    <AppShell
      header={<MockHeader />}
      sidebar={<MockSidebar />}
      bottomNav={<MockBottomNav />}
      showBottomNav={false}
      subBar={<MockSubBar title="No BottomNav" />}
    >
      <MockContent>
        <div className="text-sm">
          <p>showBottomNav=&#123;false&#125; で BottomNav 非表示、mobile main の <code>pb-20</code> クリアランスも無効化。</p>
          <p className="mt-2">設定画面 / 詳細画面で sticky nav を消したい時に。</p>
        </div>
      </MockContent>
    </AppShell>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const HeaderOnly: Story = {
  name: 'header のみ (sidebar / bottomNav なし)',
  render: () => (
    <AppShell header={<MockHeader />}>
      <MockContent>
        <div className="text-sm">header のみ提供、sidebar/bottomNav 未指定。mobile はトップ Header あり、PC は単純 main 表示。</div>
      </MockContent>
    </AppShell>
  ),
};

export const NoSlots: Story = {
  name: '全 slot なし (= 単純 shell)',
  render: () => (
    <AppShell>
      <MockContent>
        <div className="text-sm">全 slot 未指定でも min-h-screen / px-container / max-w-container は効く。最小限の app shell として使える。</div>
      </MockContent>
    </AppShell>
  ),
};

export const LongContent: Story = {
  name: 'main content 長い (scroll 確認)',
  render: () => (
    <AppShell
      header={<MockHeader />}
      sidebar={<MockSidebar />}
      bottomNav={<MockBottomNav />}
    >
      <div className="flex flex-col gap-3">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="bg-surface border border-border-default rounded-md p-4 text-sm">
            セクション {i + 1} — long content で scroll 挙動を確認。BottomNav は mobile で fixed なので main が下に流れても重ならない (pb-20 クリアランス効果)。
          </div>
        ))}
      </div>
    </AppShell>
  ),
};
