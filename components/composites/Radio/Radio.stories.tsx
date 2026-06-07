import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';
import { Caption } from '@sb-blocks/Caption';

/**
 * Radio stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → States → EdgeCases
 *
 * Radio (個別) は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
 * Sizes は size prop を廃止し 20×20 (md) 1 サイズに統一したため省略 (Checkbox と整合)。
 * Story の Subject は RadioGroup (Radio はその子として使う)。
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Composites/Radio',
  component: RadioGroup,
  argTypes: {
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    inline: { control: 'boolean' },
    errorMessage: { control: 'text' },
    legend: { control: 'text' },
    helpText: { control: 'text' },
  },
  args: {
    legend: 'プランを選択',
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から legend / required / inline / error / errorMessage を切替。click で排他選択が動くことを play test で保証。',
      },
    },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio name="plan-pg" value="free" label="フリープラン" defaultChecked />
      <Radio name="plan-pg" value="pro" label="プロプラン" />
      <Radio name="plan-pg" value="enterprise" label="エンタープライズ" />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const free = canvas.getByLabelText('フリープラン');
    const pro = canvas.getByLabelText('プロプラン');
    await expect(free).toBeChecked();
    await userEvent.click(pro);
    await expect(pro).toBeChecked();
    await expect(free).not.toBeChecked();
  },
};

// ── 2. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / With description (詳細補足) / Inline (横並び) / WithHelpText / Error (errorMessage 必須) / Disabled の構成パターン。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="Default (縦並び)">
        <RadioGroup legend="プラン">
          <Radio name="s-default" value="free" label="フリープラン" defaultChecked />
          <Radio name="s-default" value="pro" label="プロプラン" />
        </RadioGroup>
      </Caption>
      <Caption text="With description (詳細補足)">
        <RadioGroup legend="お支払い方法">
          <Radio name="s-desc" value="card" label="クレジットカード" description="Visa / Mastercard / AMEX 対応" defaultChecked />
          <Radio name="s-desc" value="bank" label="銀行振込" description="振込確認後にサービス有効化 (1〜3 営業日)" />
        </RadioGroup>
      </Caption>
      <Caption text="Inline (横並び、少数の選択肢用)">
        <RadioGroup legend="性別 (任意)" inline>
          <Radio name="s-inline" value="male" label="男性" defaultChecked />
          <Radio name="s-inline" value="female" label="女性" />
          <Radio name="s-inline" value="other" label="その他" />
        </RadioGroup>
      </Caption>
      <Caption text="With help text">
        <RadioGroup legend="配送方法" helpText="変更はリアルタイムで反映されます">
          <Radio name="s-help" value="standard" label="標準配送 (3〜5 日)" defaultChecked />
          <Radio name="s-help" value="express" label="速達 (翌日)" />
        </RadioGroup>
      </Caption>
      <Caption text="Error (errorMessage 必須、aria-invalid 自動付与)">
        <RadioGroup legend="配送方法" required error errorMessage="配送方法を選択してください">
          <Radio name="s-err" value="standard" label="標準配送" />
          <Radio name="s-err" value="express" label="速達" />
        </RadioGroup>
      </Caption>
      <Caption text="Disabled (グループ全体)">
        <RadioGroup legend="通知頻度">
          <Radio name="s-dis" value="daily" label="毎日" defaultChecked disabled />
          <Radio name="s-dis" value="weekly" label="毎週" disabled />
        </RadioGroup>
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controlled (state 同期) / 多数の選択肢 / 動的 error 伝播 (Group→子 Radio 自動) / Layout token を使ったフォーム配置例.',
      },
    },
  },
  render: () => {
    function ControlledDemo() {
      const [plan, setPlan] = useState('free');
      return (
        <div className="space-y-3">
          <RadioGroup legend="プランを選択" required>
            {['free', 'pro', 'enterprise'].map((v) => (
              <Radio key={v} name="plan-ctrl" value={v}
                label={{ free: 'フリー', pro: 'プロ', enterprise: 'エンタープライズ' }[v]!}
                checked={plan === v}
                onChange={(e) => setPlan(e.target.value)} />
            ))}
          </RadioGroup>
          <p className="text-sm text-onSurface-muted">選択中: <strong>{plan}</strong></p>
        </div>
      );
    }
    function ManyDemo() {
      return (
        <RadioGroup legend="都道府県 (関東)" helpText="多数の選択肢では Select も検討">
          {['東京都', '神奈川県', '埼玉県', '千葉県', '茨城県', '栃木県', '群馬県'].map((p) => (
            <Radio key={p} name="pref-many" value={p} label={p} />
          ))}
        </RadioGroup>
      );
    }
    function ErrorPropagationDemo() {
      const [selected, setSelected] = useState('');
      const [submitted, setSubmitted] = useState(false);
      const hasError = submitted && !selected;
      return (
        <div className="space-y-3">
          <RadioGroup
            legend="プラン"
            required
            error={hasError}
            errorMessage="プランを選択してください"
          >
            {['free', 'pro'].map((v) => (
              <Radio key={v} name="plan-err" value={v}
                label={v === 'free' ? 'Free' : 'Pro'}
                checked={selected === v}
                onChange={(e) => setSelected(e.target.value)} />
            ))}
          </RadioGroup>
          <button type="button" onClick={() => setSubmitted(true)}
            className="px-4 py-2 bg-surface-primary text-onSurface-inverse rounded-md text-sm">
            送信
          </button>
          <p className="text-xs text-onSurface-muted">
            ↑ 未選択で送信すると Group の error が Context で全 Radio に伝播し、赤枠 + errorMessage 表示
          </p>
        </div>
      );
    }
    function LayoutFormDemo() {
      const [pay, setPay] = useState('card');
      const [ship, setShip] = useState('standard');
      return (
        <form className="w-full px-container py-container max-w-container-narrow mx-auto bg-surface border border-border-subtle rounded-md">
          <div className="space-y-section-sm">
            <h3 className="text-heading-sm text-onSurface m-0">注文フォーム</h3>
            <RadioGroup legend="お支払い方法" required>
              <Radio name="lay-pay" value="card" label="クレジットカード"
                description="Visa / Mastercard / AMEX"
                checked={pay === 'card'} onChange={(e) => setPay(e.target.value)} />
              <Radio name="lay-pay" value="bank" label="銀行振込"
                description="振込確認後にサービス有効化"
                checked={pay === 'bank'} onChange={(e) => setPay(e.target.value)} />
            </RadioGroup>
            <RadioGroup legend="配送方法" required>
              <Radio name="lay-ship" value="standard" label="標準配送 (3〜5 日)"
                checked={ship === 'standard'} onChange={(e) => setShip(e.target.value)} />
              <Radio name="lay-ship" value="express" label="速達 (翌日)"
                checked={ship === 'express'} onChange={(e) => setShip(e.target.value)} />
            </RadioGroup>
          </div>
        </form>
      );
    }
    return (
      <div className="flex flex-col gap-8">
        <Caption text="Controlled (外部 state 同期)"><ControlledDemo /></Caption>
        <Caption text="多数の選択肢 (5+ で縦並びがベター、6+ なら Select 検討)"><ManyDemo /></Caption>
        <Caption text="Error 伝播 (RadioGroup の error が Context で全子 Radio に自動伝播)">
          <ErrorPropagationDemo />
        </Caption>
        <Caption text="Layout token 適用 (px-container / space-y-section-sm でフォーム frame)">
          <LayoutFormDemo />
        </Caption>
      </div>
    );
  },
};
