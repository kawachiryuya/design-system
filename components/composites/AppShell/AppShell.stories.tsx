import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AppShell } from './AppShell';
import { Section } from '../../primitives/Section';
import { Center } from '../../primitives/Center';
import { Caption } from '@sb-blocks/Caption';

/**
 * AppShell stories — VR 集約モデル (§5-3): Playground / Overview / EdgeCases
 *
 * - Overview = props で作れる内在パターン (contentMax / showBottomNav)。
 * - EdgeCases = slot 省略 / layout="full" full-bleed / long-scroll 等、slot・className 駆動で
 *   Playground の Controls では作れない構造ケース。
 * - 状態を持たない layout primitive のため States は無し。size/icon prop も無し。
 * - 視覚回帰は meta の `chromatic.viewports=[375,1280]` で mobile/desktop の breakpoint 挙動を撮る
 *   (`hidden shell:block` のサイドバー出し分け等)。Overview / EdgeCases は full-screen layout を
 *   `h-[500px] overflow-hidden` で wrap して 1 story 内に縦に並べる (Center.stories.tsx と同じ pattern)。
 */
const meta: Meta<typeof AppShell> = {
  title: 'Composites/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    // 視覚回帰 (Chromatic): mobile / desktop の 2 幅で撮影し breakpoint 駆動の表示崩れを検出する。
    // 1280px は shell breakpoint (= lg = 1024px) を超え `hidden shell:block` のサイドバーが出る幅。
    chromatic: { viewports: [375, 1280] },
  },
  argTypes: {
    contentMax: { control: 'radio', options: ['narrow', 'default', 'wide', 'full'] },
    layout: { control: 'radio', options: ['contained', 'full'] },
    showBottomNav: { control: 'boolean' },
    header: { control: false },
    sidebar: { control: false },
    bottomNav: { control: false },
    subBar: { control: false },
    children: { control: false },
  },
  args: {
    contentMax: 'default',
    layout: 'contained',
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

/** sub-render を 1 story に並べるための fullscreen wrapper。className で幅指定可。 */
const ShellPreview = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={['h-[500px] overflow-hidden border border-border-default rounded-md', className].filter(Boolean).join(' ')}>
    {children}
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
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターン: contentMax (narrow/wide) と showBottomNav={false}。

export const Overview: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '視覚回帰用の総覧。`contentMax` (narrow / wide、default は Playground) と `showBottomNav={false}` の挙動を比較。contentMax は「利用可能幅 > 768px」でないと narrow と wide の差が出ないため、内側読み列の幅差が分かるよう固定幅 1400px フレームで見せる (狭い canvas では横スクロール)。showBottomNav は mobile の挙動なので full-width。meta の viewports=[375,1280] で mobile/desktop を撮る。',
      },
    },
  },
  // contentMax (narrow 768 < wide) の差は「利用可能幅 > 768px」でないと出ない。
  // narrow/wide は固定幅 1400px フレーム (右 pane ≈ 1176px) で見せ、内側読み列の幅差を確実に可視化する
  // (狭い canvas では outer の overflow-x-auto で横スクロール)。showBottomNav は mobile 挙動なので full-width。
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      {/* contentMax 比較は固定幅 1400px フレームで横並び (狭い canvas は内側 overflow-x-auto で横スクロール) */}
      <div className="flex flex-col gap-6 overflow-x-auto">
        <div className="flex flex-col gap-1.5 w-[1400px]">
          <span className="text-caption text-onSurface-muted">{'contentMax="narrow" (= max-w-container-narrow 768px) — 読み列が中央に絞られる'}</span>
          <ShellPreview className="w-[1400px]">
            <AppShell
              contentMax="narrow"
              sidebar={<MockSidebar />}
              subBar={<MockSubBar title="narrow shell" />}
            >
              <MockContent>
                <div className="text-sm">contentMax=&quot;narrow&quot; → 内側 main wrapper は <code>max-w-container-narrow</code> (= 768px)。右 pane が広くても読み列はここで頭打ち。</div>
              </MockContent>
            </AppShell>
          </ShellPreview>
        </div>

        <div className="flex flex-col gap-1.5 w-[1400px]">
          <span className="text-caption text-onSurface-muted">{'contentMax="wide" (= max-w-container-wide 1536px) — 読み列が右 pane いっぱいまで広がる'}</span>
          <ShellPreview className="w-[1400px]">
            <AppShell
              contentMax="wide"
              sidebar={<MockSidebar />}
              subBar={<MockSubBar title="wide shell" />}
            >
              <MockContent>
                <div className="text-sm">contentMax=&quot;wide&quot; → 内側 main wrapper は <code>max-w-container-wide</code> (= 1536px)。narrow と同じフレーム幅で並べると読み列が明確に広い。</div>
              </MockContent>
            </AppShell>
          </ShellPreview>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-onSurface-muted">{'showBottomNav={false} — BottomNav 非表示 + mobile main の pb-20 クリアランス無効化'}</span>
        <ShellPreview>
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
        </ShellPreview>
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
        story: 'slot omit パターン (header only / 全 slot なし) / long content scroll / layout="full" の full-bleed を確認。AppShell が slot を渡されない場合に degrade しても破綻しないこと、full モードで背景が端まで届くことを示す。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Caption text='layout="full" — full-bleed 背景 (Section) + 中央読み列 (Center)。背景が main 端まで届く'>
        <ShellPreview>
          <AppShell sidebar={<MockSidebar />} layout="full">
            <Section padding="md" className="bg-surface-secondary">
              <Center max="md">
                <div className="bg-surface border border-border-default rounded-md p-4 text-sm">
                  背景 (Section) は main の端まで full-bleed、コンテンツ (Center max=md) は中央に絞られる。
                </div>
              </Center>
            </Section>
            <Section padding="md">
              <Center max="md">
                <div className="bg-surface border border-border-default rounded-md p-4 text-sm">
                  2 つ目の section。`contained` と違い px+max-w の wrapper が無いので背景を端まで伸ばせる。
                </div>
              </Center>
            </Section>
          </AppShell>
        </ShellPreview>
      </Caption>

      <Caption text='header のみ (sidebar / bottomNav なし) — mobile は Header のみ、PC は単純 main'>
        <ShellPreview>
          <AppShell header={<MockHeader />}>
            <MockContent>
              <div className="text-sm">header のみ提供、sidebar/bottomNav 未指定。mobile はトップ Header あり、PC は単純 main 表示。</div>
            </MockContent>
          </AppShell>
        </ShellPreview>
      </Caption>

      <Caption text='全 slot なし (= 単純 shell) — 最小限の app shell'>
        <ShellPreview>
          <AppShell>
            <MockContent>
              <div className="text-sm">全 slot 未指定でも min-h-screen / px-container / max-w-container は効く。最小限の app shell として使える。</div>
            </MockContent>
          </AppShell>
        </ShellPreview>
      </Caption>

      <Caption text='main content 長い (scroll 確認) — BottomNav は fixed なので重ならない (pb-20 クリアランス)'>
        <ShellPreview>
          <AppShell
            header={<MockHeader />}
            sidebar={<MockSidebar />}
            bottomNav={<MockBottomNav />}
          >
            <div className="flex flex-col gap-3">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="bg-surface border border-border-default rounded-md p-4 text-sm">
                  セクション {i + 1} — long content で scroll 挙動を確認。
                </div>
              ))}
            </div>
          </AppShell>
        </ShellPreview>
      </Caption>
    </div>
  ),
};
