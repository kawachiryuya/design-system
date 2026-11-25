import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within, screen, waitFor } from 'storybook/test';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '../../primitives/Button';

/**
 * ConfirmDialog stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview / OverviewDestructive / Scenarios (撮影しない)。
 * どの幅でも中央のカードだが、狭い幅でのボタンの並び (右寄せ・折り返し) を守るため、撮影する story は
 * `chromatic.viewports = [375, 1280]` で両方の幅を撮る (フォーカスの輪の検査も同じ宣言を読んで両方の幅で走る、§8-4)。
 * `<dialog>` は同時に 1 つずつ撮るので、確定ボタンが primary のもの (Overview。最初のフォーカスは確定) と
 * destructive のもの (OverviewDestructive。最初のフォーカスは取り消し) を別の story に分けて `open` で凍結する。
 * 開閉の動きは無い (即時)。play はテストの既定の幅 (1280) で走る。
 */
type PlaygroundArgs = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
  confirmLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/ConfirmDialog',
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    destructive: { control: 'boolean' },
    confirmLoading: { control: 'boolean' },
  },
  args: {
    title: '変更を保存しますか？',
    description: '保存すると、ほかの人にも新しい内容が見えます。',
    confirmLabel: '保存',
    cancelLabel: 'キャンセル',
    destructive: false,
    confirmLoading: false,
    onConfirm: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'ボタンで開く。確定は `onConfirm`、Esc・×・取り消しは `onClose` (取り消し)。外を押しても閉じない。play は、名前と説明・最初のフォーカス・開き方と閉じ方 (ポインタかキーか) で輪を出すか・閉じたら開く前の要素へ戻るか、を確かめる。',
      },
    },
  },
  render: ({ description, onConfirm, onClose, ...args }) => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>確認を開く</Button>
          <ConfirmDialog
            {...args}
            open={open}
            onClose={() => {
              onClose();
              setOpen(false);
            }}
            onConfirm={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {description}
          </ConfirmDialog>
        </>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '確認を開く' });

    // ポインタで開く: 名前は見出し、説明は children。最初のフォーカスは確定。キーを押すまで輪を出さない
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: '変更を保存しますか？' });
    await expect(dialog).toHaveAccessibleDescription('保存すると、ほかの人にも新しい内容が見えます。');
    const confirm = within(dialog).getByRole('button', { name: '保存' });
    await waitFor(() => expect(confirm).toHaveFocus());
    await expect(dialog).toHaveAttribute('data-ds-hide-focus-ring');
    await expect(getComputedStyle(confirm).outlineStyle).toBe('none');
    // 閉じるボタンは 48px
    const close = within(dialog).getByRole('button', { name: '閉じる' });
    await expect(close.getBoundingClientRect().height).toBe(48);
    await userEvent.keyboard('{Shift}');
    await expect(dialog).not.toHaveAttribute('data-ds-hide-focus-ring');

    // 取り消しボタン (ポインタ): onClose。入口へ戻したフォーカスに輪を出さない
    await userEvent.click(within(dialog).getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(args.onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAttribute('data-ds-hide-focus-ring');
    await userEvent.keyboard('{Shift}');
    await expect(trigger).not.toHaveAttribute('data-ds-hide-focus-ring');

    // キーボードで開く: はじめから輪を出す
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(confirm).toHaveFocus());
    await expect(dialog).not.toHaveAttribute('data-ds-hide-focus-ring');
    await expect(confirm.matches(':focus-visible')).toBe(true);

    // Esc: 取り消しとして onClose。入口へ戻し、輪は出す。
    // 合成のキー (userEvent) ではブラウザが cancel を出さないので、Esc で届く cancel を送る (本物の Esc は Playwright で確かめた)
    await userEvent.keyboard('{Shift}');
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onClose).toHaveBeenCalledTimes(2);
    await expect(trigger).toHaveFocus();
    await expect(trigger).not.toHaveAttribute('data-ds-hide-focus-ring');

    // 確定 (キーボード): onConfirm
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(confirm).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveFocus();
  },
};

