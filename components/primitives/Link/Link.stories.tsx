import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Primitives/_Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'radio',
      options: ['primary', 'neutral', 'muted'],
      description: 'primary=CTA/本文内、neutral=ナビゲーション、muted=規約/補足。',
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    underline: {
      control: 'radio',
      options: ['always', 'hover', 'none'],
      description: 'none は周辺と区別が付く場合のみ (ナビゲーション等)。本文中は always か hover。',
    },
    external: {
      control: 'boolean',
      description: 'true で target="_blank" + rel="noopener noreferrer" + 外部アイコンを自動付与。',
    },
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

/**
 * 既定の Link。Controls から `color` / `size` / `underline` / `external` / `disabled` を切り替えて挙動を確認できる。
 */
export const Default: Story = {};

/**
 * 使い方の手本: 外部リンク。`external` で target="_blank" + rel="noopener noreferrer" + 末尾の外部アイコンが自動付与される。
 */
export const External: Story = {
  args: { href: 'https://example.com', external: true, children: '外部サイトを開く' },
};

/**
 * 比較カタログ: 3 種の color を並べて使い分けを示す。
 * primary=主要リンク、neutral=ナビゲーション、muted=規約/補足。
 */
export const AllColors: Story = {
  name: 'color の使い分け',
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#" color="primary">primary — メインリンク</Link>
      <Link href="#" color="neutral">neutral — ナビゲーション</Link>
      <Link href="#" color="muted">muted — 補足リンク (利用規約など)</Link>
    </div>
  ),
};

/**
 * 使い方の手本: 本文中のインラインリンク。文意の文脈付きでリンクを置く。
 */
export const InlineText: Story = {
  name: '実践例: 本文中のインラインリンク',
  render: () => (
    <p className="text-base text-onSurface leading-relaxed max-w-prose">
      このサービスをご利用の際は、<Link href="#">利用規約</Link>および
      <Link href="#">プライバシーポリシー</Link>に同意したものとみなします。
      詳細は <Link href="https://example.com" external>公式ドキュメント</Link> をご確認ください。
    </p>
  ),
};

/**
 * 使い方の手本: ナビゲーション。`color="neutral"` + `underline="none"` で周辺と馴染ませる。
 */
export const NavigationLinks: Story = {
  name: '実践例: ナビゲーション',
  render: () => (
    <nav className="flex gap-6">
      {['ホーム', 'サービス', '料金', '会社概要', 'お問い合わせ'].map((label) => (
        <Link key={label} href="#" color="neutral" underline="none" className="font-medium">
          {label}
        </Link>
      ))}
    </nav>
  ),
};
