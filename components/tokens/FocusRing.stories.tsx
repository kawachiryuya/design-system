import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenPageHeader, TokenSectionHeading } from '@sb-blocks/TokenPageHeader';

const meta: Meta = {
  title: 'Tokens/Focus Ring',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

const TOKENS = [
  { key: 'width',  utility: 'ring-focus',        value: '2px', description: 'リング太さ。WCAG 2.4.11 (3:1 視認性) を満たす' },
  { key: 'offset', utility: 'ring-offset-focus', value: '2px', description: '要素境界とリング間の隙間。要素の角丸感を保つ' },
];

export const Tokens: Story = {
  name: 'width / offset',
  render: () => (
    <div className="max-w-[900px]">
      <TokenPageHeader
        title="Focus Ring"
        intro="a11y 上重要なフォーカスリングを semantic 化。色は border-focus (semantic-colors) と組合せて使う。"
        utility="focus-visible:ring-focus focus-visible:ring-offset-focus focus-visible:ring-border-focus"
      >
        本リポでは Button / Link / Radio / Checkbox / Switch 等の **border を持たない or 小さな塗り図形** な component で使う。input/textarea/select は border 色変化 + inset ring の別パターン。
      </TokenPageHeader>

      <div className="flex flex-col gap-2 mb-8">
        {TOKENS.map((e) => (
          <div
            key={e.key}
            className="grid items-center gap-4 py-3 px-4 rounded-md border border-border-muted bg-surface"
            style={{ gridTemplateColumns: '200px 80px 1fr' }}
          >
            <code className="bg-surface-inset text-onSurface px-2 py-1 rounded-sm font-mono text-xs">
              {e.utility}
            </code>
            <code className="font-mono text-xs text-onSurface-muted">{e.value}</code>
            <span className="text-sm text-onSurface">{e.description}</span>
          </div>
        ))}
      </div>

      <TokenSectionHeading>視覚サンプル (forced focus)</TokenSectionHeading>
      <p className="text-body-sm text-onSurface-muted leading-relaxed mb-4">
        強制的にリングを出した状態の例。Tab キーでフォーカスする実際の挙動は各 component の States story 参照。
      </p>
      <div className="flex gap-6 flex-wrap p-6 bg-background rounded-md">
        <button
          type="button"
          className="ring-focus ring-offset-focus ring-border-focus px-4 py-3 rounded-md bg-surface-primary text-onSurface-inverse text-sm font-medium"
        >
          Button (primary)
        </button>
        <input
          type="text"
          defaultValue="Input (focused)"
          className="ring-focus ring-offset-focus ring-border-focus px-3 py-2 rounded-sm border border-border-default text-sm"
        />
        <a
          href="#sample"
          className="ring-focus ring-offset-focus ring-border-focus px-2 py-1 rounded-sm !text-onSurface-primary !underline text-sm"
        >
          Link (focused)
        </a>
      </div>
    </div>
  ),
};
