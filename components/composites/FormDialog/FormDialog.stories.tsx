import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within, screen, waitFor } from 'storybook/test';
import { FormDialog } from './FormDialog';
import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';
import { Menu } from '../Menu';
import { Popover } from '../Popover';
import { ActionBar } from '../ActionBar';
import { ConfirmDialog } from '../ConfirmDialog';
import { NARROW_RUN, expectRunWidth } from '../../../.storybook/narrow-play';

/**
 * FormDialog stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview / EdgeCases / Scenarios・NarrowFullScreen (撮影しない)。
 * 出方が幅で変わる (640px 未満は画面いっぱい、以上は中央の大きいカード) ので、撮影する story は
 * `chromatic.viewports = [375, 1280]` で両方の幅を撮る (フォーカスの輪の検査も同じ宣言を読んで両方の幅で走る、§8-4)。
 * 開閉の動きは無い (即時)。play はテストの既定の幅 (1280) で走る。狭い幅 (画面いっぱい) の操作は、幅 375 で走る story
 * (NarrowFullScreen。`globals: NARROW_RUN` で走る幅を宣言する、AGENTS §8-4) の play が確かめる。
 */
type PlaygroundArgs = {
  title: string;
  submitLabel: string;
  cancelLabel: string;
  submitDisabled: boolean;
  submitLoading: boolean;
  onSubmit: (values: Record<string, FormDataEntryValue>) => void;
  onClose: () => void;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/FormDialog',
  argTypes: {
    title: { control: 'text' },
    submitLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    submitDisabled: { control: 'boolean' },
    submitLoading: { control: 'boolean' },
  },
  args: {
    title: '絞り込み',
    submitLabel: '適用',
    cancelLabel: 'キャンセル',
    submitDisabled: false,
    submitLoading: false,
    onSubmit: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

function FilterFields() {
  return (
    <div className="flex flex-col gap-4">
      <Input name="keyword" label="駅名・列車名" placeholder="例: のぞみ" fullWidth />
      <Select name="sort" label="並び順" fullWidth defaultValue="time">
        <option value="time">出発が早い順</option>
        <option value="fare">料金が安い順</option>
        <option value="duration">所要時間が短い順</option>
      </Select>
      <Checkbox name="vacant" label="空席がある列車だけ" />
    </div>
  );
}

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'ボタンで開く。確定 (確定ボタン・入力欄で Enter) は `onSubmit`、Esc・×・取り消しは `onClose` (取り消し)。外を押しても閉じない。play は、最初のフォーカスが最初の入力欄・Enter で確定・開き方と閉じ方で輪を出すか、を確かめる。',
      },
    },
  },
  render: ({ onSubmit, onClose, ...args }) => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>絞り込む</Button>
          <FormDialog
            {...args}
            open={open}
            onClose={() => {
              onClose();
              setOpen(false);
            }}
            onSubmit={(e) => {
              onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
              setOpen(false);
            }}
          >
            <FilterFields />
          </FormDialog>
        </>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '絞り込む' });

    // ポインタで開く: 名前は見出し。最初のフォーカスは最初の入力欄。キーを押すまで輪を出さない
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: '絞り込み' });
    const keyword = within(dialog).getByLabelText('駅名・列車名');
    await waitFor(() => expect(keyword).toHaveFocus());
    await expect(dialog).toHaveAttribute('data-ds-hide-focus-ring');
    await expect(within(dialog).getByRole('button', { name: '閉じる' }).getBoundingClientRect().height).toBe(48);

    // 入力して Enter: 確定 (onSubmit に入力の値)。部品は閉じず、親が閉じる
    await userEvent.type(keyword, 'のぞみ{Enter}');
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onSubmit).toHaveBeenCalledWith({ keyword: 'のぞみ', sort: 'time' });
    await expect(args.onClose).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
    // 最後の操作はキー (Enter) なので、戻したフォーカスに輪を出す
    await expect(trigger).not.toHaveAttribute('data-ds-hide-focus-ring');

    // キーボードで開いて、× をポインタで押す: onClose。戻したフォーカスに輪を出さない
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(keyword).toHaveFocus());
    await expect(dialog).not.toHaveAttribute('data-ds-hide-focus-ring');
    await userEvent.click(within(dialog).getByRole('button', { name: '閉じる' }));
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('data-ds-hide-focus-ring');
    await userEvent.keyboard('{Shift}');

    // 取り消しボタン (キーボード): onClose。確定はしない
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(keyword).toHaveFocus());
    within(dialog).getByRole('button', { name: 'キャンセル' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(dialog).not.toBeVisible());
    await expect(args.onClose).toHaveBeenCalledTimes(2);
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Overview (視覚回帰対象) — 開いた状態を凍結 ────────────

export const Overview: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280] },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態。見出しと ×・入力 (入力欄・選択・チェック)・取り消しと確定のフッターを `open` で凍結する。幅 375 では画面いっぱい、1280 では中央の大きいカード。最初のフォーカスは最初の入力欄。',
      },
    },
  },
  render: () => (
    <FormDialog open onClose={() => {}} title="絞り込み" submitLabel="適用" onSubmit={() => {}}>
      <FilterFields />
    </FormDialog>
  ),
};

