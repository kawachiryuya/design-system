import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { Button } from './Button';
import { Icon } from '../Icon';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'ボタンの優先度。1画面に Primary は1つまで。',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['left', 'right'] },
    children: { control: 'text' },
  },
  args: {
    children: '保存',
    variant: 'primary',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // クリックでハンドラーが呼ばれる
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  ),
};

export const States: Story = {
  name: '全バリアント × 状態',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary', 'tertiary'] as const).map((v) => (
        <div key={v} className="flex items-center gap-3">
          <span className="w-20 text-xs text-neutral-500">{v}</span>
          <Button variant={v}>通常</Button>
          <Button variant={v} isLoading>保存</Button>
          <Button variant={v} disabled>無効</Button>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');

    // loading ボタン: disabled
    await expect(buttons[1]).toBeDisabled();

    // disabled ボタン: disabled 属性
    await expect(buttons[2]).toBeDisabled();
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  name: 'Full Width（通常との比較）',
  render: () => (
    <div className="w-80 flex flex-col gap-3 items-start">
      <Button>通常幅</Button>
      <Button fullWidth>fullWidth: 親の横幅いっぱい</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button icon={<Icon name="check_circle" size="sm" />}>左アイコン</Button>
      <Button icon={<Icon name="check_circle" size="sm" />} iconPosition="right">右アイコン</Button>
    </div>
  ),
};

export const ShortLabel: Story = {
  name: '短いラベル（min-width 確認）',
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="small">OK</Button>
      <Button size="medium">OK</Button>
      <Button size="large">OK</Button>
    </div>
  ),
};

