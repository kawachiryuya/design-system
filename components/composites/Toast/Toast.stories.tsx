import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { ToastProvider, useToast, type ToastOptions, type ToastVariant } from './Toast';
import { ToastStoryContext } from '../../_internal/toastStory';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Input } from '../../primitives/Input';
import { Link } from '../../primitives/Link';
import { AppShell } from '../AppShell';
import { ConfirmDialog } from '../ConfirmDialog';
import { FormDialog } from '../FormDialog';
import { Menu } from '../Menu';
import { Popover } from '../Popover';

/**
 * Toast stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 出し方は `useToast()` だけで、秒数は部品が決める (使う側に止める手段は無い)。撮影・axe・フォーカスの輪の検査のあいだ
 * 出した Toast を残すため、撮影する story は内側の `ToastStoryContext` (公開しない、`components/_internal/toastStory.ts`) で
 * タイマーを止める (`frozen`)。Overview はさらに置き場をその場に置き (`inline`)、いくつもの形を 1 枚に並べる。
 * 置き場所 (画面の下の中央・下のナビに重ねる) は EdgeCases で撮る。どちらも幅で見え方が変わる
 * (ボタンが下の段に落ちる・下のナビに重なる) ので `[375, 1280]`。
 * 秒数・払う・枚数・フォーカスの戻り (#176)・dialog の上 (#169) は、撮影しない play で守る。
 */
const meta: Meta<typeof ToastProvider> = {
  title: 'Composites/Toast',
  component: ToastProvider,
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

/** 描いたときに 1 度だけ Toast を出す (StrictMode の二重の effect でも 1 度) */
function Fire({ toasts }: { toasts: ToastOptions[] }) {
  const { showToast } = useToast();
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    toasts.forEach((t) => showToast(t));
  }, [showToast, toasts]);
  return null;
}

/** 撮影用: タイマーを止め、置き場をその場に置いた Provider に、決めた Toast を出す */
function Still({ toasts, label, id }: { toasts: ToastOptions[]; label: string; id?: string }) {
  return (
    <div id={id} className="flex flex-col gap-1">
      <span className="type-caption text-onSurface-subtle">{label}</span>
      <ToastStoryContext.Provider value={{ frozen: true, inline: true }}>
        <ToastProvider>
          <Fire toasts={toasts} />
        </ToastProvider>
      </ToastStoryContext.Provider>
    </div>
  );
}

const noop = () => {};

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

type PlaygroundArgs = { variant: ToastVariant; message: string; action: 'なし' | '元に戻す' | '再試行'; onAction: () => void };

export const Playground: StoryObj<PlaygroundArgs> = {
  args: { variant: 'success', message: '保存しました', action: 'なし', onAction: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['success', 'error'] },
    message: { control: 'text' },
    action: { control: 'inline-radio', options: ['なし', '元に戻す', '再試行'] },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'ボタンで Toast を出す。種類・文・操作を Controls で変えて試す。秒数 (5 秒・操作つき 7 秒・できなかったは消えない) と置き場所は部品が決める。',
      },
    },
  },
  render: ({ variant, message, action, onAction }) => {
    function Demo() {
      const { showToast } = useToast();
      return (
        <Button
          onClick={() =>
            showToast({ variant, message, action: action === 'なし' ? undefined : { label: action, onClick: onAction } })
          }
        >
          Toast を出す
        </Button>
      );
    }
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
  play: async ({ args }) => {
    // 操作を押すと onClick を呼んでから、その Toast は閉じる
    await userEvent.click(screen.getByRole('button', { name: 'Toast を出す' }));
    await expect(await screen.findByText(args.message)).toBeInTheDocument();
  },
};

// ── 2. Overview (視覚回帰対象) — タイマーを止め、その場に並べる ──

const LONG = '「東京 → 新大阪」のぞみ 21 号の予約を取り消しました。払い戻しは 3 日ほどで届きます';

