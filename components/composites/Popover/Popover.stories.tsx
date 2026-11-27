import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Popover } from './Popover';
import { Menu } from '../Menu';
import { FormDialog } from '../FormDialog';
import { Button } from '../../primitives/Button';
import { NARROW_RUN, expectRunWidth, afterOpenGuard, expectBottomSheet, pressBackdrop, pressEscape } from '../../../.storybook/narrow-play';

/**
 * Popover stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview / OverviewTextOnly / FirstFocus / Scenarios / ReturnFocus / LateClose0 / LateClose100 / GateOpen / GateClose / NarrowSheet。
 * 出方が幅で変わる (640px 未満は下から、以上は押した要素の近く) ので、撮影する story は
 * `chromatic.viewports = [375, 1280]` で両方の幅を撮る (フォーカスの輪の検査も同じ宣言を読んで両方の幅で走る、§8-4)。
 * 開いた状態は同時に 1 つしか出せない (popover="auto" / showModal) ので、「押せるものがある中身」(Overview) と
 * 「文だけの中身」(OverviewTextOnly。面・パネルそのものにフォーカスが来る) を別の story に分けて `open` で凍結する。
 * 撮影は動きを減らす設定で行う (開く動きの途中を撮らない)。
 * play はテストの既定の幅 (広い幅) で走る。狭い幅 (下から出る面) の操作は、幅 375 で走る story (NarrowSheet。
 * `globals: NARROW_RUN` で走る幅を宣言する、AGENTS §8-4) の play が確かめる。1 つの play は 1 つの幅の期待だけを書く。
 * 下から出る面は開いてから 300ms ポインタを受け付けないので、狭い幅で play を書くときは 300ms 以上待ってから押す (`afterOpenGuard`)。
 * variant / size prop は無し。
 */
type PlaygroundArgs = {
  title: string;
  placement: 'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'right' | 'left';
  offset: number;
  children: string;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/Popover',
  argTypes: {
    title: { control: 'text' },
    placement: { control: 'select', options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'right', 'left'] },
    offset: { control: { type: 'number' } },
    // 中身 (children) は ReactNode。Controls では文で書き換える
    children: { control: 'text' },
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
          '入口を押して開閉する。見出し・中身の文・出す向き・入口との間隔を Controls で変えて試す (向きと間隔は広い幅でだけ効く)。幅 640px 未満で開くと下から出る。play は広い幅で、入口の属性・中に押せるものが無いときはパネル自体にフォーカス・開き方と閉じ方 (ポインタかキーか) で輪を出すか、を確かめ、最後にキーボードで開いたまま残す (フォーカスの輪の検査がパネルの輪を見る、AGENTS §8-4)。',
      },
    },
  },
  args: { title: '補足情報', placement: 'bottom-start', offset: 8, children: 'このフィールドは公開プロフィールに表示されます。' },
  render: ({ title, placement, offset, children }) => (
    <Popover trigger={<Button>詳細</Button>} title={title} placement={placement} offset={offset}>
      <p className="text-onSurface">{children}</p>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '詳細' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // ポインタで開く: aria-expanded=true、名前は title。中に押せるものが無いので、パネル自体にフォーカス。
    // キーを押すまで輪は出さない (ブラウザ既定の輪も)
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const panel = await screen.findByRole('dialog', { name: '補足情報' });
    await expect(panel).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-controls', panel.id);
    await waitFor(() => expect(panel).toHaveFocus());
    await expect(panel).toHaveAttribute('data-ds-hide-focus-ring');
    await expect(getComputedStyle(panel).outlineStyle).toBe('none');
    // キーを押したので、ここから輪が出る
    await userEvent.keyboard('{Shift}');
    await expect(panel).not.toHaveAttribute('data-ds-hide-focus-ring');
    if (panel.matches(':focus-visible')) await expect(getComputedStyle(panel).outlineStyle).toBe('solid');

    // 入口をもう一度押す → 閉じる。ポインタで閉じたので、入口のフォーカスには輪を出さない。キーを押すと出る
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAttribute('data-ds-hide-focus-ring');
    await expect(getComputedStyle(trigger).outlineStyle).toBe('none');
    await userEvent.keyboard('{Shift}');
    await expect(trigger).not.toHaveAttribute('data-ds-hide-focus-ring');

    // キーボードで開く (Enter): はじめから輪を出す
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await waitFor(() => expect(panel).toHaveFocus());
    await expect(panel).not.toHaveAttribute('data-ds-hide-focus-ring');
    await expect(panel.matches(':focus-visible')).toBe(true);

    // キーボードで閉じる (入口に戻って Enter。合成の Esc では popover は閉じない): 入口の輪は今までどおり出す
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveFocus();
    await expect(trigger).not.toHaveAttribute('data-ds-hide-focus-ring');

    // 最後にキーボードで開いたまま残す: パネル自体 (tabIndex=-1、Tab の順に入らない) のフォーカスを、
    // test-runner のフォーカスの輪の検査 (AGENTS §8-4) に「始めた時点のフォーカス」として見せる
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await waitFor(() => expect(panel).toHaveFocus());
    await expect(panel.matches(':focus-visible')).toBe(true);
  },
};

