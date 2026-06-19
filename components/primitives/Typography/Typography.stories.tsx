import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Typography } from './Typography';
import { Caption } from '@sb-blocks/Caption';

/**
 * Typography stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Overview → EdgeCases
 * (Sizes は variant に内包、States は Typography に状態なし、WithIcon は icon prop なし、すべて省略)
 *
 * Docs (Guideline) は Typography.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Typography> = {
  title: 'Primitives/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption', 'label'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'legend', 'strong', 'em'],
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'disabled', 'primary', 'success', 'error', 'warning', 'info', 'inherit'],
    },
    weight: { control: 'select', options: [undefined, 'normal', 'medium', 'semibold', 'bold'] },
    truncate: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'デザインシステム',
    variant: 'body',
    color: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// 「visual style と HTML 要素の分離 (variant vs as)」を play test で保証。

export const Playground: Story = {
  args: { variant: 'h2', as: 'h3', children: '見た目は h2、構造は h3' },
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。`as` で指定した HTML 要素が実際にレンダリングされることを play test で保証 (この例では `<h3>` タグ + text-heading-lg スタイル)。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // as="h3" 指定で <h3> 要素として描画される
    const heading = canvas.getByRole('heading', { level: 3 });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveTextContent('見た目は h2、構造は h3');
  },
};

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────
// 12 種類の variant を縦に積んでタイプスケールを示す。
// 「どのサイズ・装飾でどの variant を使うか」の判断材料。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: 'display / h1〜h4 / body-lg / body / body-sm / caption / label の 10 種類のタイプスケール。`variant` は font-size + line-height + デフォルト font-weight を一括で決める。h5/h6 は h4 との視覚差が小さいため API からは除外 (深い階層は `as="h5"` でタグだけ指定して `variant="h4"` を流用)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="display">Display — 64px / ヒーロー</Typography>
      <Typography variant="h1">H1 — ページタイトル</Typography>
      <Typography variant="h2">H2 — セクション見出し</Typography>
      <Typography variant="h3">H3 — サブセクション</Typography>
      <Typography variant="h4">H4 — カードタイトル / 小見出し</Typography>
      <hr className="border-border-subtle" />
      <Typography variant="body-lg">Body Large — 18px / リード文</Typography>
      <Typography variant="body">Body — 16px / 本文 (デフォルト)</Typography>
      <Typography variant="body-sm">Body Small — 14px / 補足</Typography>
      <Typography variant="caption">Caption — 12px / 注釈・著作権</Typography>
      <Typography variant="label">Label — 14px / フォームラベル</Typography>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// 色 / polymorphic / truncate / 長文折返し / weight 上書き など、
// variant の主軸とは別の dimension や視覚的に壊れやすいケースの監視用。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '色のセマンティック軸 / variant と as の分離 (polymorphic) / truncate (1 行省略) / 長文折返し / weight 上書きなど、variant 主軸の外側で確認すべきケース。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 max-w-prose">
      <Caption text="全 color — semantic 軸 (default/muted/disabled/primary/success/error/warning/info)">
        <div className="flex flex-col gap-1">
          {(['default', 'muted', 'disabled', 'primary', 'success', 'error', 'warning', 'info'] as const).map((color) => (
            <Typography key={color} variant="body" color={color}>
              {color} — テキストカラーのサンプル
            </Typography>
          ))}
        </div>
      </Caption>

      <Caption text="polymorphic — visual=h2 / semantic=h3 (見た目と意味を分離)">
        <Typography variant="h2" as="h3">サイドバーの見出し (h2 の見た目で h3 タグ)</Typography>
      </Caption>

      <Caption text="truncate — 1 行省略 (...) は親の width で機能">
        <div className="w-64 border border-dashed border-border-subtle p-2">
          <Typography variant="h4" truncate>
            非常に長いカードタイトルが入る場合に truncate で省略される
          </Typography>
        </div>
      </Caption>

      <Caption text="長文折返し — body 系の line-height で読みやすく">
        <Typography variant="body">
          デザインシステムは、デザインとエンジニアリングのチーム間で共有される単一の真実を提供する基盤。
          一貫した語彙とコンポーネントを共有することで、コラボレーションが円滑になり、品質が安定する。
        </Typography>
      </Caption>

      <Caption text="weight 上書き — variant=h2 (デフォルト bold) に weight=normal で軽量化">
        <Typography variant="h2" weight="normal">軽量化された見出し</Typography>
      </Caption>
    </div>
  ),
};
