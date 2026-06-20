import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';
import { Caption } from '@sb-blocks/Caption';

/**
 * EmptyState stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * size / composition (title / description / action / secondaryAction の有無) を内在軸で Overview に集約。
 * 検索結果なし / エラー / 空フォルダ / フルページ等の usage 合成は custom icon + action で再現でき
 * 構造的でないため guideline の「使用例」へ移設 (Layout token デモは Tokens/Layout 参照)。
 */

// Playground の icon mapping 用 (custom SVG を Controls から選べるように §5-3)
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
    // ReactNode prop は mapping で Controls 化 (default = 内蔵アイコン)
    icon: {
      control: 'select',
      options: ['default', 'search', 'error', 'folder'],
      mapping: { default: undefined, search: <SearchIcon />, error: <ErrorIcon />, folder: <FolderIcon /> },
    },
  },
  args: {
    title: 'データがありません',
    description: 'まだアイテムが登録されていません。',
    size: 'md',
  },
  // 全 story を w-96 + border でラップ (parameters.noWrap=true で個別解除、memory: storybook-decorator-inheritance)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-96 border border-border-subtle rounded-md"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から size / title / description / icon (default/search/error/folder) を切替。action / secondaryAction はオブジェクトなので args で指定。',
      },
    },
  },
  args: {
    action: { label: '新規作成', onClick: () => alert('新規作成') },
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸: size (比例スケール) / composition (要素の有無で変わるレイアウト)。
// custom icon は glyph 差のみで固有シグナルを足さないため Overview には並べない (Playground mapping で探索)。

const Box = ({ children }: { children: ReactNode }) => (
  <div className="w-80 border border-border-subtle rounded-md">{children}</div>
);

export const Overview: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '視覚回帰用の総覧。size (sm/md/lg の比例スケール) と composition (title のみ → +description → +action → +secondaryAction の有無レイアウト) を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm サイドバー/カード内 · md 標準 · lg ヒーロー) — icon/title/description/Button が比例</div>
        <div className="flex flex-col gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Caption key={size} text={size}>
              <Box>
                <EmptyState size={size} title="データがありません" description="まだアイテムが登録されていません。" action={{ label: '新規作成' }} />
              </Box>
            </Caption>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">composition (要素の有無、size=md)</div>
        <div className="flex flex-col gap-4">
          <Caption text="title のみ">
            <Box><EmptyState title="通知なし" /></Box>
          </Caption>
          <Caption text="+ description">
            <Box><EmptyState title="データがありません" description="まだアイテムが登録されていません。" /></Box>
          </Caption>
          <Caption text="+ action (primary)">
            <Box><EmptyState title="データがありません" description="まだアイテムが登録されていません。" action={{ label: '新規作成' }} /></Box>
          </Caption>
          <Caption text="+ secondaryAction (primary + tertiary)">
            <Box>
              <EmptyState
                title="プロジェクトがありません"
                description="最初のプロジェクトを作成しましょう。"
                action={{ label: '新規作成' }}
                secondaryAction={{ label: 'テンプレートから', variant: 'tertiary' }}
              />
            </Box>
          </Caption>
        </div>
      </div>
    </div>
  ),
};
