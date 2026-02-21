import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-lg', 'body', 'body-sm', 'caption', 'label', 'button'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'legend'],
      description: 'セマンティックなHTML要素（視覚スタイルとは独立）',
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'disabled', 'primary', 'error', 'success', 'warning'],
    },
    truncate: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'デザインシステム',
    variant: 'body',
    color: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {};

export const TypeScale: Story = {
  name: '全バリアント（タイプスケール）',
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="display">Display — 見出しの最大サイズ</Typography>
      <Typography variant="h1">H1 — ページタイトル</Typography>
      <Typography variant="h2">H2 — セクション見出し</Typography>
      <Typography variant="h3">H3 — サブセクション</Typography>
      <Typography variant="h4">H4 — カードタイトル</Typography>
      <Typography variant="h5">H5 — 小見出し</Typography>
      <Typography variant="h6">H6 — 最小見出し</Typography>
      <hr className="border-neutral-200" />
      <Typography variant="body-lg">Body Large — 18px / リード文</Typography>
      <Typography variant="body">Body — 16px / 本文（デフォルト）</Typography>
      <Typography variant="body-sm">Body Small — 14px / 補足テキスト</Typography>
      <Typography variant="caption">Caption — 12px / 注釈・著作権</Typography>
      <Typography variant="label">Label — 14px / フォームラベル</Typography>
      <Typography variant="button">Button — 14px / ボタンテキスト</Typography>
    </div>
  ),
};

export const AllColors: Story = {
  name: '全カラー',
  render: () => (
    <div className="flex flex-col gap-3">
      {(['default', 'muted', 'disabled', 'primary', 'error', 'success', 'warning'] as const).map((color) => (
        <Typography key={color} variant="body" color={color}>
          {color} — テキストカラーのサンプル文字列
        </Typography>
      ))}
    </div>
  ),
};

export const PolymorphicExample: Story = {
  name: 'ポリモーフィック: visual=h2 / semantic=p',
  args: { variant: 'h2', as: 'p', children: '見た目はH2、実際はp要素' },
};

export const Truncated: Story = {
  args: { truncate: true, children: '非常に長いテキストは自動的に1行で切り捨てられます。これが truncate プロパティの効果です。' },
  decorators: [(Story) => <div className="w-64"><Story /></div>],
};

export const ArticleLayout: Story = {
  name: '実践例: 記事レイアウト',
  render: () => (
    <article className="max-w-prose space-y-4">
      <Typography as="h1" variant="h1">デザインシステムの構築</Typography>
      <Typography variant="body-lg" color="muted">
        一貫したUIを素早く組み立てるためのコンポーネントライブラリです。
      </Typography>
      <Typography variant="body">
        デザインシステムは、チーム全体が共有できる単一の真実を提供します。
        デザイナーとエンジニアが共通の語彙を持つことで、コラボレーションが円滑になります。
      </Typography>
      <Typography variant="caption" color="muted">最終更新: 2026年2月</Typography>
    </article>
  ),
};
