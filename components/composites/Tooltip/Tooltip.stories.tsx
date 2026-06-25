import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../../primitives/Button';

/**
 * Tooltip stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview。
 * Tooltip は通常 hover/focus でのみ表示されるが、`defaultOpen` (#90 で追加) で mount 時に静的表示
 * できるため、Overview を VR 対象として撮る (bubble の見た目 + 長文折返し)。placement / icon button
 * への付与等の usage は Playground (Controls) + guideline で確認。
 * variant / size prop は無し。
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Composites/Tooltip',
  component: Tooltip,
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'radio', options: ['top', 'right', 'bottom', 'left'] },
    delay: { control: { type: 'number' } },
  },
  args: {
    content: 'クリックで詳細を表示します',
    placement: 'top',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'focus で即時表示 (hover は遅延)。Controls で content / placement / delay を切替。role="tooltip" + aria-describedby、Esc で閉じる (WCAG 1.4.13) を play test で保証。',
      },
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">ヘルプ</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'ヘルプ' });
    await expect(trigger).toHaveAttribute('aria-describedby');

    // focus で即時表示 → role=tooltip が可視
    trigger.focus();
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toBeVisible();

    // Esc で閉じる (Dismissible)
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  },
};

// ── 2. Overview (視覚回帰対象) — defaultOpen で静的表示 ──────────
// bubble の見た目 (dark / shadow / caption) と長文の max-w 折返しを撮る。
// placement は floating-ui の位置決めで bubble 自体の見た目は不変のため Playground / guideline で確認。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の開状態。`defaultOpen` で hover 不要に静的表示。短い補足と長文 (max-w で折返し) の bubble を凍結する。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-24 py-16">
      <Tooltip content="クリックで詳細を表示します" defaultOpen>
        <Button variant="secondary">短い補足</Button>
      </Tooltip>
      <Tooltip
        content="このフィールドは公開プロフィールに表示されます。後から設定でいつでも変更できます。"
        defaultOpen
      >
        <Button variant="secondary">長文 (max-w で折返し)</Button>
      </Tooltip>
    </div>
  ),
};
