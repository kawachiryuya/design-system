import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Label } from './Label';
import { Caption } from '@sb-blocks/Caption';

/**
 * Label stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * Label は非 interactive (input にフォーカスを渡す) ため hover/focus/active は無い。
 *
 * Docs (Guideline) は Label.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Label> = {
  title: 'Primitives/Label',
  component: Label,
  argTypes: {
    htmlFor: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'メールアドレス',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  args: { required: true, htmlFor: 'playground-input' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。required=true 時に `*` が aria-label="必須" 付きで描画されることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const requiredMark = canvas.getByLabelText('必須');
    await expect(requiredMark).toBeInTheDocument();
    await expect(requiredMark).toHaveTextContent('*');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: marker (なし/required/optional/precedence) / size / state。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。marker (なし / required `*` / optional 「（任意）」/ required+optional は required 優先) / size (sm 12 / md 14 / lg 16) / state (Default / Disabled) を 1 枚に集約。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">marker (なし / required / optional / required+optional=required 優先)</div>
        <div className="flex flex-wrap gap-8 items-center">
          <Caption text="なし"><Label>メールアドレス</Label></Caption>
          <Caption text="required"><Label required>メールアドレス</Label></Caption>
          <Caption text="optional"><Label optional>ニックネーム</Label></Caption>
          <Caption text="required+optional"><Label required optional>同時指定 (required 優先)</Label></Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm 12px / md 14px / lg 16px)</div>
        <div className="flex flex-col gap-3 items-start">
          <Label size="sm" required>Small (12px)</Label>
          <Label size="md" required>Medium (14px)</Label>
          <Label size="lg" required>Large (16px)</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">state (Default / Disabled) — 非 interactive のため hover/focus/active 無し</div>
        <div className="flex flex-wrap gap-8 items-start">
          <Caption text="Default"><Label>メールアドレス</Label></Caption>
          <Caption text="Disabled"><Label disabled>読み取り専用フィールド</Label></Caption>
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// props だけでは作れない文脈依存: 制約幅での長文ラベル折返し (inline-flex の挙動)。
// ※ htmlFor + input 統合は usage 合成として guideline の「使用例」へ移設。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '長文ラベル — 制約幅で折返したときの inline-flex (テキスト + マーカー) の挙動。',
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Label required>
        このフォームでは非常に長いラベルテキストが入る場合もあり、折返しの挙動を確認する
      </Label>
    </div>
  ),
};