// ── 3. EdgeCases (視覚回帰対象) — 入力が多くて本体がスクロールする ────────────

export const EdgeCases: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280] },
    docs: {
      description: {
        story:
          '入力が多く、画面に収まらないとき。見出しの行とフッターは動かず、本体だけがスクロールする (幅 375 は画面いっぱいの中で、1280 は高さ 85% のカードの中で)。',
      },
    },
  },
  render: () => (
    <FormDialog open onClose={() => {}} title="乗る人の情報" submitLabel="次へ" onSubmit={() => {}}>
      <div className="flex flex-col gap-4">
        {['1 人目', '2 人目', '3 人目', '4 人目'].map((who) => (
          <fieldset key={who} className="flex flex-col gap-3">
            <legend className="type-label text-onSurface mb-2">{who}</legend>
            <Input name={`${who}-name`} label="氏名" fullWidth />
            <Input name={`${who}-kana`} label="氏名 (カナ)" fullWidth />
            <Select name={`${who}-type`} label="区分" fullWidth defaultValue="adult">
              <option value="adult">大人</option>
              <option value="child">子ども</option>
            </Select>
          </fieldset>
        ))}
      </div>
    </FormDialog>
  ),
};

// ── 4. いろいろな場面 (視覚回帰対象外。手で触る・自動の操作で確かめる用) ────────────

type Scenario = 'nested' | 'actionBar' | 'ignore' | 'loading' | 'loadingFail' | 'empty' | 'discard' | 'long';

/** 入力が多い中身 (乗る人 4 人ぶん)。画面に収まらず、本体がスクロールする */
function PassengerFields() {
  return (
    <div className="flex flex-col gap-4">
      {['1 人目', '2 人目', '3 人目', '4 人目'].map((who) => (
        <fieldset key={who} className="flex flex-col gap-3">
          <legend className="type-label text-onSurface mb-2">{who}</legend>
          <Input name={`${who}-name`} label="氏名" fullWidth />
          <Input name={`${who}-kana`} label="氏名 (カナ)" fullWidth />
          <Select name={`${who}-type`} label="区分" fullWidth defaultValue="adult">
            <option value="adult">大人</option>
            <option value="child">子ども</option>
          </Select>
        </fieldset>
      ))}
    </div>
  );
}

function ScenarioDemo({ scenario }: { scenario: Scenario }) {
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [sort, setSort] = React.useState('出発が早い順');
  const [discardOpen, setDiscardOpen] = React.useState(false);

  const body = (() => {
    switch (scenario) {
      case 'nested':
        return (
          <div className="flex flex-col items-start gap-4">
            <Input name="keyword" label="駅名・列車名" fullWidth />
            <Menu
              trigger={<Button variant="secondary">{`並び順：${sort}`}</Button>}
              title="並び順"
              items={['出発が早い順', '料金が安い順'].map((label) => ({
                label,
                selected: label === sort,
                onSelect: () => {
                  setSort(label);
                  add(`Menu: ${label}`);
                },
              }))}
            />
            <Popover
              trigger={<Button variant="secondary">メモを足す</Button>}
              title="メモ"
              onOpenChange={(o) => add(`Popover(${o})`)}
            >
              <Input name="memo" label="メモ" />
            </Popover>
          </div>
        );
      case 'actionBar':
        return (
          <div className="flex flex-col gap-4">
            <Input name="keyword" label="駅名・列車名" fullWidth />
            <ActionBar>
              <Button variant="secondary">条件を消す</Button>
              <Button variant="secondary">前回の条件</Button>
            </ActionBar>
          </div>
        );
      case 'empty':
        return <p>押せるものが無い中身 (フォーカスは dialog そのもの)。</p>;
      case 'long':
        return <PassengerFields />;
      default:
        return <FilterFields />;
    }
  })();

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>絞り込む</Button>
      <FormDialog
        open={open}
        onClose={() => {
          add('onClose');
          // discard: 閉じずに破棄の確認を開く (確認は FormDialog の後ろの兄弟に置く)
          if (scenario === 'discard') setDiscardOpen(true);
          else if (scenario !== 'ignore') setOpen(false);
        }}
        onSubmit={(e) => {
          add(`onSubmit ${JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))}`);
          if (scenario === 'loading' || scenario === 'loadingFail') {
            setLoading(true);
            window.setTimeout(() => {
              setLoading(false);
              // loadingFail: 失敗したので開いたまま
              if (scenario === 'loading') setOpen(false);
              else add('失敗');
            }, 1500);
          } else {
            setOpen(false);
          }
        }}
        submitLoading={loading}
        title="絞り込み"
        submitLabel="適用"
      >
        {body}
      </FormDialog>
      {scenario === 'discard' && (
        <ConfirmDialog
          open={discardOpen}
          onClose={() => {
            add('確認の onClose');
            setDiscardOpen(false);
          }}
          onConfirm={() => {
            add('破棄する');
            setDiscardOpen(false);
            setOpen(false);
          }}
          title="入力を破棄しますか？"
          confirmLabel="破棄する"
          cancelLabel="破棄をやめる"
          destructive
        >
          入力した条件は保存されません。
        </ConfirmDialog>
      )}
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

export const Scenarios: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'nested' },
  argTypes: {
    scenario: { control: 'select', options: ['nested', 'actionBar', 'ignore', 'loading', 'loadingFail', 'empty', 'discard', 'long'] },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'いろいろな場面を手で触るための story (`scenario` で切り替える。play は持たない)。nested: 中に Menu と Popover (Popover の中に入力欄。そこで Enter を押しても確定しない) / actionBar: 本体の中に ActionBar (幅 0 に潰れない) / ignore: 親が閉じる要求に応えない (確定だけで閉じる。Esc を続けても消えたままにならない) / loading: 確定から 1.5 秒待って閉じる (その間 Enter でも確定しない) / loadingFail: 1.5 秒待った後、失敗して開いたまま / empty: 押せるものが無い中身 / discard: 取り消しの要求で閉じずに破棄の確認を開く (確認は FormDialog の後ろの兄弟。「破棄する」で 2 つとも閉じる) / long: 入力が多く、本体がスクロールする。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
};

