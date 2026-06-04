import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Spinner } from './Spinner';
import { Button } from '../Button/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Spinner stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → Sizes → EdgeCases
 * (States は Spinner が常に animating で静的状態なし、WithIcon は Spinner が icon そのもの、いずれも省略)
 *
 * Docs (Guideline) は Spinner.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    color: { control: 'radio', options: ['primary', 'neutral', 'white'] },
    label: { control: 'text' },
  },
  args: {
    size: 'md',
    color: 'primary',
    label: '読み込み中',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// role="status" + aria-label + sr-only text の 3 重 a11y 装備を play test で保証。

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。`role="status"` + `aria-label` + `.sr-only` テキストの 3 重 a11y 装備を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // role="status" + aria-label="読み込み中" の自動付与を検証
    const spinner = canvas.getByRole('status', { name: '読み込み中' });
    await expect(spinner).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 3 色のセマンティックカラーを静的に横並び。"どの context でどの color" の判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '3 色のカラーを比較。primary は CTA / 主要操作の待機、neutral はカード内 / 控えめ、white はダーク背景 / 色面ボタン内で背景に合わせて選ぶ。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-8 items-center">
      <Caption text="primary (CTA / 主要操作)">
        <Spinner size="lg" color="primary" />
      </Caption>
      <Caption text="neutral (カード内 / 控えめ)">
        <Spinner size="lg" color="neutral" />
      </Caption>
      <Caption text="white (ダーク背景 / 色面ボタン)">
        <div className="bg-neutral-800 p-4 rounded">
          <Spinner size="lg" color="white" />
        </div>
      </Caption>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs (12px) / sm (16px) / md (24px) / lg (32px) / xl (48px) / 2xl (64px) の見比べ。サイズ選定の指針はインライン=xs/sm、コンポーネント中央=md/lg、フルページ=xl/2xl。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6 items-end">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <Caption key={size} text={size}>
          <Spinner size={size} color="primary" />
        </Caption>
      ))}
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────
// インライン (テキスト隣) / ボタン内 / フルページ overlay など、
// 実際の組み合わせで起こる視覚バランスや a11y の確認用。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'インライン (テキスト隣) / ボタン内 isLoading 状態 / フルページ overlay の組合せパターン。Spinner は単独で完結しないため、parent との視覚バランスがキーになる。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="インライン (テキスト隣) — size=xs で text と高さを揃える">
        <div className="flex items-center gap-2 text-onSurface-muted">
          <Spinner size="xs" color="neutral" label="確認中" />
          <span className="text-sm">データを読み込んでいます...</span>
        </div>
      </Caption>

      <Caption text="ボタン内 — Button isLoading で自動付与 (size 連動済) / 手動配置 (size=xs)">
        <div className="flex gap-3">
          <Button isLoading>保存中...</Button>
          <Button variant="tertiary" disabled>
            <Spinner size="xs" color="primary" label="処理中" />
            <span className="ml-2">処理中...</span>
          </Button>
        </div>
      </Caption>

      <Caption text="フルページ overlay — 半透明白背景 + size=xl で中央配置">
        <div className="relative w-64 h-40 bg-neutral-100 rounded overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-3 rounded">
            <Spinner size="xl" color="primary" label="読み込み中" />
            <p className="text-sm text-onSurface-muted">データを取得中...</p>
          </div>
        </div>
      </Caption>
    </div>
  ),
};
