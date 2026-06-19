import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Skeleton } from './Skeleton';
import { Caption } from '@sb-blocks/Caption';

/**
 * Skeleton stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Overview → EdgeCases
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
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
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

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────
// 4 種類の形状を静的に横並び。"どの実コンテンツを置く予定か" で選ぶ判断材料。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '4 種類の形状 (text / circular / rectangular / rounded) と animated の有無を集約。形状は実際のコンテンツの形に合わせて選ぶ。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-2 gap-6">
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
      <Caption text="animated=false — アニメーション無効 (大量並列描画でパフォーマンス優先)">
        <Skeleton variant="text" lines={3} animated={false} />
      </Caption>
    </div>
  ),
};

// EdgeCases は省略 — props だけでは作れない文脈依存の崩れが無いため (§5-3)。
// animated は内在軸として Overview に集約。カード/リスト統合は usage 合成 (guideline 向き)。
