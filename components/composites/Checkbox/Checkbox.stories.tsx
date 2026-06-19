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
 * 順序固定: Playground → States → EdgeCases
 *
 * Checkbox は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
 * Sizes は size prop を廃止し 20×20 (md) 1 サイズに統一したため省略。
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

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
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

// ── 2. States ──────────────────────────────────────────────────

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

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'CheckboxGroup (複数選択 + 共通 helpText / errorMessage、error は Context で全子に伝播) / 実利用例: 会員登録フォーム (RadioGroup + CheckboxGroup + 同意チェック + Layout token).',
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
          className="w-full px-container py-container max-w-container-narrow mx-auto bg-surface border border-border-subtle rounded-md"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <div className="space-y-section-sm">
            <h2 className="text-heading-sm text-onSurface m-0">会員登録</h2>
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
          </div>
        </form>
      );
    }
    function ErrorPropagationDemo() {
      const [selected, setSelected] = useState<string[]>([]);
      const [submitted, setSubmitted] = useState(false);
      const hasError = submitted && selected.length === 0;
      const toggle = (v: string) => setSelected((prev) => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
      return (
        <div className="space-y-3">
          <CheckboxGroup
            legend="興味のあるカテゴリ"
            required
            error={hasError}
            errorMessage="1 つ以上選択してください"
          >
            {['技術', 'ビジネス', 'デザイン'].map((cat) => (
              <Checkbox key={cat} label={cat}
                checked={selected.includes(cat)}
                onChange={() => toggle(cat)} />
            ))}
          </CheckboxGroup>
          <button type="button" onClick={() => setSubmitted(true)}
            className="px-4 py-2 bg-surface-primary text-onSurface-inverse rounded-md text-sm">
            送信
          </button>
          <p className="text-xs text-onSurface-muted">
            ↑ 未選択で送信すると Group の error が Context で全 Checkbox に伝播 (赤枠 + errorMessage)
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <Caption text="CheckboxGroup (複数選択 + 共通 helpText)"><GroupDemo /></Caption>
        <Caption text="CheckboxGroup (Error + errorMessage、固定エラー)"><GroupErrorDemo /></Caption>
        <Caption text="Error 伝播 (Group の error が Context で全子 Checkbox に自動伝播)">
          <ErrorPropagationDemo />
        </Caption>
        <Caption text="会員登録フォーム (Layout token: px-container / space-y-section-sm + 動的 validation)">
          <RegistrationForm />
        </Caption>
      </div>
    );
  },
};
