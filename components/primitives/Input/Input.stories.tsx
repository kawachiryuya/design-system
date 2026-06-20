import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Input } from './Input';
import { Icon } from '../Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * Input stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * `type` は behavior 軸 (mobile keyboard 等) で視覚差が小さいため Overview には含めない。
 * EdgeCases は無し: 旧「fullWidth + 長文 placeholder の ellipsis」は内蔵挙動で fullWidth(bool) +
 * placeholder(text) の Control で再現できるため Playground の役目 (§5-3 の尖らせた基準)。
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
        story: '視覚回帰用の総覧。size (sm/md/lg) / state (Default/Hover/Focus/Filled/Error/Disabled) / icon (leading/trailing/both) / required・helpText を 1 枚に集約。',
      },
    },
    pseudo: {
      hover: ['#input-hover'],
      focusVisible: ['#input-focus'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm / md / lg)</div>
        <div className="flex flex-col gap-4 w-80">
          <Input label="Small (40px)" size="sm" placeholder="密集 UI 用" fullWidth />
          <Input label="Medium (48px)" size="md" placeholder="標準フォーム" fullWidth />
          <Input label="Large (56px)" size="lg" placeholder="モバイル CTA" fullWidth />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">state (Default / Hover / Focus / Filled / Error / Disabled)</div>
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
        <div className="text-xs text-onSurface-muted">icon (leading / trailing / both)</div>
        <div className="flex flex-col gap-4 w-80">
          <Input label="検索 (leading)" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} fullWidth />
          <Input label="メール (trailing)" type="email" placeholder="example@email.com" trailingIcon={<Icon name="info" />} fullWidth />
          <Input label="検索 (両方)" type="search" placeholder="キーワード" leadingIcon={<Icon name="search" />} trailingIcon={<Icon name="close" />} fullWidth />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">required (* 自動付与) / helpText</div>
        <div className="w-80">
          <Input label="ユーザー名" required helpText="3〜16 文字の英数字" placeholder="例: alice123" fullWidth />
        </div>
      </div>
    </div>
  ),
};
