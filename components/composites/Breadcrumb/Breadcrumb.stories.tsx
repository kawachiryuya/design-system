import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const sampleItems = [
  { label: 'ホーム', href: '/' },
  { label: 'ブログ', href: '/blog' },
  { label: 'デザインシステム', href: '/blog/design-system' },
  { label: 'Atomic Design とは' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Composites/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'radio', options: ['slash', 'chevron', 'dot'] },
  },
  args: {
    items: sampleItems,
    separator: 'chevron',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const AllSeparators: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {(['chevron', 'slash', 'dot'] as const).map((sep) => (
        <div key={sep}>
          <p className="text-xs text-neutral-400 mb-1">separator="{sep}"</p>
          <Breadcrumb items={sampleItems} separator={sep} />
        </div>
      ))}
    </div>
  ),
};

export const TwoLevels: Story = {
  args: { items: [{ label: 'ホーム', href: '/' }, { label: '設定' }] },
};

export const SingleLevel: Story = {
  args: { items: [{ label: 'ダッシュボード' }] },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: 'ホーム', href: '/' },
      { label: 'カテゴリ', href: '/cat' },
      { label: 'とても長いページタイトルが入ることもある' },
    ],
  },
};

export const ECommerceExample: Story = {
  name: '実践例: ECサイトのカテゴリナビ',
  render: () => (
    <div className="flex flex-col gap-3">
      <Breadcrumb separator="chevron" items={[
        { label: 'トップ', href: '/' },
        { label: 'ファッション', href: '/fashion' },
        { label: 'メンズ', href: '/fashion/mens' },
        { label: 'Tシャツ' },
      ]} />
      <Breadcrumb separator="slash" items={[
        { label: 'トップ', href: '/' },
        { label: 'デジタル', href: '/digital' },
        { label: 'スマートフォン' },
      ]} />
    </div>
  ),
};
