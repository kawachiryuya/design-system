import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Composites/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'radio', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy', 'away'] },
    src: { control: 'text' },
    name: { control: 'text' },
  },
  args: {
    name: '田中 太郎',
    size: 'md',
    shape: 'circle',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    name: '田中 太郎',
    alt: '田中 太郎のプロフィール写真',
  },
};

export const InitialsFallback: Story = {
  name: 'イニシャルフォールバック（src なし）',
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar name="田中 太郎" />
      <Avatar name="Yamada Hanako" />
      <Avatar name="佐藤" />
      <Avatar name="John Smith" />
      <Avatar name="木村" />
    </div>
  ),
};

export const ImageError: Story = {
  name: '画像読み込みエラー → イニシャルフォールバック',
  args: {
    src: 'https://invalid-url-that-will-fail.example.com/image.jpg',
    name: '田中 太郎',
  },
};

export const NoSrcNoName: Story = {
  name: 'src も name もない（プレースホルダー）',
  args: { name: undefined },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size} name="田中 太郎" src="https://i.pravatar.cc/150?img=5" />
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="circle" size="lg" name="田中 太郎" src="https://i.pravatar.cc/150?img=7" />
        <span className="text-xs text-neutral-500">circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="lg" name="田中 太郎" src="https://i.pravatar.cc/150?img=7" />
        <span className="text-xs text-neutral-500">square</span>
      </div>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      {(['online', 'offline', 'busy', 'away'] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <Avatar size="lg" name="田中 太郎" status={status}
            src="https://i.pravatar.cc/150?img=8" />
          <span className="text-xs text-neutral-500">{status}</span>
        </div>
      ))}
    </div>
  ),
};

export const UserCard: Story = {
  name: '実践例: ユーザーカード',
  render: () => (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 w-64">
      <Avatar src="https://i.pravatar.cc/150?img=12" name="鈴木 花子" size="md" status="online" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">鈴木 花子</p>
        <p className="text-xs text-neutral-500 truncate">suzuki@example.com</p>
      </div>
    </div>
  ),
};

export const AvatarGroup: Story = {
  name: '実践例: アバターグループ',
  render: () => (
    <div className="flex -space-x-3">
      {[
        { src: 'https://i.pravatar.cc/150?img=1', name: 'Alice' },
        { src: 'https://i.pravatar.cc/150?img=2', name: 'Bob' },
        { src: 'https://i.pravatar.cc/150?img=3', name: 'Carol' },
        { name: 'Dave' },
      ].map(({ src, name }) => (
        <Avatar key={name} src={src} name={name} size="sm"
          className="ring-2 ring-white" />
      ))}
      <span className="w-8 h-8 rounded-full bg-neutral-200 ring-2 ring-white
        flex items-center justify-center text-xs text-neutral-600 font-medium flex-shrink-0">
        +5
      </span>
    </div>
  ),
};
