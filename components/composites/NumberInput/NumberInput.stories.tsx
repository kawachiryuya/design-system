import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { NumberInput } from './NumberInput';
import { Caption } from '@sb-blocks/Caption';

/**
 * NumberInput stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * size (sm/md) と states (default/at-min/at-max/disabled/no-label/3桁) を Overview に集約。
 * 予約フォーム等の usage 合成・カスタム aria-label (非視覚) は guideline の「使用例」へ移設。
 * variant / icon prop は無し。
 */
const meta: Meta<typeof NumberInput> = {
  title: 'Composites/NumberInput',
  component: NumberInput,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
  },
  args: {
    size: 'md',
    disabled: false,
    label: '数量',
    min: 0,
    max: 10,
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  args: { onChange: fn() },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から size / disabled / min / max / label を切替。`+` ボタン click で onChange が呼ばれることを play test で保証。',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [v, setV] = useState(1);
      return (
        <NumberInput
          {...args}
          value={v}
          onChange={(n) => { setV(n); args.onChange(n); }}
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const incBtn = canvas.getByRole('button', { name: '増やす' });
    await userEvent.click(incBtn);
    await expect(args.onChange).toHaveBeenCalledWith(2);
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// size (sm/md) と states。value は controlled なので静的値 + no-op onChange で凍結。
// 3 桁は display 領域 (w-10 固定) が桁増でも崩れないことの確認。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。size (sm 40px / md 48px) と states (default / at-min で − disabled / at-max で + disabled / disabled / label なし / 3 桁) を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm 40px / md 48px、md 以上で WCAG 2.5.5 タッチターゲット達成)</div>
        <div className="flex flex-col gap-4 items-start">
          <Caption text="sm (40px)"><NumberInput value={3} onChange={() => {}} size="sm" min={1} max={9} label="サイズ sm" /></Caption>
          <Caption text="md (48px)"><NumberInput value={3} onChange={() => {}} size="md" min={1} max={9} label="サイズ md" /></Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">states</div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <Caption text="Default"><NumberInput value={3} onChange={() => {}} min={1} max={5} label="数量" /></Caption>
          <Caption text="At min (− disabled)"><NumberInput value={1} onChange={() => {}} min={1} max={5} label="最小値" /></Caption>
          <Caption text="At max (+ disabled)"><NumberInput value={5} onChange={() => {}} min={1} max={5} label="最大値" /></Caption>
          <Caption text="Disabled (両方)"><NumberInput value={2} onChange={() => {}} min={1} max={5} label="無効" disabled /></Caption>
          <Caption text="Without label"><NumberInput value={1} onChange={() => {}} min={1} max={9} /></Caption>
          <Caption text="3 桁 (display は w-10 固定で崩れない)"><NumberInput value={99} onChange={() => {}} min={1} max={999} label="3 桁" /></Caption>
        </div>
      </div>
    </div>
  ),
};