export const Overview: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280], prefersReducedMotion: 'reduce' },
    pseudo: {
      hover: ['#toast-hover button'],
      focusVisible: ['#toast-focus button'],
      active: ['#toast-active button'],
    },
    docs: {
      description: {
        story:
          '視覚回帰用の総覧 (幅 375・1280)。できた / 操作つき / できなかった (閉じる) / できなかった + 操作 / 長い文 (ボタンが下の段に落ちる) / 2 枚 (できなかったを残し、上に新しい 1 枚) と、ボタンのホバー・フォーカス・押下 (pseudo 強制)。タイマーを止めて、その場に並べている (置き場所は EdgeCases)。',
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-content-sm flex-col gap-4">
      <Still label="できた (5 秒で消える)" toasts={[{ message: '保存しました' }]} />
      <Still label="できた + 操作 (7 秒)" toasts={[{ message: 'アーカイブしました', action: { label: '元に戻す', onClick: noop } }]} />
      <Still label="できなかった (消えない・閉じる)" toasts={[{ variant: 'error', message: '送信できませんでした' }]} />
      <Still
        label="できなかった + 操作"
        toasts={[{ variant: 'error', message: '送信できませんでした', action: { label: '再試行', onClick: noop } }]}
      />
      <Still label="長い文 (1 行に収まらないと、ボタンは下の段に右寄せ)" toasts={[{ message: LONG, action: { label: '元に戻す', onClick: noop } }]} />
      <Still
        label="2 枚 (できなかったを残し、新しい 1 枚を上に)"
        toasts={[
          { variant: 'error', message: '座席を確保できませんでした', action: { label: '再試行', onClick: noop } },
          { message: '検索条件を保存しました' },
        ]}
      />
      <Still id="toast-hover" label="ホバー (黒 8%)" toasts={[{ variant: 'error', message: '送信できませんでした', action: { label: '再試行', onClick: noop } }]} />
      <Still id="toast-focus" label="フォーカス (白い内側の輪)" toasts={[{ message: 'アーカイブしました', action: { label: '元に戻す', onClick: noop } }]} />
      <Still id="toast-active" label="押下" toasts={[{ variant: 'error', message: '送信できませんでした', action: { label: '再試行', onClick: noop } }]} />
    </div>
  ),
  play: async () => {
    await screen.findByText(LONG);
    await screen.findByText('検索条件を保存しました');
  },
};

// ── 3. EdgeCases (視覚回帰対象) — 置き場所: 画面の下の中央、下のナビに重ねる ──

const MockBottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-sticky bg-surface border-t border-border-subtle shadow-sm">
    <div className="flex items-center justify-around h-16">
      <Link href="#" size="sm" className="flex-col px-3 py-1"><Icon name="home" />ホーム</Link>
      <Link href="#" size="sm" className="flex-col px-3 py-1"><Icon name="list_alt" />予約一覧</Link>
      <Link href="#" size="sm" className="flex-col px-3 py-1"><Icon name="person" />マイページ</Link>
    </div>
  </nav>
);

export const EdgeCases: Story = {
  parameters: {
    layout: 'fullscreen',
    chromatic: { viewports: [375, 1280], prefersReducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          '置き場所 (幅 375・1280)。どの幅も画面の下の中央 (広い幅は最大 28rem)。狭い幅は AppShell の下のナビを避けずに重ねる。できなかった (残る) の上に、新しいできた。タイマーは止めている。',
      },
    },
  },
  render: () => (
    <ToastStoryContext.Provider value={{ frozen: true }}>
      <ToastProvider>
        <AppShell header={<div className="px-4 h-16 flex items-center type-item-title">予約</div>} bottomNav={<MockBottomNav />}>
          <p className="type-body p-4">下のナビ (狭い幅だけ出る) に Toast が重なる。</p>
        </AppShell>
        <Fire
          toasts={[
            { variant: 'error', message: '座席を確保できませんでした', action: { label: '再試行', onClick: noop } },
            { message: 'アーカイブしました', action: { label: '元に戻す', onClick: noop } },
          ]}
        />
      </ToastProvider>
    </ToastStoryContext.Provider>
  ),
  play: async () => {
    await screen.findByText('アーカイブしました');
  },
};

// ── 撮影しない: 秒数・止まる・枚数・払う・フォーカスの戻り ──────────────────

/** Toast (文で探す) の面。消える途中のものは数えない */
function toastBody(text: string): HTMLElement {
  const el = findToast(text);
  if (!el) throw new Error(`Toast が無い: ${text}`);
  return el;
}

