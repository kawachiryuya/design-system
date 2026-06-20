import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { FilterChip } from './FilterChip';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * FilterChip stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * 状態 (default/active/disabled) × interaction (hover/focus は pseudo 強制) + icon 構成を Overview に集約。
 * フィルターバー (横スクロール・複数 active)・長文ラベル等の usage は guideline の「使用例」へ移設。
 * variant / size prop は無し。
 */
const meta: Meta<typeof FilterChip> = {
  title: 'Composites/FilterChip',
  component: FilterChip,
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    // ReactNode prop は mapping で Controls 化 (none = アイコンなし)
    iconLeft: {
      control: 'select',
      options: ['none', 'tune'],
      mapping: { none: undefined, tune: <Icon name="tune" size="sm" color="inherit" /> },
    },
    iconRight: {
      control: 'select',
      options: ['none', 'expand_more'],
      mapping: { none: undefined, expand_more: <Icon name="expand_more" size="sm" color="inherit" /> },
    },
  },
  args: {
    active: false,
    disabled: false,
    children: '並び順: 出発時刻順',
  },
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  args: { onClick: fn() },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls で active / disabled / children / iconLeft / iconRight (none/tune/expand_more) を切替。click で onClick が呼ばれることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button');
    await userEvent.click(btn);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// 状態 × interaction (hover/focus は pseudo 強制) + icon 構成 (iconLeft/iconRight/両端/iconOnly)。

export const Overview: Story = {
  parameters: {
    pseudo: {
      hover: ['#fc-default-hover', '#fc-active-hover'],
      focusVisible: ['#fc-default-focus', '#fc-active-focus'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。default / active / disabled の状態と hover / focus-visible (pseudo 強制) のマトリクス、icon 構成 (iconLeft / iconRight=Modal 起動 / 両端 / iconOnly) を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">状態 × interaction (aria-pressed で active を SR へ)</div>
        <div className="grid grid-cols-3 gap-4 items-start">
          <Caption text="Default"><FilterChip>並び順</FilterChip></Caption>
          <Caption text="Active"><FilterChip active>並び順: 出発時刻順</FilterChip></Caption>
          <Caption text="Disabled"><FilterChip disabled>並び順</FilterChip></Caption>
          <Caption text="Default + Hover"><FilterChip id="fc-default-hover">並び順</FilterChip></Caption>
          <Caption text="Active + Hover"><FilterChip id="fc-active-hover" active>並び順</FilterChip></Caption>
          <div />
          <Caption text="Default + Focus"><FilterChip id="fc-default-focus">並び順</FilterChip></Caption>
          <Caption text="Active + Focus"><FilterChip id="fc-active-focus" active>並び順</FilterChip></Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">icon 構成 (iconOnly は aria-label 必須)</div>
        <div className="flex flex-wrap gap-3 items-center">
          <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />}>左アイコン</FilterChip>
          <FilterChip iconRight={<Icon name="expand_more" size="sm" color="inherit" />}>右に矢印 (Modal 起動)</FilterChip>
          <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />} iconRight={<Icon name="expand_more" size="sm" color="inherit" />}>両端アイコン</FilterChip>
          <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />} aria-label="すべての条件で絞り込み" />
        </div>
      </div>
    </div>
  ),
};
