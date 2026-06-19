import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';
import { Caption } from '@sb-blocks/Caption';

/**
 * Badge stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * Badge は非 interactive な `<span>` で状態を持たず、size prop も無い (h-6 1 サイズ)。
 *
 * Docs (Guideline) は Badge.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'error', 'warning', 'info'],
    },
    appearance: { control: 'radio', options: ['solid', 'soft', 'outline'] },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'ラベル',
    variant: 'neutral',
    appearance: 'soft',
    dot: false,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

const VARIANTS = ['neutral', 'primary', 'success', 'error', 'warning', 'info'] as const;
const APPEARANCES = ['solid', 'soft', 'outline'] as const;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────
// args 全開放、Controls から props を探索する起点。

export const Playground: Story = {
  parameters: {
    // Controls 探索の起点 → 視覚回帰対象外 (Overview が VR 対象。§5-3)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から variant / appearance / dot を切り替えて見え方を確認する起点。Badge は非 interactive な `<span>` で、ARIA role は付かない (テキストそのものが意味を伝える前提)。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText(args.children as string);
    await expect(badge.tagName).toBe('SPAN');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在パターンを 1 枚に: appearance × variant マトリクス / dot / count。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。appearance × variant マトリクス + dot + count を 1 枚に集約。solid は強調・カウント、soft はリスト内ステータス、outline は控えめなカテゴリラベル。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">appearance × variant</div>
        <div className="flex flex-col gap-3">
          {APPEARANCES.map((appearance) => (
            <div key={appearance} className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-onSurface-muted w-14 shrink-0">{appearance}</span>
              {VARIANTS.map((variant) => (
                <Badge key={variant} variant={variant} appearance={appearance}>{variant}</Badge>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">dot (リアルタイム性: 処理中 / 接続中 / 新着等)</div>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant} dot>{variant}</Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">count (solid で通知バッジ風 / 1〜3 桁)</div>
        <div className="flex gap-2 items-center">
          <Badge variant="error" appearance="solid">1</Badge>
          <Badge variant="error" appearance="solid">12</Badge>
          <Badge variant="error" appearance="solid">99+</Badge>
          <Badge variant="primary" appearance="solid">NEW</Badge>
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存: 長文ラベルの whitespace-nowrap 挙動 (折返しは親側で許可)。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '長文ラベル — `whitespace-nowrap` で改行せず 1 行で表示 (折返ししたい場合は親側で wrap を許可)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <Badge variant="primary" appearance="soft">とても長いラベルテキストが入る場合</Badge>
      <Badge variant="success" dot>非常に長い説明文のあるバッジ</Badge>
      <Badge variant="neutral" appearance="outline">Long English text badge example</Badge>
    </div>
  ),
};
