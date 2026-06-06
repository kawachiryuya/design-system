import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { Radio, RadioGroup } from '../Radio/Radio';
import { Button } from '../../primitives/Button/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Checkbox stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * Checkbox は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Composites/Checkbox',
  component: Checkbox,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
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
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から size / checked / indeterminate / disabled / error / required を切替。click でトグルすることを play test で保証。',
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

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm / md / lg の 3 段。md がデフォルト。WCAG 2.5.5 タッチターゲット (44×44px) は md 以上で達成。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="sm" label="sm" defaultChecked />
      <Checkbox size="md" label="md (デフォルト)" defaultChecked />
      <Checkbox size="lg" label="lg" defaultChecked />
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Unchecked / Checked / Indeterminate (一部選択) / Disabled / Error (errorMessage 必須) / WithDescription / Focus-visible の構成パターン。',
      },
    },
    pseudo: {
      focusVisible: ['#cb-focus input'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="Unchecked (default)">
        <Checkbox label="利用規約に同意する" />
      </Caption>
      <Caption text="Checked">
        <Checkbox label="メール通知を受け取る" defaultChecked />
      </Caption>
      <Caption text="Indeterminate (親「全て選択」で一部のみ選択中)">
        <Checkbox label="全て選択" indeterminate />
      </Caption>
      <Caption text="Disabled">
        <Checkbox label="変更できない設定" disabled />
      </Caption>
      <Caption text="With description (補足説明)">
        <Checkbox label="マーケティングメールを受け取る" description="新機能・キャンペーン情報を月 1 回お知らせ" />
      </Caption>
      <Caption text="Error (errorMessage 必須、aria-invalid 自動付与)">
        <Checkbox label="プライバシーポリシーに同意" error errorMessage="同意が必要です" />
      </Caption>
      <Caption text="Required (label の右に *)">
        <Checkbox label="必須項目" required />
      </Caption>
      <Caption text="Focus-visible (pseudo-states 強制)">
        <div id="cb-focus">
          <Checkbox label="Focus 中" />
        </div>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'CheckboxGroup (複数選択 + 共通 helpText / errorMessage) / 実利用例: 会員登録フォーム (RadioGroup + CheckboxGroup + 同意チェック + 送信 validation).',
      },
    },
  },
  render: () => {
    function GroupDemo() {
      return (
        <CheckboxGroup legend="通知設定" helpText="複数選択できます">
          <Checkbox label="メール通知" description="重要なお知らせをメールで受け取る" defaultChecked />
          <Checkbox label="プッシュ通知" description="ブラウザの通知を受け取る" />
          <Checkbox label="SMS 通知" description="緊急時のみ SMS で通知" />
        </CheckboxGroup>
      );
    }
    function GroupErrorDemo() {
      return (
        <CheckboxGroup legend="利用規約" required error errorMessage="続けるには同意が必要です">
          <Checkbox label="利用規約とプライバシーポリシーに同意する" />
        </CheckboxGroup>
      );
    }
    function RegistrationForm() {
      const [agreed, setAgreed] = useState(false);
      const [submitted, setSubmitted] = useState(false);
      return (
        <form
          className="w-96 space-y-6 p-6 border border-border-subtle rounded-md"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <h2 className="text-lg font-semibold text-onSurface">会員登録</h2>
          <RadioGroup legend="性別" inline>
            <Radio name="reg-gender" value="male" label="男性" defaultChecked />
            <Radio name="reg-gender" value="female" label="女性" />
            <Radio name="reg-gender" value="other" label="その他" />
          </RadioGroup>
          <CheckboxGroup legend="興味のあるカテゴリ" helpText="複数選択できます">
            {['テクノロジー', 'デザイン', 'ビジネス', 'ライフスタイル'].map((cat) => (
              <Checkbox key={cat} label={cat} />
            ))}
          </CheckboxGroup>
          <CheckboxGroup
            legend="利用規約への同意"
            required
            error={submitted && !agreed}
            errorMessage="続けるには利用規約への同意が必要です"
          >
            <Checkbox
              label="利用規約とプライバシーポリシーに同意する"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
          </CheckboxGroup>
          <Button type="submit" fullWidth>登録する</Button>
        </form>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <Caption text="CheckboxGroup (複数選択 + 共通 helpText)"><GroupDemo /></Caption>
        <Caption text="CheckboxGroup (Error + errorMessage)"><GroupErrorDemo /></Caption>
        <Caption text="会員登録フォーム (RadioGroup + CheckboxGroup + 動的 validation)"><RegistrationForm /></Caption>
      </div>
    );
  },
};
