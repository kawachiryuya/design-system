import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

/**
 * ProgressBar stories — VR 集約モデル (§5-3)
 *
 * 2 節構成: Playground / Overview。
 * color / size / label 有無 を内在軸で Overview に集約。
 * value 端 (0/50/100) は color 行が値域を兼ねるため不要 (Controls の slider で確認)。
 * indeterminate はアニメーションで VR が毎フレーム差分扱いになり揺れるため Overview に入れない
 *   (Playground のトグル + guideline Do/Don't で担保)。
 * アニメ付きアップロード / ステップ / byte max / wizard 等の usage 合成は interaction・Layout token
 * デモのため guideline の「使用例」へ移設 (Layout token は Tokens/Layout 参照)。
 * ※ ProgressBar は w-full のため Caption (items-start) で潰れる → Overview では使わない。
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Composites/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    size: { control: 'radio', options: ['sm', 'md'] },
    color: { control: 'radio', options: ['primary', 'success', 'error', 'warning'] },
    showValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    value: 60,
    max: 100,
    size: 'md',
    color: 'primary',
    label: 'アップロード中',
    showValue: true,
  },
  // 全 story を w-80 でラップ (parameters.noWrap=true で個別解除、memory: storybook-decorator-inheritance)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-80"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から value (slider) / color / size / showValue / indeterminate を切替。`role="progressbar"` + `aria-valuenow` で SR に進捗を伝達。',
      },
    },
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸: color (4、値域も兼ねる) / size (sm/md) / label 有無。
// value 端・indeterminate は除外 (冒頭コメント参照)。

export const Overview: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '視覚回帰用の総覧。color (primary/success/error/warning、value 70/100/30/85 で値域も兼ねる) / size (sm/md) / label 有無 を集約。value 端と indeterminate は Overview に入れない (Controls で確認 / アニメは VR が揺れるため)。',
      },
    },
  },
  render: () => (
    <div className="w-80 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">color (primary 進捗 / success 完了 / error 失敗 / warning 警告) — value も値域を兼ねる</div>
        <div className="flex flex-col gap-3">
          <ProgressBar value={70} color="primary" label="primary (70%)" showValue />
          <ProgressBar value={100} color="success" label="success (100%)" showValue />
          <ProgressBar value={30} color="error" label="error (30%)" showValue />
          <ProgressBar value={85} color="warning" label="warning (85%)" showValue />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (sm 4px / md 8px)</div>
        <div className="flex flex-col gap-3">
          <ProgressBar value={60} size="sm" label="sm (4px)" />
          <ProgressBar value={60} size="md" label="md (8px)" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">label / showValue なし (バーのみ)</div>
        <ProgressBar value={40} />
      </div>
    </div>
  ),
};