function findToast(text: string): HTMLElement | undefined {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-ds-toast-layer] [aria-live] > [data-ds-root]')).find(
    (e) => e.dataset.state !== 'exiting' && e.textContent?.includes(text),
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** ボタンを押すと Toast を出す (秒数の play 用) */
function FireButton({ label, toast }: { label: string; toast: ToastOptions }) {
  const { showToast } = useToast();
  return <Button onClick={() => showToast(toast)}>{label}</Button>;
}

export const AutoDismiss: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: '守る play (撮影しない)。できた、は 5 秒で消える (4.5 秒ではまだある)。' } },
  },
  render: () => (
    <ToastProvider>
      <FireButton label="保存" toast={{ message: '保存しました' }} />
    </ToastProvider>
  ),
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => toastBody('保存しました'));
    await sleep(4500);
    await expect(findToast('保存しました')).toBeDefined();
    await waitFor(() => expect(findToast('保存しました')).toBeUndefined(), { timeout: 1500 });
  },
};

export const AutoDismissWithAction: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: '守る play (撮影しない)。操作つきのできた、は 7 秒で消える (6.5 秒ではまだある)。' } },
  },
  render: () => (
    <ToastProvider>
      <FireButton label="アーカイブ" toast={{ message: 'アーカイブしました', action: { label: '元に戻す', onClick: noop } }} />
    </ToastProvider>
  ),
  play: async () => {
    // ポインタを Toast の上に置かない (止まる)。キーボードで押す
    screen.getByRole('button', { name: 'アーカイブ' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => toastBody('アーカイブしました'));
    await sleep(6500);
    await expect(findToast('アーカイブしました')).toBeDefined();
    await waitFor(() => expect(findToast('アーカイブしました')).toBeUndefined(), { timeout: 1500 });
  },
};

export const PauseWhileHovered: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない)。マウスが乗っている間・中にフォーカスがある間は残り時間を止め、離れたら残りから再開する (WCAG 2.2.1)。',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <FireButton label="保存" toast={{ message: '保存しました', action: { label: '元に戻す', onClick: noop } }} />
    </ToastProvider>
  ),
  play: async () => {
    screen.getByRole('button', { name: '保存' }).focus();
    await userEvent.keyboard('{Enter}');
    const shown = Date.now();
    await waitFor(() => toastBody('保存しました'));
    // マウスが乗っている間 (1.5 秒) と、中にフォーカスがある間 (1 秒) は止まる。7 秒の期限が 2.5 秒延びる
    await sleep(500);
    await userEvent.hover(toastBody('保存しました'));
    await sleep(1500);
    await userEvent.unhover(toastBody('保存しました'));
    toastBody('保存しました').querySelector('button')!.focus();
    await sleep(1000);
    screen.getByRole('button', { name: '保存' }).focus();
    // 元の期限 (7 秒) を過ぎても残り、延びた期限 (9.5 秒) のあたりで消える
    await sleep(Math.max(0, 8800 - (Date.now() - shown)));
    await expect(findToast('保存しました')).toBeDefined();
    await waitFor(() => expect(findToast('保存しました')).toBeUndefined(), { timeout: 1500 });
  },
};

function StackDemo() {
  const { showToast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => showToast({ variant: 'error', message: '送信できませんでした (1)' })}>できなかった 1</Button>
      <Button variant="secondary" onClick={() => showToast({ variant: 'error', message: '送信できませんでした (2)' })}>できなかった 2</Button>
      <Button variant="secondary" onClick={() => showToast({ message: '保存しました (A)' })}>できた A</Button>
      <Button variant="secondary" onClick={() => showToast({ message: '保存しました (B)' })}>できた B</Button>
    </div>
  );
}

