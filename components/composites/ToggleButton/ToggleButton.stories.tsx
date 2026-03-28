import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ToggleButton } from './ToggleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'Composites/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    selected: false,
    disabled: false,
    children: '1',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllStates: Story = {
  name: '3状態の比較',
  render: () => (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <ToggleButton>1</ToggleButton>
        <span className="text-xs text-onSurface-muted">空席</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <ToggleButton selected>2</ToggleButton>
        <span className="text-xs text-onSurface-muted">選択中</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <ToggleButton disabled>3</ToggleButton>
        <span className="text-xs text-onSurface-muted">無効</span>
      </div>
    </div>
  ),
};

export const GridExample: Story = {
  name: '実践例: 座席グリッド',
  render: () => {
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
  },
};
