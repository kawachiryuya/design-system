import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { SearchBar } from '../SearchBar/SearchBar';
import { useState } from 'react';
import { Caption } from '@sb-blocks/Caption';

/**
 * EmptyState stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * EmptyState は variant prop を持たないため Variants は省略 (§5-3)。
 * Icon (custom SVG) は WithIcon ではなく Variants 的な意味で EdgeCases に統合。
 */
const SearchIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-onSurface-disabled" aria-hidden="true">
    <circle cx="28" cy="28" r="18"/>
    <path d="m50 50-12-12"/>
    <line x1="28" y1="20" x2="28" y2="36"/>
    <line x1="20" y1="28" x2="36" y2="28"/>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-onSurface-error" aria-hidden="true">
    <circle cx="32" cy="32" r="24"/>
    <line x1="32" y1="20" x2="32" y2="36"/>
    <circle cx="32" cy="44" r="1" fill="currentColor"/>
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-onSurface-disabled" aria-hidden="true">
    <path d="M56 52H8a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4h16l8 8h24a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4z"/>
  </svg>
);

const meta: Meta<typeof EmptyState> = {
  title: 'Composites/EmptyState',
  component: EmptyState,
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
  // 全 story を w-96 + border でラップする (parameters.noWrap=true で個別に解除可能、memory: storybook-decorator-inheritance)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-96 border border-border-subtle rounded-md"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から size / title / description を切替。action / secondaryAction はオブジェクトなので JSX で別途指定。',
      },
    },
  },
  args: {
    action: { label: '新規作成', onClick: () => alert('新規作成') },
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (サイドバー / カード内) / md (標準) / lg (ヒーロー / オンボーディング) の 3 段。icon / title / description / Button が比例的に大きくなる。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col divide-y divide-border-subtle w-96 border border-border-subtle rounded-md">
      <EmptyState size="sm" title="Small" description="コンパクトな表示" action={{ label: '追加' }} />
      <EmptyState size="md" title="Medium (デフォルト)" description="標準サイズ" action={{ label: '追加' }} />
      <EmptyState size="lg" title="Large" description="フルページ向け" action={{ label: '追加' }} />
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Description なし / Action なし / Primary action のみ / Primary + Secondary action の構成パターン。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="Title のみ (description / action なし)">
        <div className="w-96 border border-border-subtle rounded-md">
          <EmptyState title="通知なし" />
        </div>
      </Caption>
      <Caption text="Title + description (action なし、純粋な情報表示)">
        <div className="w-96 border border-border-subtle rounded-md">
          <EmptyState title="データがありません" description="まだアイテムが登録されていません。" />
        </div>
      </Caption>
      <Caption text="Primary action のみ">
        <div className="w-96 border border-border-subtle rounded-md">
          <EmptyState
            title="データがありません"
            description="まだアイテムが登録されていません。"
            action={{ label: '新規作成' }}
          />
        </div>
      </Caption>
      <Caption text="Primary + Secondary action (補助選択肢併記)">
        <div className="w-96 border border-border-subtle rounded-md">
          <EmptyState
            title="プロジェクトがまだありません"
            description="最初のプロジェクトを作成しましょう。"
            action={{ label: '新規作成' }}
            secondaryAction={{ label: 'テンプレートから作成' }}
          />
        </div>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: 検索結果なし (SearchBar 連動) / エラー状態 / 空のフォルダ / Layout token 適用 (page 全体 max-w-container でフルページ EmptyState)。カスタム icon (custom SVG) を渡す例も含む。',
      },
    },
    // 最後の Layout token 例を全幅表示するため meta の w-96 decorator を解除
    noWrap: true,
  },
  render: () => {
    function NoResults() {
      const [query, setQuery] = useState('xxxxxx');
      return (
        <div className="w-96 space-y-3">
          <SearchBar value={query} onChange={setQuery} fullWidth placeholder="検索..." />
          <div className="border border-border-subtle rounded-md">
            <EmptyState
              icon={<SearchIcon />}
              title={`「${query}」に一致する結果がありません`}
              description="別のキーワードで試してみてください"
              action={{ label: 'クリア', onClick: () => setQuery(''), variant: 'tertiary' }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <Caption text="検索結果なし (SearchBar 連動、クリアで戻る)">
          <NoResults />
        </Caption>
        <Caption text="エラー状態 (再試行 + 戻る)">
          <div className="w-96 border border-border-subtle rounded-md">
            <EmptyState
              icon={<ErrorIcon />}
              title="読み込みに失敗しました"
              description="ネットワーク接続を確認してもう一度お試しください。"
              action={{ label: '再試行' }}
              secondaryAction={{ label: 'ホームへ戻る', variant: 'tertiary' }}
            />
          </div>
        </Caption>
        <Caption text="空のフォルダ (ファイルアップロード CTA)">
          <div className="w-96 border border-border-subtle rounded-md">
            <EmptyState
              icon={<FolderIcon />}
              title="フォルダは空です"
              description="ファイルをドラッグ＆ドロップするか、アップロードボタンから追加できます。"
              action={{ label: 'ファイルをアップロード' }}
            />
          </div>
        </Caption>
        <Caption text="Layout token 適用 (page 全体 max-w-container + size=lg、フルページ EmptyState 典型例)">
          <div className="w-full px-container py-container max-w-container mx-auto">
            <EmptyState
              icon={<FolderIcon />}
              size="lg"
              title="ようこそ！"
              description="最初のプロジェクトを作成して始めましょう。"
              action={{ label: 'プロジェクトを作成' }}
              secondaryAction={{ label: 'チュートリアルを見る' }}
            />
          </div>
        </Caption>
      </div>
    );
  },
};
