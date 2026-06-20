import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Switch } from './Switch';
import { Caption } from '@sb-blocks/Caption';

/**
 * Switch stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * off/on × interaction (hover/focus は pseudo 強制) + labelPosition + description を Overview に集約。
 * 設定パネル (left label + justify-between 全幅) 等の usage 合成は guideline の「使用例」へ移設。
 * size / variant prop は無し (track 44×24 md 1 サイズ統一)。
 */
const meta: Meta<typeof Switch> = {
  title: 'Composites/Switch',
  component: Switch,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelPosition: { control: 'radio', options: ['left', 'right'] },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    label: 'ダークモード',
    labelPosition: 'right',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から label / labelPosition / checked / disabled を切替。click で aria-checked が反転することを play test で保証。',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [c, setC] = useState(args.checked ?? false);
      return <Switch {...args} checked={c} onChange={setC} />;
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// off/on × interaction (hover/focus は pseudo 強制) + labelPosition + description。

export const Overview: Story = {
  parameters: {
    pseudo: {
      hover: ['#sw-hover button'],
      focusVisible: ['#sw-focus button'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。off / on / disabled(off/on) のトラック状態、hover / focus-visible、labelPosition (left/right)、description を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="Off (default)"><Switch label="Off" /></Caption>
      <Caption text="On (checked)"><Switch label="On" checked /></Caption>
      <Caption text="Disabled (off / on)">
        <div className="flex gap-6">
          <Switch label="無効 off" disabled />
          <Switch label="無効 on" checked disabled />
        </div>
      </Caption>
      <Caption text="Label position: left"><Switch label="ラベル左" labelPosition="left" /></Caption>
      <Caption text="With description (ラベル下に補足)">
        <Switch label="メール通知" description="キャンペーン・お知らせをメールで受信" checked />
      </Caption>
      <Caption text="Hover (pseudo 強制)">
        <div id="sw-hover"><Switch label="Hover" /></div>
      </Caption>
      <Caption text="Focus-visible (pseudo 強制)">
        <div id="sw-focus"><Switch label="Focus" /></div>
      </Caption>
    </div>
  ),
};
