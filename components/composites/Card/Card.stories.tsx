import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../../primitives/Button/Button';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Card> = {
  title: 'Composites/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['elevated', 'outlined', 'filled'] },
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
        <p className="text-sm text-onSurface-muted">ここにコンテンツが入ります。</p>
      </Card.Body>
      <Card.Footer>
        <Button size="small" variant="tertiary">キャンセル</Button>
        <Button size="small">保存</Button>
      </Card.Footer>
    </Card>
  ),
};

export const WithoutDivider: Story = {
  name: 'Header/Footer ボーダーなし',
  render: (args) => (
    <Card {...args}>
      <Card.Header divider={false}>カードタイトル</Card.Header>
      <Card.Body>
        <p className="text-sm text-onSurface-muted">divider=false で Header/Footer のボーダーを非表示にできます。</p>
      </Card.Body>
      <Card.Footer divider={false}>
        <Button size="small" variant="tertiary">キャンセル</Button>
        <Button size="small">保存</Button>
      </Card.Footer>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {(['elevated', 'outlined', 'filled'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Body>
            <p className="text-sm font-medium text-onSurface">{variant}</p>
            <p className="text-xs text-onSurface-subtle mt-1">カードのバリアントサンプル</p>
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
        <p className="text-sm font-medium text-onSurface">クリック可能なカード</p>
        <p className="text-xs text-onSurface-subtle mt-1">onClick でハンドラーを指定</p>
      </Card.Body>
    </Card>
  ),
};

export const LinkCard: Story = {
  name: 'リンクカード（href）',
  render: () => (
    <Card variant="outlined" href="#" target="_blank">
      <Card.Body>
        <p className="text-sm font-medium text-onSurface">リンクカード</p>
        <p className="text-xs text-onSurface-subtle mt-1">href を指定すると &lt;a&gt; でレンダリングされます</p>
      </Card.Body>
    </Card>
  ),
};

export const WithoutParts: Story = {
  name: 'Header/Footerなし（padding あり）',
  args: { padding: 'md' },
  render: (args) => (
    <Card {...args}>
      <p className="text-sm text-onSurface">シンプルなテキストカード。</p>
    </Card>
  ),
};

export const LongContent: Story = {
  name: '長いコンテンツ（折り返し・スクロールなし）',
  render: () => (
    <Card variant="outlined">
      <Card.Header>コンテンツが長い場合の挙動</Card.Header>
      <Card.Body>
        <p className="text-sm text-onSurface-muted">
          デザインシステムは、チーム全体が共有できる単一の真実を提供します。
          デザイナーとエンジニアが共通の語彙を持つことで、コラボレーションが円滑になります。
          Atomic Designの考え方に基づいてAtoms・Molecules・Organismsと段階的に積み上げることで、
          再利用性と一貫性を両立した設計が可能になります。
          また、デザイントークンを使用することで、カラー・スペーシング・タイポグラフィなどの
          基本的な要素を一元管理し、変更に強いシステムを構築できます。
        </p>
        <p className="text-sm text-onSurface-muted mt-3">
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

export const NoticeCard: Story = {
  name: '実践例: お知らせカード',
  render: () => (
    <Card variant="outlined" href="#">
      <Card.Header divider={false}>
        <div className="flex items-center justify-between">
          <span>メンテナンスのお知らせ</span>
          <Badge variant="warning" appearance="soft" size="small">重要</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <p className="text-sm text-onSurface-muted">
          3月10日 02:00〜06:00 の間、サーバーメンテナンスを実施します。
        </p>
        <p className="text-xs text-onSurface-subtle mt-2">2026.03.04</p>
      </Card.Body>
    </Card>
  ),
};

export const ActionCard: Story = {
  name: '実践例: アクション付きカード',
  render: () => (
    <Card variant="outlined">
      <Card.Header>プロジェクト設定</Card.Header>
      <Card.Body>
        <p className="text-sm text-onSurface-muted">
          プロジェクトの表示名や説明を変更できます。
        </p>
      </Card.Body>
      <Card.Footer>
        <Button size="small" variant="tertiary">キャンセル</Button>
        <Button size="small">保存</Button>
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
          <p className="text-xs text-onSurface-subtle">{label}</p>
          <p className="text-xl font-bold text-onSurface mt-1">{value}</p>
          <p className={`text-xs mt-1 ${up ? 'text-success-600' : 'text-error-600'}`}>{change}</p>
        </Card>
      ))}
    </div>
  ),
};
