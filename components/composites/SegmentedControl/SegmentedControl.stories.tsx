import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * SegmentedControl stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → States → WithIcon → EdgeCases
 *
 * variant prop なしのため Variants 省略 (§5-3)。size prop は 40px (h-10) 1 サイズ統一で
 * 廃止済 (Pagination と同じ pattern)、Sizes story も削除。
 */
type PlaygroundArgs = {
  onChange: (v: string) => void;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/SegmentedControl',
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'click でセグメントが切り替わり onChange が呼ばれることを play test で保証。',
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
    const inactiveBtn = canvas.getByRole('button', { name: '無効' });
    await userEvent.click(inactiveBtn);
    await expect(args.onChange).toHaveBeenCalledWith('inactive');
  },
};

// ── 2. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Selected / Unselected の状態と、各状態の Hover / Focus-visible (pseudo-states で強制表示)。',
      },
    },
    // pseudo-states は button 要素自体に :hover / :focus-visible を強制する必要がある
    // (div に強制しても Tailwind の hover:/focus-visible: は反応しない)
    pseudo: {
      hover: ['#sc-hover button'],
      focusVisible: ['#sc-focus button'],
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

// ── 3. WithIcon ────────────────────────────────────────────────

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

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '数値 value (号車選択等) / 多数のセグメント (横スクロール) / 2 択切替の最小ケース / Layout token 適用 (ダッシュボード期間切替で max-w-container + space-y-section-sm).',
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
    function DashboardDemo() {
      const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
      return (
        <div className="w-full px-container py-container max-w-container mx-auto">
          <div className="space-y-section-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-md text-onSurface">アクティビティ</h2>
              <SegmentedControl
                items={[
                  { value: '7d', label: '7 日' },
                  { value: '30d', label: '30 日' },
                  { value: '90d', label: '90 日' },
                ]}
                value={period}
                onChange={setPeriod}
                aria-label="期間"
              />
            </div>
            <div className="grid-base">
              {[
                { label: '訪問者数', value: '12,480' },
                { label: 'CV 率', value: '3.2%' },
                { label: '直帰率', value: '38%' },
              ].map(({ label, value }) => (
                <div key={label} className="col-span-4 md:col-span-4 lg:col-span-4 p-4 border border-border-subtle rounded-md">
                  <p className="text-caption text-onSurface-muted">{label} (直近 {period})</p>
                  <p className="text-heading-md text-onSurface mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6 items-start">
        <Caption text="数値 value (号車選択)"><NumberDemo /></Caption>
        <Caption text="多数のセグメント (横スクロール、width 制約あり)"><ManyDemo /></Caption>
        <Caption text="2 択切替 (最小ケース)"><TwoDemo /></Caption>
        <Caption text="Layout token 適用 (ダッシュボード期間切替、max-w-container + space-y-section-sm + grid-base KPI)"><DashboardDemo /></Caption>
      </div>
    );
  },
};
