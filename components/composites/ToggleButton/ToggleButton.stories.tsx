import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { ToggleButton } from './ToggleButton';
import { Caption } from '@sb-blocks/Caption';

/**
 * ToggleButton stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → States → EdgeCases
 *
 * ToggleButton は variant / size / icon prop を持たないため Variants / Sizes / WithIcon は省略 (§5-3)。
 */
const meta: Meta<typeof ToggleButton> = {
  title: 'Composites/ToggleButton',
  component: ToggleButton,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    selected: false,
    disabled: false,
    children: '1',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  args: { onClick: fn() },
  parameters: {
    docs: {
      description: {
        story: 'Controls から selected / disabled / children を切り替えて挙動を確認。click で onClick が呼ばれることを play test で保証。',
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
// Default / Selected / Disabled + 各状態の Hover / Focus-visible (pseudo-states 強制)

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / Selected / Disabled の 3 状態と、Default / Selected それぞれの Hover / Focus-visible (pseudo-states で強制表示)。`aria-pressed` で選択状態を SR に伝達。',
      },
    },
    pseudo: {
      hover: ['#tb-default-hover', '#tb-selected-hover'],
      focusVisible: ['#tb-default-focus', '#tb-selected-focus'],
    },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4 items-end">
      <Caption text="Default"><ToggleButton>1</ToggleButton></Caption>
      <Caption text="Selected"><ToggleButton selected>2</ToggleButton></Caption>
      <Caption text="Disabled"><ToggleButton disabled>3</ToggleButton></Caption>
      <Caption text="Default + Hover"><ToggleButton id="tb-default-hover">4</ToggleButton></Caption>
      <Caption text="Selected + Hover"><ToggleButton id="tb-selected-hover" selected>5</ToggleButton></Caption>
      <div />
      <Caption text="Default + Focus"><ToggleButton id="tb-default-focus">6</ToggleButton></Caption>
      <Caption text="Selected + Focus"><ToggleButton id="tb-selected-focus" selected>7</ToggleButton></Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用に近い「座席グリッド」例 (occupied = 予約済み = disabled、selected トグル可能) と、長めラベル / 2 文字以上の表示確認。',
      },
    },
  },
  render: () => {
    function SeatGrid() {
      const [selected, setSelected] = useState<string[]>([]);
      const occupied = ['1B', '2A', '3C'];
      const rows = [1, 2, 3, 4, 5];
      const cols = ['A', 'B', 'C'];

      const toggle = (id: string) => {
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        );
      };

      return (
        <div className="space-y-1">
          {rows.map((row) => (
            <div key={row} className="flex gap-1">
              {cols.map((col) => {
                const id = `${row}${col}`;
                const isOccupied = occupied.includes(id);
                return (
                  <ToggleButton
                    key={id}
                    selected={selected.includes(id)}
                    disabled={isOccupied}
                    onClick={() => toggle(id)}
                    aria-label={`座席 ${id}${isOccupied ? ' 予約済み' : ''}`}
                  >
                    {row}
                  </ToggleButton>
                );
              })}
            </div>
          ))}
          {selected.length > 0 && (
            <p className="text-sm text-onSurface-muted mt-2">
              選択中: {selected.join(', ')}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <Caption text="座席グリッド (実利用例)">
          <SeatGrid />
        </Caption>
        <Caption text="複数文字ラベル">
          <div className="flex gap-2">
            <ToggleButton>10</ToggleButton>
            <ToggleButton selected>21</ToggleButton>
            <ToggleButton>99</ToggleButton>
          </div>
        </Caption>
      </div>
    );
  },
};
