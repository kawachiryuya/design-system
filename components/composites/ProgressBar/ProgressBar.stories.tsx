import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { Button } from '../../primitives/Button/Button';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
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
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'アップロード中', showValue: true, value: 45 },
};

export const AllColors: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <ProgressBar value={70} color="primary" label="primary" showValue />
      <ProgressBar value={85} color="success" label="success" showValue />
      <ProgressBar value={30} color="error" label="error" showValue />
      <ProgressBar value={55} color="warning" label="warning" showValue />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <ProgressBar value={60} size="sm" label="Small（4px）" />
      <ProgressBar value={60} size="md" label="Medium（8px）— デフォルト" />
      <ProgressBar value={60} size="lg" label="Large（12px）" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '処理中...' },
};

export const Completed: Story = {
  args: { value: 100, color: 'success', label: '完了', showValue: true },
};

export const Zero: Story = {
  args: { value: 0, label: '開始前', showValue: true },
};

export const AnimatedDemo: Story = {
  name: '実践例: アップロードの進捗',
  render: () => {
    const [progress, setProgress] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
      if (!running) return;
      if (progress >= 100) { setRunning(false); return; }
      const timer = setTimeout(() => setProgress((p) => Math.min(p + Math.random() * 8, 100)), 200);
      return () => clearTimeout(timer);
    }, [running, progress]);

    const color = progress >= 100 ? 'success' : 'primary';

    return (
      <div className="w-80 space-y-3">
        <ProgressBar value={Math.round(progress)} color={color}
          label={progress >= 100 ? 'アップロード完了' : 'ファイルをアップロード中...'}
          showValue />
        <div className="flex gap-2">
          <Button size="small" onClick={() => { setProgress(0); setRunning(true); }}
            disabled={running}>
            開始
          </Button>
          <Button size="small" variant="secondary" onClick={() => setRunning(false)}
            disabled={!running}>
            一時停止
          </Button>
          <Button size="small" variant="tertiary" onClick={() => { setProgress(0); setRunning(false); }}>
            リセット
          </Button>
        </div>
      </div>
    );
  },
};

export const StepProgress: Story = {
  name: '実践例: ステップ表示',
  render: () => {
    const steps = ['基本情報', 'プラン選択', '支払い', '確認'];
    const [current, setCurrent] = useState(1);
    const progress = ((current - 1) / (steps.length - 1)) * 100;

    return (
      <div className="w-80 space-y-4">
        <ProgressBar value={progress} size="sm" color="primary" />
        <div className="flex justify-between">
          {steps.map((step, i) => (
            <button key={step} type="button" onClick={() => setCurrent(i + 1)}
              className={`text-xs font-medium ${
                i + 1 <= current ? 'text-primary-600' : 'text-neutral-400'
              }`}>
              {step}
            </button>
          ))}
        </div>
        <p className="text-sm text-neutral-600">
          ステップ {current}/{steps.length}: <strong>{steps[current - 1]}</strong>
        </p>
        <div className="flex gap-2">
          <Button size="small" variant="tertiary" disabled={current === 1}
            onClick={() => setCurrent((c) => c - 1)}>戻る</Button>
          <Button size="small" disabled={current === steps.length}
            onClick={() => setCurrent((c) => c + 1)}>次へ</Button>
        </div>
      </div>
    );
  },
};
