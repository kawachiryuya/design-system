import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Toast, ToastProvider, useToast, type ToastPosition } from './Toast';
import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { ConfirmDialog } from '../ConfirmDialog';
import { FormDialog } from '../FormDialog';
import { Menu } from '../Menu';
import { Popover } from '../Popover';

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
    <p className="type-caption text-onSurface-subtle">
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

// ── 撮影しない: dialog を開いている間の Toast (#169) ──────────────────

type Scenario = 'dialogs' | 'providers' | 'raw' | 'stacked' | 'unmount';

/** 場面の部品: 押すと Toast を出すボタン 2 つ (元に戻す付き = 自動で消えない / 3 秒で消える) */
function FireButtons({ where, onLog }: { where: string; onLog: (m: string) => void }) {
  const { showToast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          showToast({
            variant: 'info',
            description: `アーカイブしました (${where})`,
            action: { label: '元に戻す', onClick: () => onLog(`元に戻す (${where})`) },
          })
        }
      >
        {`Toast (元に戻す付き・${where})`}
      </Button>
      <Button
        variant="secondary"
        onClick={() => showToast({ variant: 'success', description: `保存しました (${where})`, duration: 3000 })}
      >
        {`Toast (3 秒・${where})`}
      </Button>
    </div>
  );
}

function DialogScenarioDemo() {
  const { showToast } = useToast();
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [discardOpen, setDiscardOpen] = React.useState(false);
  const later = () =>
    window.setTimeout(
      () => showToast({ variant: 'info', description: '遅れて届いた知らせ', action: { label: '元に戻す', onClick: () => add('元に戻す (遅れて)') } }),
      1000,
    );

  return (
    <div className="flex flex-col items-start gap-4">
      <FireButtons where="ページ" onLog={add} />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={later}>1 秒後に Toast を出す</Button>
        <Button onClick={() => setConfirmOpen(true)}>確認を開く</Button>
        <Button onClick={() => setFormOpen(true)}>作業を開く</Button>
        <Menu
          trigger={<Button variant="secondary">並び順</Button>}
          title="並び順"
          items={['出発が早い順', '料金が安い順'].map((label) => ({ label, onSelect: () => add(`Menu: ${label}`) }))}
        />
        <Popover trigger={<Button variant="secondary">自由席について</Button>} title="自由席について">
          <p className="type-body">1〜3 号車が自由席です。</p>
        </Popover>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          // 確定の後、閉じる前に Toast を出す (同じ描画で閉じる)
          showToast({ variant: 'success', description: '予約を取り消しました', action: { label: '元に戻す', onClick: () => add('元に戻す (確定)') } });
          setConfirmOpen(false);
        }}
        title="予約を取り消しますか？"
        confirmLabel="取り消す"
        cancelLabel="やめる"
      >
        <div className="flex flex-col gap-2">
          <span>取り消すと元に戻せません。</span>
          <FireButtons where="確認" onLog={add} />
        </div>
      </ConfirmDialog>
      <FormDialog
        open={formOpen}
        onClose={() => setDiscardOpen(true)}
        onSubmit={() => setFormOpen(false)}
        title="絞り込み"
        submitLabel="適用"
      >
        <div className="flex flex-col items-start gap-4">
          <Input name="keyword" label="駅名・列車名" fullWidth />
          <FireButtons where="作業" onLog={add} />
          <Menu
            trigger={<Button variant="secondary">並び順 (作業)</Button>}
            title="並び順"
            items={['出発が早い順', '料金が安い順'].map((label) => ({ label, onSelect: () => add(`Menu (作業): ${label}`) }))}
          />
          <Popover trigger={<Button variant="secondary">メモ (作業)</Button>} title="メモ">
            <Input name="memo" label="メモ" />
          </Popover>
        </div>
      </FormDialog>
      <ConfirmDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onConfirm={() => {
          setDiscardOpen(false);
          setFormOpen(false);
        }}
        title="入力を破棄しますか？"
        confirmLabel="破棄する"
        cancelLabel="破棄をやめる"
        destructive
      >
        <div className="flex flex-col gap-2">
          <span>入力した条件は保存されません。</span>
          <FireButtons where="破棄の確認" onLog={add} />
        </div>
      </ConfirmDialog>
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

