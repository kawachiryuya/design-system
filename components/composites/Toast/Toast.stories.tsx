import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastProvider, useToast } from './Toast';
import { Button } from '../../primitives/Button';

const meta: Meta<typeof Toast> = {
  title: 'Composites/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '一時通知。`<Toast />` で単発 controlled 利用、`<ToastProvider />` + `useToast()` で複数管理可能。'
          + ' `error` variant は aria-live="assertive" で即時、それ以外は polite で読まれる。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const SingleControlled: Story = {
  name: '単発 controlled 利用',
  render: () => {
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
  },
};

export const Variants: Story = {
  name: 'variant 別 (Provider 経由)',
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      return (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => showToast({ variant: 'success', description: '保存しました' })}>
            success
          </Button>
          <Button onClick={() => showToast({ variant: 'error', title: '通信エラー', description: 'もう一度お試しください' })}>
            error
          </Button>
          <Button onClick={() => showToast({ variant: 'warning', description: '残り 1 件で枠が埋まります' })}>
            warning
          </Button>
          <Button onClick={() => showToast({ variant: 'info', description: '新しいバージョンが利用可能です' })}>
            info
          </Button>
          <Button onClick={() => showToast({ variant: 'neutral', description: '同期しています…' })}>
            neutral
          </Button>
        </div>
      );
    };
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

export const WithAction: Story = {
  name: 'action ボタン付き',
  render: () => {
    const Demo = () => {
      const { showToast, dismissToast } = useToast();
      return (
        <Button
          onClick={() => {
            const id = showToast({
              variant: 'info',
              title: 'タスクをアーカイブしました',
              description: '元に戻すこともできます。',
              action: {
                label: '元に戻す',
                onClick: () => dismissToast(id),
              },
              duration: 0, // 手動で閉じるまで残す
            });
          }}
        >
          アーカイブ
        </Button>
      );
    };
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

export const StackedTop: Story = {
  name: '複数 Toast スタック (top-right)',
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      return (
        <Button
          onClick={() => {
            const stamp = new Date().toLocaleTimeString();
            showToast({ variant: 'success', description: `通知 ${stamp}` });
          }}
        >
          連打して積み上げ
        </Button>
      );
    };
    return (
      <ToastProvider position="top-right" maxToasts={4}>
        <Demo />
      </ToastProvider>
    );
  },
};

export const PersistentNoDuration: Story = {
  name: '自動消滅なし (duration=0)',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>再表示</Button>
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          variant="warning"
          title="メンテナンス予定"
          description="2026-06-05 02:00 から 30 分ほど停止します"
          duration={0}
          position="top"
        />
      </>
    );
  },
};
