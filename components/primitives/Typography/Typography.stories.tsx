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
      options: ['heroTitle', 'pageTitle', 'sectionTitle', 'itemTitle', 'body', 'supporting', 'label', 'caption'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'legend', 'strong', 'em'],
    },
    color: {
      control: 'select',
      options: ['default', 'subtle', 'disabled', 'primary', 'success', 'error', 'warning', 'info', 'inherit'],
    },
    weight: { control: 'select', options: [undefined, 'normal', 'medium', 'bold'] },
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
  args: { variant: 'sectionTitle', as: 'h3', children: '見た目はセクション見出し、構造は h3' },
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。`as` で指定した HTML 要素が実際にレンダリングされることを play test で保証 (この例では `<h3>` タグ + type-section-title スタイル)。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // as="h3" 指定で <h3> 要素として描画される
    const heading = canvas.getByRole('heading', { level: 3 });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveTextContent('見た目はセクション見出し、構造は h3');
  },
};

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────
// 8 種類の variant を縦に積んでタイプスケールを示す。
// 「どのサイズ・装飾でどの variant を使うか」の判断材料。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: 'タイプスケール (heroTitle / pageTitle / sectionTitle / itemTitle / body / supporting / label / caption、font-size 大→小。同サイズの supporting / label は regular → medium の順) と color / weight の軸を 1 枚に集約。見出しは役割名で選び、HTML レベルは `as` で独立に決める。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* タイプスケール — font-size 大→小 / 同サイズは太→細 */}
      <div className="flex flex-col gap-4">
        <Typography variant="heroTitle">heroTitle — 48px / LP ヒーロー</Typography>
        <Typography variant="pageTitle">pageTitle — 30px / 画面のタイトル</Typography>
        <Typography variant="sectionTitle">sectionTitle — 24px / セクション・Modal</Typography>
        <Typography variant="itemTitle">itemTitle — 20px / Card・Accordion の見出し</Typography>
        <hr className="border-border-subtle" />
        <Typography variant="body">body — 16px / 読み物の本文・入力欄 (デフォルト)</Typography>
        <Typography variant="supporting">supporting — 14px / 補助説明・メニュー・通知などの UI 文言</Typography>
        <Typography variant="label">Label — 14px medium / フォームラベル</Typography>
        <Typography variant="caption">Caption — 12px / 注釈・著作権</Typography>
      </div>

      {/* color — semantic 軸 */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-onSurface-subtle">color</div>
        {(['default', 'subtle', 'disabled', 'primary', 'success', 'error', 'warning', 'info'] as const).map((color) => (
          <Typography key={color} variant="body" color={color}>{color} — テキストカラーのサンプル</Typography>
        ))}
      </div>

      {/* weight — variant デフォルトの上書き */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-onSurface-subtle">weight (variant デフォルトを上書き)</div>
        <div className="flex flex-wrap gap-4 items-baseline">
          {(['normal', 'medium', 'bold'] as const).map((weight) => (
            <Typography key={weight} variant="itemTitle" weight={weight}>{weight}</Typography>
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
          <Typography variant="itemTitle" truncate>
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
