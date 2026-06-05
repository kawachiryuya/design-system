import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Divider } from './Divider';
import { Caption } from '@sb-blocks/Caption';

/**
 * Divider stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → EdgeCases
 * (Sizes は weight に内包、States は Divider に状態なし、WithIcon は icon prop なし、いずれも省略)
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

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// `role="separator"` 自動付与を play test で保証。

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
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。`role="separator"` の自動付与を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const divider = canvas.getByRole('separator');
    await expect(divider).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 主要な見た目パターン (horizontal / horizontal+label / vertical) を静的に並べる。
// "どれを使うか" の判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '3 パターンの代表的な使い方を比較。horizontal (デフォルト) はセクション区切り、horizontal+label は意味的区切り (「または」等)、vertical はインラインアイテムの区切り。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <Caption text="horizontal — セクション区切り">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-onSurface-muted">セクション 1</span>
          <Divider />
          <span className="text-sm text-onSurface-muted">セクション 2</span>
        </div>
      </Caption>

      <Caption text="horizontal + label — 意味的区切り (「または」「以上」等)">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-onSurface-muted">SNS でログイン</span>
          <Divider label="または" />
          <span className="text-sm text-onSurface-muted">メールでログイン</span>
        </div>
      </Caption>

      <Caption text="vertical — インラインアイテム区切り">
        <div className="flex items-center gap-4 h-8">
          <span className="text-sm text-onSurface-muted">利用規約</span>
          <Divider orientation="vertical" />
          <span className="text-sm text-onSurface-muted">プライバシーポリシー</span>
          <Divider orientation="vertical" />
          <span className="text-sm text-onSurface-muted">お問合せ</span>
        </div>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// weight (太さ) の見比べ / 実用統合 (フォーム内 / 設定パネル等) / horizontal+vertical 共存など、
// 実装の境界条件を確認する。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '太さ (weight: thin/normal) の見比べ / フォーム内の OR 区切り統合例 / vertical を高さの不明な親で使った場合の挙動など。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <Caption text="weight: thin (1px) vs normal (2px) — normal は強調的な区切り用">
        <div className="flex flex-col gap-4 w-full">
          <Divider weight="thin" />
          <Divider weight="normal" />
        </div>
      </Caption>

      <Caption text="フォーム統合例 — SNS ログイン vs メールログインの OR 区切り">
        <div className="flex flex-col gap-4 w-full">
          <button
            type="button"
            className="w-full py-2 px-4 border border-border-default rounded text-sm hover:bg-state-hover transition-colors"
          >
            Google でログイン
          </button>
          <Divider label="または" />
          <input
            type="email"
            placeholder="メールアドレス"
            className="w-full px-3 py-2 border border-border-default rounded text-sm"
          />
        </div>
      </Caption>

      <Caption text="vertical を flex 親で使う — self-stretch で親の高さに追従">
        <div className="flex items-stretch gap-4 h-24 border border-dashed border-border-subtle p-3 rounded">
          <div className="flex-1 flex items-center justify-center bg-surface-raised rounded text-sm text-onSurface-muted">左パネル</div>
          <Divider orientation="vertical" weight="normal" />
          <div className="flex-1 flex items-center justify-center bg-surface-raised rounded text-sm text-onSurface-muted">右パネル</div>
        </div>
      </Caption>
    </div>
  ),
};