// ── 2. Overview (視覚回帰対象) — 開いた状態を凍結 ────────────

function AccountContent() {
  return (
    <div className="flex flex-col gap-2 min-w-[12rem]">
      <p className="type-label font-medium text-onSurface">山田 太郎</p>
      <p className="type-caption text-onSurface-subtle">taro@example.com</p>
      <hr className="border-border-subtle" />
      <Button variant="tertiary" size="sm">プロフィール</Button>
      <Button variant="tertiary" size="sm">設定</Button>
      <Button variant="destructive" size="sm">ログアウト</Button>
    </div>
  );
}

const SEAT_NOTE =
  '自由席は 1〜3 号車です。指定席の空きが無いときも乗れますが、混雑時は座れないことがあります。特急券は乗る列車に限らず、当日中なら同じ区間の自由席に使えます。';

export const Overview: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280], prefersReducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態 (押せるものがある中身)。見出し + 操作を含むアカウントの補足を `open` で凍結する。幅 375 では下から出る面 (見出しは title)、1280 では入口の近く (見た目は今までどおり)。フォーカスは最初の押せるもの。',
      },
    },
  },
  render: () => (
    <div className="p-8 pb-48 flex justify-center">
      <Popover trigger={<Button>アカウント</Button>} title="アカウント" placement="bottom" open onOpenChange={() => {}}>
        <AccountContent />
      </Popover>
    </div>
  ),
};

export const OverviewTextOnly: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280], prefersReducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態 (文だけの中身)。中に押せるものが無いので、面・パネルそのものにフォーカスが来る (内側 2px の輪)。幅 375 では下から出る面、1280 では入口の近く。フォーカスの輪の検査が両方の幅で、そのフォーカスを見る (AGENTS §8-4)。',
      },
    },
  },
  render: () => (
    <div className="p-8 pb-64 flex justify-center">
      <Popover trigger={<Button variant="secondary">自由席について</Button>} title="自由席について" placement="bottom" open onOpenChange={() => {}}>
        <p className="text-onSurface">{SEAT_NOTE}</p>
      </Popover>
    </div>
  ),
};

// ── 3. 操作の確かめ (視覚回帰対象外) ────────────

export const FirstFocus: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '中に押せるものがあるとき、開いた直後のフォーカスは最初の押せるもの (広い幅)。閉じたら入口に戻る。',
      },
    },
  },
  render: () => (
    <Popover trigger={<Button>アカウント</Button>} title="アカウント">
      <AccountContent />
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'アカウント' });
    await userEvent.click(trigger);
    const panel = await screen.findByRole('dialog', { name: 'アカウント' });
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'プロフィール' })).toHaveFocus());
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

// ── 4. いろいろな場面 (視覚回帰対象外。手で触る・自動の操作で確かめる用) ────────────

type Scenario = 'text' | 'actions' | 'long' | 'inFormDialog' | 'fromMenu' | 'controlled' | 'pinned' | 'lateMicrotask' | 'late0' | 'late100' | 'late500' | 'gateOpen' | 'gateClose' | 'two' | 'strict' | 'bottom';

