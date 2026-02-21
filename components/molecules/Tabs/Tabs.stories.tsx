import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';
import { Badge } from '../../atoms/Badge/Badge';

const sampleTabs = [
  {
    id: 'overview',
    label: '概要',
    content: (
      <div className="space-y-2">
        <p className="text-sm text-neutral-700">プロジェクトの概要ページです。</p>
        <p className="text-sm text-neutral-500">最終更新: 2026年2月21日</p>
      </div>
    ),
  },
  {
    id: 'members',
    label: 'メンバー',
    badge: 5,
    content: (
      <ul className="space-y-2">
        {['田中 太郎', '鈴木 花子', '佐藤 一郎', '山田 次郎', '木村 三郎'].map((name) => (
          <li key={name} className="text-sm text-neutral-700">{name}</li>
        ))}
      </ul>
    ),
  },
  {
    id: 'settings',
    label: '設定',
    content: <p className="text-sm text-neutral-700">設定ページです。</p>,
  },
  {
    id: 'disabled',
    label: '無効タブ',
    disabled: true,
    content: null,
  },
];

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['underline', 'pill'] },
    defaultActiveId: { control: 'text' },
  },
  args: {
    tabs: sampleTabs,
    defaultActiveId: 'overview',
    variant: 'underline',
  },
  decorators: [(Story) => <div className="w-[480px]"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const PillVariant: Story = {
  args: { variant: 'pill', defaultActiveId: 'overview' },
};

export const WithBadge: Story = {
  args: {
    tabs: [
      { id: 'all', label: 'すべて', badge: 128, content: <p className="text-sm">すべての通知</p> },
      { id: 'unread', label: '未読', badge: 12, content: <p className="text-sm">未読の通知</p> },
      { id: 'read', label: '既読', content: <p className="text-sm">既読の通知</p> },
    ],
    defaultActiveId: 'all',
  },
};

export const Controlled: Story = {
  name: '制御コンポーネント',
  render: () => {
    const [activeId, setActiveId] = useState('overview');
    return (
      <div className="space-y-3 w-[480px]">
        <p className="text-xs text-neutral-500">アクティブ: <strong>{activeId}</strong></p>
        <Tabs
          tabs={sampleTabs}
          activeId={activeId}
          onChange={setActiveId}
          variant="underline"
        />
      </div>
    );
  },
};

export const KeyboardNav: Story = {
  name: 'キーボード操作（← → Home End）',
  args: { defaultActiveId: 'overview' },
};

export const ProfileTabs: Story = {
  name: '実践例: プロフィールページ',
  render: () => (
    <div className="w-[480px] border border-neutral-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-neutral-50 border-b border-neutral-200">
        <h2 className="font-semibold text-neutral-800">田中 太郎</h2>
        <p className="text-sm text-neutral-500">UI デザイナー</p>
      </div>
      <div className="px-4">
        <Tabs
          variant="underline"
          defaultActiveId="posts"
          tabs={[
            {
              id: 'posts',
              label: '記事',
              badge: 48,
              content: (
                <div className="space-y-3">
                  {['Atomic Design 入門', 'Tailwind CSS のすすめ', '色彩理論の基礎'].map((title) => (
                    <div key={title} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-sm text-neutral-700">{title}</span>
                      <Badge variant="neutral" size="small">公開中</Badge>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: 'followers',
              label: 'フォロワー',
              badge: '1.2k',
              content: <p className="text-sm text-neutral-600">フォロワー一覧</p>,
            },
            {
              id: 'following',
              label: 'フォロー中',
              badge: 320,
              content: <p className="text-sm text-neutral-600">フォロー中一覧</p>,
            },
          ]}
        />
      </div>
    </div>
  ),
};