export const Stacking: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない)。ふだん 1 枚で入れ替え。できなかったが出ている間はそれを残し、新しい 1 枚をその上に (最大 2 枚)。できなかったが続けたら新しいほうだけ。できなかったは消えない (できたが 5 秒で消えても残る)。',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <StackDemo />
    </ToastProvider>
  ),
  play: async () => {
    const count = () => document.querySelectorAll('[data-ds-toast-layer] [aria-live] > [data-ds-root]:not([data-state=exiting])').length;
    await userEvent.click(screen.getByRole('button', { name: 'できた A' }));
    await userEvent.click(screen.getByRole('button', { name: 'できた B' }));
    await waitFor(() => expect(count()).toBe(1));
    await expect(findToast('(A)')).toBeUndefined();
    // できなかったが出ると、できたは入れ替わる (できなかった 1 枚)
    await userEvent.click(screen.getByRole('button', { name: 'できなかった 1' }));
    await waitFor(() => expect(count()).toBe(1));
    // できなかったを残して、上に新しいできた (2 枚)
    await userEvent.click(screen.getByRole('button', { name: 'できた A' }));
    await waitFor(() => expect(count()).toBe(2));
    await expect(toastBody('(A)').getBoundingClientRect().bottom).toBeLessThanOrEqual(toastBody('(1)').getBoundingClientRect().top);
    // 次のできたは、できたと入れ替わる (2 枚のまま)
    await userEvent.click(screen.getByRole('button', { name: 'できた B' }));
    await waitFor(() => expect(findToast('(A)')).toBeUndefined());
    await expect(count()).toBe(2);
    // できなかったが続いたら新しいほうだけ (できたも入れ替わる)
    await userEvent.click(screen.getByRole('button', { name: 'できなかった 2' }));
    await waitFor(() => expect(count()).toBe(1));
    await expect(findToast('(2)')).toBeDefined();
    // できたは 5 秒で消え、できなかったは残る
    await userEvent.click(screen.getByRole('button', { name: 'できた A' }));
    await waitFor(() => expect(count()).toBe(2));
    await waitFor(() => expect(findToast('(A)')).toBeUndefined(), { timeout: 6500 });
    await expect(findToast('(2)')).toBeDefined();
  },
};

/** 合成の pointer で、Toast の面を下へ dy だけ動かして離す */
function swipe(el: HTMLElement, dy: number) {
  const r = el.getBoundingClientRect();
  const x = r.x + 16;
  const y = r.y + r.height / 2;
  const opts = { bubbles: true, pointerId: 7, pointerType: 'touch', isPrimary: true } as const;
  el.dispatchEvent(new PointerEvent('pointerdown', { ...opts, clientX: x, clientY: y }));
  for (let i = 1; i <= 4; i += 1) el.dispatchEvent(new PointerEvent('pointermove', { ...opts, clientX: x, clientY: y + (dy * i) / 4 }));
  el.dispatchEvent(new PointerEvent('pointerup', { ...opts, clientX: x, clientY: y + dy }));
}

export const SwipeToDismiss: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: '守る play (撮影しない)。下へ 24px より多く動かして離すと消える (できたも、できなかったも)。少しだけなら戻る。' } },
  },
  render: () => (
    <ToastProvider>
      <StackDemo />
    </ToastProvider>
  ),
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'できなかった 1' }));
    await waitFor(() => toastBody('(1)'));
    swipe(toastBody('(1)'), 12);
    await sleep(100);
    await expect(findToast('(1)')).toBeDefined();
    await expect(toastBody('(1)').style.getPropertyValue('--ds-toast-drag')).toBe('');
    swipe(toastBody('(1)'), 40);
    await waitFor(() => expect(findToast('(1)')).toBeUndefined());
    await userEvent.click(screen.getByRole('button', { name: 'できた A' }));
    await waitFor(() => toastBody('(A)'));
    swipe(toastBody('(A)'), 40);
    await waitFor(() => expect(findToast('(A)')).toBeUndefined());
  },
};

function FocusDemo() {
  const { showToast } = useToast();
  const [rowGone, setRowGone] = React.useState(false);
  const nextRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={() => showToast({ message: 'アーカイブしました', action: { label: '元に戻す', onClick: noop } })}>アーカイブ</Button>
      <Button onClick={() => showToast({ variant: 'error', message: '送信できませんでした' })}>送信</Button>
      {!rowGone && (
        <Button
          variant="secondary"
          onClick={() => {
            // 押したボタンごと行が消え、アプリは次の行へフォーカスを移す (§8-3 の削除時)
            setRowGone(true);
            showToast({ message: '行を削除しました', action: { label: '元に戻す', onClick: noop } });
            queueMicrotask(() => nextRef.current?.focus());
          }}
        >
          この行を削除
        </Button>
      )}
      <Button ref={nextRef} variant="secondary">次の行</Button>
    </div>
  );
}

