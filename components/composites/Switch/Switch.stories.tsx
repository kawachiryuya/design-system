import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Switch } from './Switch';
import { Caption } from '@sb-blocks/Caption';

/**
 * Switch stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * Switch は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
 */
const meta: Meta<typeof Switch> = {
  title: 'Composites/Switch',
  component: Switch,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelPosition: { control: 'radio', options: ['left', 'right'] },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    label: 'ダークモード',
    size: 'md',
    labelPosition: 'right',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から label / size / labelPosition / checked / disabled を切替。click で aria-checked が反転することを play test で保証。',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [c, setC] = useState(args.checked ?? false);
      return <Switch {...args} checked={c} onChange={setC} />;
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (track 32px) / md (44px) / lg (56px) の 3 段。md 以上で WCAG 2.5.5 タッチターゲット (44×44px) を満たす。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [s1, setS1] = useState(true);
      const [s2, setS2] = useState(true);
      const [s3, setS3] = useState(true);
      return (
        <div className="flex flex-col gap-4">
          <Switch size="sm" label="sm (track 32px)" checked={s1} onChange={setS1} />
          <Switch size="md" label="md (track 44px) — デフォルト" checked={s2} onChange={setS2} />
          <Switch size="lg" label="lg (track 56px)" checked={s3} onChange={setS3} />
        </div>
      );
    }
    return <Demo />;
  },
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Off / On / Disabled(off) / Disabled(on) + label 左右配置 + hover / focus-visible (pseudo-states 強制)。',
      },
    },
    pseudo: {
      hover: ['#sw-hover button'],
      focusVisible: ['#sw-focus button'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="Off (default)"><Switch label="Off" /></Caption>
      <Caption text="On (checked)"><Switch label="On" defaultChecked /></Caption>
      <Caption text="Disabled (off)"><Switch label="Disabled (off)" disabled /></Caption>
      <Caption text="Disabled (on)"><Switch label="Disabled (on)" defaultChecked disabled /></Caption>
      <Caption text="Label position: left"><Switch label="ラベル左" labelPosition="left" /></Caption>
      <Caption text="With description (ラベル下に補足)">
        <Switch label="メール通知" description="キャンペーン・お知らせをメールで受信" defaultChecked />
      </Caption>
      <Caption text="Hover (pseudo-states 強制)">
        <div id="sw-hover"><Switch label="Hover" /></div>
      </Caption>
      <Caption text="Focus-visible (pseudo-states 強制)">
        <div id="sw-focus"><Switch label="Focus" /></div>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: 設定パネル (左ラベル + 右トグル、justify-between で全幅活用) と、ラベルなし (icon-only switch、aria-label 補強).',
      },
    },
  },
  render: () => {
    function SettingsPanel() {
      const [settings, setSettings] = useState({
        email: true, push: false, sms: false, newsletter: true,
      });
      const toggle = (k: keyof typeof settings) => setSettings((p) => ({ ...p, [k]: !p[k] }));
      const items = [
        { key: 'email' as const, label: 'メール通知', description: 'ログイン・購入などの重要なお知らせ' },
        { key: 'push' as const, label: 'プッシュ通知', description: 'ブラウザの通知を受け取る' },
        { key: 'sms' as const, label: 'SMS 通知', description: '緊急時のみ' },
        { key: 'newsletter' as const, label: 'ニュースレター', description: '週 1 回の最新情報' },
      ];
      return (
        <div className="w-80 divide-y divide-border-subtle">
          {items.map(({ key, label, description }) => (
            <div key={key} className="py-4 first:pt-0 last:pb-0">
              <Switch label={label} description={description} labelPosition="left"
                checked={settings[key]} onChange={() => toggle(key)}
                className="w-full justify-between" />
            </div>
          ))}
        </div>
      );
    }

    function LayoutSettings() {
      const [settings, setSettings] = useState({
        dark: false, autoUpdate: true, telemetry: false,
      });
      const toggle = (k: keyof typeof settings) => setSettings((p) => ({ ...p, [k]: !p[k] }));
      return (
        <form className="w-full px-container py-container max-w-container-narrow mx-auto bg-surface border border-border-subtle rounded-md">
          <div className="space-y-section-sm">
            <h3 className="text-heading-sm text-onSurface m-0">アプリ設定</h3>
            <div className="divide-y divide-border-subtle">
              <div className="py-3">
                <Switch label="ダークモード" description="OS の設定に従う場合は無効化" labelPosition="left"
                  checked={settings.dark} onChange={() => toggle('dark')}
                  className="w-full justify-between" />
              </div>
              <div className="py-3">
                <Switch label="自動更新" description="新しいバージョンを自動でインストール" labelPosition="left"
                  checked={settings.autoUpdate} onChange={() => toggle('autoUpdate')}
                  className="w-full justify-between" />
              </div>
              <div className="py-3">
                <Switch label="使用状況の送信" description="匿名の使用データを開発元に送信" labelPosition="left"
                  checked={settings.telemetry} onChange={() => toggle('telemetry')}
                  className="w-full justify-between" />
              </div>
            </div>
          </div>
        </form>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <Caption text="設定パネル (left label + justify-between で全幅活用)">
          <SettingsPanel />
        </Caption>
        <Caption text="ラベルなし (icon-only、aria-label で SR 補強)">
          <Switch aria-label="ダークモードを切替" />
        </Caption>
        <Caption text="Layout token 適用 (px-container / space-y-section-sm でアプリ設定 frame)">
          <LayoutSettings />
        </Caption>
      </div>
    );
  },
};
