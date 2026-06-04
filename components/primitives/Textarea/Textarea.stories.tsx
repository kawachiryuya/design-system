import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Textarea } from './Textarea';
import { Caption } from '@sb-blocks/Caption';

/**
 * Textarea stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → States → EdgeCases
 * (Variants は省略: visual variant 軸なし。Sizes は省略: size prop なし、高さは
 *  rows 属性で連続制御。WithIcon は省略: icon prop なし。)
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
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// label 自動付与 (htmlFor 連携) を play test で保証。

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。label の自動付与 (htmlFor / id の連携) を play test で保証。',
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

// ── 2. States ──────────────────────────────────────────────────
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
      hover: ['#textarea-hover'],
      focusVisible: ['#textarea-focus'],
    },
  },
  // Textarea は rows={3} の高さに加え Error は errorMessage が下に伸びる。
  // gap-x-6 (24px) / gap-y-8 (32px) で隣接セルとの干渉を防ぐ。
  // Caption wrapper を w-full にして子要素 (Textarea) の fullWidth が
  // grid セル幅に追従するようにする (Caption は items-start で width が
  // shrink-to-fit になっていたため textarea natural width が cell からはみ出していた)。
  render: () => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 items-start [&>*]:w-full">
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
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// 文字数カウンター / resize 4 種 / フォーム統合など、Textarea 固有の境界条件を確認。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '文字数カウンターの近接/超過挙動 / resize の 4 パターン (none / vertical / horizontal / both) / お問い合わせフォーム統合 (fullWidth + counter + helpText) など、Textarea の境界条件を一覧。',
      },
    },
  },
  render: () => {
    const NearLimitText = 'A'.repeat(185);
    const AtLimitText = 'A'.repeat(200);
    const ContactFormDemo: React.FC = () => {
      const [value, setValue] = useState('');
      return (
        <Textarea
          label="お問い合わせ内容"
          required
          fullWidth
          placeholder="ご質問・ご要望をご記入ください"
          rows={5}
          maxLength={500}
          currentLength={value.length}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helpText="担当者より 2 営業日以内にご返信します"
        />
      );
    };

    return (
      <div className="flex flex-col gap-8">
        <Caption text="文字数カウンター — maxLength 近接 (185/200) はカウンターのみ、上限到達でカウンターが赤+太字">
          <div className="flex flex-col gap-4">
            <Textarea
              label="自己紹介 (近接)"
              maxLength={200}
              currentLength={NearLimitText.length}
              value={NearLimitText}
              onChange={() => {}}
              rows={3}
            />
            <Textarea
              label="自己紹介 (上限)"
              maxLength={200}
              currentLength={AtLimitText.length}
              value={AtLimitText}
              onChange={() => {}}
              rows={3}
            />
          </div>
        </Caption>

        <Caption text="resize: 4 パターン — 右下のドラッグハンドルの挙動が異なる">
          <div className="grid grid-cols-2 gap-3">
            <Textarea label="none (固定)" resize="none" placeholder="サイズ固定" rows={3} />
            <Textarea label="vertical (デフォルト)" resize="vertical" placeholder="縦のみ" rows={3} />
            <Textarea label="horizontal" resize="horizontal" placeholder="横のみ" rows={3} />
            <Textarea label="both" resize="both" placeholder="両方向" rows={3} />
          </div>
        </Caption>

        <Caption text="お問い合わせフォーム統合 — fullWidth + counter + helpText の組合せ">
          <ContactFormDemo />
        </Caption>
      </div>
    );
  },
};
