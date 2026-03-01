import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    color: { control: 'radio', options: ['neutral', 'primary'] },
    weight: { control: 'radio', options: ['thin', 'normal'] },
    label: { control: 'text' },
  },
  args: {
    orientation: 'horizontal',
    color: 'neutral',
    weight: 'thin',
  },
  decorators: [(Story) => <div className="w-80 p-4"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'または' },
};

export const PrimaryColor: Story = {
  args: { color: 'primary' },
};

export const NormalWeight: Story = {
  args: { weight: 'normal' },
};

export const Vertical: Story = {
  decorators: [
    () => (
      <div className="flex items-center gap-4 h-16">
        <span className="text-sm text-neutral-600">左コンテンツ</span>
        <Divider orientation="vertical" />
        <span className="text-sm text-neutral-600">右コンテンツ</span>
      </div>
    ),
  ],
};

export const LoginDivider: Story = {
  name: '実践例: ログインフォームの仕切り',
  decorators: [
    () => (
      <div className="flex flex-col gap-4 w-80">
        <button type="button"
          className="w-full py-2 px-4 border border-neutral-300 rounded flex items-center justify-center gap-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google でログイン
        </button>
        <Divider label="または" />
        <div className="flex flex-col gap-3">
          <input type="email" placeholder="メールアドレス"
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200" />
          <input type="password" placeholder="パスワード"
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200" />
        </div>
      </div>
    ),
  ],
};

export const SectionDivider: Story = {
  name: '実践例: セクション区切り',
  decorators: [
    () => (
      <div className="flex flex-col gap-4 w-80">
        <h3 className="text-base font-medium text-neutral-800">基本情報</h3>
        <p className="text-sm text-neutral-600">名前・メールアドレスを設定します。</p>
        <Divider />
        <h3 className="text-base font-medium text-neutral-800">通知設定</h3>
        <p className="text-sm text-neutral-600">通知の受け取り方を設定します。</p>
      </div>
    ),
  ],
};
