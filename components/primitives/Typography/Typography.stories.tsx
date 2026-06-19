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
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'label', 'caption'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'legend', 'strong', 'em'],
    },
    color: {
      control: 'select',
      options: ['default', 'subdued', 'muted', 'disabled', 'primary', 'success', 'error', 'warning', 'info', 'inherit'],
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
        story: 'タイプスケール (display / h1〜h4 / body-lg / body / body-sm / label / caption、font-size 大→小。同サイズの body-sm/label は body グループをまとめる方針で body-sm→label) と color / weight の軸を 1 枚に集約。h5/h6 は h4 との視覚差が小さいため variant には無く、`as="h5"` でタグだけ指定して `variant="h4"` を流用する。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* タイプスケール — font-size 大→小 / 同サイズは太→細 */}
      <div className="flex flex-col gap-4">
        <Typography variant="display">Display — 48px / ヒーロー</Typography>
        <Typography variant="h1">H1 — ページタイトル</Typography>
        <Typography variant="h2">H2 — セクション見出し</Typography>
        <Typography variant="h3">H3 — サブセクション</Typography>
        <Typography variant="h4">H4 — カードタイトル / 小見出し</Typography>
        <hr className="border-border-subtle" />
        <Typography variant="body-lg">Body Large — 18px / リード文</Typography>
        <Typography variant="body">Body — 16px / 本文 (デフォルト)</Typography>
        <Typography variant="body-sm">Body Small — 14px / 補足</Typography>
        <Typography variant="label">Label — 14px medium / フォームラベル</Typography>
        <Typography variant="caption">Caption — 12px / 注釈・著作権</Typography>
      </div>

      {/* color — semantic 軸 */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-onSurface-muted">color</div>
        {(['default', 'subdued', 'muted', 'disabled', 'primary', 'success', 'error', 'warning', 'info'] as const).map((color) => (
          <Typography key={color} variant="body" color={color}>{color} — テキストカラーのサンプル</Typography>
        ))}
      </div>

      {/* weight — variant デフォルトの上書き */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-onSurface-muted">weight (variant デフォルトを上書き)</div>
        <div className="flex flex-wrap gap-4 items-baseline">
          {(['normal', 'medium', 'semibold', 'bold'] as const).map((weight) => (
            <Typography key={weight} variant="h4" weight={weight}>{weight}</Typography>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (VR 対象) ─────────────────────────────────────
// props だけでは作れない文脈依存: truncate (親 width 依存) / 長文の折返し。
// ※ color / weight は prop = 内在軸なので Overview に集約。
// ※ polymorphic (variant vs as) は見た目に出ない (semantic だけの差) ため VR からは外す。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'props だけでは作れない文脈依存: truncate (1 行省略は親 width 依存) / 長文の折返し。color / weight は Overview を参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 max-w-prose">
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
    </div>
  ),
};
