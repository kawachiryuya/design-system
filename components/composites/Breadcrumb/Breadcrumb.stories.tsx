import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';
import { Caption } from '@sb-blocks/Caption';

/**
 * Breadcrumb stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * Overview は Breadcrumb 唯一の視覚軸 separator (3 種) のみを凍結する。
 * 以下は Playground (Controls) で再現でき固有の視覚シグナルも足さないため VR では撮らない:
 *   - 階層数 / 単一階層: items を増減すれば見える。separator 行が最後の項目の見た目を兼ねる
 *   - 長文ラベルの truncate: ラベルを伸ばせば内蔵 `max-w-[200px]` + 省略が見える (長文は Playground の役目)
 *   - link hover/focus: interaction 状態。focus-ring は Button/Link 側で VR 済み
 */
const sampleItems = [
  { label: 'ホーム', href: '/' },
  { label: 'ブログ', href: '/blog' },
  { label: 'デザインシステム', href: '/blog/design-system' },
  { label: 'Atomic Design とは' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Composites/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: { control: 'radio', options: ['chevron', 'slash', 'dot'] },
    ariaLabel: { control: 'text' },
  },
  args: {
    items: sampleItems,
    separator: 'chevron',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から separator / ariaLabel を切替。最後の項目は href なしで自動的に `aria-current="page"` 付与。',
      },
    },
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// Breadcrumb 唯一の視覚軸 separator (3 種・多段で代表) のみを凍結。
// 階層数 / 長文 truncate / link hover-focus は Controls で再現でき固有シグナルも足さないため撮らない (冒頭コメント参照)。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。Breadcrumb 唯一の視覚軸 separator (chevron/slash/dot、多段で代表) を凍結する。階層数・長文 truncate・link hover/focus は Controls で再現できるため撮らない。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['chevron', 'slash', 'dot'] as const).map((sep) => (
        <Caption key={sep} text={`separator="${sep}"`}>
          <Breadcrumb items={sampleItems} separator={sep} />
        </Caption>
      ))}
    </div>
  ),
};
