import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Cluster } from './Cluster';
import { Caption } from '@sb-blocks/Caption';

/**
 * Cluster stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Overview → EdgeCases
 */
const meta: Meta<typeof Cluster> = {
  title: 'Primitives/Cluster',
  component: Cluster,
  argTypes: {
    gap: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    as: { control: 'radio', options: ['div', 'section', 'ul', 'ol', 'nav'] },
    align: { control: 'radio', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'radio', options: ['start', 'center', 'end', 'between', 'around'] },
    className: { control: false },
    children: { control: false },
  },
  args: {
    gap: 'sm',
    as: 'div',
    align: 'center',
    justify: 'start',
  },
};

export default meta;
type Story = StoryObj<typeof Cluster>;

const Item = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-surface border border-border-default rounded-md px-3 py-2 text-sm">
    {children}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="w-96 bg-surface-layer-2 border border-dashed border-border-subtle p-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Cluster {...args}>
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Item>Item 3</Item>
      <Item>Item 4</Item>
    </Cluster>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls の `gap` / `align` / `justify` を切り替えて配置の差を確認。親幅 (24rem = 384px) より長い場合は折り返す (常に flex-wrap)。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Item 1')).toBeInTheDocument();
    await expect(canvas.getByText('Item 4')).toBeInTheDocument();
  },
};

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '6 段階の gap、5 種の justify、5 種の align を順に比較。Cluster は常に flex-wrap、画面端で折り返す。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="gap — xs (4px) から 2xl (48px) まで">
        <div className="flex flex-col gap-3">
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((g) => (
            <div key={g} className="flex items-center gap-2">
              <div className="w-16 text-xs text-onSurface-muted font-mono">gap={g}</div>
              <div className="bg-surface-layer-2 border border-dashed border-border-subtle p-2 flex-1">
                <Cluster gap={g}>
                  <Item>A</Item>
                  <Item>B</Item>
                  <Item>C</Item>
                </Cluster>
              </div>
            </div>
          ))}
        </div>
      </Caption>

      <Caption text="justify — main-axis (= horizontal) 配置">
        <div className="flex flex-col gap-2">
          {(['start', 'center', 'end', 'between', 'around'] as const).map((j) => (
            <div key={j} className="flex items-center gap-2">
              <div className="w-20 text-xs text-onSurface-muted font-mono">justify={j}</div>
              <div className="bg-surface-layer-2 border border-dashed border-border-subtle p-2 flex-1">
                <Cluster gap="sm" justify={j}>
                  <Item>A</Item>
                  <Item>B</Item>
                  <Item>C</Item>
                </Cluster>
              </div>
            </div>
          ))}
        </div>
      </Caption>

      <Caption text="align — cross-axis (= vertical) 配置 (子要素の高さがバラバラの時に効く)">
        <div className="flex flex-col gap-2">
          {(['start', 'center', 'end', 'stretch', 'baseline'] as const).map((a) => (
            <div key={a} className="flex items-center gap-2">
              <div className="w-20 text-xs text-onSurface-muted font-mono">align={a}</div>
              <div className="bg-surface-layer-2 border border-dashed border-border-subtle p-2 flex-1">
                <Cluster gap="sm" align={a}>
                  <div className="bg-surface border border-border-default rounded-md px-3 py-1 text-sm">短い</div>
                  <div className="bg-surface border border-border-default rounded-md px-3 py-3 text-lg">高め</div>
                  <div className="bg-surface border border-border-default rounded-md px-3 py-2 text-sm">中</div>
                </Cluster>
              </div>
            </div>
          ))}
        </div>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases (VR 対象) ─────────────────────────────────────
// props だけでは作れない文脈依存: 親幅が狭いときの折返し (常に flex-wrap)。
// ※ as=nav (semantic) / header・icon+label (usage 合成) / Fragment (堅牢性) は VR から除外。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'wrap — 親幅が狭くなると折り返す (常に flex-wrap)。コンテナ幅依存の文脈ケース。',
      },
    },
  },
  render: () => (
    <div className="w-72 bg-surface-layer-2 border border-dashed border-border-subtle p-3">
      <Cluster gap="sm">
        {Array.from({ length: 10 }, (_, i) => (
          <Item key={i}>Item {i + 1}</Item>
        ))}
      </Cluster>
    </div>
  ),
};