/** providers: Provider を 2 つ重ね (外側は右下、内側は右上)、単発の `<Toast>` (上) も置く。FormDialog の中から 3 つとも出す */
function ProvidersScenarioDemo() {
  const outer = useToast();
  return (
    <ToastProvider position="top-right">
      <ProvidersInner showOuter={outer.showToast} />
    </ToastProvider>
  );
}

function ProvidersInner({ showOuter }: { showOuter: ReturnType<typeof useToast>['showToast'] }) {
  const inner = useToast();
  const [open, setOpen] = React.useState(false);
  const [single, setSingle] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>作業を開く</Button>
      <FormDialog open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} title="絞り込み" submitLabel="適用">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => showOuter({ variant: 'info', description: '外側の知らせ', action: { label: '元に戻す', onClick: () => add('外側') } })}
          >
            外側の Provider
          </Button>
          <Button
            variant="secondary"
            onClick={() => inner.showToast({ variant: 'info', description: '内側の知らせ', action: { label: '元に戻す', onClick: () => add('内側') } })}
          >
            内側の Provider
          </Button>
          <Button variant="secondary" onClick={() => setSingle(true)}>単発の Toast</Button>
        </div>
      </FormDialog>
      <Toast
        open={single}
        onClose={() => setSingle(false)}
        position="top"
        variant="info"
        description="単発の知らせ"
        action={{ label: '元に戻す', onClick: () => add('単発') }}
      />
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

/** raw: 使う側の素の `<dialog>` (マウントしたら自分で `showModal()`)。閉じずに DOM から外す */
function RawModal({ onRemove }: { onRemove: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();
  React.useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} aria-label="素の dialog" className="p-4 rounded-md bg-surface text-onSurface backdrop:bg-surface-overlay">
      <div className="flex flex-col items-start gap-2">
        <Button
          variant="secondary"
          onClick={() => showToast({ variant: 'info', description: '素の dialog の知らせ', action: { label: '元に戻す', onClick: () => {} } })}
        >
          Toast (素の dialog)
        </Button>
        <Button onClick={onRemove}>閉じずに外す</Button>
      </div>
    </dialog>
  );
}

/** raw: 唯一の子が文字の素の `<dialog>`。開いている間、React が中身を丸ごと置き換え続ける。開いたら Toast を出す */
function TextModal({ onClosed }: { onClosed: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();
  const [n, setN] = React.useState(0);
  const fired = React.useRef(false);
  React.useEffect(() => {
    ref.current?.showModal();
    if (!fired.current) {
      fired.current = true;
      showToast({ variant: 'info', description: '文字だけの dialog の知らせ', action: { label: '元に戻す', onClick: () => {} } });
    }
    const t = window.setInterval(() => setN((x) => x + 1), 50);
    return () => window.clearInterval(t);
  }, [showToast]);
  return (
    <dialog ref={ref} aria-label="文字だけの dialog" onClose={onClosed} className="p-4 rounded-md bg-surface text-onSurface backdrop:bg-surface-overlay">
      {`更新 ${n} 回 (Esc で閉じる)`}
    </dialog>
  );
}

function RawScenarioDemo() {
  const [raw, setRaw] = React.useState(false);
  const [text, setText] = React.useState(false);
  return (
    <div className="flex flex-col items-start gap-4">
      <FireButtons where="ページ" onLog={() => {}} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setRaw(true)}>素の dialog を開く</Button>
        <Button onClick={() => setText(true)}>文字だけの dialog を開く</Button>
      </div>
      {raw && <RawModal onRemove={() => setRaw(false)} />}
      {text && <TextModal onClosed={() => setText(false)} />}
    </div>
  );
}

/** stacked: JSX では ConfirmDialog を FormDialog より前に置く。FormDialog の上に ConfirmDialog を重ね、その中から単発の Toast を開く */
function StackedScenarioDemo() {
  const [form, setForm] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [single, setSingle] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setForm(true)}>作業を開く</Button>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => setConfirm(false)}
        title="入力を破棄しますか？"
        confirmLabel="破棄する"
        cancelLabel="破棄をやめる"
      >
        <Button variant="secondary" onClick={() => setSingle(true)}>単発の Toast</Button>
      </ConfirmDialog>
      <FormDialog open={form} onClose={() => setForm(false)} onSubmit={() => setForm(false)} title="絞り込み" submitLabel="適用">
        <Button variant="secondary" onClick={() => setConfirm(true)}>確認を重ねる</Button>
      </FormDialog>
      <Toast
        open={single}
        onClose={() => setSingle(false)}
        variant="info"
        description="単発の知らせ"
        action={{ label: '元に戻す', onClick: () => setLog((l) => [...l, '単発']) }}
      />
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

