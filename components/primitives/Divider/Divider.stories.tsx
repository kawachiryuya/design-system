import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Divider } from './Divider';
import { Caption } from '@sb-blocks/Caption';

/**
 * Divider stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * Divider は状態を持たず icon prop も無い。size 概念は weight に内包。
 * 単独では描画されないため各サンプルは最小の文脈 (コンテナ) で囲む。
 *
 * Docs (Guideline) は Divider.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    weight: { control: 'radio', options: ['thin', 'normal'] },
    label: { control: 'text' },
    className: { control: false },
  },
  args: {
    orientation: 'horizontal',
    weight: 'thin',
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────
// args 全開放、Controls から props を探索する起点。

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="w-80 flex flex-col gap-3">
        <span className="text-sm text-onSurface-muted">上のコンテンツ</span>
        <Story />
        <span className="text-sm text-onSurface-muted">下のコンテンツ</span>
      </div>
    ),
  ],
  parameters: {
    // Controls 探索の起点 → 視覚回帰対象外 (Overview が VR 対象。§5-3)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。`role="separator"` の自動付与を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const divider = canvas.getByRole('separator');
    await expect(divider).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターンを 1 枚に: orientation × weight + label。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。orientation (horizontal / vertical) × weight (thin 1px / normal 2px) と label 付きを集約。normal は強調的な区切り用。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <div className="flex flex-col gap-3">
        <span className="text-xs text-onSurface-muted">horizontal × weight</span>
        <Caption text="thin (1px)">
          <Divider weight="thin" />
        </Caption>
        <Caption text="normal (2px)">
          <Divider weight="normal" />
        </Caption>
        <Caption text="label 付き — 意味的区切り (「または」等)">
          <Divider label="または" />
        </Caption>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-onSurface-muted">vertical × weight (固定高さの flex 内)</span>
        <div className="flex items-center gap-4 h-8">
          <span className="text-sm text-onSurface-muted">利用規約</span>
          <Divider orientation="vertical" weight="thin" />
          <span className="text-sm text-onSurface-muted">プライバシー</span>
          <Divider orientation="vertical" weight="normal" />
          <span className="text-sm text-onSurface-muted">お問合せ</span>
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存: vertical を高さ不定の flex 親で使い self-stretch で追従させる挙動。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'vertical を flex 親 (`items-stretch`) で使うと self-stretch で親の高さに追従する。高さがコンテナ依存になる文脈依存ケース。',
      },
    },
  },
  render: () => (
    <div className="flex items-stretch gap-4 h-24 w-96 border border-dashed border-border-subtle p-3 rounded">
      <div className="flex-1 flex items-center justify-center bg-surface-layer-2 rounded text-sm text-onSurface-muted">左パネル</div>
      <Divider orientation="vertical" weight="normal" />
      <div className="flex-1 flex items-center justify-center bg-surface-layer-2 rounded text-sm text-onSurface-muted">右パネル</div>
    </div>
  ),
};
