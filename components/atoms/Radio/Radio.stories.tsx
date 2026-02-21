import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Atoms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    inline: { control: 'boolean' },
    errorMessage: { control: 'text' },
    legend: { control: 'text' },
  },
  args: {
    legend: 'プランを選択',
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio name="plan-default" value="free" label="フリープラン" defaultChecked />
      <Radio name="plan-default" value="pro" label="プロプラン" />
      <Radio name="plan-default" value="enterprise" label="エンタープライズ" />
    </RadioGroup>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <RadioGroup legend="お支払い方法">
      <Radio name="payment" value="card" label="クレジットカード"
        description="Visa / Mastercard / AMEX 対応" defaultChecked />
      <Radio name="payment" value="bank" label="銀行振込"
        description="振込確認後にサービスを有効化します（1〜3営業日）" />
      <Radio name="payment" value="invoice" label="請求書払い"
        description="法人向け。月末締め翌月末払い" />
    </RadioGroup>
  ),
};

export const Inline: Story = {
  render: () => (
    <RadioGroup legend="性別（任意）" inline>
      <Radio name="gender" value="male" label="男性" defaultChecked />
      <Radio name="gender" value="female" label="女性" />
      <Radio name="gender" value="other" label="その他" />
    </RadioGroup>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <RadioGroup legend="配送方法" required error errorMessage="配送方法を選択してください">
      <Radio name="delivery-err" value="standard" label="標準配送（3〜5日）" />
      <Radio name="delivery-err" value="express" label="速達（翌日）" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup legend="通知頻度">
      <Radio name="freq-dis" value="daily" label="毎日" defaultChecked disabled />
      <Radio name="freq-dis" value="weekly" label="毎週" disabled />
    </RadioGroup>
  ),
};

export const AllSizes: Story = {
  name: '全サイズ',
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup legend="Small">
        <Radio name="size-sm" value="a" label="オプション A" size="small" defaultChecked />
        <Radio name="size-sm" value="b" label="オプション B" size="small" />
      </RadioGroup>
      <RadioGroup legend="Medium（デフォルト）">
        <Radio name="size-md" value="a" label="オプション A" size="medium" defaultChecked />
        <Radio name="size-md" value="b" label="オプション B" size="medium" />
      </RadioGroup>
      <RadioGroup legend="Large">
        <Radio name="size-lg" value="a" label="オプション A" size="large" defaultChecked />
        <Radio name="size-lg" value="b" label="オプション B" size="large" />
      </RadioGroup>
    </div>
  ),
};

export const Controlled: Story = {
  name: '実践例: 制御コンポーネント',
  render: () => {
    const [plan, setPlan] = useState('free');
    return (
      <div className="space-y-4">
        <RadioGroup legend="プランを選択" required>
          {['free', 'pro', 'enterprise'].map((v) => (
            <Radio key={v} name="plan-ctrl" value={v}
              label={{ free: 'フリー', pro: 'プロ', enterprise: 'エンタープライズ' }[v]}
              checked={plan === v} onChange={(e) => setPlan(e.target.value)} />
          ))}
        </RadioGroup>
        <p className="text-sm text-neutral-500">選択中: <strong>{plan}</strong></p>
      </div>
    );
  },
};
