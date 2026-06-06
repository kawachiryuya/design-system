import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { Button } from '../../primitives/Button/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * ProgressBar stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants (color) → Sizes → States → EdgeCases
 *
 * ProgressBar は icon prop を持たないため WithIcon は省略 (§5-3)。
 * Variants は color 軸 (primary / success / error / warning) として扱う。
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Composites/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
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
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controls から value (slider) / color / size / showValue / indeterminate を切替。`role="progressbar"` + `aria-valuenow` で SR に進捗を伝達。',
      },
    },
  },
};

// ── 2. Variants (color) ────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '色 (primary / success / error / warning) の使い分け。primary は通常進捗、success は完了、error は失敗、warning は容量警告等。',
      },
    },
  },
  render: () => (
    <div className="w-80 space-y-4">
      <ProgressBar value={70} color="primary" label="primary (通常進捗)" showValue />
      <ProgressBar value={100} color="success" label="success (完了)" showValue />
      <ProgressBar value={30} color="error" label="error (失敗)" showValue />
      <ProgressBar value={85} color="warning" label="warning (容量警告等)" showValue />
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm (4px) / md (8px) / lg (12px) の 3 段階。md がデフォルト、sm は dense UI、lg は強調表示用。',
      },
    },
  },
  render: () => (
    <div className="w-80 space-y-4">
      <ProgressBar value={60} size="sm" label="sm (4px)" />
      <ProgressBar value={60} size="md" label="md (8px) — デフォルト" />
      <ProgressBar value={60} size="lg" label="lg (12px)" />
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Zero / Mid / Completed / Indeterminate / WithoutLabel の 5 状態。indeterminate は `aria-busy="true"` 自動付与。',
      },
    },
  },
  render: () => (
    <div className="w-80 space-y-5">
      <Caption text="Zero (0%)">
        <ProgressBar value={0} label="開始前" showValue />
      </Caption>
      <Caption text="Mid (50%)">
        <ProgressBar value={50} label="進捗中" showValue />
      </Caption>
      <Caption text="Completed (100%, color=success)">
        <ProgressBar value={100} color="success" label="完了" showValue />
      </Caption>
      <Caption text="Indeterminate (進捗不明、アニメーション)">
        <ProgressBar indeterminate label="サーバー応答待ち" />
      </Caption>
      <Caption text="Without label (バーのみ)">
        <ProgressBar value={40} />
      </Caption>
    </div>
  ),
};

// ── 5. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: アニメーション付きアップロード、ステップ進捗バー。`max` をバイト数に設定した動的ラベル。',
      },
    },
  },
  render: () => {
    function AnimatedDemo() {
      const [progress, setProgress] = useState(0);
      const [running, setRunning] = useState(false);
      useEffect(() => {
        if (!running) return;
        if (progress >= 100) { setRunning(false); return; }
        const t = setTimeout(() => setProgress((p) => Math.min(p + Math.random() * 8, 100)), 200);
        return () => clearTimeout(t);
      }, [running, progress]);
      const color = progress >= 100 ? 'success' : 'primary';
      return (
        <div className="space-y-3">
          <ProgressBar value={Math.round(progress)} color={color}
            label={progress >= 100 ? 'アップロード完了' : 'ファイルをアップロード中...'}
            showValue />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="tertiary" onClick={() => { setProgress(0); setRunning(false); }}>リセット</Button>
            <Button size="sm" onClick={() => { setProgress(0); setRunning(true); }} disabled={running}>開始</Button>
          </div>
        </div>
      );
    }
    function StepDemo() {
      const steps = ['基本情報', 'プラン選択', '支払い', '確認'];
      const [current, setCurrent] = useState(1);
      const progress = ((current - 1) / (steps.length - 1)) * 100;
      return (
        <div className="space-y-4">
          <p className="text-sm text-onSurface-muted">
            ステップ {current}/{steps.length}: <strong>{steps[current - 1]}</strong>
          </p>
          <ProgressBar value={progress} size="sm" color="primary" />
          <div className="flex justify-between">
            {steps.map((step, i) => (
              <button key={step} type="button" onClick={() => setCurrent(i + 1)}
                className={`text-xs font-medium ${i + 1 <= current ? 'text-onSurface-primary' : 'text-onSurface-muted'}`}>
                {step}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="tertiary" disabled={current === 1} onClick={() => setCurrent((c) => c - 1)}>戻る</Button>
            <Button size="sm" disabled={current === steps.length} onClick={() => setCurrent((c) => c + 1)}>次へ</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <Caption text="アップロード進捗 (アニメーション + 完了で色変化)">
          <AnimatedDemo />
        </Caption>
        <Caption text="ステップ進捗バー (4 ステップ)">
          <StepDemo />
        </Caption>
        <Caption text="バイト数ベース (max を動的に)">
          <ProgressBar value={2_457_600} max={5_242_880} label="2.3 MB / 5.0 MB" />
        </Caption>
      </div>
    );
  },
};
