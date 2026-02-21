import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Alert } from './Alert';
import { Button } from '../../atoms/button/Button';
import { Link } from '../../atoms/Link/Link';

const meta: Meta<typeof Alert> = {
  title: 'Molecules/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'warning', 'info', 'neutral'] },
    title: { control: 'text' },
    hideIcon: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'info',
    children: 'アラートのメッセージがここに入ります。',
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const WithTitle: Story = {
  args: { variant: 'success', title: '保存しました', children: '変更内容が正常に保存されました。' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Alert variant="success" title="完了">操作が正常に完了しました。</Alert>
      <Alert variant="error" title="エラー">入力内容に誤りがあります。確認してください。</Alert>
      <Alert variant="warning" title="注意">この操作は取り消せません。</Alert>
      <Alert variant="info" title="お知らせ">システムメンテナンスを2月25日に実施します。</Alert>
      <Alert variant="neutral">一般的な補足情報。特に緊急度はありません。</Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  name: '閉じるボタンあり',
  render: () => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert variant="info" title="新機能のご案内"
        onClose={() => setVisible(false)}>
        ダッシュボードに新しい分析機能が追加されました。
        <Link href="#" className="ml-1" underline="always">詳細を見る</Link>
      </Alert>
    ) : (
      <div className="flex items-center gap-3">
        <p className="text-sm text-neutral-500">アラートを閉じました</p>
        <Button size="small" variant="tertiary" onClick={() => setVisible(true)}>
          再表示
        </Button>
      </div>
    );
  },
};

export const WithoutIcon: Story = {
  args: { hideIcon: true, variant: 'warning', children: 'アイコンなしのアラート。' },
};

export const WithAction: Story = {
  name: '実践例: アクション付きアラート',
  render: () => (
    <Alert variant="warning" title="メールアドレスが未確認です">
      <p>アカウントのすべての機能を使うにはメールアドレスの確認が必要です。</p>
      <div className="mt-3 flex gap-2">
        <Button size="small">確認メールを再送</Button>
        <Button size="small" variant="tertiary">後で行う</Button>
      </div>
    </Alert>
  ),
};

export const FormErrors: Story = {
  name: '実践例: フォームエラー一覧',
  render: () => (
    <Alert variant="error" title="3件のエラーがあります">
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>メールアドレスの形式が正しくありません</li>
        <li>パスワードは8文字以上にしてください</li>
        <li>生年月日を入力してください</li>
      </ul>
    </Alert>
  ),
};
