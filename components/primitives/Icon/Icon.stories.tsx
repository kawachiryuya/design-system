import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { getIconNames, iconRegistry } from './iconRegistry';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [undefined, ...getIconNames()],
      description: 'レジストリからアイコンを取得',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'sm=20px / md=24px / lg=32px / xl=48px',
    },
    color: {
      control: 'select',
      options: ['inherit', 'neutral', 'primary', 'success', 'error', 'warning', 'info', 'disabled'],
    },
    variant: {
      control: 'radio',
      options: [undefined, 'fill', 'stroke'],
      description: 'レンダリングモード（name 指定時はレジストリから自動判定）',
    },
    label: { control: 'text', description: 'aria-label。省略すると aria-hidden="true"（装飾）' },
  },
  args: {
    name: 'search',
    size: 'md',
    color: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const AllRegisteredIcons: Story = {
  name: 'アイコン一覧（レジストリ）',
  render: () => (
    <div className="grid grid-cols-4 gap-4" style={{ maxWidth: '480px' }}>
      {getIconNames().map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 p-3 rounded border border-border-muted">
          <Icon name={name} size="md" color="neutral" />
          <span className="text-xs text-onSurface-muted text-center">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon name="search" size={size} color="neutral" />
          <span className="text-xs text-onSurface-muted">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      {(['neutral', 'primary', 'success', 'error', 'warning', 'info', 'disabled'] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <Icon name="info" size="md" color={color} />
          <span className="text-xs text-onSurface-muted">{color}</span>
        </div>
      ))}
    </div>
  ),
};

export const Named: Story = {
  name: 'name prop（レジストリ参照）',
  args: { name: 'check_circle', size: 'md', color: 'success' },
};

export const CustomSVG: Story = {
  name: 'カスタム SVG（children + variant="stroke"）',
  args: {
    name: undefined,
    variant: 'stroke',
    size: 'md',
    color: 'neutral',
    children: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </>
    ),
  },
};

export const IconButton: Story = {
  name: '実践例: アイコンボタン（タッチターゲット 44px）',
  render: () => (
    <button
      type="button"
      aria-label="検索"
      className="w-11 h-11 flex items-center justify-center rounded hover:bg-state-hover active:bg-state-active transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      <Icon name="search" size="md" color="neutral" />
    </button>
  ),
};

export const RegistryDetails: Story = {
  name: 'レジストリ詳細',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <table style={{ fontSize: '13px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #E5E5E5', color: '#737373' }}>Icon</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #E5E5E5', color: '#737373' }}>name</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #E5E5E5', color: '#737373' }}>label</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #E5E5E5', color: '#737373' }}>mode</th>
          </tr>
        </thead>
        <tbody>
          {getIconNames().map((name) => {
            const def = iconRegistry[name];
            return (
              <tr key={name}>
                <td style={{ padding: '8px', borderBottom: '1px solid #F5F5F5' }}>
                  <Icon name={name} size="md" color="neutral" />
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #F5F5F5' }}>
                  <code style={{ fontSize: '12px', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>{name}</code>
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #F5F5F5', color: '#525252' }}>{def.label}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #F5F5F5', color: '#737373' }}>{def.mode}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};
