import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Label } from './Label';
import { Caption } from '@sb-blocks/Caption';

/**
 * Label stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Variants → Sizes → States → EdgeCases
 * (WithIcon は icon prop が無いため省略。States は Label が interactive でないため
 *  Hover/Focus/Active なし、Default と Disabled のみ。)
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

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// required=true で aria-label="必須" 付きアスタリスクの自動付与を play test で保証。

export const Playground: Story = {
  args: { required: true, htmlFor: 'playground-input' },
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。required=true 指定時に `*` マークが aria-label="必須" 付きで描画されることを play test で保証。',
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

// ── 2. Variants ────────────────────────────────────────────────
// マーカーの 3 パターン (なし / required / optional) を静的に横並び。
// 「必須・任意の見せ分け」の判断材料。

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'マーカー違いの 3 パターン: なし / required (`*` + aria-label="必須") / optional (「（任意）」)。required と optional を同時指定した場合は required が優先される (precedence は EdgeCases で確認)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-8 items-center">
      <Caption text="マーカーなし">
        <Label>メールアドレス</Label>
      </Caption>
      <Caption text="required (必須)">
        <Label required>メールアドレス</Label>
      </Caption>
      <Caption text="optional (任意)">
        <Label optional>ニックネーム</Label>
      </Caption>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'small (12px) / medium (14px、デフォルト) / large (16px) の見比べ。フォーム入力欄のサイズに合わせて選ぶ。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Label size="sm" required>Small (12px)</Label>
      <Label size="md" required>Medium (14px) — デフォルト</Label>
      <Label size="lg" required>Large (16px)</Label>
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────
// Label は interactive ではないため Hover/Focus/Active は存在しない。
// Default と Disabled の 2 状態のみ。

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default (text-onSurface, cursor-pointer) と Disabled (text-onSurface-disabled, cursor-not-allowed) の 2 状態。Label 自体は Tab 移動の対象でない (input にフォーカスを渡す) ため Hover/Focus/Active は持たない。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 items-start">
      <Caption text="Default">
        <Label>メールアドレス</Label>
      </Caption>
      <Caption text="Disabled">
        <Label disabled>読み取り専用フィールド</Label>
      </Caption>
    </div>
  ),
};

// ── 5. EdgeCases ───────────────────────────────────────────────
// 実用統合 (htmlFor + input) / 長文ラベル折返し / required + optional の precedence など、
// 視覚的・仕様確認的に押さえたいケースの監視。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'フォーム入力欄との htmlFor 統合 / 長文ラベル折返し / required と optional を同時指定した場合の precedence (required 優先) など、実装の境界条件を確認する。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <Caption text="htmlFor で input と関連付ける (label クリックで input にフォーカス)">
        <div className="flex flex-col gap-1">
          <Label htmlFor="edge-email" required>メールアドレス</Label>
          <input
            id="edge-email"
            type="email"
            placeholder="example@email.com"
            className="block w-full rounded border border-border-default px-3 py-2 text-base focus:outline-none focus:border-border-focus focus:ring-focus focus:ring-border-focus"
          />
        </div>
      </Caption>

      <Caption text="長文ラベル — 折返し時に inline-flex の挙動を確認">
        <Label required>
          このフォームでは非常に長いラベルテキストが入る場合もあり、折返しの挙動を確認する
        </Label>
      </Caption>

      <Caption text="required + optional 同時指定 — required が優先される">
        <Label required optional>同時指定でも * が表示される</Label>
      </Caption>
    </div>
  ),
};
