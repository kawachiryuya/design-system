import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['text', 'circular', 'rectangular', 'rounded'] },
    lines: { control: { type: 'number', min: 1, max: 10 } },
    animated: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'text',
    animated: true,
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const MultilineText: Story = {
  args: { variant: 'text', lines: 4 },
};

export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
};

export const Rectangular: Story = {
  args: { variant: 'rectangular', height: 160 },
};

export const Rounded: Story = {
  args: { variant: 'rounded', height: 120 },
};

export const NoAnimation: Story = {
  args: { variant: 'text', lines: 3, animated: false },
};

export const CardSkeleton: Story = {
  name: '実践例: カードのスケルトン',
  render: () => (
    <div className="w-72 p-4 border border-neutral-200 rounded-lg space-y-4">
      <Skeleton variant="rectangular" height={160} className="rounded-md" />
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={36} height={36} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={64} height={28} />
        <Skeleton variant="rounded" width={64} height={28} />
      </div>
    </div>
  ),
};

export const UserListSkeleton: Story = {
  name: '実践例: ユーザーリストのスケルトン',
  render: () => (
    <div className="w-80 divide-y divide-neutral-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 px-1">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="70%" />
          </div>
          <Skeleton variant="rounded" width={56} height={24} />
        </div>
      ))}
    </div>
  ),
};

export const ArticleSkeleton: Story = {
  name: '実践例: 記事のスケルトン',
  render: () => (
    <div className="w-80 space-y-4">
      <Skeleton variant="text" width="80%" height={28} />
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={60} />
      </div>
      <Skeleton variant="rectangular" height={200} className="rounded-lg" />
      <Skeleton variant="text" lines={5} />
    </div>
  ),
};
