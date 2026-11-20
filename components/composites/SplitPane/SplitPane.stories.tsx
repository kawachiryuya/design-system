import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import { SplitPane } from './SplitPane';
import { Button } from '../../primitives/Button';
import { Link } from '../../primitives/Link';
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
    <div className="type-label mb-3">予約一覧 (list pane)</div>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-surface border border-border-default rounded-md p-3 hover:bg-surface-subtle cursor-pointer">
        <div className="type-label">予約 #{String(i + 1).padStart(3, '0')}</div>
        <div className="type-caption text-onSurface-subtle mt-1">2026/06/{(i % 28) + 1} 東京 → 新大阪</div>
      </div>
    ))}
  </div>
);

const MockDetail = () => (
  <div className="p-6 space-y-4">
    <div className="type-section-title">予約詳細 (detail pane)</div>
    <div className="bg-surface border border-border-default rounded-md p-4">
      <div className="type-label mb-2">予約番号: RD-001</div>
      <div className="type-supporting text-onSurface-subtle">
        list / detail の独立スクロールを確認できるよう、両 pane を長くしておく。
      </div>
    </div>
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="bg-surface-subtle border border-border-default rounded-md p-4 type-supporting">
        <div className="font-medium mb-1">セクション {i + 1}</div>
        <div className="text-onSurface-subtle">scroll させて確認。</div>
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
    // listWidth は cols breakpoint (>= 1024px) でのみ効き、mobile では全て縦積みで同一になるため
    // Overview は desktop (1280) のみ撮る。mobile の縦積み / list 非表示等は EdgeCases ([375,1280]) で検証。
    chromatic: { viewports: [1280] },
    docs: {
      description: {
        story: '視覚回帰用の総覧。`listWidth` 3 段階 (280 / 360 / 480px) と `divider={false}` を desktop 幅で比較。listWidth は cols breakpoint (>= 1024px) でのみ効くため Overview は 1280 のみ撮る (mobile では全て縦積みで同一)。mobile の breakpoint 挙動は EdgeCases ([375,1280]) で検証。',
      },
    },
  },
  // listWidth の大小を相対比較できるよう全 pane を同じ総幅に揃える。
  // Caption (items-start で shrink) だと listWidth ごとに総幅が変わり比較にならないため使わず、
  // 共通の max-w 枠 + stretch ラベルにする (mobile は viewport 幅に収まり縦積み)。
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-[860px]">
      <div className="flex flex-col gap-1.5">
        <span className="type-caption text-onSurface-subtle">listWidth=&quot;280px&quot; (狭め)</span>
        <PanePreview>
          <SplitPane listWidth="280px" height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="type-caption text-onSurface-subtle">listWidth=&quot;360px&quot; (default、consumer の標準採用値)</span>
        <PanePreview>
          <SplitPane listWidth="360px" height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="type-caption text-onSurface-subtle">listWidth=&quot;480px&quot; (広め)</span>
        <PanePreview>
          <SplitPane listWidth="480px" height="500px" list={<MockList count={10} />}>
            <MockDetail />
          </SplitPane>
        </PanePreview>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="type-caption text-onSurface-subtle">divider=&#123;false&#125; — 両 pane 間の縦境界線なし</span>
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
            <div className="p-6 type-supporting text-onSurface-subtle">左の一覧から項目を選択してください。</div>
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

// ── 4. FocusStop (視覚回帰対象外: 挙動テスト) ────────────────────
// 領域に Tab で止まるのは「実際に縦か横にスクロールでき、かつ中に Tab で来られる要素が無い」ときだけ (#136)。
// 止まるかどうかは見た目に出ない (余白は同じ) ので、play で確かめる。

/** 中身を短くできる SplitPane (領域そのものにフォーカスがある間に条件が変わる場合の確認用)。押すボタンは領域の外に置く */
const ShrinkDemo = () => {
  const [long, setLong] = useState(true);
  return (
    <div className="space-y-2">
      <Button variant="secondary" size="sm" onClick={() => setLong(false)}>詳細を短くする</Button>
      <PanePreview>
        <SplitPane height="500px" list={<div data-testid="shrink-list"><MockList count={10} /></div>}>
          <div data-testid="shrink-detail">
            {long ? <MockDetail /> : <p className="p-6 type-supporting">短くなった中身。</p>}
          </div>
        </SplitPane>
      </PanePreview>
    </div>
  );
};

/** 描画と測り直し (1 フレームにまとめている) が済むのを待つ */
const nextFrames = (n = 2) =>
  new Promise<void>((resolve) => {
    const step = (left: number) => (left <= 0 ? resolve() : requestAnimationFrame(() => step(left - 1)));
    step(n);
  });

