import React from 'react';
import { flushSync } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { BottomSheet } from './BottomSheet';
import { Button } from '../../primitives/Button';

/**
 * 下から出る面 (外に出さない共通の土台、#157) を、土台だけで開いて操作するための story。
 *
 * - 部品の一覧 (Primitives / Composites) の外 (`Internal/`) に置く。使う側は役割の部品 (Menu・Popover) を選ぶ
 * - 視覚回帰は撮らない (`disableSnapshot`)。見た目の確かめは、この土台を使う部品 (Menu・Popover) の Overview で撮る
 * - 配信 (dist) には入らない (stories は tsconfig.build と tailwind.dist.config の対象外)
 * - 幅 375px で開くと、狭い幅で使うときの見え方になる (iframe の URL に `&viewport=` は無いので、ブラウザの幅で見る)
 */
type Content = 'items' | 'text' | 'longItems' | 'longText';

interface DemoArgs {
  /** 見出し */
  title: string;
  /** 中身の種類 (短い項目 / 短い文 / 長い項目 / 長い文) */
  content: Content;
  /** 開いた直後のフォーカス先。`third` は 3 つ目の項目 (initialFocusRef)。項目が無い中身では既定と同じ */
  initialFocus: 'default' | 'third';
}

const ITEMS = ['出発時刻順', '到着時刻順', '所要時間順', '乗り換えの少ない順'];
const LONG_ITEMS = Array.from({ length: 20 }, (_, i) => `項目 ${i + 1}`);
const PARAGRAPH =
  '自由席は、指定席が満席でも乗れる席です。座れないことがあります。混む時間帯は、始発の駅で早めに並ぶと座りやすくなります。';

