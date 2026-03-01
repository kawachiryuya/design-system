import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Primitives/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'radio', options: ['primary', 'neutral', 'muted'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    underline: { control: 'radio', options: ['always', 'hover', 'none'] },
    external: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    href: '#',
    children: 'リンクテキスト',
    color: 'primary',
    size: 'md',
    underline: 'hover',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const External: Story = {
  args: { href: 'https://example.com', external: true, children: '外部サイトを開く' },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#" color="primary">primary — メインリンク</Link>
      <Link href="#" color="neutral">neutral — ナビゲーション</Link>
      <Link href="#" color="muted">muted — 補足リンク（利用規約など）</Link>
    </div>
  ),
};

export const AllUnderlines: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#" underline="always">always — 常に下線あり</Link>
      <Link href="#" underline="hover">hover — ホバー時のみ（デフォルト）</Link>
      <Link href="#" underline="none">none — 下線なし</Link>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#" size="sm">Small（14px）</Link>
      <Link href="#" size="md">Medium（16px）— デフォルト</Link>
      <Link href="#" size="lg">Large（18px）</Link>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: '無効なリンク' },
};

export const InlineText: Story = {
  name: '実践例: 本文中のインラインリンク',
  render: () => (
    <p className="text-base text-neutral-800 leading-relaxed max-w-prose">
      このサービスをご利用の際は、<Link href="#">利用規約</Link>および
      <Link href="#">プライバシーポリシー</Link>に同意したものとみなします。
      詳細は <Link href="https://example.com" external>公式ドキュメント</Link> をご確認ください。
    </p>
  ),
};

export const NavigationLinks: Story = {
  name: '実践例: ナビゲーション',
  render: () => (
    <nav className="flex gap-6">
      {['ホーム', 'サービス', '料金', '会社概要', 'お問い合わせ'].map((label) => (
        <Link key={label} href="#" color="neutral" underline="none"
          className="font-medium">
          {label}
        </Link>
      ))}
    </nav>
  ),
};
