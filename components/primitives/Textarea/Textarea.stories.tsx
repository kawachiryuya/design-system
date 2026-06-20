import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Textarea } from './Textarea';
import { Caption } from '@sb-blocks/Caption';

/**
 * Textarea stories — VR 集約モデル (§5-3)
 *
 * 3 節構成: Playground / Overview。
 * size prop なし (高さは rows)、visual variant 軸なし。文脈依存の崩れも無いため EdgeCases は省略。
 *
 * Docs (Guideline) は Textarea.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    rows: { control: { type: 'number', min: 2, max: 20 } },
    maxLength: { control: 'number' },
    resize: { control: 'radio', options: ['none', 'vertical', 'horizontal', 'both'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helpText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    label: 'お問い合わせ内容',
    placeholder: 'ご質問・ご要望をご記入ください',
    rows: 4,
  },
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-96"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて挙動を確認する起点。label の自動付与 (htmlFor / id 連携) を play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText('お問い合わせ内容');
    await expect(textarea).toBeInTheDocument();
    await expect(textarea.tagName.toLowerCase()).toBe('textarea');
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: state / 文字数カウンター (maxLength) / resize。
// Hover/Focus は pseudo-states で強制表示。

export const Overview: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '視覚回帰用の総覧。state (Default/Hover/Focus/Filled/Error/Disabled) / 文字数カウンター (近接・上限) / resize (4 種) を 1 枚に集約。',
      },
    },
    pseudo: {
      hover: ['#textarea-hover'],
      focusVisible: ['#textarea-focus'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">state (Default / Hover / Focus / Filled / Error / Disabled)</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 items-start [&>*]:w-full w-[44rem] max-w-full">
          <Caption text="Default">
            <Textarea label="Default" placeholder="入力してください" rows={3} fullWidth />
          </Caption>
          <Caption text="Hover">
            <Textarea id="textarea-hover" label="Hover" placeholder="入力してください" rows={3} fullWidth />
          </Caption>
          <Caption text="Focus-visible">
            <Textarea id="textarea-focus" label="Focus" placeholder="入力してください" rows={3} fullWidth />
          </Caption>
          <Caption text="Filled (入力済み)">
            <Textarea label="Filled" defaultValue="これは入力済みのテキストです。複数行の本文をここに記述します。" rows={3} fullWidth />
          </Caption>
          <Caption text="Error">
            <Textarea label="Error" error errorMessage="内容を入力してください" defaultValue="ab" rows={3} fullWidth />
          </Caption>
          <Caption text="Disabled">
            <Textarea label="Disabled" disabled defaultValue="受付番号: 20260221-001" rows={3} fullWidth />
          </Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">文字数カウンター — 近接 (185/200) / 上限到達は赤+太字 (200/200)</div>
        <div className="flex flex-col gap-4 w-96">
          <Textarea label="自己紹介 (近接)" maxLength={200} currentLength={185} value={'A'.repeat(185)} onChange={() => {}} rows={3} fullWidth />
          <Textarea label="自己紹介 (上限)" maxLength={200} currentLength={200} value={'A'.repeat(200)} onChange={() => {}} rows={3} fullWidth />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">resize (none / vertical / horizontal / both)</div>
        <div className="grid grid-cols-2 gap-3 w-[44rem] max-w-full">
          <Textarea label="none (固定)" resize="none" placeholder="サイズ固定" rows={3} fullWidth />
          <Textarea label="vertical (デフォルト)" resize="vertical" placeholder="縦のみ" rows={3} fullWidth />
          <Textarea label="horizontal" resize="horizontal" placeholder="横のみ" rows={3} fullWidth />
          <Textarea label="both" resize="both" placeholder="両方向" rows={3} fullWidth />
        </div>
      </div>
    </div>
  ),
};
