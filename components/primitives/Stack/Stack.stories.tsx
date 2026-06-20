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
// props で作れる内在軸を集約: gap (5 段) + align (cross-axis 4 種)。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: 'gap (5 段) と align (cross-axis) を集約。`xs/sm/md/lg` は form / list 内部、`xl` は段落間 / 大ブロック間。page 内の section 分割は Stack でなく <Section> (py-section) を使う。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">gap (xs / sm / md / lg / xl)</div>
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
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">align (cross-axis: start / center / end / stretch)</div>
        <div className="grid grid-cols-4 gap-2">
          {(['start', 'center', 'end', 'stretch'] as const).map((a) => (
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
      </div>
    </div>
  ),
};

// EdgeCases は省略 — props だけでは作れない文脈依存の崩れが無いため (§5-3)。
// align は内在軸として Overview に集約。as=ul (semantic) / Fragment (堅牢性) は VR 対象外。