// ── 2. Overview (視覚回帰対象) — 開いた状態を凍結 ────────────

export const Overview: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280] },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態 (確定が primary)。見出し・短い説明・取り消しと確定を `open` で凍結する。幅 375 でも中央のカード (左右 16px)。最初のフォーカスは確定ボタン。',
      },
    },
  },
  render: () => (
    <ConfirmDialog
      open
      onClose={() => {}}
      title="変更を保存しますか？"
      confirmLabel="保存"
      onConfirm={() => {}}
    >
      保存すると、ほかの人にも新しい内容が見えます。
    </ConfirmDialog>
  ),
};

export const OverviewDestructive: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280] },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態 (戻せない操作。`destructive`)。確定は destructive (赤) で、最初のフォーカスは取り消しボタン。',
      },
    },
  },
  render: () => (
    <ConfirmDialog
      open
      onClose={() => {}}
      title="予約を取り消しますか？"
      confirmLabel="予約を取り消す"
      cancelLabel="戻る"
      destructive
      onConfirm={() => {}}
    >
      取り消すと元に戻せません。払い戻しの手数料がかかります。
    </ConfirmDialog>
  ),
};

// ── 4. いろいろな場面 (視覚回帰対象外。手で触る・自動の操作で確かめる用) ────────────

type Scenario = 'ignore' | 'methodDialog' | 'externalClose' | 'externalCloseIgnored' | 'unmount' | 'basic' | 'loadingFail' | 'conditional';

function ScenarioDemo({ scenario }: { scenario: Scenario }) {
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const respond = scenario !== 'ignore' && scenario !== 'externalCloseIgnored';

  const openDialog = () => {
    setMounted(true);
    setOpen(true);
    if (scenario === 'externalClose' || scenario === 'externalCloseIgnored') {
      // 開いて 1 秒後に、外から dialog.close() を呼ぶ
      window.setTimeout(() => ref.current?.close(), 1000);
    }
    if (scenario === 'unmount') window.setTimeout(() => setMounted(false), 1000);
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={openDialog}>確認を開く</Button>
      {mounted && (scenario !== 'conditional' || open) && (
        <ConfirmDialog
          ref={ref}
          open={open}
          onClose={() => {
            add('onClose');
            if (respond) setOpen(false);
          }}
          onConfirm={() => {
            add('onConfirm');
            if (scenario === 'loadingFail') {
              // 1.5 秒待った後、失敗して開いたまま
              setLoading(true);
              window.setTimeout(() => {
                setLoading(false);
                add('失敗');
              }, 1500);
            } else setOpen(false);
          }}
          confirmLoading={loading}
          title="変更を保存しますか？"
          confirmLabel="保存"
        >
          {scenario === 'methodDialog' ? (
            <form method="dialog" className="flex flex-col items-start gap-2">
              <span>中の form (method=&quot;dialog&quot;) の送信で閉じる。</span>
              <Button type="submit" variant="secondary" size="sm">
                form で閉じる
              </Button>
            </form>
          ) : (
            '保存すると、ほかの人にも新しい内容が見えます。'
          )}
        </ConfirmDialog>
      )}
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

export const Scenarios: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'ignore' },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['ignore', 'methodDialog', 'externalClose', 'externalCloseIgnored', 'unmount', 'basic', 'loadingFail', 'conditional'],
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'いろいろな場面を手で触るための story (`scenario` で切り替える。play は持たない)。ignore: 親が閉じる要求に応えない (確定だけで閉じる。Esc を続けても消えたままにならない) / methodDialog: 中の `<form method="dialog">` で閉じる (onClose が呼ばれ、背景の止めが外れる) / externalClose: 開いて 1 秒後に外から `dialog.close()` (親は閉じる) / externalCloseIgnored: 同じく、親は閉じない (出し直す) / unmount: 開いて 1 秒後に部品ごと外す / basic: 親が閉じる、基本の形 / loadingFail: 確定から 1.5 秒読み込み中にし、失敗して開いたまま / conditional: `{open && <ConfirmDialog open … />}` の形 (開くときに部品ごと描く。ページで最初の dialog)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
};