/** unmount: FormDialog を開いている間に、内側の ToastProvider を外す */
function UnmountScenarioDemo() {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(true);
  const innerShow = React.useRef<ReturnType<typeof useToast>['showToast'] | null>(null);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>作業を開く</Button>
      {inner && (
        <ToastProvider position="top-right">
          <CaptureShowToast target={innerShow} />
        </ToastProvider>
      )}
      <FormDialog open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} title="絞り込み" submitLabel="適用">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => innerShow.current?.({ variant: 'info', description: '内側の知らせ', action: { label: '元に戻す', onClick: () => {} } })}
          >
            内側の Toast
          </Button>
          <Button variant="secondary" onClick={() => setInner(false)}>内側の Provider を外す</Button>
        </div>
      </FormDialog>
    </div>
  );
}

function CaptureShowToast({ target }: { target: React.MutableRefObject<ReturnType<typeof useToast>['showToast'] | null> }) {
  const { showToast } = useToast();
  React.useEffect(() => {
    target.current = showToast;
    return () => {
      target.current = null;
    };
  }, [showToast, target]);
  return null;
}

const SCENARIO_DOCS =
  'いろいろな場面を手で触るための story (play は持たない)。dialogs: ConfirmDialog・FormDialog (取り消すと上に破棄の確認)・Menu・Popover を開いている間に Toast を出す。「1 秒後に Toast を出す」を押してから開くと、開いている間に届く。providers: Provider を 2 つ重ね、単発の `<Toast>` も置いて、FormDialog の中から 3 つとも出す。raw: 使う側の素の `<dialog>` (閉じずに DOM から外す) と、唯一の子が文字で中身が置き換わり続ける dialog。stacked: JSX で ConfirmDialog を FormDialog より前に置き、FormDialog の上に重ねて単発の Toast を開く。unmount: FormDialog を開いている間に内側の ToastProvider を外す。';

export const Scenarios: StoryObj<{ scenario: Scenario; position: ToastPosition }> = {
  args: { scenario: 'dialogs', position: 'bottom-right' },
  argTypes: {
    scenario: { control: 'select', options: ['dialogs', 'providers', 'raw', 'stacked', 'unmount'] },
    position: { control: 'select', options: ['top', 'top-right', 'bottom', 'bottom-right'] },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: SCENARIO_DOCS } },
  },
  render: ({ scenario, position }) => (
    <ToastProvider position={position}>
      {
        {
          dialogs: <DialogScenarioDemo />,
          providers: <ProvidersScenarioDemo />,
          raw: <RawScenarioDemo />,
          stacked: <StackedScenarioDemo />,
          unmount: <UnmountScenarioDemo />,
        }[scenario]
      }
    </ToastProvider>
  ),
};

/** Toast (説明の文で探す) の面 */
function toastBody(text: string): HTMLElement {
  const el = Array.from(document.querySelectorAll<HTMLElement>('[data-ds-root]')).find(
    (e) => !e.matches('dialog') && e.closest('[aria-live]') && e.textContent?.includes(text),
  );
  if (!el) throw new Error(`Toast が無い: ${text}`);
  return el;
}

/** Toast が見えて (一番上で)、ボタンにフォーカスが入り、置かれている dialog (無ければ null) を返す */
async function expectUsable(text: string, dialogTitle: string | null, rawDialogLabel?: string) {
  const body = toastBody(text);
  const r = body.getBoundingClientRect();
  // 一番上: 真ん中の点に当たるのが Toast (dialog の背景・中身ではない)
  await expect(body.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2))).toBe(true);
  // フォーカスが入る (dialog の外に残ると inert で入らない)
  const close = body.querySelector<HTMLElement>('button[aria-label="通知を閉じる"]')!;
  const prev = document.activeElement as HTMLElement | null;
  close.focus();
  await expect(document.activeElement).toBe(close);
  prev?.focus();
  // 読み上げの live region の中
  await expect(body.closest('[aria-live]')).not.toBeNull();
  // 置き場: dialog を開いている間は一番上の dialog の中、閉じたら元の場所 (popover を外す)
  const host = body.closest('.z-toast') as HTMLElement;
  const dialog = body.closest('dialog');
  if (rawDialogLabel) await expect(dialog?.getAttribute('aria-label')).toBe(rawDialogLabel);
  else await expect(dialog?.querySelector('h2')?.textContent ?? null).toBe(dialogTitle);
  await expect(host.hasAttribute('popover')).toBe(dialogTitle !== null || !!rawDialogLabel);
}

