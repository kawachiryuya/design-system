import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelPosition: { control: 'radio', options: ['left', 'right'] },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    label: 'ダークモード',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, onChange: () => {} },
};

export const WithDescription: Story = {
  args: {
    label: 'メール通知',
    description: 'キャンペーンやお知らせをメールで受け取ります',
    checked: true,
    onChange: () => {},
  },
};

export const LabelLeft: Story = {
  args: { labelPosition: 'left', label: '公開設定' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch size="small" label="Small" defaultChecked onChange={() => {}} />
      <Switch size="medium" label="Medium（デフォルト）" defaultChecked onChange={() => {}} />
      <Switch size="large" label="Large" defaultChecked onChange={() => {}} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="OFF（無効）" disabled />
      <Switch label="ON（無効）" disabled defaultChecked />
    </div>
  ),
};

export const SettingsPanel: Story = {
  name: '実践例: 設定パネル',
  render: () => {
    const [settings, setSettings] = useState({
      email: true,
      push: false,
      sms: false,
      newsletter: true,
    });
    const toggle = (key: keyof typeof settings) =>
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

    const items = [
      { key: 'email' as const, label: 'メール通知', description: 'ログイン・購入などの重要なお知らせ' },
      { key: 'push' as const, label: 'プッシュ通知', description: 'ブラウザの通知を受け取る' },
      { key: 'sms' as const, label: 'SMS通知', description: '緊急時のみ' },
      { key: 'newsletter' as const, label: 'ニュースレター', description: '週1回の最新情報をお届け' },
    ];

    return (
      <div className="w-80 divide-y divide-neutral-200">
        {items.map(({ key, label, description }) => (
          <div key={key} className="py-4 first:pt-0 last:pb-0">
            <Switch label={label} description={description} labelPosition="left"
              checked={settings[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    );
  },
};
