import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * VisuallyHidden stories — VR 集約モデル (§5-3) の例外
 *
 * VisuallyHidden は **視覚的に何も描画しない** (`sr-only`) ため、視覚回帰で撮るものが無い。
 * よって Overview / EdgeCases は持たず、Playground (Controls 探索・撮影外) のみ。
 * 主要な統合パターン (icon-only Button / form label / aria-live) は guideline の「使用例」に保持。
 *
 * Docs (Guideline) は VisuallyHidden.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof VisuallyHidden> = {
  title: 'Primitives/VisuallyHidden',
  component: VisuallyHidden,
  argTypes: {
    as: { control: 'radio', options: ['span', 'div', 'p', 'label'] },
    children: { control: 'text' },
    htmlFor: { control: 'text' },
  },
  args: {
    children: 'スクリーンリーダ専用テキスト',
    as: 'span',
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────
// 視覚的には何も見えないので、上下に説明テキストを decorator で添える。

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-onSurface-muted">
          下の <code>VisuallyHidden</code> はブラウザに見えないが、VoiceOver / NVDA 等では読み上げられる:
        </p>
        <Story />
        <p className="text-sm text-onSurface-muted">↑ ここに非表示テキスト</p>
      </div>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '視覚的には見えないが DOM にテキストが存在し、`sr-only` クラスが当たることを play test で保証。VisuallyHidden は不可視のため視覚回帰の撮影対象 (Overview/EdgeCases) は持たない。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hidden = canvas.getByText('スクリーンリーダ専用テキスト');
    await expect(hidden).toBeInTheDocument();
    await expect(hidden).toHaveClass('sr-only');
  },
};
