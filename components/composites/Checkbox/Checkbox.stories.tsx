import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { Radio, RadioGroup } from '../Radio/Radio';
import { Button } from '../../primitives/Button/Button';

const meta: Meta<typeof Checkbox> = {
  title: 'Composites/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
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
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');

    // 初期状態：未チェック
    await expect(checkbox).not.toBeChecked();

    // クリックでチェック
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // 再クリックで解除
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: 'マーケティングメールを受け取る',
    description: '新機能やキャンペーン情報をメールでお知らせします',
  },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '全て選択' },
};

export const ErrorState: Story = {
  args: { error: true, errorMessage: '続けるには同意が必要です' },
};

export const Disabled: Story = {
  args: { disabled: true, label: '変更できない設定' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="small" label="Small" defaultChecked />
      <Checkbox size="medium" label="Medium（デフォルト）" defaultChecked />
      <Checkbox size="large" label="Large" defaultChecked />
    </div>
  ),
};

export const Group: Story = {
  name: 'CheckboxGroup',
  render: () => (
    <CheckboxGroup legend="通知設定" helpText="複数選択できます">
      <Checkbox label="メール通知" description="重要なお知らせをメールで受け取る" defaultChecked />
      <Checkbox label="プッシュ通知" description="ブラウザの通知を受け取る" />
      <Checkbox label="SMS通知" description="緊急時のみSMSで通知" />
    </CheckboxGroup>
  ),
};

export const GroupError: Story = {
  name: 'CheckboxGroup（エラー）',
  render: () => (
    <CheckboxGroup legend="利用規約" required error errorMessage="続けるには同意が必要です">
      <Checkbox label="利用規約とプライバシーポリシーに同意する" />
    </CheckboxGroup>
  ),
};

export const RegistrationForm: Story = {
  name: '実践例: 会員登録フォーム',
  render: () => {
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    return (
      <form
        className="w-96 space-y-6 p-6 border border-border-muted rounded-lg"
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
    const agreeCheckbox = canvas.getByRole('checkbox', { name: '利用規約とプライバシーポリシーに同意する' });
    await userEvent.click(agreeCheckbox);
    await expect(errorMessage).not.toBeVisible();
  },
};
