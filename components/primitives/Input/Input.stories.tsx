import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Input } from './Input';
import { Icon } from '../Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Input stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview / EdgeCases。
 * `type` は behavior 軸 (mobile keyboard 等) で視覚差が小さいため Overview には含めない。
 * 例外は `date`: 日付の欄だけ見た目の指定 (appearance: none・flex で縦の中央) を持つので行を置く (#181)。
 * EdgeCases は狭い親 (120px) の中の日付の欄だけ (コンテナ幅依存なので固定幅で見せる)。
 * 「fullWidth + 長文 placeholder の ellipsis」は fullWidth(bool) + placeholder(text) の Control で
 * 再現できるため Playground の役目 (§5-3 の尖らせた基準)。
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
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-80"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。label の自動付与 (htmlFor / id 連携) と type 属性の反映を play test で保証。',
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

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: size / state / icon / required・helpText。
// Hover/Focus は pseudo-states で強制表示。

export const Overview: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '視覚回帰用の総覧。size (sm/md/lg) / state (Default/Hover/Focus/Filled/Error/Disabled) / icon (leading/trailing/both) / required・helpText / 日付の欄 (type="date") を 1 枚に集約。',
      },
    },
    pseudo: {
      hover: ['#input-hover'],
      focusVisible: ['#input-focus', '#input-date-focus'],
    },
  },
  // 日付の欄が iPhone の Safari で親の右にはみ出す不具合 (#181) は WebKit でしか起きず、ここ (Chromium) では
  // 再現しない。代わりに、直すために効いているべき宣言が日付の欄に当たっていることを守る。
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('#input-date-md');
    await expect(input).not.toBeNull();
    const cs = getComputedStyle(input!);
    await expect(cs.appearance).toBe('none');
    await expect(cs.minWidth).toBe('0px');
    await expect(cs.display).toBe('flex');
    await expect(cs.alignItems).toBe('center');
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="type-caption text-onSurface-subtle">size (sm / md / lg)</div>
        <div className="flex flex-col gap-4 w-80">
          <Input label="Small (40px)" size="sm" placeholder="密集 UI 用" fullWidth />
          <Input label="Medium (48px)" size="md" placeholder="標準フォーム" fullWidth />
          <Input label="Large (56px)" size="lg" placeholder="モバイル CTA" fullWidth />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="type-caption text-onSurface-subtle">state (Default / Hover / Focus / Filled / Error / Disabled)</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 items-start [&>*]:w-full w-[40rem] max-w-full">
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
      </div>

      <div className="flex flex-col gap-2">
        <div className="type-caption text-onSurface-subtle">icon (leading / trailing / both)</div>
        <div className="flex flex-col gap-4 w-80">
          <Input label="検索 (leading)" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} fullWidth />
          <Input label="メール (trailing)" type="email" placeholder="example@email.com" trailingIcon={<Icon name="info" />} fullWidth />
          <Input label="検索 (両方)" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} trailingIcon={<Icon name="close" />} fullWidth />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="type-caption text-onSurface-subtle">required (* 自動付与) / helpText</div>
        <div className="w-80">
          <Input label="ユーザー名" required helpText="3〜16 文字の英数字" placeholder="例: alice123" fullWidth />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="type-caption text-onSurface-subtle">type="date" (size sm / md / lg・空 / 入力済み・Focus / Error / Disabled)</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 items-start [&>*]:w-full w-[40rem] max-w-full">
          <Input id="input-date-sm" label="Small (空)" type="date" size="sm" fullWidth />
          <Input label="Small (入力済み)" type="date" size="sm" defaultValue="2026-12-01" fullWidth />
          <Input id="input-date-md" label="Medium (空)" type="date" size="md" fullWidth />
          <Input label="Medium (入力済み)" type="date" size="md" defaultValue="2026-12-01" fullWidth />
          <Input label="Large (空)" type="date" size="lg" fullWidth />
          <Input label="Large (入力済み)" type="date" size="lg" defaultValue="2026-12-01" fullWidth />
          <Input id="input-date-focus" label="Focus" type="date" defaultValue="2026-12-01" fullWidth />
          <Input label="Error" type="date" error errorMessage="今日より後の日付を選んでください" defaultValue="2026-01-01" fullWidth />
          <Input label="Disabled" type="date" disabled defaultValue="2026-12-01" fullWidth />
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '狭い親 (120px) の中の日付の欄。欄が親の幅を越えない (iPhone の Safari で右にはみ出していた #181。Chromium では元から出ない)。',
      },
    },
  },
  render: () => (
    <div className="w-[120px] border border-dashed border-border-default">
      <Input label="乗車日" type="date" defaultValue="2026-12-01" fullWidth />
    </div>
  ),
};