function ScenarioDemo({ scenario }: { scenario: Scenario }) {
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [controlledOpen, setControlledOpen] = React.useState(false);
  const [allowOpen, setAllowOpen] = React.useState(scenario !== 'gateOpen');
  const [allowClose, setAllowClose] = React.useState(scenario !== 'gateClose');

  const note = (
    <Popover trigger={<Button variant="secondary">自由席について</Button>} title="自由席について">
      <p className="text-onSurface">{SEAT_NOTE}</p>
    </Popover>
  );

  const body = (() => {
    switch (scenario) {
      case 'text':
        return note;
      case 'actions':
        return (
          <Popover trigger={<Button>アカウント</Button>} title="アカウント">
            <AccountContent />
          </Popover>
        );
      case 'long':
        return (
          <Popover trigger={<Button>利用規約の要点</Button>} title="利用規約の要点">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="text-onSurface mb-2">
                {`${i + 1}. ${SEAT_NOTE}`}
              </p>
            ))}
          </Popover>
        );
      case 'inFormDialog':
        return (
          <>
            <Button onClick={() => setDialogOpen(true)}>条件を開く</Button>
            <FormDialog
              open={dialogOpen}
              onClose={() => {
                add('FormDialog の onClose');
                setDialogOpen(false);
              }}
              onSubmit={() => {
                add('FormDialog の onSubmit');
                setDialogOpen(false);
              }}
              title="条件"
              submitLabel="適用"
            >
              <div className="flex flex-col items-start gap-4">
                <p>座席の条件を選びます。</p>
                <Popover
                  trigger={<Button variant="secondary">自由席について</Button>}
                  title="自由席について"
                  onOpenChange={(o) => add(`Popover(${o})`)}
                >
                  <p className="text-onSurface">{SEAT_NOTE}</p>
                </Popover>
              </div>
            </FormDialog>
          </>
        );
      case 'fromMenu':
        return (
          <>
            <Menu
              trigger={<Button>操作</Button>}
              title="操作"
              items={[{ label: '自由席の説明を見る', onSelect: () => setNoteOpen(true) }]}
            />
            <Popover
              trigger={<Button variant="secondary">自由席について</Button>}
              title="自由席について"
              open={noteOpen}
              onOpenChange={setNoteOpen}
            >
              <div className="flex flex-col items-start gap-2">
                <p className="text-onSurface">{SEAT_NOTE}</p>
                <Button size="sm" variant="tertiary" onClick={() => setNoteOpen(false)}>
                  わかった
                </Button>
              </div>
            </Popover>
          </>
        );
      case 'controlled':
        return (
          <Popover
            trigger={<Button>アカウント</Button>}
            title="アカウント"
            open={controlledOpen}
            onOpenChange={(o) => {
              add(`onOpenChange(${o})`);
              setControlledOpen(o);
            }}
          >
            <AccountContent />
          </Popover>
        );
      case 'pinned':
        // 親が閉じる要求を無視する (開いたら開いたまま)。閉じるのは下のボタンだけ
        return (
          <div className="flex items-start gap-4">
            <Button variant="tertiary" onClick={() => setControlledOpen(false)}>
              親から閉じる
            </Button>
            {note}
            <Popover
              trigger={<Button>アカウント</Button>}
              title="アカウント"
              open={controlledOpen}
              onOpenChange={(o) => {
                add(`onOpenChange(${o})`);
                if (o) setControlledOpen(true);
              }}
            >
              <AccountContent />
            </Popover>
          </div>
        );
      case 'lateMicrotask':
      case 'late0':
      case 'late100':
      case 'late500': {
        // 親が 1 拍遅れて閉じる (onOpenChange(false) を受けてから、マイクロタスク / setTimeout 0 / 100ms 後に open を false に)
        const later = (fn: () => void) =>
          scenario === 'lateMicrotask'
            ? queueMicrotask(fn)
            : window.setTimeout(fn, scenario === 'late0' ? 0 : scenario === 'late100' ? 100 : 500);
        return (
          <Popover
            trigger={<Button>アカウント</Button>}
            title="アカウント"
            open={controlledOpen}
            onOpenChange={(o) => {
              add(`onOpenChange(${o})`);
              if (o) setControlledOpen(true);
              else later(() => setControlledOpen(false));
            }}
          >
            <AccountContent />
          </Popover>
        );
      }
      case 'gateOpen':
      case 'gateClose':
        // 親が条件付きで要求を断る (読み込み中は開かない / 保存中は閉じない など)。下のボタンで許可を切り替える
        return (
          <div className="flex items-start gap-4">
            <Button variant="tertiary" onClick={() => setAllowOpen((v) => !v)}>
              {`開く：${allowOpen ? '許可' : '断る'}`}
            </Button>
            <Button variant="tertiary" onClick={() => setAllowClose((v) => !v)}>
              {`閉じる：${allowClose ? '許可' : '断る'}`}
            </Button>
            <Popover
              trigger={<Button>アカウント</Button>}
              title="アカウント"
              open={controlledOpen}
              onOpenChange={(o) => {
                add(`onOpenChange(${o})`);
                if (o ? allowOpen : allowClose) setControlledOpen(o);
              }}
            >
              <AccountContent />
            </Popover>
          </div>
        );
      case 'two':
        return (
          <div className="flex gap-4">
            {note}
            <Popover trigger={<Button>アカウント</Button>} title="アカウント">
              <AccountContent />
            </Popover>
          </div>
        );
      case 'strict':
        return <React.StrictMode>{note}</React.StrictMode>;
      case 'bottom':
        return <div className="fixed inset-x-0 bottom-0 p-4 bg-surface">{note}</div>;
    }
  })();

  return (
    <div className="flex flex-col items-start gap-4">
      {body}
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

export const Scenarios: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'text' },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['text', 'actions', 'long', 'inFormDialog', 'fromMenu', 'controlled', 'pinned', 'lateMicrotask', 'late0', 'late100', 'late500', 'gateOpen', 'gateClose', 'two', 'strict', 'bottom'],
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'いろいろな場面を手で触るための story (`scenario` で切り替える。play は持たない)。text: 文だけ / actions: 押せるものがある / long: 長い文 (狭い幅では面の中でスクロール) / inFormDialog: FormDialog の中の Popover (Esc や外を押しても Popover だけ閉じる) / fromMenu: Menu で選んだら Popover を開く / controlled: open と onOpenChange の回数と順番を下に出す / pinned: 親が閉じる要求を無視する (広い幅ではパネルが消え、入口を押すと出し直す。狭い幅では Esc を続けても面を出し直す。別の Popover も並べる) / lateMicrotask・late0・late100・late500: 親が遅れて閉じる / gateOpen・gateClose: 親が条件付きで開く・閉じる要求を断る (ボタンで許可に変える) / two: Popover を 2 つ並べる / strict: StrictMode / bottom: 入口が画面の下端 (二度押しの確かめ)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
};

