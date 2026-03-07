import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta = {
  title: 'Composites/SegmentedControl',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium'] },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('all');
    return (
      <SegmentedControl
        items={[
          { value: 'all', label: 'すべて' },
          { value: 'active', label: '有効' },
          { value: 'inactive', label: '無効' },
        ]}
        value={value}
        onChange={setValue}
        aria-label="フィルター"
      />
    );
  },
};

export const Medium: Story = {
  name: 'サイズ: medium',
  render: () => {
    const [value, setValue] = useState('monthly');
    return (
      <SegmentedControl
        items={[
          { value: 'daily', label: '日次' },
          { value: 'weekly', label: '週次' },
          { value: 'monthly', label: '月次' },
        ]}
        value={value}
        onChange={setValue}
        size="medium"
        aria-label="表示期間"
      />
    );
  },
};

export const NumberValues: Story = {
  name: '実践例: 号車選択',
  render: () => {
    const [car, setCar] = useState(1);
    return (
      <SegmentedControl
        items={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n}号車` }))}
        value={car}
        onChange={setCar}
        aria-label="号車選択"
      />
    );
  },
};

export const TwoOptions: Story = {
  name: '2択切替',
  render: () => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl
        items={[
          { value: 'list', label: 'リスト' },
          { value: 'grid', label: 'グリッド' },
        ]}
        value={value}
        onChange={setValue}
        aria-label="表示切替"
      />
    );
  },
};
