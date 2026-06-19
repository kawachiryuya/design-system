import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Button } from './Button';
import { Icon } from '../Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Button stories — VR 集約モデル (§5-3)
 *
 * 3 節構成 (固定順序):
 * - Playground: args 全開放、Controls の探索起点 (視覚回帰対象外)
 * - Overview:   props で作れる内在パターンを 1 枚に凍結した総覧グリッド (視覚回帰対象)
 * - EdgeCases:  props だけでは作れない文脈依存の崩れやすさ (視覚回帰対象)
 *
 * Docs (Guideline) は Button.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  // description は Button.tsx の Props JSDoc に集約 (react-docgen-typescript が拾う)。
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'destructive'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['left', 'right'] },
    children: { control: 'text' },
    description: { control: 'text' },
    // ReactNode prop は text control にできないため、ラベル → 実 Icon の mapping で
    // Controls から選べるようにする (icon の有無 / iconPosition が Playground で機能する)。
    icon: {
      control: 'select',
      options: ['none', 'check_circle', 'close', 'arrow_forward'],
      mapping: {
        none: undefined,
        check_circle: <Icon name="check_circle" size="sm" />,
        close: <Icon name="close" size="sm" />,
        arrow_forward: <Icon name="arrow_forward" size="sm" />,
      },
    },
    iconOnly: { control: 'boolean' },
  },
  args: {
    children: '保存',
    variant: 'primary',
    size: 'md',
    icon: 'none',
    iconOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────
// args 全開放、Controls から props を探索する起点。click の play test もここに置く。

export const Playground: Story = {
  args: { onClick: fn() },
  parameters: {
    // Controls 探索の起点 → 視覚回帰対象外 (静的な Overview / EdgeCases が VR 対象。§5-3)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を探索する起点。click で onClick が呼ばれることを play test で保証。',
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在的パターンを 1 枚に凍結した総覧グリッド。VR はここを撮る。
//   variant × state マトリクス / サイズ / アイコン (左右/iconOnly) / description (2行CTA)。
// Hover/Focus/Active は storybook-addon-pseudo-states で列ごとに強制表示。

const OV_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive'] as const;
const OV_STATE_COLS = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Loading'] as const;

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧グリッド。variant × state / サイズ / アイコン / description を 1 枚に集約し、Chromatic はここを撮影する。props で作れない文脈依存ケースは EdgeCases へ。',
      },
    },
    pseudo: {
      hover: OV_VARIANTS.map((v) => `#ov-${v}-hover`),
      focusVisible: OV_VARIANTS.map((v) => `#ov-${v}-focus`),
      active: OV_VARIANTS.map((v) => `#ov-${v}-active`),
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* variant (行) × state (列) マトリクス */}
      <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-3 items-center w-fit">
        <div />
        {OV_STATE_COLS.map((s) => (
          <div key={s} className="text-xs text-onSurface-muted">{s}</div>
        ))}
        {OV_VARIANTS.map((v) => (
          <Fragment key={v}>
            <div className="text-xs text-onSurface-muted capitalize">{v}</div>
            <Button variant={v}>Button</Button>
            <Button variant={v} id={`ov-${v}-hover`}>Button</Button>
            <Button variant={v} id={`ov-${v}-focus`}>Button</Button>
            <Button variant={v} id={`ov-${v}-active`}>Button</Button>
            <Button variant={v} disabled>Button</Button>
            <Button variant={v} isLoading>Button</Button>
          </Fragment>
        ))}
      </div>

      {/* サイズ */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size</div>
        <div className="flex gap-3 items-end">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* アイコン (leading / trailing / iconOnly) */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">icon</div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button icon={<Icon name="check_circle" size="sm" />}>左アイコン</Button>
          <Button icon={<Icon name="check_circle" size="sm" />} iconPosition="right">右アイコン</Button>
          <Button iconOnly icon={<Icon name="close" />} aria-label="閉じる" />
        </div>
      </div>

      {/* description (2 行 CTA) — size 別 + variant 別 (全 size で描画) */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">description (2 行 CTA)</div>
        <div className="flex flex-wrap gap-3 items-start">
          <Button size="sm" description="¥1,200">購入</Button>
          <Button size="md" description="¥1,200">購入する</Button>
          <Button size="lg" description="残り3席">予約する</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-start">
          <Button description="¥1,200">購入する</Button>
          <Button variant="secondary" description="¥1,200">あとで決済</Button>
          <Button variant="tertiary" description="¥1,200">カートに入れる</Button>
          <Button variant="destructive" description="取り消せません">削除する</Button>
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない「文脈依存の崩れやすさ」だけをここに残す:
//   fullWidth (親幅に追従) / 長文の折返し / inner-span による truncate。
// ※ 内在状態 (variant/size/state/icon/description) は Overview が持つ。
// ※ iconOnly + 長文 aria-label は非視覚 (SR 専用) なので VR からは外し、
//    axe (test-runner) + guideline で担保する。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'props では作れない文脈依存ケースのみ: fullWidth (親幅追従) / 長文の標準折返し / 内側 span による truncate。内在状態は Overview を参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Caption text="fullWidth (親要素幅に追従)">
        <Button fullWidth>fullWidth で広がる</Button>
      </Caption>
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
    </div>
  ),
};
