import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../../atoms/button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Image } from '../../atoms/Image/Image';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['elevated', 'outlined', 'flat'] },
    padding: { control: 'radio', options: ['none', 'sm', 'md', 'lg'] },
    clickable: { control: 'boolean' },
  },
  args: { variant: 'outlined' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>カードタイトル</Card.Header>
      <Card.Body>
        <p className="text-sm text-neutral-600">ここにコンテンツが入ります。</p>
      </Card.Body>
      <Card.Footer>
        <Button size="small" variant="tertiary">キャンセル</Button>
        <Button size="small">保存</Button>
      </Card.Footer>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {(['elevated', 'outlined', 'flat'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Body>
            <p className="text-sm font-medium text-neutral-800">{variant}</p>
            <p className="text-xs text-neutral-500 mt-1">カードのバリアントサンプル</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

export const Clickable: Story = {
  args: { clickable: true },
  render: (args) => (
    <Card {...args} onClick={() => alert('カードをクリック')}>
      <Card.Body>
        <p className="text-sm font-medium text-neutral-800">クリック可能なカード</p>
        <p className="text-xs text-neutral-500 mt-1">Hover / Focus でシャドウが変化します</p>
      </Card.Body>
    </Card>
  ),
};

export const WithoutParts: Story = {
  name: 'Header/Footerなし（padding あり）',
  args: { padding: 'md' },
  render: (args) => (
    <Card {...args}>
      <p className="text-sm text-neutral-700">シンプルなテキストカード。</p>
    </Card>
  ),
};

export const LongContent: Story = {
  name: '長いコンテンツ（折り返し・スクロールなし）',
  render: () => (
    <Card variant="outlined">
      <Card.Header>コンテンツが長い場合の挙動</Card.Header>
      <Card.Body>
        <p className="text-sm text-neutral-600">
          デザインシステムは、チーム全体が共有できる単一の真実を提供します。
          デザイナーとエンジニアが共通の語彙を持つことで、コラボレーションが円滑になります。
          Atomic Designの考え方に基づいてAtoms・Molecules・Organismsと段階的に積み上げることで、
          再利用性と一貫性を両立した設計が可能になります。
          また、デザイントークンを使用することで、カラー・スペーシング・タイポグラフィなどの
          基本的な要素を一元管理し、変更に強いシステムを構築できます。
        </p>
        <p className="text-sm text-neutral-600 mt-3">
          とても長い単語なしのテキスト：aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </p>
      </Card.Body>
      <Card.Footer>
        <Button size="small" variant="tertiary">キャンセル</Button>
        <Button size="small">保存</Button>
      </Card.Footer>
    </Card>
  ),
};

export const BlogCard: Story = {
  name: '実践例: ブログカード',
  render: () => (
    <Card variant="outlined" clickable>
      <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop"
        alt="山の風景" aspectRatio="video" />
      <Card.Body>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="primary" appearance="soft" size="small">デザイン</Badge>
          <span className="text-xs text-neutral-400">2026.02.21</span>
        </div>
        <h3 className="text-base font-semibold text-neutral-800 leading-snug mb-1">
          デザインシステム構築のすすめ
        </h3>
        <p className="text-sm text-neutral-600 line-clamp-2">
          一貫したUIを素早く組み立てるための基盤として、デザインシステムが果たす役割を解説します。
        </p>
      </Card.Body>
      <Card.Footer justify="between">
        <div className="flex items-center gap-2">
          <Avatar src="https://i.pravatar.cc/150?img=5" name="田中 太郎" size="xs" />
          <span className="text-xs text-neutral-500">田中 太郎</span>
        </div>
        <span className="text-xs text-neutral-400">5 min read</span>
      </Card.Footer>
    </Card>
  ),
};

export const ProfileCard: Story = {
  name: '実践例: プロフィールカード',
  render: () => (
    <Card variant="elevated">
      <Card.Body className="flex flex-col items-center text-center gap-3 py-6">
        <Avatar src="https://i.pravatar.cc/150?img=12" name="鈴木 花子" size="xl" status="online" />
        <div>
          <p className="font-semibold text-neutral-800">鈴木 花子</p>
          <p className="text-sm text-neutral-500">UI デザイナー</p>
        </div>
        <div className="flex gap-6 text-center">
          {[['48', '記事'], ['1.2k', 'フォロワー'], ['320', 'いいね']].map(([num, label]) => (
            <div key={label}>
              <p className="font-semibold text-neutral-800">{num}</p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </Card.Body>
      <Card.Footer justify="between">
        <Button variant="tertiary" size="small" className="flex-1">メッセージ</Button>
        <Button size="small" className="flex-1">フォロー</Button>
      </Card.Footer>
    </Card>
  ),
};

export const StatCard: Story = {
  name: '実践例: 統計カード',
  render: () => (
    <div className="grid grid-cols-2 gap-3 w-96">
      {[
        { label: '総ユーザー数', value: '12,480', change: '+8.2%', up: true },
        { label: '月間収益', value: '¥2.4M', change: '+12.5%', up: true },
        { label: '解約率', value: '2.1%', change: '-0.3%', up: false },
        { label: '平均セッション', value: '8m 32s', change: '+1m 12s', up: true },
      ].map(({ label, value, change, up }) => (
        <Card key={label} variant="outlined" padding="md">
          <p className="text-xs text-neutral-500">{label}</p>
          <p className="text-xl font-bold text-neutral-800 mt-1">{value}</p>
          <p className={`text-xs mt-1 ${up ? 'text-success-600' : 'text-error-600'}`}>{change}</p>
        </Card>
      ))}
    </div>
  ),
};