const visibleButton = (name: string) =>
  screen.getAllByRole('button', { name }).filter((b) => b.getClientRects().length > 0).pop()!;

export const OverDialog: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない、#169)。FormDialog を開いている間に出した Toast が dialog の上に見えて押せる / 上に破棄の確認を重ねると、そちらの上へ移る / 2 つとも閉じた後もページで押せて、作り直されていない。先に出してから ConfirmDialog を開いた場合も同じ。',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <DialogScenarioDemo />
    </ToastProvider>
  ),
  play: async () => {
    // FormDialog の中から出す
    await userEvent.click(screen.getByRole('button', { name: '作業を開く' }));
    await userEvent.click(visibleButton('Toast (元に戻す付き・作業)'));
    const text = 'アーカイブしました (作業)';
    await waitFor(() => toastBody(text));
    await expectUsable(text, '絞り込み');
    const marked = toastBody(text);
    await userEvent.click(screen.getByRole('button', { name: '元に戻す' }));
    await expect(screen.getByTestId('log')).toHaveTextContent('元に戻す (作業)');
    // 指・マウスで開いた dialog は、キーが押されるまで輪を出さない。Toast の中でキーを押したら、そこから出す (AGENTS §3-2)
    const formDialog = toastBody(text).closest('dialog')!;
    await expect(formDialog).toHaveAttribute('data-ds-hide-focus-ring');
    await userEvent.tab();
    await expect(formDialog).not.toHaveAttribute('data-ds-hide-focus-ring');
    // 取り消し → 上に破棄の確認。Toast はそちらの上へ
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    await waitFor(() =>
      expect(Array.from(document.querySelectorAll('dialog[open] h2'), (h) => h.textContent)).toContain('入力を破棄しますか？'),
    );
    await expectUsable(text, '入力を破棄しますか？');
    // 破棄する (2 つとも閉じる) → ページへ戻る。同じ要素のまま (作り直されていない)
    await userEvent.click(screen.getByRole('button', { name: '破棄する' }));
    await waitFor(() => expect(document.querySelector('dialog[open]')).toBeNull());
    await expectUsable(text, null);
    await expect(toastBody(text)).toBe(marked);
    await expect(document.activeElement).toBe(screen.getByRole('button', { name: '作業を開く' }));

    // 順番が逆: ページで出してから ConfirmDialog を開く
    await userEvent.click(screen.getByRole('button', { name: 'Toast (元に戻す付き・ページ)' }));
    await waitFor(() => toastBody('アーカイブしました (ページ)'));
    await userEvent.click(screen.getByRole('button', { name: '確認を開く' }));
    await expectUsable('アーカイブしました (ページ)', '予約を取り消しますか？');
    // dialog の中で、Toast の閉じるをキーボードで押して Toast が消えたら、フォーカスは dialog そのものへ (body に落ちない)。
    // 残っている別の Toast へは移さない
    const confirmDialog = toastBody('アーカイブしました (ページ)').closest('dialog')!;
    toastBody('アーカイブしました (ページ)').querySelector<HTMLElement>('button[aria-label="通知を閉じる"]')!.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(document.activeElement).toBe(confirmDialog));
    await expectUsable(text, '予約を取り消しますか？');
    await expectUsable(text, '予約を取り消しますか？');
    await userEvent.click(screen.getByRole('button', { name: 'やめる' }));
    await expectUsable(text, null);
  },
};