export const FocusStop: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '領域に Tab で止まる条件の挙動テスト。スクロールする文章だけの領域 → 止まる / 中身が短くスクロールしない → 止まらない / スクロールするが中に押せるものがある → 止まらない (中の要素へのフォーカスでスクロールできる) / 横にだけあふれる → 止まる / 中のボタンが `<fieldset disabled>` で無効 → 止まる / 領域そのものにフォーカスがある間に中身が短くなっても、tabindex を外さない (外すとフォーカスが body に飛ぶ。フォーカスが外れたら外す)。',
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <Caption text="スクロールする・中に押せるものが無い → 両方の領域に Tab で止まる">
        <PanePreview>
          <SplitPane height="500px" list={<div data-testid="scroll-list"><MockList count={10} /></div>}>
            <div data-testid="scroll-detail"><MockDetail /></div>
          </SplitPane>
        </PanePreview>
      </Caption>
      <Caption text="中身が短くスクロールしない → 止まらない">
        <PanePreview>
          <SplitPane height="500px" list={<div data-testid="short-list"><MockList count={2} /></div>}>
            <div data-testid="short-detail" className="p-6 type-supporting">短い中身。</div>
          </SplitPane>
        </PanePreview>
      </Caption>
      <Caption text="スクロールするが、中に押せるものがある → 領域には止まらない">
        <PanePreview>
          <SplitPane
            height="500px"
            list={
              <ul data-testid="link-list" className="p-4 space-y-6">
                {Array.from({ length: 16 }, (_, i) => (
                  <li key={i}><Link href="#">予約 #{String(i + 1).padStart(3, '0')}</Link></li>
                ))}
              </ul>
            }
          >
            <div data-testid="link-detail"><MockDetail /></div>
          </SplitPane>
        </PanePreview>
      </Caption>
      <Caption text="横にだけあふれる (幅の広い中身) → 止まる">
        <PanePreview>
          <SplitPane
            height="500px"
            list={
              <div data-testid="wide-list" className="w-[1200px] p-4 type-supporting">
                幅の広い中身 (横にスクロールする)。
              </div>
            }
          >
            <div data-testid="wide-detail" className="p-6 type-supporting">短い中身。</div>
          </SplitPane>
        </PanePreview>
      </Caption>
      <Caption text="スクロールするが、中のボタンは fieldset ごと無効 → 押せるものに数えず、止まる">
        <PanePreview>
          <SplitPane
            height="500px"
            list={
              <fieldset data-testid="disabled-list" disabled className="p-4 space-y-6">
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i}><Button variant="secondary" size="sm">予約 #{String(i + 1).padStart(3, '0')}</Button></div>
                ))}
              </fieldset>
            }
          >
            <div data-testid="disabled-detail" className="p-6 type-supporting">短い中身。</div>
          </SplitPane>
        </PanePreview>
      </Caption>
      <Caption text="領域にフォーカスがある間に中身が短くなる → フォーカスも tabindex も残り、フォーカスが外れたら外れる">
        <ShrinkDemo />
      </Caption>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pane = (id: string) => canvas.getByTestId(id).parentElement as HTMLElement;
    // 幅が cols (= lg) 未満 (縦積み) のときは、どの領域もスクロールの枠でないので止まらない。
    // 縦積みかどうかは CSS の読み込みを待たずに決まるよう、幅の media query で見る
    const stacked = !window.matchMedia('(min-width: 1024px)').matches;
    // CSS が効いて、測り直し (1 フレームにまとめている) が済むまで待つ。最初の描画は「止まる」なので、
    // 待たずに「止まる」を確かめると、測る前の値で通ってしまう
    if (!stacked) await waitFor(() => expect(getComputedStyle(pane('scroll-list')).overflowY).toBe('auto'));
    await nextFrames(3);
    if (stacked) {
      for (const id of [
        'scroll-list', 'scroll-detail', 'short-list', 'short-detail', 'link-list', 'link-detail',
        'wide-list', 'wide-detail', 'disabled-list', 'disabled-detail', 'shrink-list', 'shrink-detail',
      ]) {
        await waitFor(() => expect(pane(id)).not.toHaveAttribute('tabindex'));
      }
      return;
    }
    await waitFor(() => expect(pane('scroll-list')).toHaveAttribute('tabindex', '0'));
    await expect(pane('scroll-detail')).toHaveAttribute('tabindex', '0');
    await waitFor(() => expect(pane('short-list')).not.toHaveAttribute('tabindex'));
    await expect(pane('short-detail')).not.toHaveAttribute('tabindex');
    await waitFor(() => expect(pane('link-list')).not.toHaveAttribute('tabindex'));
    // 押せるものが無い側 (詳細) は、同じ SplitPane の中でも止まる
    await expect(pane('link-detail')).toHaveAttribute('tabindex', '0');
    // 横にだけあふれる領域も、スクロールできるので止まる
    await waitFor(() => expect(pane('wide-list')).toHaveAttribute('tabindex', '0'));
    await expect(pane('wide-detail')).not.toHaveAttribute('tabindex');
    // fieldset ごと無効なボタンは Tab で来られないので数えない → 止まる
    await waitFor(() => expect(pane('disabled-list')).toHaveAttribute('tabindex', '0'));

    // 実際に Tab を押すと、止まる領域にフォーカスが来る (領域の外のボタン → 一覧の領域)
    const shrinkButton = canvas.getByRole('button', { name: '詳細を短くする' });
    const shrinkList = pane('shrink-list');
    const shrinkDetail = pane('shrink-detail');
    await waitFor(() => expect(shrinkList).toHaveAttribute('tabindex', '0'));
    await waitFor(() => expect(shrinkDetail).toHaveAttribute('tabindex', '0'));
    shrinkButton.focus();
    await userEvent.tab();
    await expect(shrinkList).toHaveFocus();
    await userEvent.tab();
    await expect(shrinkDetail).toHaveFocus();

    // 領域そのものにフォーカスがある間に中身が短くなる (フォーカスを動かさずに押す)
    shrinkButton.click();
    await waitFor(() => expect(canvas.getByText('短くなった中身。')).toBeInTheDocument());
    await nextFrames(3);
    // フォーカスは body に飛ばず領域に残り、tabindex も残る
    await expect(shrinkDetail).toHaveFocus();
    await expect(shrinkDetail).toHaveAttribute('tabindex', '0');
    // フォーカスが外れたら、測り直して外す
    shrinkDetail.blur();
    await waitFor(() => expect(shrinkDetail).not.toHaveAttribute('tabindex'));
  },
};
