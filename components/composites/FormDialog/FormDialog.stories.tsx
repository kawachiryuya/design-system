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

/**
 * FormDialog stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview / EdgeCases / Scenarios (撮影しない)。
 * 出方が幅で変わる (640px 未満は画面いっぱい、以上は中央の大きいカード) ので、撮影する story は
 * `chromatic.viewports = [375, 1280]` で両方の幅を撮る (フォーカスの輪の検査も同じ宣言を読んで両方の幅で走る、§8-4)。
 * 開閉の動きは無い (即時)。play はテストの既定の幅 (1280) で走る。狭い幅の操作は PR の表 (Playwright) で確かめた。
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

type Scenario = 'nested' | 'actionBar' | 'ignore' | 'loading' | 'empty';

function ScenarioDemo({ scenario }: { scenario: Scenario }) {
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [sort, setSort] = React.useState('出発が早い順');

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
          if (scenario !== 'ignore') setOpen(false);
        }}
        onSubmit={(e) => {
          add(`onSubmit ${JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))}`);
          if (scenario === 'loading') {
            setLoading(true);
            window.setTimeout(() => {
              setLoading(false);
              setOpen(false);
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
      <p className="type-caption text-onSurface-subtle" data-testid="log">
        {log.join(' / ') || '（まだ何も起きていない）'}
      </p>
    </div>
  );
}

export const Scenarios: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'nested' },
  argTypes: {
    scenario: { control: 'select', options: ['nested', 'actionBar', 'ignore', 'loading', 'empty'] },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'いろいろな場面を手で触るための story (`scenario` で切り替える。play は持たない)。nested: 中に Menu と Popover (Popover の中に入力欄。そこで Enter を押しても確定しない) / actionBar: 本体の中に ActionBar (幅 0 に潰れない) / ignore: 親が閉じる要求に応えない (確定だけで閉じる。Esc を続けても消えたままにならない) / loading: 確定から 1.5 秒待って閉じる (その間 Enter でも確定しない) / empty: 押せるものが無い中身。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
};
