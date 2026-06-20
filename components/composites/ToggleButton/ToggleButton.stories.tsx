import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { ToggleButton } from './ToggleButton';
import { Caption } from '@sb-blocks/Caption';

/**
 * ToggleButton stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * default/selected/disabled × hover/focus-visible (pseudo 強制) を Overview に集約。`aria-pressed` で選択状態を SR へ。
 * 座席グリッド / 曜日セレクター等の複数インスタンス usage は guideline の「使用例」へ移設。
 * variant / size / icon prop は無し。
 */
const meta: Meta<typeof ToggleButton> = {
  title: 'Composites/ToggleButton',
  component: ToggleButton,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    selected: false,
    disabled: false,
    children: '1',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  args: { onClick: fn() },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から selected / disabled / children を切替。クリックでも selected が toggle される (stateful wrapper、Controls 値を初期値として読み込む)。',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [s, setS] = useState(args.selected ?? false);
      // Controls から selected を変えた時にも反映 (args 変化で再 render → 再同期する意図的な dep)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => { setS(args.selected ?? false); }, [args.selected]);
      return (
        <ToggleButton
          {...args}
          selected={s}
          onClick={(e) => {
            setS((prev) => !prev);
            args.onClick?.(e);
          }}
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button');
    await userEvent.click(btn);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// default / selected / disabled × hover / focus-visible (pseudo 強制) のマトリクス。

export const Overview: Story = {
  parameters: {
    pseudo: {
      hover: ['#tb-default-hover', '#tb-selected-hover'],
      focusVisible: ['#tb-default-focus', '#tb-selected-focus'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。default / selected / disabled の 3 状態と、default / selected それぞれの hover / focus-visible (pseudo 強制) をマトリクスで集約。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4 items-end">
      <Caption text="Default"><ToggleButton>1</ToggleButton></Caption>
      <Caption text="Selected"><ToggleButton selected>2</ToggleButton></Caption>
      <Caption text="Disabled"><ToggleButton disabled>3</ToggleButton></Caption>
      <Caption text="Default + Hover"><ToggleButton id="tb-default-hover">4</ToggleButton></Caption>
      <Caption text="Selected + Hover"><ToggleButton id="tb-selected-hover" selected>5</ToggleButton></Caption>
      <div />
      <Caption text="Default + Focus"><ToggleButton id="tb-default-focus">6</ToggleButton></Caption>
      <Caption text="Selected + Focus"><ToggleButton id="tb-selected-focus" selected>7</ToggleButton></Caption>
    </div>
  ),
};
