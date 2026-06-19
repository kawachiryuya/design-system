import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { FilterChip } from './FilterChip';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * FilterChip stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → States → WithIcon → EdgeCases
 *
 * FilterChip は variant / size prop を持たないため Variants / Sizes は省略 (§5-3)。
 */
const meta: Meta<typeof FilterChip> = {
  title: 'Composites/FilterChip',
  component: FilterChip,
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    active: false,
    disabled: false,
    children: '並び順: 出発時刻順',
  },
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  args: { onClick: fn() },
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls で active / disabled / children を切替。click で onClick が呼ばれることを play test で保証。',
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

// ── 2. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / Active / Disabled の 3 状態 + 各状態の Hover / Focus-visible。`aria-pressed` で active を SR に伝達。',
      },
    },
    pseudo: {
      hover: ['#fc-default-hover', '#fc-active-hover'],
      focusVisible: ['#fc-default-focus', '#fc-active-focus'],
    },
  },
  render: () => (
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
  ),
};

// ── 3. WithIcon ────────────────────────────────────────────────

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'iconLeft (Filter アイコン等) / iconRight (Modal 起動用 dropdown 矢印等) と、テキストなし iconOnly のパターン。iconOnly は `aria-label` 必須。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />}>左アイコン</FilterChip>
      <FilterChip iconRight={<Icon name="expand_more" size="sm" color="inherit" />}>右に矢印 (Modal 起動)</FilterChip>
      <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />} iconRight={<Icon name="expand_more" size="sm" color="inherit" />}>両端アイコン</FilterChip>
      <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />} aria-label="すべての条件で絞り込み" />
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '横スクロール可能なフィルターバーの実利用例 (Modal 起動 / Toggle / iconOnly の組合せ) / 長文ラベル / 複数 active / Layout token 適用 (検索結果ページの典型構成、max-w-container + filter bar + 結果).',
      },
    },
  },
  render: () => {
    function FilterBar() {
      const [sort, setSort] = useState<'departure' | 'arrival'>('departure');
      const [type, setType] = useState<'all' | 'のぞみ' | 'ひかり'>('all');
      const [hideSoldOut, setHideSoldOut] = useState(false);

      return (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterChip
            iconLeft={<Icon name="tune" size="sm" color="inherit" />}
            aria-label="すべての条件で絞り込み"
          />
          <FilterChip
            iconRight={<Icon name="expand_more" size="sm" color="inherit" />}
            active={sort !== 'departure'}
            onClick={() => setSort(sort === 'departure' ? 'arrival' : 'departure')}
          >
            並び順: {sort === 'departure' ? '出発時刻順' : '到着時刻順'}
          </FilterChip>
          <FilterChip
            iconRight={<Icon name="expand_more" size="sm" color="inherit" />}
            active={type !== 'all'}
            onClick={() => setType(type === 'all' ? 'のぞみ' : 'all')}
          >
            種別: {type === 'all' ? 'すべて' : type}
          </FilterChip>
          <FilterChip
            active={hideSoldOut}
            onClick={() => setHideSoldOut(!hideSoldOut)}
          >
            満席を非表示
          </FilterChip>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <Caption text="フィルターバー (横スクロール、Modal 起動 + Toggle 混在)">
          <FilterBar />
        </Caption>
        <Caption text="長文ラベル (whitespace-nowrap で 1 行固定)">
          <FilterChip iconRight={<Icon name="expand_more" size="sm" color="inherit" />}>
            並び順: ある駅からある駅へ向かう出発時刻が早い順
          </FilterChip>
        </Caption>
        <Caption text="複数 active が並ぶ (フィルタ条件が複数有効)">
          <div className="flex gap-2 flex-wrap">
            <FilterChip active>並び順: 出発時刻順</FilterChip>
            <FilterChip active>種別: のぞみ</FilterChip>
            <FilterChip active>満席を非表示</FilterChip>
          </div>
        </Caption>
        <Caption text="Layout token 適用 (検索結果ページ、max-w-container + filter bar + 結果カード)">
          <div className="w-full px-container py-container max-w-container mx-auto">
            <div className="space-y-section-sm">
              <div className="flex flex-wrap gap-2">
                <FilterChip iconLeft={<Icon name="tune" size="sm" color="inherit" />} aria-label="すべての条件で絞り込み" />
                <FilterChip iconRight={<Icon name="expand_more" size="sm" color="inherit" />} active>並び順: 新着順</FilterChip>
                <FilterChip iconRight={<Icon name="expand_more" size="sm" color="inherit" />}>カテゴリ</FilterChip>
                <FilterChip>送料無料</FilterChip>
                <FilterChip>在庫あり</FilterChip>
              </div>
              <div className="grid-base">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col-span-4 md:col-span-4 lg:col-span-4 p-4 border border-border-subtle rounded-md">
                    <div className="aspect-video bg-surface-disabled rounded mb-3" />
                    <p className="text-label text-onSurface">商品 {i + 1}</p>
                    <p className="text-caption text-onSurface-muted mt-1">¥{(1000 * (i + 1)).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Caption>
      </div>
    );
  },
};
