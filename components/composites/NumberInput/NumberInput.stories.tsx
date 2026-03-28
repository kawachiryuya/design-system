import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Composites/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(1);
    return <NumberInput value={value} onChange={setValue} min={0} max={10} label="数量" />;
  },
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return <NumberInput value={value} onChange={setValue} min={1} max={6} size="small" label="人数" />;
  },
};

export const WithoutLabel: Story = {
  name: 'ラベルなし',
  render: () => {
    const [value, setValue] = useState(1);
    return <NumberInput value={value} onChange={setValue} min={1} max={99} />;
  },
};

export const Disabled: Story = {
  name: '無効状態',
  render: () => {
    const [value, setValue] = useState(2);
    return <NumberInput value={value} onChange={setValue} min={1} max={10} label="数量" disabled />;
  },
};

export const AtBounds: Story = {
  name: '境界値（min=1, max=3）',
  render: () => {
    const [value, setValue] = useState(1);
    return <NumberInput value={value} onChange={setValue} min={1} max={3} label="部屋数" />;
  },
};
