import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Tooltip stories — VR 集約モデル (§5-3) 移行は一部保留
 *
 * Tooltip は `open`/`defaultOpen` prop が無く hover/focus でのみ表示されるため、開状態を安定して
 * 静的に VR できない。開状態の Overview 追加は #90 (defaultOpen API) で対応予定。それまでは
 * §9-4 のスタンスに従い Playground を撮影対象に残す (closed trigger の撮影 = 退行検知の最低限)。
 * 各 story はトリガーに hover か Tab focus して開状態を確認する。
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

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'focus で即時表示 (hover は遅延)。role="tooltip" + aria-describedby、Esc で閉じる (WCAG 1.4.13) を play test で保証。',
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
