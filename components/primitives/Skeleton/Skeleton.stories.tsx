import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Skeleton } from './Skeleton';
import { Caption } from '@sb-blocks/Caption';

/**
 * Skeleton stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → EdgeCases
 * (Sizes は width/height が連続値で discrete サイズなし、States は Skeleton が常に
 *  読み込み中の単一状態、WithIcon は該当なし、いずれも省略)
 *
 * Docs (Guideline) は Skeleton.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: { control: 'radio', options: ['text', 'circular', 'rectangular', 'rounded'] },
    lines: { control: { type: 'number', min: 1, max: 10 } },
    animated: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'text',
    animated: true,
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// role="status" + aria-busy の自動付与を play test で保証。

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。`role="status"` + `aria-busy="true"` + `aria-label="読み込み中"` の a11y 装備を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByRole('status', { name: '読み込み中' });
    await expect(skeleton).toBeInTheDocument();
    await expect(skeleton).toHaveAttribute('aria-busy', 'true');
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 4 種類の形状を静的に横並び。"どの実コンテンツを置く予定か" で選ぶ判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '4 種類の形状を比較。text は本文行、circular はアバター/アイコン、rectangular は画像/カード本体、rounded は角丸モダンカード。実際のコンテンツの形に合わせて選ぶ。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-full">
      <Caption text="text — 本文行 (lines=3、最終行 75% 幅)">
        <Skeleton variant="text" lines={3} />
      </Caption>
      <Caption text="circular — アバター/アイコン">
        <Skeleton variant="circular" width={48} height={48} />
      </Caption>
      <Caption text="rectangular — 画像/カード本体">
        <Skeleton variant="rectangular" height={120} />
      </Caption>
      <Caption text="rounded — 角丸モダンカード">
        <Skeleton variant="rounded" height={120} />
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// animated=false / カード統合 / リスト統合など、組合せパターンの監視。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'animated=false (複数並べる場合のパフォーマンス対策) / カード統合 (画像+アバター+本文+ボタン) / リスト統合 (アバター+テキスト 2 行 + チップ) など、実際のレイアウトに重ねる組合せ。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-72">
      <Caption text="animated=false — 大量並列描画でパフォーマンス優先">
        <Skeleton variant="text" lines={3} animated={false} />
      </Caption>

      <Caption text="カードレイアウト統合 (画像 + アバター + 本文 + ボタン)">
        <div className="p-4 border border-border-muted rounded-lg space-y-4">
          <Skeleton variant="rectangular" height={120} className="rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={36} height={36} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
          <Skeleton variant="text" lines={2} />
          <div className="flex gap-2">
            <Skeleton variant="rounded" width={64} height={28} />
            <Skeleton variant="rounded" width={64} height={28} />
          </div>
        </div>
      </Caption>

      <Caption text="ユーザーリスト統合 (4 行)">
        <div className="divide-y divide-border-muted">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 px-1">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="70%" />
              </div>
              <Skeleton variant="rounded" width={56} height={24} />
            </div>
          ))}
        </div>
      </Caption>
    </div>
  ),
};