function Demo({ title, content, initialFocus }: DemoArgs) {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState('（まだ選んでいない）');
  const thirdRef = React.useRef<HTMLButtonElement | null>(null);
  const close = () => setOpen(false);
  const items = content === 'items' ? ITEMS : content === 'longItems' ? LONG_ITEMS : null;

  return (
    <div className="flex flex-col items-start gap-4">
      <Button aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        下から出る面を開く
      </Button>
      <p className="type-supporting text-onSurface-subtle" data-testid="last-choice">
        選んだもの: {last}
      </p>
      <BottomSheet
        open={open}
        onClose={close}
        title={title}
        bodyPadding={items ? 'none' : 'default'}
        initialFocusRef={items && initialFocus === 'third' ? thirdRef : undefined}
      >
        {items ? (
          <div className="flex flex-col pb-2">
            {items.map((label, i) => (
              <Button
                key={label}
                ref={i === 2 ? thirdRef : undefined}
                variant="tertiary"
                fullWidth
                onClick={() => {
                  setLast(label);
                  close();
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: content === 'longText' ? 12 : 1 }, (_, i) => (
              <p key={i} className="type-body text-onSurface">
                {PARAGRAPH}
              </p>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

/**
 * 2 つの面を重ねたり、閉じる途中に別の面を開いたりする (背景のスクロール止めが、順番によらず戻るかの確かめ)。
 * 面 A の中のボタンで、A を閉じると同時に B を開く・B を A の上に開く。B の中のボタンで A を閉じる。
 */
function StackedDemo() {
  const [a, setA] = React.useState(false);
  const [b, setB] = React.useState(false);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setA(true)}>面 A を開く</Button>
      <BottomSheet open={a} onClose={() => setA(false)} title="面 A">
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setA(false);
              setB(true);
            }}
          >
            A を閉じて B を開く
          </Button>
          <Button variant="secondary" onClick={() => setB(true)}>
            A の上に B を開く
          </Button>
        </div>
      </BottomSheet>
      <BottomSheet open={b} onClose={() => setB(false)} title="面 B">
        <Button variant="secondary" onClick={() => setA(false)}>
          下の A を閉じる
        </Button>
      </BottomSheet>
    </div>
  );
}

/** React の StrictMode で、開いた状態 (`open` が最初から true) から描き始める */
function StrictOpenDemo() {
  const [open, setOpen] = React.useState(true);
  const [closes, setCloses] = React.useState(0);
  return (
    <React.StrictMode>
      <p className="type-supporting text-onSurface-subtle" data-testid="close-count">
        onClose の回数: {closes}
      </p>
      <Button onClick={() => setOpen(true)}>開く</Button>
      <BottomSheet
        open={open}
        onClose={() => {
          setCloses((n) => n + 1);
          setOpen(false);
        }}
        title="最初から開いている面"
      >
        <div className="flex flex-col gap-3">
          <p className="type-body text-onSurface">{PARAGRAPH}</p>
          <Button
            variant="secondary"
            onClick={() => {
              // 閉じて、ブラウザの close イベントが届く前に開き直す (動きを減らす設定では、閉じるのがすぐ終わる)
              flushSync(() => setOpen(false));
              setOpen(true);
            }}
          >
            閉じてすぐ開き直す
          </Button>
        </div>
      </BottomSheet>
    </React.StrictMode>
  );
}

const meta: Meta<DemoArgs> = {
  title: 'Internal/BottomSheet',
  component: Demo,
  argTypes: {
    title: { control: 'text' },
    content: { control: 'radio', options: ['items', 'text', 'longItems', 'longText'] },
    initialFocus: { control: 'radio', options: ['default', 'third'] },
  },
  args: {
    title: '並び順',
    content: 'items',
    initialFocus: 'default',
  },
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<DemoArgs>;

/** 背景 (::backdrop) の上の 1 点。面の上端より上 */
const backdropPoint = (dialog: HTMLElement) => {
  const r = dialog.getBoundingClientRect();
  return { clientX: r.left + 10, clientY: Math.max(1, r.top - 20) };
};
/** 開いてから、ポインタを受け付けるまで待つ (部品の守りは 300ms) */
const afterOpenGuard = () => new Promise((r) => setTimeout(r, 350));
/** 帯 (見出しの行) の上で、合成の pointer で下へ dy 引いて離す (合成のイベントは間を空けずに続くので、速さは大きい) */
const dragGrab = (dialog: HTMLElement, dy: number) => {
  const h = dialog.querySelector('h2') as HTMLElement;
  const r = h.getBoundingClientRect();
  const x = r.left + 10;
  const y = r.top + r.height / 2;
  const init = { bubbles: true, isPrimary: true, pointerType: 'touch', pointerId: 7 };
  h.dispatchEvent(new PointerEvent('pointerdown', { ...init, clientX: x, clientY: y }));
  h.dispatchEvent(new PointerEvent('pointermove', { ...init, clientX: x, clientY: y + dy }));
  h.dispatchEvent(new PointerEvent('pointerup', { ...init, clientX: x, clientY: y + dy }));
};
/** 押し始め (pointerdown) を el に、離した後の click を dialog に、座標つきで送る (背景の上の click は dialog に届く) */
const press = (el: Element, dialog: HTMLElement, at: { clientX: number; clientY: number }) => {
  const r = el.getBoundingClientRect();
  const start = el === dialog ? at : { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
  el.dispatchEvent(new PointerEvent('pointerdown', { ...start, bubbles: true, isPrimary: true, pointerType: 'mouse' }));
  dialog.dispatchEvent(new MouseEvent('click', { ...at, bubbles: true }));
};

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '土台だけで開いて操作する。外を押す・閉じるボタン・Esc・上端の帯を下に引く (25% か 0.5px/ms を超えると閉じる) で閉じ、閉じたらフォーカスが入口に戻る。中身の長さと、開いた直後のフォーカス先は Controls で切り替える。play は持たない (開いたときに自動の操作が走らないように。自動の確かめは Checks)。',
      },
    },
  },
};

export const Checks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'test-storybook が走らせる自動の確かめ (play)。開く・開いた直後 300ms はポインタを受け付けない・帯を軽く触っても閉じない・中で押して外で離すと閉じない・外を押す・閉じるボタン・項目を選ぶ・Esc を順に行い、フォーカスの戻り先と html / body の overflow を見る。最後はキーボードで開いたまま残す (axe が開いた面を見る)。手で触るときは Playground を使う。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '下から出る面を開く' });
    const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;
    const html = document.documentElement;

    // 開く: 面が出て、最初のフォーカスは本体の最初の項目 (閉じるボタンではない)。背景は html・body とも止まる
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog.open).toBe(true));
    await expect(dialog).toHaveAttribute('data-state', 'open');
    await expect(screen.getByRole('dialog', { name: '並び順' })).toBe(dialog);
    await expect(screen.getByRole('button', { name: '出発時刻順' })).toHaveFocus();
    await expect(html.style.overflow).toBe('hidden');
    await expect(document.body.style.overflow).toBe('hidden');

    // 開いた直後 (300ms 以内) のポインタは受け付けない: 項目を押しても選ばれず、背景を押しても閉じない
    await userEvent.click(screen.getByRole('button', { name: '所要時間順' }));
    press(dialog, dialog, backdropPoint(dialog));
    dragGrab(dialog, 200);
    await new Promise((r) => setTimeout(r, 50));
    await expect(dialog.open).toBe(true);
    await expect(dialog).toHaveAttribute('data-state', 'open');
    await expect(canvas.getByTestId('last-choice')).toHaveTextContent('まだ選んでいない');
    await afterOpenGuard();

    // 動きを減らす設定では、背景の暗さも動かさない (preset の共通の規則は ::backdrop に当たらない)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await expect(getComputedStyle(dialog, '::backdrop').transitionProperty).toBe('none');
    }

    // 帯を軽く触っただけ (10px 以下) は、速くても閉じない。10px を超えて速ければ閉じる
    dragGrab(dialog, 8);
    await new Promise((r) => setTimeout(r, 100));
    await expect(dialog.open).toBe(true);
    await expect(dialog).toHaveAttribute('data-state', 'open');
    dragGrab(dialog, 14);
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog.open).toBe(true));
    await afterOpenGuard();

    // 中 (本体の項目) で押して背景で離す (click は dialog に届く): 閉じない
    press(screen.getByRole('button', { name: '到着時刻順' }), dialog, backdropPoint(dialog));
    // 閉じる要求は描画の後に反映されるので、少し待ってから開いたままかを見る
    await new Promise((r) => setTimeout(r, 100));
    await expect(dialog.open).toBe(true);
    await expect(dialog).toHaveAttribute('data-state', 'open');

    // 背景で押して背景で離す: 閉じる。フォーカスは入口へ、背景のスクロールは元へ
    press(dialog, dialog, backdropPoint(dialog));
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(trigger).toHaveFocus();
    await expect(html.style.overflow).toBe('');
    await expect(document.body.style.overflow).toBe('');

    // 閉じるボタン
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog.open).toBe(true));
    await afterOpenGuard();
    await userEvent.click(screen.getByRole('button', { name: '閉じる' }));
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(trigger).toHaveFocus();

    // 項目を選ぶ (使う側が onClose と同じく open を false にする)
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog.open).toBe(true));
    await afterOpenGuard();
    await userEvent.click(screen.getByRole('button', { name: '到着時刻順' }));
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(canvas.getByTestId('last-choice')).toHaveTextContent('到着時刻順');
    await expect(trigger).toHaveFocus();

    // キーボードで開いて Esc で閉じる。合成のキー入力ではブラウザが cancel を出さないので、
    // Esc を押したときにブラウザが dialog に送る cancel を直接送る (本物の Esc は Playwright で確かめた)
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(dialog.open).toBe(true));
    await expect(screen.getByRole('button', { name: '出発時刻順' })).toHaveFocus();
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    // ブラウザには閉じさせない (閉じる動きの後に部品が閉じる)
    await expect(cancel.defaultPrevented).toBe(true);
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(trigger).toHaveFocus();
    await expect(html.style.overflow).toBe('');

    // 最後はキーボードで開いたまま残す (test-runner の axe が開いた面を見る)
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(dialog.open).toBe(true));
  },
};

