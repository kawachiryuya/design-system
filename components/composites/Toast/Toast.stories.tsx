import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastProvider, useToast } from './Toast';
import { Button } from '../../primitives/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Toast stories — VR 集約モデル (§5-3) 移行は一部保留
 *
 * Toast は `position: fixed` + 入場アニメーションがあり、開状態を安定して静的に VR できない
 * (毎ビルド差分で揺れるリスク)。開状態の Overview 追加は #90 (アニメ無効 API) で対応予定。
 * それまでは §9-4 のスタンスに従い Playground を撮影対象に残す。
 * 単発 controlled / Provider+useToast の 2 つの利用形態を持つ。
 */
const meta: Meta<typeof Toast> = {
  title: 'Composites/Toast',
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: '単発 controlled 利用 (`open` + `onClose`)。ボタンで Toast を表示、自動消滅 (5 秒) or close ボタンで閉じる。',
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

// ── 2. Variants ────────────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '5 つの variant (success / error / warning / info / neutral)。`error` は aria-live="assertive" + role="alert" で即時通知、それ以外は polite で読まれる。Provider 経由で複数管理。',
      },
    },
  },
  render: () => {
    function Demo() {
      const { showToast } = useToast();
      return (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => showToast({ variant: 'success', description: '保存しました' })}>success</Button>
          <Button onClick={() => showToast({ variant: 'error', title: '通信エラー', description: 'もう一度お試しください' })}>error</Button>
          <Button onClick={() => showToast({ variant: 'warning', description: '残り 1 件で枠が埋まります' })}>warning</Button>
          <Button onClick={() => showToast({ variant: 'info', description: '新しいバージョンが利用可能です' })}>info</Button>
          <Button onClick={() => showToast({ variant: 'neutral', description: '同期しています…' })}>neutral</Button>
        </div>
      );
    }
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '構成パターン: title あり / description のみ / action ボタン付き / 自動消滅なし (duration=0).',
      },
    },
  },
  render: () => {
    function Demo() {
      const { showToast, dismissToast } = useToast();
      return (
        <div className="flex flex-col gap-3 items-start">
          <Caption text="Description のみ">
            <Button onClick={() => showToast({ variant: 'info', description: 'シンプルな通知' })}>
              description のみ
            </Button>
          </Caption>
          <Caption text="Title + description">
            <Button onClick={() => showToast({ variant: 'success', title: '保存しました', description: '変更内容を反映済み' })}>
              title + description
            </Button>
          </Caption>
          <Caption text="Action ボタン付き (元に戻す / 確認等)">
            <Button onClick={() => {
              const id = showToast({
                variant: 'info',
                title: 'タスクをアーカイブ',
                description: '元に戻すこともできます',
                action: { label: '元に戻す', onClick: () => dismissToast(id) },
                duration: 0,
              });
            }}>
              action 付き (手動 close)
            </Button>
          </Caption>
          <Caption text="自動消滅なし (duration=0、手動で閉じるまで残す)">
            <Button onClick={() => showToast({
              variant: 'warning',
              title: 'メンテナンス予定',
              description: '2026-06-05 02:00 から 30 分停止します',
              duration: 0,
            })}>
              persistent (duration=0)
            </Button>
          </Caption>
        </div>
      );
    }
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

// ── 4. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: 複数 Toast スタック (連打で積み上げ、maxToasts で上限) / position 変更 (top / top-right / bottom / bottom-right) / Provider + 単発 controlled の併用 (非推奨例).',
      },
    },
  },
  render: () => {
    function StackDemo() {
      const { showToast } = useToast();
      return (
        <Button onClick={() => {
          const stamp = new Date().toLocaleTimeString();
          showToast({ variant: 'success', description: `通知 ${stamp}` });
        }}>
          連打して積み上げ
        </Button>
      );
    }
    function PositionDemo() {
      const { showToast } = useToast();
      return (
        <div className="flex flex-wrap gap-2">
          {(['top', 'top-right', 'bottom', 'bottom-right'] as const).map((pos) => (
            <Button key={pos} onClick={() => showToast({ variant: 'info', description: `position: ${pos}` })}>
              {pos}
            </Button>
          ))}
          <p className="text-caption text-onSurface-muted w-full mt-2">
            ※ Provider 全体の position は固定 (top-right)。各 toast の position は Provider 設定が優先。
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <Caption text="複数 Toast スタック (top-right + maxToasts=4)">
          <ToastProvider position="top-right" maxToasts={4}>
            <StackDemo />
          </ToastProvider>
        </Caption>
        <Caption text="Position 切替 (Provider 全体の位置設定)">
          <ToastProvider position="bottom-right">
            <PositionDemo />
          </ToastProvider>
        </Caption>
      </div>
    );
  },
};