export const ReturnFocus: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'fromMenu' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'Menu で選んだら開く Popover (fromMenu)。中の「わかった」で閉じたら、フォーカスは Popover の入口 (自由席について) に戻る (ブラウザは開く前のフォーカス = Menu の入口へ戻そうとする)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '操作' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: '自由席の説明を見る' }));
    const noteTrigger = canvas.getByRole('button', { name: '自由席について' });
    await waitFor(() => expect(noteTrigger).toHaveAttribute('aria-expanded', 'true'));
    const panel = await screen.findByRole('dialog', { name: '自由席について' });
    const ok = within(panel).getByRole('button', { name: 'わかった' });
    await waitFor(() => expect(ok).toHaveFocus());
    // 外から open で開いたので、輪は隠さない
    await expect(panel).not.toHaveAttribute('data-ds-hide-focus-ring');
    // 中のボタンで (親が) 閉じる → フォーカスは Popover の入口 (Menu の入口ではない)
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(noteTrigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(noteTrigger).toHaveFocus());
  },
};

/** 親が遅れて閉じる場面の play (広い幅)。1 回で閉じて、出し直さない */
function lateClosePlay() {
  return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'アカウント' });
    const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '') as HTMLElement;
    let opens = 0;
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === 'open') opens++;
    };
    panel.addEventListener('toggle', onToggle);
    try {
      for (const how of ['pointer', 'key'] as const) {
        opens = 0;
        if (how === 'pointer') await userEvent.click(trigger);
        else {
          trigger.focus();
          await userEvent.keyboard('{Enter}');
        }
        await waitFor(() => expect(panel.matches(':popover-open')).toBe(true));
        // 閉じる (入口を押す / Enter)。親は遅れて閉じる
        if (how === 'pointer') await userEvent.click(trigger);
        else {
          trigger.focus();
          await userEvent.keyboard('{Enter}');
        }
        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
        await expect(panel.matches(':popover-open')).toBe(false);
        // 出し直さない (少し待っても閉じたまま。開いたのは 1 回だけ)
        await new Promise((r) => setTimeout(r, 300));
        await expect(panel.matches(':popover-open')).toBe(false);
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await waitFor(() => expect(opens).toBe(1));
        await expect(trigger).toHaveFocus();
      }
      await expect(canvas.getByTestId('log')).toHaveTextContent(
        'onOpenChange(true) / onOpenChange(false) / onOpenChange(true) / onOpenChange(false)',
      );
    } finally {
      panel.removeEventListener('toggle', onToggle);
    }
  };
}

export const LateClose0: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'late0' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: '親が onOpenChange(false) を受けて setTimeout 0 で閉じる。パネルは 1 回で閉じ、出し直さない (広い幅)。' } },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: lateClosePlay(),
};

