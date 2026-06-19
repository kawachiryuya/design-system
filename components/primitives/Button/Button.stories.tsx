import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Button } from './Button';
import { Icon } from '../Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Button stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants → Sizes → States → WithIcon → WithDescription → EdgeCases
 *
 * - Playground: args を全開放、Controls の起点
 * - Variants / Sizes / WithIcon: 静的横並び (args 非依存) でカタログ化
 * - States: Hover / Focus / Active は storybook-addon-pseudo-states で強制表示
 * - EdgeCases: fullWidth / 長文 / icon-only に長文 aria-label など壊れやすいケース
 *
 * Docs (Guideline) は Button.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  // description は Button.tsx の Props JSDoc に集約 (react-docgen-typescript が拾う)。
  // argTypes には control 設定のみ書く。
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'destructive'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['left', 'right'] },
    children: { control: 'text' },
    description: { control: 'text' },
    icon: { control: false },
    iconOnly: { control: false },
  },
  args: {
    children: '保存',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls タブから props を探索する起点。
// 基本動作 (click → onClick) の play test もここに置く。

export const Playground: Story = {
  args: { onClick: fn() },
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。click で onClick が呼ばれることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Variants ────────────────────────────────────────────────
// 4つの variant を静的に横並び。"どれを使い分けるか" の判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '4つの variant を横並びで比較。primary は1画面1つ、secondary は副次、tertiary は補助、destructive は破壊的アクション。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────
// 3つのサイズを静的に横並び。タッチターゲット (44px) との関係を確認。

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'small (40px) / medium (48px) / large (56px) の見比べ。全 step +8 等差で grid 整合 (Material 3 max と同等)。medium 以上で WCAG 2.5.5 のタッチターゲット要件を満たす。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────
// Default / Hover / Focus-visible / Active / Disabled / Loading を単独表示。
// Hover/Focus/Active は storybook-addon-pseudo-states で擬似状態を強制適用。

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / Hover / Focus-visible / Active / Disabled / Loading を一覧。Hover/Focus/Active は pseudo-states で強制表示しているのでマウス操作なしで見える。',
      },
    },
    pseudo: {
      hover: ['#btn-hover'],
      focusVisible: ['#btn-focus'],
      active: ['#btn-active'],
    },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4 items-end">
      <Caption text="Default">
        <Button>Default</Button>
      </Caption>
      <Caption text="Hover">
        <Button id="btn-hover">Hover</Button>
      </Caption>
      <Caption text="Focus-visible">
        <Button id="btn-focus">Focus</Button>
      </Caption>
      <Caption text="Active">
        <Button id="btn-active">Active</Button>
      </Caption>
      <Caption text="Disabled">
        <Button disabled>Disabled</Button>
      </Caption>
      <Caption text="Loading">
        <Button isLoading>Loading</Button>
      </Caption>
    </div>
  ),
};

// ── 5. WithIcon ────────────────────────────────────────────────
// icon prop は ReactNode のため Controls で表現しづらい。
// leading / trailing / iconOnly の3パターンをカタログ化。

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'left/right にアイコンを併置するパターンと、テキストなしの iconOnly モード (aria-label が型レベルで必須)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button icon={<Icon name="check_circle" size="sm" />}>左アイコン</Button>
      <Button icon={<Icon name="check_circle" size="sm" />} iconPosition="right">
        右アイコン
      </Button>
      <Button iconOnly icon={<Icon name="close" />} aria-label="閉じる" />
    </div>
  ),
};

// ── 6. WithDescription ─────────────────────────────────────────
// 2 行 CTA (主ラベル + サブ情報)。モバイル CTA で価格・残数などを 1 押下対象に集約する用途。
// size="sm" では description は描画されない (タッチターゲット内で潰れるため)。

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: '主ラベル下に description を並べる 2 行 CTA。価格・残数などのサブ情報を主アクションと同じ押下対象に集約する想定。`size="sm"` では description は描画されない (タッチターゲット内で潰れるため、最下段で挙動確認)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <Caption text="md (text-base + text-xs)">
        <Button description="¥1,200">購入する</Button>
      </Caption>
      <Caption text="lg (text-lg + text-sm) — モバイル CTA 想定">
        <Button size="lg" description="残り3席">予約する</Button>
      </Caption>
      <Caption text="lg + fullWidth + icon (左)">
        <Button
          size="lg"
          fullWidth
          icon={<Icon name="check_circle" size="md" />}
          description="送料無料 / 明日お届け"
        >
          注文を確定する
        </Button>
      </Caption>
      <Caption text="variant ごとの見え方">
        <div className="flex flex-wrap gap-3 items-end">
          <Button description="¥1,200">購入する</Button>
          <Button variant="secondary" description="¥1,200">あとで決済</Button>
          <Button variant="tertiary" description="¥1,200">カートに入れる</Button>
          <Button variant="destructive" description="この操作は取り消せません">削除する</Button>
        </div>
      </Caption>
      <Caption text="size='sm' は description を無視 (1 行のまま)">
        <Button size="sm" description="¥1,200">購入</Button>
      </Caption>
    </div>
  ),
};

// ── 7. EdgeCases ───────────────────────────────────────────────
// fullWidth / 長文ラベル / 短文 + min-width / icon-only に長文 aria-label など、
// 視覚的に壊れやすいケースの監視用。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'fullWidth / 長文 (標準折返し・内側 span で truncate の 2 挙動) / 短文 (min-width 確認) / icon-only + 長文 aria-label など、壊れやすいケースの監視一覧。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Caption text="fullWidth (親要素幅に追従)">
        <Button fullWidth>fullWidth で広がる</Button>
      </Caption>
      {/* 長文 × fullWidth の挙動 2 パターン: 標準 (折返す) / truncate (1行で省略) */}
      <Caption text="fullWidth + 長文 — 標準 (折返す)">
        <Button fullWidth>ここに非常に長いラベルテキストが入って折返しを確認する</Button>
      </Caption>
      <Caption text="fullWidth + 長文 — truncate (1行で省略...)">
        {/* Button は inline-flex なので truncate を直接当てても効かない (テキストノードが収縮しない)。
            ellipsis を出すには内側に min-w-0 truncate を持つ span を挟むのが Tailwind/Flexbox の定石。 */}
        <Button fullWidth>
          <span className="min-w-0 truncate">ここに非常に長いラベルテキストが入って折返しを確認する</span>
        </Button>
      </Caption>
      <Caption text="短文 (min-width が効いて潰れない)">
        {/* items-end で flex stretch を無効化 → 各 Button が size 別の高さを保つ */}
        <div className="flex gap-2 items-end">
          <Button size="sm">OK</Button>
          <Button size="md">OK</Button>
          <Button size="lg">OK</Button>
        </div>
      </Caption>
      <Caption text="iconOnly + 長文 aria-label (SR で読まれる文字列を併記)">
        {/* iconOnly モードでは aria-label が SR にだけ届く。視覚カタログでは見えないため、
            実際に SR が読み上げる文字列を下に併記して読者の認識を補助する。 */}
        <div className="flex flex-col items-start gap-1">
          <Button iconOnly icon={<Icon name="close" />} aria-label="このダイアログを閉じて元の画面に戻る" />
          <span className="text-xs text-onSurface-muted font-mono">aria-label="このダイアログを閉じて元の画面に戻る"</span>
        </div>
      </Caption>
    </div>
  ),
};

