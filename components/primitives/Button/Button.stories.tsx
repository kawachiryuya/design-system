import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { Button } from './Button';

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
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
      <Button variant="quaternary">Quaternary</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button isLoading>保存中...</Button>
      <Button disabled>無効</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');

    // loading ボタン: disabled + 「読み込み中...」テキスト
    await expect(buttons[0]).toBeDisabled();
    await expect(canvas.getByText('読み込み中...')).toBeInTheDocument();

    // disabled ボタン: disabled 属性
    await expect(buttons[1]).toBeDisabled();
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
  args: { fullWidth: true, children: 'ログイン' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button icon={<SaveIcon />}>左アイコン</Button>
      <Button icon={<SaveIcon />} iconPosition="right">右アイコン</Button>
    </div>
  ),
};

