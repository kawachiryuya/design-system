import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Icon } from './Icon';
import { getIconNames } from './iconRegistry';
import { Caption } from '@sb-blocks/Caption';

/**
 * Icon stories — VR 集約モデル (§5-3) + Icon 固有の Library 節
 *
 * 構成: Playground / Library / Overview / EdgeCases。
 * Library は iconRegistry 全アイコンの catalog で、icon セット全体の視覚回帰も兼ねる
 * Icon 固有の追加節 (「どの name が使えるか」を見せるため Playground 直後に配置)。
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

const COLORS = ['inherit', 'neutral', 'primary', 'success', 'error', 'warning', 'info', 'disabled'] as const;
const SIZE_PX: Record<'sm' | 'md' | 'lg' | 'xl', number> = { sm: 20, md: 24, lg: 32, xl: 48 };

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。name="search" で registry の label "検索" が aria-label に付き role="img" になることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole('img', { name: '検索' });
    await expect(icon).toBeInTheDocument();
  },
};

// ── 2. Library (Icon 固有・視覚回帰対象) ────────────────────────
// iconRegistry 全アイコンの catalog。icon セット全体の視覚回帰も兼ねる。

export const Library: Story = {
  parameters: {
    docs: {
      description: {
        story: 'iconRegistry に登録された全アイコンの一覧。`<Icon name="..." />` でそのまま使える name を表示。registry に無いアイコンは iconRegistry.ts に追記する。',
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

// ── 3. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: color (8) / size (4) / variant (fill/stroke)。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。color (8 semantic) / size (sm 20 / md 24 / lg 32 / xl 48) を 1 枚に集約。inherit は親の text color を継承。※ `variant` (fill/stroke) は registry アイコンでは registry の mode が優先され無効 — custom SVG (children) 専用なので EdgeCases で扱う。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">color (semantic 8)</div>
        <div className="flex flex-wrap gap-6 items-center">
          {COLORS.map((color) => (
            <Caption key={color} text={color}>
              <Icon name="info" size="md" color={color} />
            </Caption>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm / md / lg / xl)</div>
        <div className="flex flex-wrap gap-6 items-end">
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Caption key={size} text={`${size} (${SIZE_PX[size]}px)`}>
              <Icon name="search" size={size} color="neutral" />
            </Caption>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 4. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存・フェイルセーフ: color=inherit (親色継承) /
// custom SVG children / 存在しない name / xl + 本文隣接の baseline 揃え。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'color="inherit" の親色継承 / registry に無い custom SVG (children) / 存在しない name (装飾的フェイルセーフ) / xl + 本文隣接時の alignment など、文脈依存・境界条件を監視。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text='color="inherit" — 親の text 色 (赤) を継承'>
        <div className="text-red-700 flex items-center gap-2">
          <Icon name="error" size="md" color="inherit" />
          <span>エラーメッセージのアイコンと文字が同色</span>
        </div>
      </Caption>
      <Caption text='custom SVG (children + variant="stroke") — registry に無いカスタムパス'>
        <Icon size="md" color="neutral" variant="stroke" label="カスタム円形">
          <circle cx="12" cy="12" r="8" />
          <path d="m20 20-3-3" />
        </Icon>
      </Caption>
      <Caption text='存在しない name — registry に無い場合は path なし (装飾的フェイルセーフ)'>
        <div className="flex items-center gap-2 border border-dashed border-border-subtle p-2 rounded">
          <Icon name="nonexistent_icon" size="md" />
          <span className="text-xs text-onSurface-muted">↑ SVG タグはあるが path なし</span>
        </div>
      </Caption>
      <Caption text='xl + 本文隣接 — baseline が効かないので flex items-center で揃える'>
        <div className="flex items-center gap-2">
          <Icon name="info" size="xl" color="info" />
          <span className="text-base">items-center で揃える</span>
        </div>
      </Caption>
    </div>
  ),
};
