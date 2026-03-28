import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Composites/_Switch',
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

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch label="ダークモード" checked={checked} onChange={setChecked} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');

    // 初期状態：OFF
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    // クリックで ON
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    // 再クリックで OFF
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  },
};

export const Checked: Story = {
  args: { checked: true, onChange: () => {} },
};

export const WithDescription: Story = {
  args: {
    label: 'メール通知',
    description: 'キャンペーンやお知らせをメールで受け取ります',
    checked: true,
    onChange: () => {},
    labelPosition: 'left',
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <Switch {...args} checked={checked} onChange={setChecked} className="w-full justify-between" />;
  },
};

export const LabelLeft: Story = {
  args: { labelPosition: 'left', label: '公開設定' },
};

export const AllSizes: Story = {
  render: () => {
    const [s1, setS1] = useState(true);
    const [s2, setS2] = useState(true);
    const [s3, setS3] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <Switch size="small" label="Small" checked={s1} onChange={setS1} />
        <Switch size="medium" label="Medium（デフォルト）" checked={s2} onChange={setS2} />
        <Switch size="large" label="Large" checked={s3} onChange={setS3} />
      </div>
    );
  },
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
      <div className="w-80 divide-y divide-border-muted">
        {items.map(({ key, label, description }) => (
          <div key={key} className="py-4 first:pt-0 last:pb-0">
            <Switch label={label} description={description} labelPosition="left"
              checked={settings[key]} onChange={() => toggle(key)}
              className="w-full justify-between" />
          </div>
        ))}
      </div>
    );
  },
};
