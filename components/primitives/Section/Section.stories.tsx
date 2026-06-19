import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Section } from './Section';
import { Center } from '../Center';
import { Caption } from '@sb-blocks/Caption';

/**
 * Section stories — 標準ストーリー構造に準拠 (Playground / Variants / EdgeCases)
 *
 * - States 省略: 状態を持たない layout primitive のため (AGENTS.md §5-3 注)
 * - Sizes 省略: size prop なし (`padding` 段階は Variants で扱う)
 * - WithIcon 省略: icon prop なし
 */
const meta: Meta<typeof Section> = {
  title: 'Primitives/Section',
  component: Section,
  argTypes: {
    padding: { control: 'radio', options: ['none', 'sm', 'md', 'lg'] },
    as: { control: 'radio', options: ['section', 'div', 'article', 'aside', 'main'] },
    className: { control: false },
    children: { control: false },
  },
  args: {
    padding: 'md',
    as: 'section',
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

const Block = ({ label }: { label: string }) => (
  <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
    {label}
  </div>
);

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-surface-layer-2 border border-dashed border-border-subtle">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Section {...args}>
      <Center max="md">
        <Block label="Section の中身 (内側 Center max=md で読み列を絞る)" />
      </Center>
    </Section>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls の `padding` を切り替えて上下余白 (py-section) の差を確認。Section は full-width、横幅は内側 Center が絞る。dashed の親が Section の領域 (= 画面端まで full-width)。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Section の中身/)).toBeInTheDocument();
  },
};

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '`padding` 4 段 (none / sm 32 / md 64 / lg 96)。隣接 section の padding が積み上がってリズムが生まれる (Model α = padding 所有)。`none` は親が gap を持つ場合の脱出口。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
        <Caption key={p} text={`padding="${p}"`}>
          <div className="bg-surface-layer-2 border border-dashed border-border-subtle">
            <Section padding={p}>
              <Center max="md">
                <Block label={`padding=${p}`} />
              </Center>
            </Section>
          </div>
        </Caption>
      ))}
    </div>
  ),
};

// EdgeCases は省略 — props だけでは作れない文脈依存の崩れが無いため (§5-3)。
// full-bleed 背景 + Center / 隣接 section の padding リズムは usage 合成 (guideline 向き)、
// as=div は semantic で非視覚のため VR 対象外。
