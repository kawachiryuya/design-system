import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { NumberInput } from './NumberInput';
import { Caption } from '@sb-blocks/Caption';

/**
 * NumberInput stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Sizes → States → EdgeCases
 *
 * NumberInput は variant / icon prop を持たないため Variants / WithIcon は省略 (§5-3)。
 */
const meta: Meta<typeof NumberInput> = {
  title: 'Composites/NumberInput',
  component: NumberInput,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
  },
  args: {
    size: 'md',
    disabled: false,
    label: '数量',
    min: 0,
    max: 10,
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  args: { onChange: fn() },
  parameters: {
    docs: {
      description: {
        story: 'Controls から size / disabled / min / max / label を切替。`+` ボタン click で onChange が呼ばれることを play test で保証。',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [v, setV] = useState(1);
      return (
        <NumberInput
          {...args}
          value={v}
          onChange={(n) => { setV(n); args.onChange(n); }}
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const incBtn = canvas.getByRole('button', { name: '増やす' });
    await userEvent.click(incBtn);
    await expect(args.onChange).toHaveBeenCalledWith(2);
  },
};

// ── 2. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (40px) / md (48px) の 2 段階。md 以上で WCAG 2.5.5 タッチターゲット要件 (44×44px) を満たす。',
      },
    },
  },
  render: () => {
    function SizeDemo({ size }: { size: 'sm' | 'md' }) {
      const [v, setV] = useState(3);
      return <NumberInput value={v} onChange={setV} size={size} min={1} max={9} label={`サイズ ${size}`} />;
    }
    return (
      <div className="flex flex-col gap-4 items-start">
        <Caption text="sm (40px)"><SizeDemo size="sm" /></Caption>
        <Caption text="md (48px)"><SizeDemo size="md" /></Caption>
      </div>
    );
  },
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default / At min (−が disabled) / At max (+が disabled) / Disabled / Without label の 5 状態。',
      },
    },
  },
  render: () => {
    function Default() {
      const [v, setV] = useState(3);
      return <NumberInput value={v} onChange={setV} min={1} max={5} label="数量" />;
    }
    function AtMin() {
      const [v, setV] = useState(1);
      return <NumberInput value={v} onChange={setV} min={1} max={5} label="最小値" />;
    }
    function AtMax() {
      const [v, setV] = useState(5);
      return <NumberInput value={v} onChange={setV} min={1} max={5} label="最大値" />;
    }
    function Disabled() {
      const [v, setV] = useState(2);
      return <NumberInput value={v} onChange={setV} min={1} max={5} label="無効" disabled />;
    }
    function NoLabel() {
      const [v, setV] = useState(1);
      return <NumberInput value={v} onChange={setV} min={1} max={9} />;
    }
    return (
      <div className="grid grid-cols-2 gap-4 items-end">
        <Caption text="Default"><Default /></Caption>
        <Caption text="At min (− disabled)"><AtMin /></Caption>
        <Caption text="At max (+ disabled)"><AtMax /></Caption>
        <Caption text="Disabled (両方)"><Disabled /></Caption>
        <Caption text="Without label"><NoLabel /></Caption>
      </div>
    );
  },
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'カスタム aria-label (大人/小人で別 NumberInput) / 大きな桁 (3 桁表示) / 1 個ずつではない上限。',
      },
    },
  },
  render: () => {
    function CustomLabel() {
      const [adults, setAdults] = useState(2);
      const [kids, setKids] = useState(0);
      return (
        <div className="flex gap-4 items-start">
          <NumberInput
            value={adults}
            onChange={setAdults}
            min={1}
            max={9}
            label="大人"
            decrementLabel="大人の人数を減らす"
            incrementLabel="大人の人数を増やす"
          />
          <NumberInput
            value={kids}
            onChange={setKids}
            min={0}
            max={9}
            label="小人"
            decrementLabel="小人の人数を減らす"
            incrementLabel="小人の人数を増やす"
          />
        </div>
      );
    }
    function LargeValue() {
      const [v, setV] = useState(99);
      return <NumberInput value={v} onChange={setV} min={1} max={999} label="3 桁" />;
    }
    function BookingForm() {
      const [adults, setAdults] = useState(2);
      const [children, setChildren] = useState(0);
      const [rooms, setRooms] = useState(1);
      return (
        <form className="w-full px-container py-container max-w-container-narrow mx-auto bg-surface border border-border-subtle rounded-md">
          <div className="space-y-section-sm">
            <h3 className="text-heading-sm text-onSurface m-0">予約内容</h3>
            <div className="flex flex-wrap gap-6">
              <NumberInput value={adults} onChange={setAdults} min={1} max={9}
                label="大人"
                decrementLabel="大人の人数を減らす"
                incrementLabel="大人の人数を増やす" />
              <NumberInput value={children} onChange={setChildren} min={0} max={9}
                label="小人"
                decrementLabel="小人の人数を減らす"
                incrementLabel="小人の人数を増やす" />
              <NumberInput value={rooms} onChange={setRooms} min={1} max={5}
                label="部屋数"
                decrementLabel="部屋数を減らす"
                incrementLabel="部屋数を増やす" />
            </div>
          </div>
        </form>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <Caption text="カスタム aria-label (大人/小人で SR が文脈を読める)">
          <CustomLabel />
        </Caption>
        <Caption text="3 桁の値 (display 領域は w-10 で固定、桁が増えてもレイアウト崩れない)">
          <LargeValue />
        </Caption>
        <Caption text="Layout token 適用 (予約フォーム frame、複数 NumberInput を並べる)">
          <BookingForm />
        </Caption>
      </div>
    );
  },
};
