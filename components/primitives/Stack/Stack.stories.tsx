import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from './Stack';
import { Caption } from '@sb-blocks/Caption';

/**
 * Stack stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Overview → EdgeCases
 * (Sizes は gap prop に内包、States は Stack に状態なし、WithIcon は icon prop なし、いずれも省略)
 *
 * Docs (Guideline) は Stack.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Stack> = {
  title: 'Primitives/Stack',
  component: Stack,
  argTypes: {
    gap: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    as: { control: 'radio', options: ['div', 'section', 'article', 'ul', 'ol', 'nav', 'form'] },
    align: { control: 'radio', options: ['start', 'center', 'end', 'stretch'] },
    className: { control: false },
    children: { control: false },
  },
  args: {
    gap: 'md',
    as: 'div',
    align: 'stretch',
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Item = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-surface border border-border-default rounded-md px-3 py-2 text-sm">
    {children}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から gap / align / as を切り替えて挙動を探索する起点。

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="w-72 bg-surface-layer-2 border border-dashed border-border-subtle p-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Stack {...args}>
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Item>Item 3</Item>
    </Stack>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls の `gap` を切り替えて間隔の差を確認、`align` で cross-axis (横方向) 配置の切替を体験。`as` で描画 HTML 要素を変えても見た目は同じ (semantic タグだけ変わる)。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Item 1')).toBeInTheDocument();
    await expect(canvas.getByText('Item 3')).toBeInTheDocument();
  },
};

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────
// 5 段階の gap を縦に並べて見比べ。"どれを使うか" の判断材料。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '5 段階の gap を横並び比較。`xs/sm/md/lg` は form / list 内部の日常用途、`xl` は段落間 / 大ブロック間に。page 内の section 分割は Stack ではなく <Section> (py-section) を使う。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
        <Caption key={g} text={`gap=${g}`}>
          <div className="w-56 bg-surface-layer-2 border border-dashed border-border-subtle p-3">
            <Stack gap={g}>
              <Item>A</Item>
              <Item>B</Item>
              <Item>C</Item>
            </Stack>
          </div>
        </Caption>
      ))}
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// align (cross-axis 配置) / semantic タグ切替 / 親幅依存挙動 / 子に Fragment を混ぜた時の挙動。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'align で cross-axis 配置 (`start/center/end`)、`as="ul"` で semantic list、Fragment 混在時の gap 維持 (space-y- ではなく gap- 実装のため壊れない) を確認。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="align=start / center / end の比較">
        <div className="grid grid-cols-3 gap-2">
          {(['start', 'center', 'end'] as const).map((a) => (
            <div key={a} className="bg-surface-layer-2 border border-dashed border-border-subtle p-3">
              <div className="text-xs text-onSurface-muted mb-2">align={a}</div>
              <Stack gap="sm" align={a}>
                <Item>短い</Item>
                <Item>少し長めの item</Item>
                <Item>もっと長めの item です</Item>
              </Stack>
            </div>
          ))}
        </div>
      </Caption>

      <Caption text="as='ul' — semantic list として描画 (見た目は同じ、SR でリストとして認識される)">
        <div className="w-72 bg-surface-layer-2 border border-dashed border-border-subtle p-3">
          <Stack gap="sm" as="ul">
            <li className="bg-surface border border-border-default rounded-md px-3 py-2 text-sm">List item 1</li>
            <li className="bg-surface border border-border-default rounded-md px-3 py-2 text-sm">List item 2</li>
            <li className="bg-surface border border-border-default rounded-md px-3 py-2 text-sm">List item 3</li>
          </Stack>
        </div>
      </Caption>

      <Caption text="Fragment / 条件付き children — gap-* 実装なので壊れない">
        <div className="w-72 bg-surface-layer-2 border border-dashed border-border-subtle p-3">
          <Stack gap="md">
            <Item>常に表示</Item>
            <>
              <Item>Fragment 内 A</Item>
              <Item>Fragment 内 B</Item>
            </>
            {true && <Item>条件付き表示</Item>}
          </Stack>
        </div>
      </Caption>
    </div>
  ),
};
