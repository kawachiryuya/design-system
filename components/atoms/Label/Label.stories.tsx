import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'メールアドレス',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Optional: Story = {
  args: { children: 'ニックネーム', optional: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label size="small" required>Small（12px）</Label>
      <Label size="medium" required>Medium（14px）— デフォルト</Label>
      <Label size="large" required>Large（16px）</Label>
    </div>
  ),
};

export const WithFormField: Story = {
  name: '実践例: フォームフィールドとの組み合わせ',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex flex-col gap-1">
        <Label htmlFor="email-ex" required>メールアドレス</Label>
        <input id="email-ex" type="email" placeholder="example@email.com"
          className="block w-full rounded border border-neutral-300 px-3 py-2 text-base text-neutral-800 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-300" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="nick-ex" optional>ニックネーム</Label>
        <input id="nick-ex" type="text"
          className="block w-full rounded border border-neutral-300 px-3 py-2 text-base text-neutral-800 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-300" />
      </div>
    </div>
  ),
};
