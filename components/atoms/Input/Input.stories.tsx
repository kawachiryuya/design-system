import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: 'メールアドレス',
    placeholder: 'example@email.com',
    type: 'email',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true, helpText: 'ログインに使用します' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input size="small" label="Small" placeholder="Small" />
      <Input size="medium" label="Medium（デフォルト）" placeholder="Medium" />
      <Input size="large" label="Large" placeholder="Large" />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    error: true,
    errorMessage: '8文字以上、英数字を組み合わせてください',
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input label="検索" placeholder="検索..." leadingIcon={<SearchIcon />} />
      <Input label="メール" type="email" placeholder="example@email.com" trailingIcon={<MailIcon />} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, label: 'ユーザー名' },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export const LoginForm: Story = {
  name: '実践例: ログインフォーム',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="メールアドレス" type="email" required placeholder="example@email.com" fullWidth />
      <Input label="パスワード" type="password" required fullWidth
        error errorMessage="パスワードが正しくありません" />
    </div>
  ),
};
