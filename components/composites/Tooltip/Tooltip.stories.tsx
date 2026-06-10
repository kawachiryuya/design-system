import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Tooltip stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Placements → OnIconButton → LongText
 *
 * variant / size prop なしのため Variants / Sizes は省略 (§5-3)。
 * hover / focus で表示されるため、各 story はトリガーに hover か Tab focus して確認する。
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Composites/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'focus で即時表示 (hover は遅延)。role="tooltip" + aria-describedby、Esc で閉じる (WCAG 1.4.13) を play test で保証。',
      },
    },
  },
  render: () => (
    <Tooltip content="クリックで詳細を表示します">
      <Button variant="secondary">ヘルプ</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'ヘルプ' });
    await expect(trigger).toHaveAttribute('aria-describedby');

    // focus で即時表示 → role=tooltip が可視・内容一致
    trigger.focus();
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toBeVisible();
    await expect(tip).toHaveTextContent('クリックで詳細を表示します');

    // Esc で閉じる (Dismissible)
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  },
};

// ── 2. Placements ──────────────────────────────────────────────

export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story: 'placement で配置を指定。視界からはみ出す場合は flip / shift で自動補正される。hover か Tab focus で確認。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6 p-8">
      {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
        <Caption key={p} text={p}>
          <Tooltip content={`placement = ${p}`} placement={p}>
            <Button variant="secondary">{p}</Button>
          </Tooltip>
        </Caption>
      ))}
    </div>
  ),
};

// ── 3. OnIconButton ────────────────────────────────────────────

export const OnIconButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'アイコンのみのボタンに補足を添える典型用途。Button は `aria-label` で名前を、Tooltip は `aria-describedby` で補足を提供する (役割が別)。',
      },
    },
  },
  render: () => (
    <div className="flex gap-3">
      <Tooltip content="お気に入りに追加">
        <Button iconOnly icon={<Icon name="favorite" />} aria-label="お気に入りに追加" variant="tertiary" />
      </Tooltip>
      <Tooltip content="ヘルプを表示">
        <Button iconOnly icon={<Icon name="help" />} aria-label="ヘルプ" variant="tertiary" />
      </Tooltip>
      <Tooltip content="この操作は取り消せません">
        <Button iconOnly icon={<Icon name="warning" />} aria-label="警告" variant="tertiary" />
      </Tooltip>
    </div>
  ),
};

// ── 4. LongText ────────────────────────────────────────────────

export const LongText: Story = {
  parameters: {
    docs: {
      description: {
        story: '長めの補足は max-width で折り返す。ただし tooltip は短い補足向け — 長文や操作が要るなら Popover を使う。',
      },
    },
  },
  render: () => (
    <Tooltip content="このフィールドは公開プロフィールに表示されます。後から設定でいつでも変更できます。">
      <Button variant="secondary">表示名</Button>
    </Tooltip>
  ),
};
