import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Icon } from './Icon';
import { getIconNames } from './iconRegistry';
import { Caption } from '@sb-blocks/Caption';

/**
 * Icon stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Library → Variants → Sizes → EdgeCases
 * (States は Icon に hover/focus 状態がないため省略、WithIcon は Icon が icon そのものなので省略)
 * Library は Icon 固有の追加節 — iconRegistry 全アイコンを一覧表示する catalog story。
 * 「どの name が使えるか」を最初に見せたいので Playground の直後に配置する。
 *
 * Docs (Guideline) は Icon.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: ['inherit', 'neutral', 'primary', 'success', 'error', 'warning', 'info', 'disabled'],
    },
    variant: { control: 'radio', options: [undefined, 'fill', 'stroke'] },
    label: { control: 'text' },
    children: { control: false },
  },
  args: {
    name: 'search',
    size: 'md',
    color: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls タブから props を探索する起点。
// 基本動作 (registry 参照 + role/aria-label 自動付与) の play test もここに置く。

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。name="search" を指定すると registry の label "検索" が自動的に aria-label として付き role="img" になることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // name="search" の registry エントリには label="検索" がある → role="img" + aria-label="検索"
    const icon = canvas.getByRole('img', { name: '検索' });
    await expect(icon).toBeInTheDocument();
  },
};

// ── 2. Library (Icon 固有) ─────────────────────────────────────
// iconRegistry に登録されている全アイコンの catalog 表示。
// 「どの name が使えるか」を一覧で見せる目的で、Playground の直後に配置。

export const Library: Story = {
  parameters: {
    docs: {
      description: {
        story: 'iconRegistry に登録された全アイコンの一覧。`<Icon name="..." />` でそのまま使える name を表示。registry にないアイコンを使いたい場合は iconRegistry.ts に追記する。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-4 gap-3 max-w-2xl">
      {getIconNames().map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 p-3 rounded border border-border-subtle">
          <Icon name={name} size="md" color="neutral" />
          <code className="text-xs">{name}</code>
        </div>
      ))}
    </div>
  ),
};

// ── 3. Variants ────────────────────────────────────────────────
// 7 色のセマンティックカラーを静的に横並び。`color` prop の使い分け判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '7 色のセマンティックカラーを横並びで比較。inherit (text-current) は親要素の色を継承するため Button 内のアイコン等で多用。意味別の使い分けは Guideline 参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6 items-center">
      {(['inherit', 'neutral', 'primary', 'success', 'error', 'warning', 'info', 'disabled'] as const).map((color) => (
        <Caption key={color} text={color}>
          <Icon name="info" size="md" color={color} />
        </Caption>
      ))}
    </div>
  ),
};

// ── 4. Sizes ───────────────────────────────────────────────────
// 4 つのサイズを静的に横並び。本文と組み合わせるなら sm/md、装飾大表示は lg/xl。

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (20px) / md (24px) / lg (32px) / xl (48px) の見比べ。本文サイズ (md text=16px) との視覚バランスのため sm/md が標準、見出しや空状態の図解で lg/xl を使う。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6 items-end">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Caption key={size} text={`${size} (${size === 'sm' ? 20 : size === 'md' ? 24 : size === 'lg' ? 32 : 48}px)`}>
          <Icon name="search" size={size} color="neutral" />
        </Caption>
      ))}
    </div>
  ),
};

// ── 5. EdgeCases ───────────────────────────────────────────────
// color="inherit" の親色連動 / custom SVG (children) / 存在しない name / xl + テキスト隣接など、
// 視覚的に壊れやすい / 仕様確認が必要なケースの監視用。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'color="inherit" で親色を継承するパターン / registry にない custom SVG (children) / 存在しない name / xl + テキスト隣接時のレイアウトなど、エッジケース監視。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text='color="inherit" — 親の text-red-500 を継承して赤くなる'>
        <div className="text-red-700 flex items-center gap-2">
          <Icon name="error" size="md" color="inherit" />
          <span>エラーメッセージのアイコンと文字が同色</span>
        </div>
      </Caption>
      <Caption text='custom SVG (children + variant="stroke") — registry に無いカスタムパスを直接描画'>
        <Icon size="md" color="neutral" variant="stroke" label="カスタム円形">
          <circle cx="12" cy="12" r="8" />
          <path d="m20 20-3-3" />
        </Icon>
      </Caption>
      <Caption text='存在しない name — registry に無い場合は何も描画されない (装飾的にフェイルセーフ)'>
        <div className="flex items-center gap-2 border border-dashed border-border-subtle p-2 rounded">
          <Icon name="nonexistent_icon" size="md" />
          <span className="text-xs text-onSurface-muted">↑ SVG タグはあるが path なし</span>
        </div>
      </Caption>
      <Caption text='xl + 本文隣接 — text-baseline 揃えが効かないので flex items-center 必須'>
        <div className="flex items-center gap-2">
          <Icon name="info" size="xl" color="info" />
          <span className="text-base">items-center で揃える</span>
        </div>
      </Caption>
    </div>
  ),
};

