import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';
import { Caption } from '@sb-blocks/Caption';

/**
 * Breadcrumb stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants (separator) → States → EdgeCases
 *
 * Breadcrumb は size / icon prop を持たないため Sizes / WithIcon は省略 (§5-3)。
 * 「Variants」軸は separator (chevron / slash / dot) として扱う。
 */
const sampleItems = [
  { label: 'ホーム', href: '/' },
  { label: 'ブログ', href: '/blog' },
  { label: 'デザインシステム', href: '/blog/design-system' },
  { label: 'Atomic Design とは' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Composites/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: { control: 'radio', options: ['chevron', 'slash', 'dot'] },
    ariaLabel: { control: 'text' },
  },
  args: {
    items: sampleItems,
    separator: 'chevron',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から separator / ariaLabel を切替。最後の項目は href なしで自動的に `aria-current="page"` 付与。',
      },
    },
  },
};

// ── 2. Variants (separator) ────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'separator の 3 種類 (chevron / slash / dot) を縦並び比較。chevron が標準 (視認性高)、slash は密集 UI、dot はミニマル。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      {(['chevron', 'slash', 'dot'] as const).map((sep) => (
        <Caption key={sep} text={`separator="${sep}"`}>
          <Breadcrumb items={sampleItems} separator={sep} />
        </Caption>
      ))}
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '段数違い (1 段 / 2 段 / 多段) と、link の hover / focus-visible 状態。',
      },
    },
    pseudo: {
      hover: ['#bc-hover a'],
      focusVisible: ['#bc-focus a'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      <Caption text="単一階層 (現在ページのみ)">
        <Breadcrumb items={[{ label: 'ダッシュボード' }]} />
      </Caption>
      <Caption text="2 階層">
        <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '設定' }]} />
      </Caption>
      <Caption text="多階層 (4 段)">
        <Breadcrumb items={sampleItems} />
      </Caption>
      <Caption text="リンク Hover (pseudo-states 強制)">
        <div id="bc-hover">
          <Breadcrumb items={sampleItems} />
        </div>
      </Caption>
      <Caption text="リンク Focus-visible (pseudo-states 強制)">
        <div id="bc-focus">
          <Breadcrumb items={sampleItems} />
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
        story: '長文ラベル (max-w-[200px] で truncate) / 全項目に href がある / EC カテゴリナビ / Layout token 適用 (page header に Breadcrumb + ページタイトル).',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      <Caption text="長文ラベル (max-w-[200px] で truncate)">
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: 'カテゴリ', href: '/cat' },
          { label: 'とても長いページタイトルが入ることもある複数行に折り返す可能性のあるラベル' },
        ]} />
      </Caption>
      <Caption text="全項目に href (最後の項目も link 扱い、まだ詳細ページ移動可)">
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: 'プロジェクト', href: '/projects' },
          { label: 'design-system', href: '/projects/ds' },
        ]} />
      </Caption>
      <Caption text="EC サイトのカテゴリナビ (実利用例)">
        <div className="flex flex-col gap-3">
          <Breadcrumb separator="chevron" items={[
            { label: 'トップ', href: '/' },
            { label: 'ファッション', href: '/fashion' },
            { label: 'メンズ', href: '/fashion/mens' },
            { label: 'Tシャツ' },
          ]} />
          <Breadcrumb separator="slash" items={[
            { label: 'トップ', href: '/' },
            { label: 'デジタル', href: '/digital' },
            { label: 'スマートフォン' },
          ]} />
        </div>
      </Caption>
      <Caption text="Layout token 適用 (page header に Breadcrumb + ページタイトル、max-w-container + space-y-2)">
        <div className="w-full px-container py-container max-w-container mx-auto">
          <div className="space-y-2">
            <Breadcrumb items={[
              { label: 'ホーム', href: '/' },
              { label: '製品', href: '/products' },
              { label: 'デザインシステム', href: '/products/design-system' },
              { label: 'コンポーネント一覧' },
            ]} />
            <h1 className="text-heading-lg text-onSurface">コンポーネント一覧</h1>
            <p className="text-body-md text-onSurface-muted">デザインシステムで提供する全コンポーネントの一覧です。</p>
          </div>
        </div>
      </Caption>
    </div>
  ),
};
