import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * SegmentedControl stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * 状態 (selected/unselected) × interaction (hover/focus は pseudo 強制) + icon ラベルを Overview に集約。
 * 多数セグメントの固定幅オーバーフローは width 依存の構造ケースなので EdgeCases。
 * 号車選択 / 2 択 / ダッシュボード期間切替等の usage は guideline の「使用例」へ移設。
 * variant / size prop は無し (40px 1 サイズ統一)。
 */
type PlaygroundArgs = {
  onChange: (v: string) => void;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/SegmentedControl',
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'click / 矢印キーでセグメントが切り替わり onChange が呼ばれること、radiogroup の role/aria-checked を play test で保証。',
      },
    },
  },
  args: {
    onChange: fn(),
  },
  render: ({ onChange }) => {
    function Demo() {
      const [value, setValue] = useState('all');
      return (
        <SegmentedControl
          items={[
            { value: 'all', label: 'すべて' },
            { value: 'active', label: '有効' },
            { value: 'inactive', label: '無効' },
          ]}
          value={value}
          onChange={(v) => { setValue(v); onChange(v); }}
          aria-label="フィルター"
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inactive = canvas.getByRole('radio', { name: '無効' });
    await userEvent.click(inactive);
    await expect(args.onChange).toHaveBeenCalledWith('inactive');
    await expect(inactive).toHaveAttribute('aria-checked', 'true');

    // roving tabindex + 矢印キー: 末尾 (無効) から ArrowRight でラップして先頭 (すべて) を選択
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onChange).toHaveBeenCalledWith('all');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// selected/unselected (1 つの control が両方を内包) + hover/focus (pseudo 強制) + icon ラベル。
// value は controlled なので静的値 + no-op onChange で凍結。

export const Overview: Story = {
  parameters: {
    pseudo: {
      hover: ['#sc-hover button'],
      focusVisible: ['#sc-focus button'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。selected + unselected を内包した control と、hover / focus-visible (pseudo 強制)、icon ラベル (表示モード等) を集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Caption text="Default (selected + unselected 並列)">
        <SegmentedControl
          items={[{ value: 'a', label: 'A (selected)' }, { value: 'b', label: 'B' }]}
          value="a" onChange={() => {}} aria-label="states demo"
        />
      </Caption>
      <Caption text="Hover (pseudo 強制)">
        <div id="sc-hover">
          <SegmentedControl
            items={[{ value: 'a', label: 'A (selected)' }, { value: 'b', label: 'B' }]}
            value="a" onChange={() => {}} aria-label="hover demo"
          />
        </div>
      </Caption>
      <Caption text="Focus-visible (pseudo 強制)">
        <div id="sc-focus">
          <SegmentedControl
            items={[{ value: 'a', label: 'A (selected)' }, { value: 'b', label: 'B' }]}
            value="a" onChange={() => {}} aria-label="focus demo"
          />
        </div>
      </Caption>
      <Caption text="icon ラベル (表示モード: リスト / グリッド)">
        <SegmentedControl
          items={[
            { value: 'list', label: <span className="inline-flex items-center gap-1"><Icon name="list" size="sm" color="inherit" /> リスト</span> },
            { value: 'grid', label: <span className="inline-flex items-center gap-1"><Icon name="grid_view" size="sm" color="inherit" /> グリッド</span> },
          ]}
          value="list" onChange={() => {}} aria-label="表示モード"
        />
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// 多数セグメントを固定幅 (w-80) に入れた時のはみ出し挙動 = width + item 数依存の構造ケース。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '多数セグメント (10 件) を固定幅 w-80 に収めた時のはみ出し挙動 — コンテナ幅 + item 数依存の構造ケース。号車選択 / 2 択 / ダッシュボード期間切替の usage は guideline 使用例へ移設。',
      },
    },
  },
  render: () => (
    <Caption text="多数セグメント (10 件、固定幅 w-80 ではみ出し挙動を確認)">
      <div className="w-80">
        <SegmentedControl
          items={Array.from({ length: 10 }, (_, i) => ({ value: i, label: `Day ${i + 1}` }))}
          value={0} onChange={() => {}} aria-label="日付"
        />
      </div>
    </Caption>
  ),
};
