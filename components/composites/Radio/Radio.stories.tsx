import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Radio, RadioGroup } from './Radio';
import { Caption } from '@sb-blocks/Caption';

/**
 * Radio stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * Subject は RadioGroup (Radio はその子)。RadioGroup の構成軸 (縦/inline/description/helpText/
 * error/disabled) + radio の focus-visible を Overview に集約。
 * controlled / 多数の選択肢 / 動的 error 伝播 / Layout フォーム等 usage は guideline の「使用例」へ移設。
 * size / variant prop は無し (20×20 md 1 サイズ統一、Checkbox と整合)。
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

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// RadioGroup の構成軸: 縦 / inline / description / helpText / error / disabled + radio の focus-visible。

export const Overview: Story = {
  parameters: {
    pseudo: {
      focusVisible: ['#radio-focus input'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。RadioGroup の構成 (縦並び / inline / description 付き / helpText / error / disabled) と radio の focus-visible を集約。',
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
      <Caption text="Focus-visible (pseudo 強制)">
        <div id="radio-focus">
          <RadioGroup legend="フォーカス">
            <Radio name="s-focus" value="a" label="Focus 中" defaultChecked />
          </RadioGroup>
        </div>
      </Caption>
    </div>
  ),
};
