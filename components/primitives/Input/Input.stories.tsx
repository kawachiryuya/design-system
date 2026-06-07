import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Input } from './Input';
import { Icon } from '../Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Input stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Sizes → States → WithIcon → EdgeCases
 * (Variants は省略: `type` は behavior 軸 [mobile keyboard 切替等] で視覚差が小さい)
 *
 * Docs (Guideline) は Input.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    errorMessage: { control: 'text' },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
  args: {
    label: 'メールアドレス',
    placeholder: 'example@email.com',
    type: 'email',
    size: 'md',
  },
  // 全 story を w-80 でラップする (parameters.noWrap=true で個別に解除可能、memory: storybook-decorator-inheritance)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-80"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// label 自動付与 (htmlFor 連携) を play test で保証。

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。label の自動付与 (htmlFor / id の連携) と type 属性の反映を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('メールアドレス');
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('type', 'email');
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'small (40px) / medium (48px、デフォルト) / large (56px) の見比べ。全 step +8 等差で grid 整合 (Material 3 max と同等)。medium 以上で WCAG 2.5.5 (44x44px) のタッチターゲット要件を満たす。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input label="Small (40px)" size="sm" placeholder="密集 UI 用" />
      <Input label="Medium (48px) — デフォルト" size="md" placeholder="標準フォーム" />
      <Input label="Large (56px)" size="lg" placeholder="モバイル CTA" />
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────
// Default / Hover / Focus-visible / Filled / Error / Disabled を単独表示。
// Hover/Focus は storybook-addon-pseudo-states で擬似状態を強制適用。

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / Hover / Focus / Filled / Error / Disabled を一覧。Hover/Focus は pseudo-states で強制表示しているのでマウス操作なしで見える。Error は errorMessage が必須 (型レベル)。',
      },
    },
    pseudo: {
      hover: ['#input-hover'],
      focusVisible: ['#input-focus'],
    },
  },
  // Error 状態は errorMessage が下に伸びる分セルが高くなる。
  // gap-x-6 (24px) / gap-y-8 (32px) で隣接セルとの干渉を防ぐ。
  // Caption の wrapper を w-full にして子要素 (Input) の fullWidth が
  // grid セル幅に追従するようにする (Caption は items-start で width が
  // shrink-to-fit になっていたため input natural width が cell からはみ出していた)。
  render: () => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 items-start [&>*]:w-full">
      <Caption text="Default">
        <Input label="Default" placeholder="入力してください" fullWidth />
      </Caption>
      <Caption text="Hover">
        <Input id="input-hover" label="Hover" placeholder="入力してください" fullWidth />
      </Caption>
      <Caption text="Focus-visible">
        <Input id="input-focus" label="Focus" placeholder="入力してください" fullWidth />
      </Caption>
      <Caption text="Filled (入力済み)">
        <Input label="Filled" defaultValue="user@example.com" fullWidth />
      </Caption>
      <Caption text="Error">
        <Input label="Error" error errorMessage="8 文字以上で入力してください" defaultValue="abc" type="password" fullWidth />
      </Caption>
      <Caption text="Disabled">
        <Input label="Disabled" disabled defaultValue="変更不可" fullWidth />
      </Caption>
    </div>
  ),
};

// ── 4. WithIcon ────────────────────────────────────────────────
// leadingIcon / trailingIcon は ReactNode のため Controls から設定しづらい。
// 主要 3 パターン (leading / trailing / 両方) をカタログ化。

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'leadingIcon (検索・通貨記号等の冒頭装飾) / trailingIcon (info アイコン・クリアボタン等) / 両方併用の 3 パターン。アイコンは pointer-events-none で input クリックを邪魔しない。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="leadingIcon — 検索ボックス">
        <Input label="検索" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} />
      </Caption>
      <Caption text="trailingIcon — info / クリア等">
        <Input label="メール" type="email" placeholder="example@email.com" trailingIcon={<Icon name="info" />} />
      </Caption>
      <Caption text="両方 — leading=検索 + trailing=close">
        <Input label="検索 (with クリア)" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} trailingIcon={<Icon name="close" />} />
      </Caption>
    </div>
  ),
};

// ── 5. EdgeCases ───────────────────────────────────────────────
// fullWidth / 長文 placeholder / required + helpText の組合せ / 多言語 / form 統合など、
// 壊れやすい / 仕様確認的に押さえたいケース。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'fullWidth + 長文 placeholder / required + helpText の組合せ / 多言語 (絵文字含む input value) / フォーム統合 (複数 Input + error + 必須) / Layout token 適用 (大外コンテナ全幅) など、Input の境界条件を一覧。',
      },
    },
    // 最後の Layout token 例を全幅表示するため meta の w-80 decorator を解除
    noWrap: true,
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-96 flex flex-col gap-6">
      <Caption text="fullWidth + 長文 placeholder — placeholder は overflow:hidden + ellipsis">
        <Input
          label="長い placeholder"
          fullWidth
          placeholder="このフォームは非常に長い placeholder テキストを受け付ける挙動の確認用"
        />
      </Caption>

      <Caption text="required + helpText — `*` 自動付与、helpText は input 下に表示">
        <Input
          label="ユーザー名"
          required
          helpText="3〜16 文字の英数字"
          placeholder="例: alice123"
        />
      </Caption>

      <Caption text="絵文字含む input value — 多言語 / Unicode 想定">
        <Input label="お名前" defaultValue="山田 花子 🌸" />
      </Caption>

      <Caption text="ログインフォーム統合 — 複数 Input + error の組合せ">
        <div className="flex flex-col gap-4">
          <Input label="メールアドレス" type="email" required fullWidth placeholder="example@email.com" />
          <Input
            label="パスワード"
            type="password"
            required
            fullWidth
            error
            errorMessage="パスワードが正しくありません"
          />
        </div>
      </Caption>
      </div>

      <Caption text="Layout token 適用 (px-container / py-container / max-w-container-narrow / space-y-section-sm)">
        <form className="w-full px-container py-container max-w-container-narrow mx-auto bg-surface border border-border-subtle rounded-md">
          <div className="space-y-section-sm">
            <h3 className="text-heading-sm text-onSurface m-0">アカウント情報</h3>
            <div className="flex flex-col gap-4">
              <Input label="氏名" required fullWidth placeholder="山田 太郎" />
              <Input label="メールアドレス" type="email" required fullWidth placeholder="example@email.com" />
              <Input label="電話番号" type="tel" fullWidth placeholder="090-1234-5678" helpText="ハイフンありで入力" />
            </div>
          </div>
        </form>
      </Caption>
    </div>
  ),
};