export const LateClose100: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'late100' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { description: { story: '親が onOpenChange(false) を受けて 100ms 後に閉じる。パネルは 1 回で閉じ、出し直さない (広い幅)。' } },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: lateClosePlay(),
};

export const GateOpen: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'gateOpen' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '親が開く要求を断る (gateOpen)。断られている間も、操作のたびに onOpenChange(true) が 1 回ずつ出る。許可に変えた後の最初の 1 回で開く (広い幅)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'アカウント' });
    const log = canvas.getByTestId('log');
    // 断られている間: 押す 2 回・Enter・Space → 要求は 4 回、開かない
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(log).toHaveTextContent(Array(4).fill('onOpenChange(true)').join(' / '));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // 許可に変える → 最初の 1 回で開く
    await userEvent.click(canvas.getByRole('button', { name: '開く：断る' }));
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await expect(log).toHaveTextContent(Array(5).fill('onOpenChange(true)').join(' / '));
    const panel = await screen.findByRole('dialog', { name: 'アカウント' });
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'プロフィール' })).toHaveFocus());
    // 閉じる (読み上げの「実行」と同じ detail 0 の click でも要求が出る)
    trigger.click();
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};

export const GateClose: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'gateClose' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '親が閉じる要求を断る (gateClose)。断られている間も、操作のたびに onOpenChange(false) が 1 回ずつ出る。許可に変えた後の最初の 1 回で閉じる (広い幅)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'アカウント' });
    const log = canvas.getByTestId('log');
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    // 断られている間: 入口を押す・detail 0 の click 2 回・Enter → 要求は 4 回、開いたまま
    await userEvent.click(trigger);
    trigger.click();
    trigger.click();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(log).toHaveTextContent(['onOpenChange(true)', ...Array(4).fill('onOpenChange(false)')].join(' / '));
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // 許可に変える → 最初の 1 回で閉じる
    await userEvent.click(canvas.getByRole('button', { name: '閉じる：断る' }));
    trigger.click();
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(log).toHaveTextContent(['onOpenChange(true)', ...Array(5).fill('onOpenChange(false)')].join(' / '));
  },
};

// ── 5. 狭い幅 (幅 375 で走る。視覚回帰対象外) ────────────
// 走る幅は `globals: NARROW_RUN` で宣言する (test-runner が描く前にその幅にする。Storybook で開いても 375 に固定して見える、AGENTS §8-4)

export const NarrowSheet: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'two' },
  globals: NARROW_RUN,
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '幅 375 で走る (Storybook でも 375 に固定して見える)。文だけの中身 (自由席について) と押せるものがある中身 (アカウント) を並べ、開くと下から出る面・最初のフォーカス (中に押せるものが無ければ面そのもの、あれば最初の押せるもの)・閉じるボタン / Esc / 外 (背景) で閉じる・閉じた後のフォーカスは入口、を確かめる。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    await expectRunWidth();
    const canvas = within(canvasElement);
    const open = async (trigger: HTMLElement, name: string) => {
      await userEvent.click(trigger);
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
      const sheet = await screen.findByRole('dialog', { name });
      await expectBottomSheet(sheet);
      return sheet;
    };
    const expectClosed = async (sheet: HTMLElement, trigger: HTMLElement) => {
      await waitFor(() => expect((sheet as HTMLDialogElement).open).toBe(false));
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await waitFor(() => expect(trigger).toHaveFocus());
    };

    // 文だけの中身: 中に押せるものが無いので、フォーカスは面そのもの (閉じるボタンではない)
    const note = canvas.getByRole('button', { name: '自由席について' });
    let sheet = await open(note, '自由席について');
    await waitFor(() => expect(sheet).toHaveFocus());
    // 閉じるボタン → 閉じて、フォーカスは入口
    await afterOpenGuard();
    await userEvent.click(within(sheet).getByRole('button', { name: '閉じる' }));
    await expectClosed(sheet, note);
    // Esc → 閉じて、フォーカスは入口
    sheet = await open(note, '自由席について');
    await waitFor(() => expect(sheet).toHaveFocus());
    pressEscape(sheet);
    await expectClosed(sheet, note);

    // 押せるものがある中身: フォーカスは最初の押せるもの。外 (背景) を押す → 閉じて、フォーカスは入口
    const account = canvas.getByRole('button', { name: 'アカウント' });
    sheet = await open(account, 'アカウント');
    await waitFor(() => expect(within(sheet).getByRole('button', { name: 'プロフィール' })).toHaveFocus());
    await afterOpenGuard();
    pressBackdrop(sheet);
    await expectClosed(sheet, account);
  },
};
