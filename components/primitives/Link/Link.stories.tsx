import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Link } from './Link';
import { Caption } from '@sb-blocks/Caption';

/**
 * Link stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants → Sizes → States → EdgeCases
 * (Link には icon prop が無いため WithIcon 節は省略。`external` の自動アイコンは EdgeCases で扱う)
 *
 * - Playground: args を全開放、Controls の起点 + click→onClick play test
 * - Variants: 3 つの color (primary/neutral/muted) を静的横並び
 * - Sizes: sm/md/lg を静的横並び
 * - States: Default/Hover/Focus/Active/Disabled (Loading は Link には無い)
 * - EdgeCases: 長文 / 段落中インライン / external + 折返し / underline 3 パターン
 *
 * Docs (Guideline) は Link.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Link> = {
  title: 'Primitives/Link',
  component: Link,
  // description は Link.tsx の Props JSDoc に集約 (react-docgen-typescript が拾う)。
  // argTypes には control 設定のみ書く。
  argTypes: {
    color: { control: 'radio', options: ['primary', 'neutral', 'muted'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    underline: { control: 'radio', options: ['always', 'hover', 'none'] },
    external: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    href: '#',
    children: 'リンクテキスト',
    color: 'primary',
    size: 'md',
    underline: 'hover',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls タブから props を探索する起点。
// 基本動作 (click → onClick) の play test もここに置く。

export const Playground: Story = {
  // onClick で preventDefault — `<a href="#">` のデフォルト遷移が Storybook iframe の
  // URL state を変えてサイドバーが折り畳まれるのを防ぐ。spy は wrap した中で動くので
  // toHaveBeenCalledTimes() は変わらず動く。
  args: { onClick: fn((e) => e.preventDefault()) },
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。click で onClick が呼ばれることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 3 つの color を静的に横並び。"どこに何を使うか" の判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '3 つの color を横並びで比較。primary は CTA / 本文中の参照、neutral はナビゲーション、muted はフッター / 規約リンク。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6 items-center">
      <Link href="#" color="primary">Primary</Link>
      <Link href="#" color="neutral">Neutral</Link>
      <Link href="#" color="muted">Muted</Link>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────
// 3 つのサイズを静的に横並び。本文と組み合わせるなら md、CTA は lg を選ぶ。

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (14px) / md (16px) / lg (18px) の見比べ。本文と組合せるなら md、CTA リンクは lg。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6 items-baseline">
      <Link href="#" size="sm">Small</Link>
      <Link href="#" size="md">Medium</Link>
      <Link href="#" size="lg">Large</Link>
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────
// Default / Hover / Focus-visible / Active / Disabled を単独表示。
// Hover/Focus/Active は storybook-addon-pseudo-states で擬似状態を強制適用。
// Loading 状態は Link には無い (遷移は同期、ローディングは遷移先で扱う)。

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / Hover / Focus-visible / Active / Disabled を一覧。Hover/Focus/Active は pseudo-states で強制表示。Loading 状態は Link には無い (遷移は同期処理)。',
      },
    },
    pseudo: {
      hover: ['#link-hover'],
      focusVisible: ['#link-focus'],
      active: ['#link-active'],
    },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4 items-start">
      <Caption text="Default">
        <Link href="#">Default</Link>
      </Caption>
      <Caption text="Hover">
        <Link href="#" id="link-hover">Hover</Link>
      </Caption>
      <Caption text="Focus-visible">
        <Link href="#" id="link-focus">Focus</Link>
      </Caption>
      <Caption text="Active">
        <Link href="#" id="link-active">Active</Link>
      </Caption>
      <Caption text="Disabled">
        <Link href="#" disabled>Disabled</Link>
      </Caption>
    </div>
  ),
};

// ── 5. EdgeCases ───────────────────────────────────────────────
// 長文 / 段落内インライン / external + 折返し / underline 3 パターンなど、
// 視覚的に壊れやすい / 確認したいケースの監視用。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '長文 (折返し) / 段落中インライン (text-decoration の継承) / external + 長文 (外部アイコンが行末に来るか) / underline 3 パターン (always/hover/none) の挙動を監視。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Caption text="長文 — 折返し挙動">
        <Link href="#">ここに非常に長いリンクテキストが入って折返しがどう動くかを確認する</Link>
      </Caption>
      <Caption text="段落中インライン (text-decoration が周辺と分離)">
        <p className="text-base leading-relaxed">
          このサービスをご利用の際は、<Link href="#">利用規約</Link>および
          <Link href="#">プライバシーポリシー</Link>に同意したものとみなします。
        </p>
      </Caption>
      <Caption text="external + 長文 — 外部アイコンの位置">
        <Link href="https://example.com" external>非常に長い外部リンクテキスト ここに external プロパティ付きで折返し挙動を確認する</Link>
      </Caption>
      <Caption text="underline 3 パターン">
        <div className="flex flex-col gap-2">
          <Link href="#" underline="always">underline=always (常に下線)</Link>
          <Link href="#" underline="hover">underline=hover (ホバー時のみ)</Link>
          <Link href="#" underline="none">underline=none (下線なし)</Link>
        </div>
      </Caption>
    </div>
  ),
};
