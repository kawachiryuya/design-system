import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import { Button } from '../button/Button';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'xs=12px / sm=16px / md=20px / lg=24px / xl=32px / 2xl=48px',
    },
    color: { control: 'radio', options: ['primary', 'neutral', 'white'] },
    label: { control: 'text', description: 'スクリーンリーダー用ラベル' },
  },
  args: {
    size: 'md',
    color: 'primary',
    label: '読み込み中',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} label="読み込み中" />
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="primary" label="読み込み中" />
        <span className="text-xs text-neutral-500">primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="neutral" label="読み込み中" />
        <span className="text-xs text-neutral-500">neutral</span>
      </div>
      <div className="flex flex-col items-center gap-2 bg-neutral-800 p-4 rounded">
        <Spinner size="lg" color="white" label="読み込み中" />
        <span className="text-xs text-neutral-400">white</span>
      </div>
    </div>
  ),
};

export const InlineWithText: Story = {
  name: 'テキストと組み合わせ',
  render: () => (
    <div className="flex items-center gap-2 text-neutral-600">
      <Spinner size="sm" color="neutral" label="読み込み中" />
      <span className="text-sm">データを読み込んでいます...</span>
    </div>
  ),
};

export const OnButton: Story = {
  name: '実践例: ボタンのローディング状態',
  render: () => (
    <div className="flex gap-3">
      <Button isLoading>保存中...</Button>
      <Button variant="tertiary" disabled>
        <span className="flex items-center gap-2">
          <Spinner size="xs" color="primary" label="処理中" />
          処理中...
        </span>
      </Button>
    </div>
  ),
};

export const FullPageOverlay: Story = {
  name: '実践例: フルページローディング',
  render: () => (
    <div className="relative w-64 h-40 bg-neutral-100 rounded overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-3 rounded">
        <Spinner size="xl" color="primary" label="読み込み中" />
        <p className="text-sm text-neutral-600">データを取得中...</p>
      </div>
    </div>
  ),
};
