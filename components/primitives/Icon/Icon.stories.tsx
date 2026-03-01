import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

// Heroicons (Outline) のサンプルパス
const SearchPath = () => (
  <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>
);
const HomePath = () => (
  <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>
);
const CheckPath = () => <polyline points="20 6 9 17 4 12"/>;
const ClosePath = () => (
  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
);
const TrashPath = () => (
  <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>
);

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'xs=12px / sm=16px / md=20px / lg=24px / xl=32px / 2xl=48px',
    },
    color: {
      control: 'select',
      options: ['inherit', 'neutral', 'primary', 'success', 'error', 'warning', 'disabled'],
    },
    label: { control: 'text', description: 'aria-label。省略すると aria-hidden="true"（装飾）' },
  },
  args: {
    size: 'md',
    color: 'neutral',
    children: <SearchPath />,
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon size={size} color="neutral"><SearchPath /></Icon>
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      {(['neutral', 'primary', 'success', 'error', 'warning', 'disabled'] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <Icon size="lg" color={color}><HomePath /></Icon>
          <span className="text-xs text-neutral-500">{color}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: '意味を持つアイコン（label あり）',
  args: { label: '検索', children: <SearchPath /> },
};

export const Decorative: Story = {
  name: '装飾アイコン（label なし = aria-hidden）',
  args: { children: <CheckPath /> },
};

export const CommonIcons: Story = {
  name: 'よく使うアイコン一覧',
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      {[
        { label: '検索', path: <SearchPath /> },
        { label: 'ホーム', path: <HomePath /> },
        { label: 'チェック', path: <CheckPath /> },
        { label: '閉じる', path: <ClosePath /> },
        { label: '削除', path: <TrashPath /> },
      ].map(({ label, path }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <Icon size="lg" color="neutral">{path}</Icon>
          <span className="text-xs text-neutral-500">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const IconButton: Story = {
  name: '実践例: アイコンボタン（タッチターゲット 44px）',
  render: () => (
    <button type="button" aria-label="検索"
      className="w-11 h-11 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300">
      <Icon size="md" color="neutral"><SearchPath /></Icon>
    </button>
  ),
};
