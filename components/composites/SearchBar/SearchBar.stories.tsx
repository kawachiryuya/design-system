import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Caption } from '@sb-blocks/Caption';

/**
 * SearchBar stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * size (sm/md/lg) と states (empty/値あり/disabled/focus) を Overview に集約。
 * onSearch / ヘッダー検索 (候補表示) / テーブルフィルタ等の usage 合成は guideline の「使用例」へ移設。
 * fullWidth は親幅追従で固定幅では差が出ないため Overview には並べない (Playground / guideline で確認)。
 * isLoading は spinner アニメで VR が毎フレーム差分扱いになり揺れるため Overview に入れない
 *   (Playground のトグルで確認、spinner 自体は Spinner primitive の Overview で VR 済み)。
 */
const meta: Meta<typeof SearchBar> = {
  title: 'Composites/SearchBar',
  component: SearchBar,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    value: '',
    placeholder: '検索...',
    size: 'md',
  },
  render: (args) => {
    function Demo() {
      const [v, setV] = useState(args.value);
      return <SearchBar {...args} value={v} onChange={setV} />;
    }
    return <Demo />;
  },
  // 全 story を w-80 でラップ (parameters.noWrap=true で個別解除)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-80"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から size / fullWidth / isLoading / disabled / placeholder / value を切替。テキスト入力 → クリアボタン click で値が消えることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await expect(input).toHaveValue('');
    await userEvent.type(input, 'デザイン');
    await expect(input).toHaveValue('デザイン');
    const clearBtn = canvas.getByRole('button', { name: '検索をクリア' });
    await userEvent.click(clearBtn);
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// size (sm/md/lg) と states。value は controlled なので静的値 + no-op onChange で凍結。

export const Overview: Story = {
  parameters: {
    noWrap: true,
    pseudo: {
      focusVisible: ['#sb-focus input'],
    },
    docs: {
      description: {
        story: '視覚回帰用の総覧。size (sm 32px / md 40px / lg 48px) と states (empty / 値あり=クリアボタン / disabled / focus-visible) を集約。loading=spinner はアニメで VR が揺れるため除外 (Playground で確認)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm テーブルフィルタ / md 標準 / lg ヘッダー検索)</div>
        <div className="flex flex-col gap-3 w-80">
          <SearchBar size="sm" value="" onChange={() => {}} placeholder="sm" />
          <SearchBar size="md" value="" onChange={() => {}} placeholder="md (デフォルト)" />
          <SearchBar size="lg" value="" onChange={() => {}} placeholder="lg" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">states</div>
        <div className="flex flex-col gap-3 w-96">
          <Caption text="Empty (placeholder のみ)">
            <SearchBar value="" onChange={() => {}} placeholder="検索..." />
          </Caption>
          <Caption text="値あり (クリアボタン表示)">
            <SearchBar value="入力済み" onChange={() => {}} placeholder="検索..." />
          </Caption>
          <Caption text="Disabled">
            <SearchBar value="" onChange={() => {}} disabled placeholder="検索..." />
          </Caption>
          <Caption text="Focus-visible (pseudo 強制)">
            <div id="sb-focus">
              <SearchBar value="" onChange={() => {}} placeholder="検索..." />
            </div>
          </Caption>
        </div>
      </div>
    </div>
  ),
};
