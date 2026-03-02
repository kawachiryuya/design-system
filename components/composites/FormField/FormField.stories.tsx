import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { FormField } from './FormField';
import { Radio, RadioGroup } from '../Radio/Radio';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../../primitives/Button/Button';

const meta: Meta<typeof FormField> = {
  title: 'Composites/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelSize: { control: 'radio', options: ['small', 'medium', 'large'] },
    label: { control: 'text' },
    helpText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: '配送方法',
    required: true,
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      <RadioGroup legend="配送方法">
        <Radio name="delivery-default" value="standard" label="標準配送（3〜5日）" defaultChecked />
        <Radio name="delivery-default" value="express" label="速達（翌日）" />
        <Radio name="delivery-default" value="pickup" label="店頭受取" />
      </RadioGroup>
    </FormField>
  ),
};

export const WithHelpText: Story = {
  render: () => (
    <FormField label="通知設定" helpText="変更はリアルタイムで反映されます">
      <div className="flex flex-col gap-2">
        <Checkbox label="メール通知" defaultChecked />
        <Checkbox label="プッシュ通知" />
        <Checkbox label="SMS通知" />
      </div>
    </FormField>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <FormField label="配送方法" required error errorMessage="配送方法を選択してください">
      <RadioGroup legend="配送方法">
        <Radio name="delivery-err" value="standard" label="標準配送（3〜5日）" />
        <Radio name="delivery-err" value="express" label="速達（翌日）" />
      </RadioGroup>
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // エラーメッセージが role="alert" で表示されていること
    const errorMessage = canvas.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveTextContent('配送方法を選択してください');
  },
};

export const WithRenderProp: Story = {
  name: 'レンダープロップ（id の自動紐付け）',
  render: () => (
    <FormField label="カスタムスライダー" helpText="0〜100 の値を設定してください">
      {(id) => (
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          className="w-full accent-primary-600"
        />
      )}
    </FormField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormField label="プラン" disabled helpText="現在のプランは変更できません">
      <RadioGroup legend="プラン">
        <Radio name="plan-dis" value="pro" label="プロプラン" defaultChecked disabled />
      </RadioGroup>
    </FormField>
  ),
};

export const RegistrationForm: Story = {
  name: '実践例: 会員登録フォーム',
  render: () => {
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    return (
      <form
        className="w-96 space-y-6 p-6 border border-neutral-200 rounded-lg"
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      >
        <h2 className="text-lg font-semibold text-neutral-800">会員登録</h2>

        <FormField label="性別" optional>
          <div className="flex gap-6">
            <Radio name="reg-gender" value="male" label="男性" defaultChecked />
            <Radio name="reg-gender" value="female" label="女性" />
            <Radio name="reg-gender" value="other" label="その他" />
          </div>
        </FormField>

        <FormField label="興味のあるカテゴリ" optional helpText="複数選択できます">
          <div className="flex flex-col gap-2">
            {['テクノロジー', 'デザイン', 'ビジネス', 'ライフスタイル'].map((cat) => (
              <Checkbox key={cat} label={cat} />
            ))}
          </div>
        </FormField>

        <FormField
          label="利用規約への同意"
          required
          error={submitted && !agreed}
          errorMessage="続けるには利用規約への同意が必要です"
        >
          <Checkbox
            label="利用規約とプライバシーポリシーに同意する"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
        </FormField>

        <Button type="submit" fullWidth>登録する</Button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 同意せずに送信 → バリデーションエラーが表示される
    const submitBtn = canvas.getByRole('button', { name: '登録する' });
    await userEvent.click(submitBtn);

    const errorMessage = await canvas.findByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveTextContent('続けるには利用規約への同意が必要です');

    // 同意チェックボックスをオンにするとエラーが消える
    const agreeCheckbox = canvas.getByRole('checkbox');
    await userEvent.click(agreeCheckbox);
    await expect(errorMessage).not.toBeVisible();
  },
};
