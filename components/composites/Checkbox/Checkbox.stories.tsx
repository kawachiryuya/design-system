import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { Caption } from '@sb-blocks/Caption';

/**
 * Checkbox stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * box 状態 (unchecked/checked/indeterminate) × interaction + error + 付帯要素を Overview に集約。
 * CheckboxGroup (fieldset/legend + error 伝播) は props 単体で作れない複数インスタンス構造なので EdgeCases。
 * 会員登録フォーム等の動的 validation usage は guideline の「使用例」へ移設。
 * size / variant prop は無し (20×20 md 1 サイズ統一)。
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Composites/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: '利用規約に同意する',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から checked / indeterminate / disabled / error / required を切替。click でトグルすることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// box 状態 × interaction (focus-visible は pseudo 強制) / error / description。
// 個別 Checkbox の required は視覚マーカー無し (native 属性のみ) → Overview に並べない。`*` は CheckboxGroup legend (EdgeCases) で確認。

export const Overview: Story = {
  parameters: {
    pseudo: {
      focusVisible: ['#cb-focus input'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。box 状態 (unchecked / checked / indeterminate / disabled) と focus-visible、error (赤枠 + errorMessage)、description を集約。required は個別 Checkbox に視覚マーカーが無く (native 属性のみ)、`*` は CheckboxGroup の legend で出るため EdgeCases 側で確認。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">box 状態 × interaction</div>
        <div className="flex flex-col gap-3">
          <Caption text="Unchecked (default)"><Checkbox label="未選択" /></Caption>
          <Caption text="Checked"><Checkbox label="選択済み" defaultChecked /></Caption>
          <Caption text="Indeterminate (一部選択)"><Checkbox label="全て選択" indeterminate /></Caption>
          <Caption text="Disabled (off / on)">
            <div className="flex gap-6">
              <Checkbox label="無効 off" disabled />
              <Checkbox label="無効 on" defaultChecked disabled />
            </div>
          </Caption>
          <Caption text="Focus-visible (pseudo 強制)">
            <div id="cb-focus"><Checkbox label="Focus 中" /></div>
          </Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">error / 付帯要素</div>
        <div className="flex flex-col gap-3">
          <Caption text="Error (errorMessage 必須、aria-invalid 自動付与)">
            <Checkbox label="プライバシーポリシーに同意" error errorMessage="同意が必要です" />
          </Caption>
          <Caption text="With description (補足説明)">
            <Checkbox label="マーケティングメールを受け取る" description="新機能・キャンペーン情報を月 1 回お知らせ" />
          </Caption>
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// CheckboxGroup = fieldset/legend + helpText + error の Context 伝播。props 単体では作れない複数インスタンス構造。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'CheckboxGroup (fieldset/legend + helpText、error は Context で全子 Checkbox に伝播) — 複数インスタンス構造。会員登録等の動的 validation usage は guideline 使用例へ移設。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="CheckboxGroup (複数選択 + 共通 helpText)">
        <CheckboxGroup legend="通知設定" helpText="複数選択できます">
          <Checkbox label="メール通知" description="重要なお知らせをメールで受け取る" defaultChecked />
          <Checkbox label="プッシュ通知" description="ブラウザの通知を受け取る" />
          <Checkbox label="SMS 通知" description="緊急時のみ SMS で通知" />
        </CheckboxGroup>
      </Caption>
      <Caption text="CheckboxGroup (error が Context で全子に伝播、赤枠 + errorMessage)">
        <CheckboxGroup legend="利用規約" required error errorMessage="続けるには同意が必要です">
          <Checkbox label="利用規約とプライバシーポリシーに同意する" />
        </CheckboxGroup>
      </Caption>
    </div>
  ),
};
