import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterChip } from './FilterChip';
import { Icon } from '../../primitives/Icon';

const meta: Meta<typeof FilterChip> = {
  title: 'Composites/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    active: false,
    disabled: false,
    children: '並び順: 出発時刻順',
  },
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const WithDropdownIcon: Story = {
  name: 'Dropdown 風（Modal 起動）',
  args: {
    children: '種別: のぞみ',
    active: true,
    iconRight: <Icon name="expand_more" size="sm" color="inherit" />,
  },
};

export const IconOnly: Story = {
  name: 'アイコンのみ（Modal 起動）',
  args: {
    children: undefined,
    iconLeft: <Icon name="tune" size="sm" color="inherit" />,
    'aria-label': 'すべての条件で絞り込み',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FilterBar: Story = {
  name: '実践例: フィルターバー',
  render: () => {
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
  },
};
