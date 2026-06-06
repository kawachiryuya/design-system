import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * SegmentedControl stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → WithIcon → EdgeCases
 *
 * SegmentedControl は variant prop を持たないため Variants は省略 (§5-3)。
 */
const meta: Meta = {
  title: 'Composites/SegmentedControl',
};

export default meta;
type Story = StoryObj;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から size を切替。click でセグメントが切り替わり onChange が呼ばれることを play test で保証。',
      },
    },
  },
  args: {
    size: 'sm',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
  },
  render: ({ size, onChange }) => {
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
          size={size}
          aria-label="フィルター"
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inactiveBtn = canvas.getByRole('button', { name: '無効' });
    await userEvent.click(inactiveBtn);
    await expect(args.onChange).toHaveBeenCalledWith('inactive');
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (40px) / md (48px) の 2 段階。md 以上で WCAG 2.5.5 タッチターゲット要件 (44×44px) を満たす。',
      },
    },
  },
  render: () => {
    function SizeDemo({ size }: { size: 'sm' | 'md' }) {
      const [v, setV] = useState('list');
      return (
        <SegmentedControl
          items={[
            { value: 'list', label: 'リスト' },
            { value: 'grid', label: 'グリッド' },
          ]}
          value={v}
          onChange={setV}
          size={size}
          aria-label={`表示切替 ${size}`}
        />
      );
    }
    return (
      <div className="flex flex-col gap-4 items-start">
        <Caption text="sm (40px)"><SizeDemo size="sm" /></Caption>
        <Caption text="md (48px)"><SizeDemo size="md" /></Caption>
      </div>
    );
  },
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Selected / Unselected の状態と、各状態の Hover / Focus-visible (pseudo-states で強制表示)。',
      },
    },
    pseudo: {
      hover: ['#sc-hover'],
      focusVisible: ['#sc-focus'],
    },
  },
  render: () => {
    function StaticDemo({ id }: { id?: string }) {
      const [v, setV] = useState('a');
      return (
        <div id={id}>
          <SegmentedControl
            items={[
              { value: 'a', label: 'A (selected)' },
              { value: 'b', label: 'B' },
            ]}
            value={v}
            onChange={setV}
            aria-label="states demo"
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4 items-start">
        <Caption text="Default (Selected + Unselected 並列)"><StaticDemo /></Caption>
        <Caption text="Hover (pseudo-states 強制)"><StaticDemo id="sc-hover" /></Caption>
        <Caption text="Focus-visible (pseudo-states 強制)"><StaticDemo id="sc-focus" /></Caption>
      </div>
    );
  },
};

// ── 4. WithIcon ────────────────────────────────────────────────

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ラベルに `<Icon>` を含めて視覚的な意味を補強するパターン (表示モード / ソート方向 等)。',
      },
    },
  },
  render: () => {
    function IconDemo() {
      const [view, setView] = useState<'list' | 'grid'>('list');
      return (
        <SegmentedControl
          items={[
            { value: 'list', label: <span className="inline-flex items-center gap-1"><Icon name="list" size="sm" color="inherit" /> リスト</span> },
            { value: 'grid', label: <span className="inline-flex items-center gap-1"><Icon name="grid_view" size="sm" color="inherit" /> グリッド</span> },
          ]}
          value={view}
          onChange={setView}
          aria-label="表示モード"
        />
      );
    }
    return <IconDemo />;
  },
};

// ── 5. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '数値 value (号車選択等) / 多数のセグメント (横スクロール) / 2 択切替の最小ケース。',
      },
    },
  },
  render: () => {
    function NumberDemo() {
      const [car, setCar] = useState(1);
      return (
        <SegmentedControl
          items={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n}号車` }))}
          value={car}
          onChange={setCar}
          aria-label="号車選択"
        />
      );
    }
    function ManyDemo() {
      const [v, setV] = useState(0);
      return (
        <div className="w-80">
          <SegmentedControl
            items={Array.from({ length: 10 }, (_, i) => ({ value: i, label: `Day ${i + 1}` }))}
            value={v}
            onChange={setV}
            aria-label="日付"
          />
        </div>
      );
    }
    function TwoDemo() {
      const [v, setV] = useState('list');
      return (
        <SegmentedControl
          items={[
            { value: 'list', label: 'リスト' },
            { value: 'grid', label: 'グリッド' },
          ]}
          value={v}
          onChange={setV}
          aria-label="表示切替"
        />
      );
    }
    return (
      <div className="flex flex-col gap-6 items-start">
        <Caption text="数値 value (号車選択)"><NumberDemo /></Caption>
        <Caption text="多数のセグメント (横スクロール、width 制約あり)"><ManyDemo /></Caption>
        <Caption text="2 択切替 (最小ケース)"><TwoDemo /></Caption>
      </div>
    );
  },
};
