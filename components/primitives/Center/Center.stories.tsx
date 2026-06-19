import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Center } from './Center';
import { Caption } from '@sb-blocks/Caption';

/**
 * Center stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → EdgeCases
 * (Sizes は max prop に内包、States は Center に状態なし、WithIcon は icon prop なし、いずれも省略)
 *
 * Docs (Guideline) は Center.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Center> = {
  title: 'Primitives/Center',
  component: Center,
  argTypes: {
    max: { control: 'radio', options: ['sm', 'md', 'lg', 'xl'] },
    as: { control: 'radio', options: ['div', 'section', 'article', 'main'] },
    className: { control: false },
    children: { control: false },
  },
  args: {
    max: 'md',
    as: 'div',
  },
};

export default meta;
type Story = StoryObj<typeof Center>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から max / as を切り替えて挙動を探索する起点。
// 親背景に dashed border を付け、Center の境界 (= max-width の頭打ち位置) を可視化する。

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle p-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Center {...args}>
      <div className="bg-surface border border-border-default rounded-md p-6 text-center">
        <div className="text-onSurface-muted text-sm">この外側の dashed が親、内側の box が Center 内</div>
        <div className="text-onSurface mt-2 font-medium">max: {args.max}</div>
      </div>
    </Center>
  ),
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls の `max` を切り替えて、内側 box の最大幅が `sm` (448) → `md` (768) → `lg` (896) → `xl` (1024) と段階的に広がるのを確認する。`as` は描画 HTML 要素 (semantic タグ) の切り替え、見た目には影響なし。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // box 内のテキストが存在し、Center の DOM が描画されていることを確認
    await expect(canvas.getByText(/max:/)).toBeInTheDocument();
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 4 段階の max-width を縦に並べて見比べ。"どれを使うか" の判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '4 段階の max-width を縦に並べた比較。`sm` は Login / 設定 form、`md` は Article / FAQ (測度最適)、`lg` は Help / 反復 grid、`xl` は Landing / Card grid という想定用途。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text="max=sm — 448px / Login form / Onboarding">
        <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle p-4">
          <Center max="sm">
            <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
              フォーム想定の単列コンテンツ
            </div>
          </Center>
        </div>
      </Caption>

      <Caption text="max=md — 768px / Article 本文 / FAQ (測度最適)">
        <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle p-4">
          <Center max="md">
            <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
              本文として読みやすい幅 (1 行 65 文字前後)
            </div>
          </Center>
        </div>
      </Caption>

      <Caption text="max=lg — 896px / Help / 内側 grid">
        <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle p-4">
          <Center max="lg">
            <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
              内側に 2 col grid 等を持つ反復構造
            </div>
          </Center>
        </div>
      </Caption>

      <Caption text="max=xl — 1024px / Landing / Card grid">
        <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle p-4">
          <Center max="xl">
            <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
              Landing hero / 最大 3 col の card grid
            </div>
          </Center>
        </div>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// semantic タグの切替 / vertical padding は consumer 責務 / 親に何もない時の挙動など。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '`as` で描画タグ切替 (article / section)、Center は vertical padding を持たないので consumer 側で `className="py-12"` 等を付ける運用、親幅が max より狭い場合は親に追従する挙動 (`w-full`)、を確認。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Caption text="as='article' — Article 本文の semantic タグを保ったまま読みやすい幅に">
        <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle p-4">
          <Center as="article" max="md" className="py-8">
            <h2 className="text-heading-md mb-4">記事タイトル</h2>
            <p className="text-body-md text-onSurface-soft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Center>
        </div>
      </Caption>

      <Caption text="vertical padding は Center 自身は持たない (className 経由で付ける)">
        <div className="w-full bg-surface-layer-2 border border-dashed border-border-subtle">
          <Center max="sm" className="py-12">
            <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
              `py-12` を className で渡すと上下 48px の余白
            </div>
          </Center>
        </div>
      </Caption>

      <Caption text="親幅が max より狭い場合 — w-full で親に追従、max は頭打ちのみ">
        <div className="w-64 bg-surface-layer-2 border border-dashed border-border-subtle p-4 mx-auto">
          <Center max="xl">
            <div className="bg-surface border border-border-default rounded-md p-4 text-center text-sm">
              親が 256px、Center max=xl (1024) でも 256px に収まる
            </div>
          </Center>
        </div>
      </Caption>
    </div>
  ),
};
