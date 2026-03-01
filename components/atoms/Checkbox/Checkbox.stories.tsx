import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: '利用規約に同意する',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');

    // 初期状態：未チェック
    await expect(checkbox).not.toBeChecked();

    // クリックでチェック
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // 再クリックで解除
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: 'マーケティングメールを受け取る',
    description: '新機能やキャンペーン情報をメールでお知らせします',
  },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '全て選択' },
};

export const ErrorState: Story = {
  args: { error: true, errorMessage: '続けるには同意が必要です' },
};

export const Disabled: Story = {
  args: { disabled: true, label: '変更できない設定' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="small" label="Small" defaultChecked />
      <Checkbox size="medium" label="Medium（デフォルト）" defaultChecked />
      <Checkbox size="large" label="Large" defaultChecked />
    </div>
  ),
};

export const CheckboxGroup: Story = {
  name: '実践例: チェックボックスグループ',
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const options = [
      { value: 'email', label: 'メール通知', description: '重要なお知らせをメールで受け取る' },
      { value: 'push', label: 'プッシュ通知', description: 'ブラウザの通知を受け取る' },
      { value: 'sms', label: 'SMS通知', description: '緊急時のみSMSで通知' },
    ];
    const toggle = (v: string) =>
      setSelected((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-neutral-800 mb-2">通知設定</legend>
        {options.map(({ value, label, description }) => (
          <Checkbox key={value} label={label} description={description}
            checked={selected.includes(value)}
            onChange={() => toggle(value)} />
        ))}
      </fieldset>
    );
  },
};
