import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Spinner } from './Spinner';
import { Button } from '../Button/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Spinner stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * Spinner は常に animating (静的状態なし) で icon そのものなので States / WithIcon は無い。
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

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────
// args 全開放、Controls から props を探索する起点。

export const Playground: Story = {
  parameters: {
    // Controls 探索の起点 → 視覚回帰対象外 (Overview が VR 対象。§5-3)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。`role="status"` + `aria-label` + `.sr-only` テキストの 3 重 a11y 装備を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('status', { name: '読み込み中' });
    await expect(spinner).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターンを 1 枚に: size 6 段 + color 3 種 (white はダーク背景上)。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。size 6 段 (xs 12px 〜 2xl 64px) と color 3 種 (primary / neutral / white) を集約。white はダーク背景・色面ボタン用。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (xs / sm / md / lg / xl / 2xl)</div>
        <div className="flex flex-wrap gap-6 items-end">
          {SIZES.map((size) => (
            <Caption key={size} text={size}>
              <Spinner size={size} color="primary" />
            </Caption>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">color (primary / neutral / white)</div>
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
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存: 周囲レイアウトとの視覚バランス。
// インライン (テキスト隣) / ボタン内 / フルページ overlay。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'インライン (テキスト隣) / ボタン内 isLoading / フルページ overlay。Spinner は単独で完結せず parent との視覚バランスがキーになる文脈依存ケース。',
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