export const FocusReturn: StoryObj = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '守る play (撮影しない、#176)。Toast の中にフォーカスがあるまま閉じると、出したときにフォーカスがあった要素に戻す (body に落とさない)。その要素が消えていたら、Toast に入る直前の要素に戻す。',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <FocusDemo />
    </ToastProvider>
  ),
  play: async () => {
    // 操作を押して閉じる → アーカイブへ
    const archive = screen.getByRole('button', { name: 'アーカイブ' });
    archive.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => toastBody('アーカイブしました'));
    toastBody('アーカイブしました').querySelector('button')!.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(findToast('アーカイブしました')).toBeUndefined());
    await expect(document.activeElement).toBe(archive);

    // できなかったの「閉じる」→ 送信へ
    const send = screen.getByRole('button', { name: '送信' });
    send.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => toastBody('送信できませんでした'));
    screen.getByRole('button', { name: '通知を閉じる' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(findToast('送信できませんでした')).toBeUndefined());
    await expect(document.activeElement).toBe(send);

    // 出したボタンが消えた → Toast に入る直前の要素 (アプリが移した「次の行」) へ
    screen.getByRole('button', { name: 'この行を削除' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => toastBody('行を削除しました'));
    const next = screen.getByRole('button', { name: '次の行' });
    await waitFor(() => expect(document.activeElement).toBe(next));
    await userEvent.tab();
    await expect(toastBody('行を削除しました').contains(document.activeElement)).toBe(true);
    // 下へ払って消しても同じ (指で消したので、次にキーが押されるまで輪は出さない)
    swipe(toastBody('行を削除しました'), 40);
    await waitFor(() => expect(findToast('行を削除しました')).toBeUndefined());
    await expect(document.activeElement).toBe(next);
  },
};

// ── 撮影しない: dialog を開いている間の Toast (#169) ──────────────────

type Scenario = 'dialogs' | 'providers' | 'raw' | 'stacked' | 'unmount';

/** 場面の部品: 押すと Toast を出すボタン 2 つ (できなかった + 再試行 = 消えない / できた = 5 秒で消える) */
function FireButtons({ where, onLog }: { where: string; onLog: (m: string) => void }) {
  const { showToast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          showToast({
            variant: 'error',
            message: `送信できませんでした (${where})`,
            action: { label: '再試行', onClick: () => onLog(`再試行 (${where})`) },
          })
        }
      >
        {`Toast (できなかった・${where})`}
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          showToast({ message: `アーカイブしました (${where})`, action: { label: '元に戻す', onClick: () => onLog(`元に戻す (${where})`) } })
        }
      >
        {`Toast (できた・${where})`}
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
      () => showToast({ variant: 'error', message: '遅れて届いた知らせ', action: { label: '再試行', onClick: () => add('再試行 (遅れて)') } }),
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
          showToast({ message: '予約を取り消しました', action: { label: '元に戻す', onClick: () => add('元に戻す (確定)') } });
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

/** providers: Provider を 2 つ重ねる。FormDialog の中から 2 つとも出す */
function ProvidersScenarioDemo() {
  const outer = useToast();
  return (
    <ToastProvider>
      <ProvidersInner showOuter={outer.showToast} />
    </ToastProvider>
  );
}

