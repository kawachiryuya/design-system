import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    rows: { control: { type: 'number', min: 2, max: 20 } },
    maxLength: { control: 'number' },
    resize: { control: 'radio', options: ['none', 'vertical', 'horizontal', 'both'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: 'お問い合わせ内容',
    placeholder: 'ご質問・ご要望をご記入ください',
    rows: 4,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true, helpText: '具体的にご記入いただくと回答がスムーズです' },
};

export const WithCharCounter: Story = {
  args: { maxLength: 200, required: true },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)}
        currentLength={value.length} />
    );
  },
};

export const NearLimit: Story = {
  name: '文字数制限に近い状態（警告表示）',
  render: () => {
    const text = 'A'.repeat(185);
    return (
      <Textarea label="自己紹介" maxLength={200} currentLength={text.length}
        value={text} onChange={() => {}} rows={4} />
    );
  },
};

export const AtLimit: Story = {
  name: '文字数上限（エラー表示）',
  render: () => {
    const text = 'A'.repeat(200);
    return (
      <Textarea label="自己紹介" maxLength={200} currentLength={text.length}
        value={text} onChange={() => {}} rows={4} />
    );
  },
};

export const ErrorState: Story = {
  args: { error: true, errorMessage: '内容を入力してください', required: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '受付番号: 20260221-001' },
};

export const NoResize: Story = {
  args: { resize: 'none', helpText: 'サイズは固定です' },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export const ContactForm: Story = {
  name: '実践例: お問い合わせフォーム',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-96">
        <Textarea label="お問い合わせ内容" required fullWidth
          placeholder="ご質問・ご要望をご記入ください" rows={6}
          maxLength={500} currentLength={value.length}
          value={value} onChange={(e) => setValue(e.target.value)}
          helpText="担当者より2営業日以内にご返信します" />
      </div>
    );
  },
};
