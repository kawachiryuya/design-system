import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { screen } from 'storybook/test';
import { Toast, ToastProvider, useToast } from './Toast';
import { Button } from '../../primitives/Button';

/**
 * Toast stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview。
 * Toast は入場アニメを持たないため (#90 で確認)、Provider に `duration=0` で複数積めば開状態を
 * 静的に VR できる。Overview は 5 variant を Provider に静的スタックして撮る。position 切替 / 単発
 * controlled / 手動 close 等の usage は Playground + guideline で確認。
 * size / icon prop は無し。単発 controlled (`<Toast open>`) と Provider+useToast の 2 形態を持つ。
 */
const meta: Meta<typeof Toast> = {
  title: 'Composites/Toast',
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '単発 controlled 利用 (`open` + `onClose`)。ボタンで Toast を表示、自動消滅 (5 秒) or close ボタンで閉じる。Provider+useToast の複数管理は Overview / guideline 参照。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Toast を表示</Button>
          <Toast
            open={open}
            onClose={() => setOpen(false)}
            variant="success"
            description="保存しました"
          />
        </>
      );
    }
    return <Demo />;
  },
};

// ── 2. Overview (視覚回帰対象) — Provider に 5 variant を静的スタック ──
// 入場アニメが無いため duration=0 で積めば揺れずに撮れる。play で描画完了を待ってから撮影。

function ToastOverviewDemo() {
  const { showToast } = useToast();
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (fired.current) return; // StrictMode の二重発火防止
    fired.current = true;
    showToast({ variant: 'success', title: '保存しました', description: '変更を反映済み', duration: 0 });
    showToast({ variant: 'error', title: '通信エラー', description: 'もう一度お試しください', duration: 0 });
    showToast({ variant: 'warning', description: '残り 1 件で枠が埋まります', duration: 0 });
    showToast({ variant: 'info', title: 'タスクをアーカイブ', description: '元に戻すこともできます', action: { label: '元に戻す', onClick: () => {} }, duration: 0 });
    showToast({ variant: 'neutral', description: '同期しています…', duration: 0 });
  }, [showToast]);
  return (
    <p className="text-caption text-onSurface-muted">
      5 variant (success / error / warning / info + action / neutral) を Provider に静的スタック (VR 用、右上)。
    </p>
  );
}

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の開状態。5 variant (success / error / warning / info + action / neutral) を `ToastProvider` に `duration=0` で積み、右上に静的スタックして撮る。',
      },
    },
  },
  render: () => (
    <ToastProvider position="top-right" maxToasts={10}>
      <ToastOverviewDemo />
    </ToastProvider>
  ),
  play: async () => {
    // toasts が描画されるまで待ってから Chromatic が撮影する (確実に開状態を撮る)。
    await screen.findByText('保存しました');
    await screen.findByText('同期しています…');
  },
};
