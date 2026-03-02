import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Composites/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'error', 'warning', 'info'],
    },
    appearance: { control: 'radio', options: ['solid', 'soft', 'outline'] },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'ラベル',
    variant: 'neutral',
    appearance: 'soft',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const AllAppearances: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['solid', 'soft', 'outline'] as const).map((appearance) => (
        <div key={appearance} className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-neutral-500 w-16">{appearance}</span>
          {(['neutral', 'primary', 'success', 'error', 'warning', 'info'] as const).map((variant) => (
            <Badge key={variant} variant={variant} appearance={appearance}>{variant}</Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-3 items-center">
      <Badge size="small" variant="success">Small</Badge>
      <Badge size="medium" variant="success">Medium</Badge>
      <Badge size="large" variant="success">Large</Badge>
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success" dot>オンライン</Badge>
      <Badge variant="error" dot>エラー</Badge>
      <Badge variant="warning" dot>要確認</Badge>
      <Badge variant="neutral" dot>オフライン</Badge>
    </div>
  ),
};

export const LongLabel: Story = {
  name: '長いラベルテキスト',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="primary" appearance="soft">とても長いラベルテキストが入る場合</Badge>
      <Badge variant="success" dot>非常に長い説明文のあるバッジ</Badge>
      <Badge variant="neutral" appearance="outline">Long English text badge example</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  name: '実践例: ステータス表示',
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {[
        { label: '公開中', variant: 'success' as const, appearance: 'soft' as const, dot: true },
        { label: '下書き', variant: 'neutral' as const, appearance: 'outline' as const },
        { label: '要レビュー', variant: 'warning' as const, appearance: 'soft' as const, dot: true },
        { label: '非公開', variant: 'error' as const, appearance: 'soft' as const },
        { label: 'NEW', variant: 'primary' as const, appearance: 'solid' as const },
      ].map(({ label, variant, appearance, dot }) => (
        <div key={label} className="flex items-center justify-between px-3 py-2 rounded border border-neutral-200">
          <span className="text-sm text-neutral-800">{label === 'NEW' ? 'プロ機能' : `記事「${label}の設定」`}</span>
          <Badge variant={variant} appearance={appearance} dot={dot}>{label}</Badge>
        </div>
      ))}
    </div>
  ),
};