function ProvidersInner({ showOuter }: { showOuter: ReturnType<typeof useToast>['showToast'] }) {
  const inner = useToast();
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>作業を開く</Button>
      <FormDialog open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} title="絞り込み" submitLabel="適用">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => showOuter({ variant: 'error', message: '外側の知らせ', action: { label: '再試行', onClick: () => add('外側') } })}
          >
            外側の Provider
          </Button>
          <Button
            variant="secondary"
            onClick={() => inner.showToast({ variant: 'error', message: '内側の知らせ', action: { label: '再試行', onClick: () => add('内側') } })}
          >
            内側の Provider
          </Button>
        </div>
      </FormDialog>
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
          onClick={() => showToast({ variant: 'error', message: '素の dialog の知らせ', action: { label: '再試行', onClick: noop } })}
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
      showToast({ variant: 'error', message: '文字だけの dialog の知らせ', action: { label: '再試行', onClick: noop } });
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
      <FireButtons where="ページ" onLog={noop} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setRaw(true)}>素の dialog を開く</Button>
        <Button onClick={() => setText(true)}>文字だけの dialog を開く</Button>
      </div>
      {raw && <RawModal onRemove={() => setRaw(false)} />}
      {text && <TextModal onClosed={() => setText(false)} />}
    </div>
  );
}

/**
 * stacked: JSX では ConfirmDialog を FormDialog より前に置く。FormDialog の上に ConfirmDialog を重ねてから、
 * はじめて ToastProvider を描き (見張りは置き場が描かれたときに始まる)、Toast を出す
 */
function StackedScenarioDemo() {
  const [form, setForm] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [provider, setProvider] = React.useState(false);
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
        <Button variant="secondary" onClick={() => setProvider(true)}>Toast を使い始める</Button>
      </ConfirmDialog>
      <FormDialog open={form} onClose={() => setForm(false)} onSubmit={() => setForm(false)} title="絞り込み" submitLabel="適用">
        <Button variant="secondary" onClick={() => setConfirm(true)}>確認を重ねる</Button>
      </FormDialog>
      {provider && (
        <ToastProvider>
          <Fire toasts={[{ variant: 'error', message: '遅れて描いた Provider の知らせ', action: { label: '再試行', onClick: () => setLog((l) => [...l, '再試行']) } }]} />
        </ToastProvider>
      )}
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
        <ToastProvider>
          <CaptureShowToast target={innerShow} />
        </ToastProvider>
      )}
      <FormDialog open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} title="絞り込み" submitLabel="適用">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => innerShow.current?.({ variant: 'error', message: '内側の知らせ', action: { label: '再試行', onClick: noop } })}
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
  'いろいろな場面を手で触るための story (play は持たない)。dialogs: ConfirmDialog・FormDialog (取り消すと上に破棄の確認)・Menu・Popover を開いている間に Toast を出す。「1 秒後に Toast を出す」を押してから開くと、開いている間に届く。providers: Provider を 2 つ重ね、FormDialog の中から 2 つとも出す。raw: 使う側の素の `<dialog>` (閉じずに DOM から外す) と、唯一の子が文字で中身が置き換わり続ける dialog。stacked: JSX で ConfirmDialog を FormDialog より前に置き、FormDialog の上に重ねてから ToastProvider を描く。unmount: FormDialog を開いている間に内側の ToastProvider を外す。';