export const Stacked: Story = {
  render: () => <StackedDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [a, b] = [...canvasElement.querySelectorAll('dialog')] as HTMLDialogElement[];
    const html = document.documentElement;
    const body = document.body;
    // 元の inline の指定 (個別指定) が、そのまま戻ることも見る
    html.style.overflowY = 'auto';
    body.style.setProperty('overflow-x', 'clip', 'important');
    try {
      // A を閉じると同時に B を開く → B を閉じる
      await userEvent.click(canvas.getByRole('button', { name: '面 A を開く' }));
      await waitFor(() => expect(a.open).toBe(true));
      await afterOpenGuard();
      await userEvent.click(screen.getByRole('button', { name: 'A を閉じて B を開く' }));
      await waitFor(() => expect(b.open).toBe(true));
      await expect(html.style.overflowY).toBe('hidden');
      b.dispatchEvent(new Event('cancel', { cancelable: true }));
      await waitFor(() => expect(a.open || b.open).toBe(false));
      await expect(html.style.overflowY).toBe('auto');
      await expect(html.style.overflowX).toBe('');
      await expect(body.style.getPropertyValue('overflow-x')).toBe('clip');
      await expect(body.style.getPropertyPriority('overflow-x')).toBe('important');
      await expect(body.style.overflowY).toBe('');

      // A の上に B を開き、下の A を先に閉じる → B を閉じる (開いた順と同じ順に閉じる)
      await userEvent.click(canvas.getByRole('button', { name: '面 A を開く' }));
      await waitFor(() => expect(a.open).toBe(true));
      await afterOpenGuard();
      await userEvent.click(screen.getByRole('button', { name: 'A の上に B を開く' }));
      await waitFor(() => expect(b.open).toBe(true));
      await afterOpenGuard();
      await userEvent.click(screen.getByRole('button', { name: '下の A を閉じる' }));
      await waitFor(() => expect(a.open).toBe(false));
      // B はまだ開いているので止まったまま
      await expect(html.style.overflowY).toBe('hidden');
      await expect(body.style.overflowY).toBe('hidden');
      b.dispatchEvent(new Event('cancel', { cancelable: true }));
      await waitFor(() => expect(b.open).toBe(false));
      await expect(html.style.overflowY).toBe('auto');
      await expect(body.style.getPropertyValue('overflow-x')).toBe('clip');
      await expect(body.style.overflowY).toBe('');
    } finally {
      html.style.removeProperty('overflow-y');
      body.style.removeProperty('overflow-x');
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          '2 つの面を重ねる・閉じる途中に別の面を開く。どの順番で閉じても、閉じ終えたら html・body のスクロール止めが元に戻る。',
      },
    },
  },
};

