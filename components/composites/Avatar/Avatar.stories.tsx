import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Caption } from '@sb-blocks/Caption';

/**
 * Avatar stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants (shape) → Sizes → States → EdgeCases
 *
 * Avatar は icon prop を持たないため WithIcon は省略 (§5-3)。
 * Variants 軸は shape (circle / square) として扱う。
 */
const meta: Meta<typeof Avatar> = {
  title: 'Composites/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'radio', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy', 'away'] },
    src: { control: 'text' },
    name: { control: 'text' },
    alt: { control: 'text' },
  },
  args: {
    name: '田中 太郎',
    size: 'md',
    shape: 'circle',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から size / shape / status / src / name を切替。src 未指定時は name のイニシャル、それも無ければプレースホルダーアイコンへフォールバック。',
      },
    },
  },
};

// ── 2. Variants (shape) ────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'shape の 2 種: circle (個人アカウント慣習) / square (チーム・組織)。',
      },
    },
  },
  render: () => (
    <div className="flex gap-6 items-center">
      <Caption text="circle (個人)">
        <Avatar shape="circle" size="lg" name="田中 太郎" src="https://i.pravatar.cc/150?img=7" />
      </Caption>
      <Caption text="square (チーム・組織)">
        <Avatar shape="square" size="lg" name="チーム A" src="https://i.pravatar.cc/150?img=7" />
      </Caption>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs (24px、サイドバー / コメント) → xl (80px、プロフィールヒーロー) の 5 段階。',
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size} name="田中 太郎" src="https://i.pravatar.cc/150?img=5" />
          <span className="text-xs text-onSurface-muted font-mono">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Image / Initials (src なし) / Image error → Initials / No src+no name (placeholder) + status (online/offline/busy/away) の状態。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      <Caption text="Image (src 指定)">
        <Avatar src="https://i.pravatar.cc/150?img=3" name="田中 太郎" />
      </Caption>
      <Caption text="Initials (src なし、name から自動生成)">
        <div className="flex gap-3 items-center">
          <Avatar name="田中 太郎" />
          <Avatar name="Yamada Hanako" />
          <Avatar name="佐藤" />
          <Avatar name="John Smith" />
          <Avatar name="木村" />
        </div>
      </Caption>
      <Caption text="Image error → Initials fallback (invalid URL)">
        <Avatar src="https://invalid.example.com/x.jpg" name="田中 太郎" />
      </Caption>
      <Caption text="No src + no name (placeholder icon)">
        <Avatar />
      </Caption>
      <Caption text="Status dot (online / offline / busy / away)">
        <div className="flex gap-6 items-center">
          {(['online', 'offline', 'busy', 'away'] as const).map((status) => (
            <div key={status} className="flex flex-col items-center gap-1">
              <Avatar size="lg" name="田中 太郎" status={status} src="https://i.pravatar.cc/150?img=8" />
              <span className="text-xs text-onSurface-muted font-mono">{status}</span>
            </div>
          ))}
        </div>
      </Caption>
    </div>
  ),
};

// ── 5. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: ユーザーカード (avatar + name + email) / アバターグループ (重なり + +N counter)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="ユーザーカード (avatar + name + email + status)">
        <div className="flex items-center gap-3 p-4 rounded-md border border-border-subtle w-64">
          <Avatar src="https://i.pravatar.cc/150?img=12" name="鈴木 花子" size="md" status="online" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-onSurface truncate">鈴木 花子</p>
            <p className="text-xs text-onSurface-muted truncate">suzuki@example.com</p>
          </div>
        </div>
      </Caption>
      <Caption text="アバターグループ (重なり -space-x-3 + ring-surface + 残り表示)">
        <div className="flex -space-x-3">
          {[
            { src: 'https://i.pravatar.cc/150?img=1', name: 'Alice' },
            { src: 'https://i.pravatar.cc/150?img=2', name: 'Bob' },
            { src: 'https://i.pravatar.cc/150?img=3', name: 'Carol' },
            { name: 'Dave' },
          ].map(({ src, name }) => (
            <Avatar key={name} src={src} name={name} size="sm" className="ring-2 ring-surface" />
          ))}
          <span className="w-8 h-8 rounded-full bg-surface-skeleton ring-2 ring-surface
            flex items-center justify-center text-xs text-onSurface-muted font-medium flex-shrink-0">
            +5
          </span>
        </div>
      </Caption>
    </div>
  ),
};