export const OverDialogProviders: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない、#169)。Provider を 2 つ重ね、単発の `<Toast>` も置いたとき、FormDialog の中から出した 3 つとも dialog の上に見えて押せる。閉じたら 3 つとも元の場所へ戻る。',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <ProvidersScenarioDemo />
    </ToastProvider>
  ),
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '作業を開く' }));
    await userEvent.click(screen.getByRole('button', { name: '外側の Provider' }));
    await userEvent.click(screen.getByRole('button', { name: '内側の Provider' }));
    await userEvent.click(screen.getByRole('button', { name: '単発の Toast' }));
    for (const text of ['外側の知らせ', '内側の知らせ', '単発の知らせ']) {
      await waitFor(() => toastBody(text));
      await expectUsable(text, '絞り込み');
    }
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => expect(document.querySelector('dialog[open]')).toBeNull());
    for (const text of ['外側の知らせ', '内側の知らせ', '単発の知らせ']) await expectUsable(text, null);
  },
};

export const OverDialogRemoved: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない、#169)。使う側の素の `<dialog>` を開いたまま DOM から外しても、Toast は消えずにページへ戻り、その後も出せる。唯一の子が文字の dialog で、開いている間に中身が置き換わり続けても、Toast は dialog の上に残る。',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <RawScenarioDemo />
    </ToastProvider>
  ),
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '素の dialog を開く' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Toast (素の dialog)' }));
    await waitFor(() => toastBody('素の dialog の知らせ'));
    await expectUsable('素の dialog の知らせ', null, '素の dialog');
    // 閉じずに外す → Toast はページへ戻る (置き場ごと消えない)
    await userEvent.click(screen.getByRole('button', { name: '閉じずに外す' }));
    await waitFor(() => expect(document.querySelector('dialog[open]')).toBeNull());
    await waitFor(() => expectUsable('素の dialog の知らせ', null));
    // その後に出した Toast も文書にある
    await userEvent.click(screen.getByRole('button', { name: 'Toast (3 秒・ページ)' }));
    await waitFor(() => toastBody('保存しました (ページ)'));
    await expectUsable('保存しました (ページ)', null);

    // 唯一の子が文字の dialog: 中身が置き換わっても、Toast は dialog の上に残る
    await userEvent.click(screen.getByRole('button', { name: '文字だけの dialog を開く' }));
    await waitFor(() => toastBody('文字だけの dialog の知らせ'));
    const textDialog = document.querySelector<HTMLDialogElement>('dialog[aria-label="文字だけの dialog"]')!;
    await waitFor(() => expect(textDialog.textContent).toMatch(/更新 [5-9]|更新 \d\d/));
    await expectUsable('文字だけの dialog の知らせ', null, '文字だけの dialog');
    textDialog.close();
    await waitFor(() => expect(document.querySelector('dialog[open]')).toBeNull());
    await expectUsable('文字だけの dialog の知らせ', null);
  },
};

export const OverDialogStacked: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない、#169)。ToastProvider が無いページで、FormDialog の上に ConfirmDialog を重ね (JSX では ConfirmDialog が先)、その中から単発の `<Toast>` を開くと、上の ConfirmDialog の上に出て押せる (見張りは Toast を開いたときに始まるので、フォーカスを含む dialog を一番上とみなす)。',
      },
    },
  },
  render: () => <StackedScenarioDemo />,
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '作業を開く' }));
    await userEvent.click(screen.getByRole('button', { name: '確認を重ねる' }));
    await userEvent.click(await screen.findByRole('button', { name: '単発の Toast' }));
    await waitFor(() => toastBody('単発の知らせ'));
    await expectUsable('単発の知らせ', '入力を破棄しますか？');
    await userEvent.click(screen.getByRole('button', { name: '破棄をやめる' }));
    await waitFor(() => expectUsable('単発の知らせ', '絞り込み'));
  },
};

export const OverDialogUnmount: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない、#169)。FormDialog を開いている間に、その上に Toast を出している ToastProvider を外すと、置き場は dialog の中に残らない (置き去りの Toast が見え続けない)。',
      },
    },
  },
  render: () => <UnmountScenarioDemo />,
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '作業を開く' }));
    await userEvent.click(screen.getByRole('button', { name: '内側の Toast' }));
    await waitFor(() => toastBody('内側の知らせ'));
    await expectUsable('内側の知らせ', '絞り込み');
    const dialog = toastBody('内側の知らせ').closest('dialog')!;
    await userEvent.click(screen.getByRole('button', { name: '内側の Provider を外す' }));
    await waitFor(() => expect(document.body.textContent).not.toContain('内側の知らせ'));
    await expect(dialog.querySelector('.z-toast')).toBeNull();
  },
};
