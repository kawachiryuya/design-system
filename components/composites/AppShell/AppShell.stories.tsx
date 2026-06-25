import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AppShell } from './AppShell';
import { Section } from '../../primitives/Section';
import { Center } from '../../primitives/Center';
import { Caption } from '@sb-blocks/Caption';

/**
 * AppShell stories — VR 集約モデル (§5-3): Playground / Overview / EdgeCases
 *
 * - Overview = props で作れる内在パターン (contentMax)。desktop の機能なので desktop (1280) のみ撮影。
 * - EdgeCases = slot 省略 / layout="full" full-bleed / long-scroll 等、slot・className 駆動で
 *   Playground の Controls では作れない構造ケース。mobile/desktop の breakpoint 挙動 (`hidden shell:block`
 *   のサイドバー出し分け等) を [375,1280] で撮る。
 * - 状態を持たない layout primitive のため States は無し。size/icon prop も無し。
 * - viewports は meta が [375,1280] (EdgeCases 用)、Overview は desktop 機能のため [1280] で override。
 *   Overview / EdgeCases は full-screen layout を `h-[500px] overflow-hidden` で wrap して縦に並べる。
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
    footer: { control: false },
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

// AppShell が `<footer>` landmark を提供するので、中身は素の要素で渡す (二重に `<footer>` しない)。
// 帯は内容カラム全幅、内側の読み幅は px-container で軽く絞る (consumer は Section/Center で組む)。
const MockFooter = () => (
  <div className="bg-surface border-t border-border-subtle px-container py-4 text-xs text-onSurface-muted">
    <div className="flex flex-wrap gap-4">
      <span>サービス紹介</span>
      <span>ヘルプ</span>
      <span>よくある質問</span>
    </div>
    <div className="mt-3">© 2026 Rail Demo</div>
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
      footer={<MockFooter />}
    >
      <MockContent />
    </AppShell>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '5 slot (header / sidebar / bottomNav / subBar / footer) 全て埋めた状態。Controls で `contentMax` / `showBottomNav` を変えて挙動確認。Storybook を viewport switcher で mobile / PC 切替すると breakpoint 挙動が見える。',
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
    // contentMax は desktop の読み列幅機能 → Overview は desktop (1280) のみ撮る (375 では固定幅 1400px
    // フレームが見切れるだけで無意味)。サイドバー出し分け等の breakpoint 挙動は EdgeCases ([375,1280]) で検証。
    chromatic: { viewports: [1280] },
    docs: {
      description: {
        story: '視覚回帰用の総覧。`contentMax` (narrow / wide、default は Playground) の内側読み列の幅差を比較。contentMax は desktop の機能で「利用可能幅 > 768px」が要るため、固定幅 1400px フレームで desktop (1280) のみ撮る。showBottomNav (mobile 専用、prop JSDoc/guideline 参照) やサイドバー出し分け等の breakpoint 挙動は EdgeCases ([375,1280]) で検証。',
      },
    },
  },
  // contentMax (narrow 768 < wide) の差は「利用可能幅 > 768px」でないと出ない。
  // narrow/wide は固定幅 1400px フレーム (右 pane ≈ 1176px) で見せ、内側読み列の幅差を確実に可視化する
  // (狭い canvas では outer の overflow-x-auto で横スクロール)。desktop (1280) のみ撮影。
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
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'slot omit パターン (header only / 全 slot なし) / long content scroll / layout="full" の full-bleed / footer slot を確認。AppShell が slot を渡されない場合に degrade しても破綻しないこと、full モードで背景が端まで届くこと、footer が短いページでもビューポート底に来て内容カラム幅の帯になることを示す。',
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

      <Caption text='footer slot (短いコンテンツ) — main が flex-1・footer が shrink-0 で、短くてもフッターはビューポート底へ。帯は内容カラム幅 (レール下に回り込まない)、mobile は BottomNav の上に押し上げ'>
        <ShellPreview>
          <AppShell
            header={<MockHeader />}
            sidebar={<MockSidebar />}
            bottomNav={<MockBottomNav />}
            subBar={<MockSubBar title="footer 付き" />}
            footer={<MockFooter />}
          >
            <MockContent>
              <div className="text-sm">短いコンテンツ。footer は中央に浮かず、内容カラム最下部 (= ビューポート底) に来る。</div>
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