export const Scenarios: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'dialogs' },
  argTypes: {
    scenario: { control: 'select', options: ['dialogs', 'providers', 'raw', 'stacked', 'unmount'] },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: SCENARIO_DOCS } },
  },
  render: ({ scenario }) => (
    <ToastProvider>
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

/** Toast が見えて (一番上で)、ボタンにフォーカスが入り、置かれている dialog が期待どおりか */
async function expectUsable(text: string, dialogTitle: string | null, rawDialogLabel?: string) {
  const body = toastBody(text);
  const r = body.getBoundingClientRect();
  // 一番上: 真ん中の点に当たるのが Toast (dialog の背景・中身ではない)。Provider を重ねると同じ場所に出るので、どれかの Toast ならよい
  const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  await expect(!!hit?.closest('[data-ds-toast-layer] [aria-live] > [data-ds-root]')).toBe(true);
  // フォーカスが入る (dialog の外に残ると inert で入らない)。ボタンの無い Toast は見ない
  const button = body.querySelector<HTMLElement>('button');
  if (button) {
    const prev = document.activeElement as HTMLElement | null;
    button.focus();
    await expect(document.activeElement).toBe(button);
    prev?.focus();
  }
  // 読み上げの live region の中
  await expect(body.closest('[aria-live]')).not.toBeNull();
  // 置き場: dialog を開いている間は一番上の dialog の中、閉じたら元の場所 (popover を外す)
  const host = body.closest('[data-ds-toast-layer]') as HTMLElement;
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
    // FormDialog の中から出す。操作を押すと onClick を呼んで閉じる
    await userEvent.click(screen.getByRole('button', { name: '作業を開く' }));
    await userEvent.click(visibleButton('Toast (できなかった・作業)'));
    const text = '送信できませんでした (作業)';
    await waitFor(() => toastBody(text));
    await expectUsable(text, '絞り込み');
    await userEvent.click(screen.getByRole('button', { name: '再試行' }));
    await expect(screen.getByTestId('log')).toHaveTextContent('再試行 (作業)');
    await waitFor(() => expect(findToast(text)).toBeUndefined());
    // もう一度出す
    await userEvent.click(visibleButton('Toast (できなかった・作業)'));
    await waitFor(() => toastBody(text));
    const marked = toastBody(text);
    // 指・マウスで開いた dialog は、キーが押されるまで輪を出さない。Toast の中でキーを押したら、そこから出す (AGENTS §3-2)
    const formDialog = toastBody(text).closest('dialog')!;
    await expect(formDialog).toHaveAttribute('data-ds-hide-focus-ring');
    toastBody(text).querySelector<HTMLElement>('button')!.focus();
    await userEvent.keyboard('{Shift}');
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

    // 順番が逆: ページで出してから ConfirmDialog を開く (できなかったは残し、できたを上に)
    await userEvent.click(screen.getByRole('button', { name: 'Toast (できた・ページ)' }));
    const page = 'アーカイブしました (ページ)';
    await waitFor(() => toastBody(page));
    await userEvent.click(screen.getByRole('button', { name: '確認を開く' }));
    await expectUsable(page, '予約を取り消しますか？');
    // dialog の中で、Toast の操作をキーボードで押して Toast が消えたら、フォーカスは body に落ちない。
    // 出したボタンは dialog の後ろ (押せない) なので、Toast に入る直前の要素 (dialog の中) へ戻す
    const before = document.activeElement as HTMLElement;
    const confirmDialog = toastBody(page).closest('dialog')!;
    await expect(confirmDialog.contains(before)).toBe(true);
    toastBody(page).querySelector<HTMLElement>('button')!.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(findToast(page)).toBeUndefined());
    await expect(document.activeElement).toBe(before);
    await expect(screen.getByTestId('log')).toHaveTextContent('元に戻す (ページ)');
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
          '守る play (撮影しない、#169)。Provider を 2 つ重ねたとき、FormDialog の中から出した 2 つとも dialog の上に見えて押せる。閉じたら 2 つとも元の場所へ戻る。',
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
    for (const text of ['外側の知らせ', '内側の知らせ']) {
      await waitFor(() => toastBody(text));
      await expectUsable(text, '絞り込み');
    }
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => expect(document.querySelector('dialog[open]')).toBeNull());
    for (const text of ['外側の知らせ', '内側の知らせ']) await expectUsable(text, null);
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
    await userEvent.click(screen.getByRole('button', { name: 'Toast (できた・ページ)' }));
    await waitFor(() => toastBody('アーカイブしました (ページ)'));
    await expectUsable('アーカイブしました (ページ)', null);

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
          '守る play (撮影しない、#169)。ほかに ToastProvider が無いページで、FormDialog の上に ConfirmDialog を重ね (JSX では ConfirmDialog が先)、その後に ToastProvider を描いて出すと、上の ConfirmDialog の上に出て押せる (見張りは置き場が描かれたときに始まるので、フォーカスを含む dialog を一番上とみなす)。',
      },
    },
  },
  render: () => <StackedScenarioDemo />,
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: '作業を開く' }));
    await userEvent.click(screen.getByRole('button', { name: '確認を重ねる' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Toast を使い始める' }));
    const text = '遅れて描いた Provider の知らせ';
    await waitFor(() => toastBody(text));
    await expectUsable(text, '入力を破棄しますか？');
    await userEvent.click(screen.getByRole('button', { name: '破棄をやめる' }));
    await waitFor(() => expectUsable(text, '絞り込み'));
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
    await expect(dialog.querySelector('[data-ds-toast-layer]')).toBeNull();
  },
};