// ── 5. 狭い幅 (幅 375 で走る。視覚回帰対象外) ────────────
// 走る幅は `globals: NARROW_RUN` で宣言する (test-runner が描く前にその幅にする。Storybook で開いても 375 に固定して見える、AGENTS §8-4)

export const NarrowFullScreen: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'long' },
  globals: NARROW_RUN,
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '幅 375 で走る (Storybook でも 375 に固定して見える)。入力が多い中身を開き、画面いっぱい (幅・高さ)・本体だけがスクロールする (見出しとフッターは動かない)・取り消しで閉じてフォーカスが開いたボタンに戻る、を確かめる。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    await expectRunWidth();
    const canvas = within(canvasElement);
    const opener = canvas.getByRole('button', { name: '絞り込む' });
    await userEvent.click(opener);
    const dialog = (await screen.findByRole('dialog', { name: '絞り込み' })) as HTMLDialogElement;
    await waitFor(() => expect(dialog.open).toBe(true));

    // 画面いっぱい (幅・高さ)
    const r = dialog.getBoundingClientRect();
    await expect(Math.round(r.left)).toBe(0);
    await expect(Math.round(r.top)).toBe(0);
    await expect(Math.round(r.width)).toBe(window.innerWidth);
    await expect(Math.round(r.height)).toBe(window.innerHeight);

    // 本体だけがスクロールする: dialog 自体はスクロールせず、本体を下まで送っても見出しとフッターは動かない
    const heading = within(dialog).getByRole('heading', { name: '絞り込み' });
    const form = dialog.querySelector('form') as HTMLFormElement;
    // form の中は 見出しの行 → 本体 → フッター の順
    const body = form.children[1] as HTMLElement;
    const footer = form.lastElementChild as HTMLElement;
    await expect(footer).toContainElement(within(dialog).getByRole('button', { name: 'キャンセル' }));
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await expect(dialog.scrollHeight).toBeLessThanOrEqual(dialog.clientHeight);
    const headingTop = heading.getBoundingClientRect().top;
    const footerTop = footer.getBoundingClientRect().top;
    await expect(Math.abs(footer.getBoundingClientRect().bottom - window.innerHeight)).toBeLessThanOrEqual(1);
    body.scrollTop = body.scrollHeight;
    await waitFor(() => expect(body.scrollTop).toBeGreaterThan(0));
    await expect(heading.getBoundingClientRect().top).toBe(headingTop);
    await expect(footer.getBoundingClientRect().top).toBe(footerTop);
    await expect(dialog.scrollTop).toBe(0);

    // 取り消し → 閉じて (onClose)、フォーカスは開いたボタン
    await userEvent.click(within(dialog).getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(canvas.getByTestId('log')).toHaveTextContent('onClose');
    await waitFor(() => expect(opener).toHaveFocus());
  },
};
