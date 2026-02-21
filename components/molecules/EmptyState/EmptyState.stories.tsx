import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { SearchBar } from '../SearchBar/SearchBar';
import { useState } from 'react';

const SearchIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-neutral-300" aria-hidden="true">
    <circle cx="28" cy="28" r="18"/>
    <path d="m50 50-12-12"/>
    <line x1="28" y1="20" x2="28" y2="36"/>
    <line x1="20" y1="28" x2="36" y2="28"/>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-error-300" aria-hidden="true">
    <circle cx="32" cy="32" r="24"/>
    <line x1="32" y1="20" x2="32" y2="36"/>
    <circle cx="32" cy="44" r="1" fill="currentColor"/>
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-neutral-300" aria-hidden="true">
    <path d="M56 52H8a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4h16l8 8h24a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4z"/>
  </svg>
);

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'データがありません',
    description: 'まだアイテムが登録されていません。',
    size: 'md',
  },
  decorators: [(Story) => <div className="w-96 border border-neutral-200 rounded-lg"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: { label: '新規作成', onClick: () => alert('新規作成') },
  },
};

export const WithBothActions: Story = {
  args: {
    action: { label: '新規作成' },
    secondaryAction: { label: 'テンプレートから作成' },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-neutral-100 w-96 border border-neutral-200 rounded-lg">
      <EmptyState size="sm" title="Small" description="コンパクトな表示" action={{ label: '追加' }} />
      <EmptyState size="md" title="Medium（デフォルト）" description="標準サイズ" action={{ label: '追加' }} />
      <EmptyState size="lg" title="Large" description="フルページ向け" action={{ label: '追加' }} />
    </div>
  ),
};

export const NoResults: Story = {
  name: '実践例: 検索結果なし',
  render: () => {
    const [query, setQuery] = useState('xxxxxx');
    return (
      <div className="w-96 space-y-3">
        <SearchBar value={query} onChange={setQuery} fullWidth placeholder="検索..." />
        <div className="border border-neutral-200 rounded-lg">
          <EmptyState
            icon={<SearchIcon />}
            title={`「${query}」に一致する結果がありません`}
            description="別のキーワードで試してみてください"
            action={{ label: 'クリア', onClick: () => setQuery(''), variant: 'tertiary' }}
          />
        </div>
      </div>
    );
  },
};

export const ErrorState: Story = {
  name: '実践例: エラー状態',
  render: () => (
    <EmptyState
      icon={<ErrorIcon />}
      title="読み込みに失敗しました"
      description="ネットワーク接続を確認してもう一度お試しください。"
      action={{ label: '再試行' }}
      secondaryAction={{ label: 'ホームへ戻る', variant: 'tertiary' }}
    />
  ),
};

export const EmptyFolder: Story = {
  name: '実践例: フォルダが空',
  render: () => (
    <EmptyState
      icon={<FolderIcon />}
      title="フォルダは空です"
      description="ファイルをドラッグ＆ドロップするか、アップロードボタンから追加できます。"
      action={{ label: 'ファイルをアップロード' }}
    />
  ),
};
