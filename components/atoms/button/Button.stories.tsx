import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
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

export const Default: Story = {};

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

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button icon={<SaveIcon />}>左アイコン</Button>
      <Button icon={<SaveIcon />} iconPosition="right">右アイコン</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { isLoading: true, children: '保存中...' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'ログイン' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const ModalButtons: Story = {
  name: '実践例: モーダルのボタン配置',
  render: () => (
    <div className="flex justify-end gap-3">
      <Button variant="secondary">キャンセル</Button>
      <Button variant="primary">保存</Button>
    </div>
  ),
};