export const StrictOpen: Story = {
  render: () => <StrictOpenDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;
    // 最初から開いていて、閉じない (StrictMode の描き直しで、遅れて届く close を「ブラウザが閉じた」と取り違えない)
    await waitFor(() => expect(dialog.open).toBe(true));
    await new Promise((r) => setTimeout(r, 100));
    await expect(dialog.open).toBe(true);
    await expect(canvas.getByTestId('close-count')).toHaveTextContent('onClose の回数: 0');
    // 閉じてすぐ開き直す (キーボードで押す): 開いたままで、onClose は呼ばれない
    screen.getByRole('button', { name: '閉じてすぐ開き直す' }).focus();
    await userEvent.keyboard('{Enter}');
    await new Promise((r) => setTimeout(r, 100));
    await expect(dialog.open).toBe(true);
    await expect(dialog).toHaveAttribute('data-state', 'open');
    await expect(canvas.getByTestId('close-count')).toHaveTextContent('onClose の回数: 0');
  },
  parameters: {
    docs: {
      description: {
        story:
          'React の StrictMode で、`open` が最初から true のまま描き始める。開いたままで、`onClose` は呼ばれない。面の中のボタンで「閉じて、ブラウザの close イベントが届く前に開き直す」も試せる。',
      },
    },
  },
};
