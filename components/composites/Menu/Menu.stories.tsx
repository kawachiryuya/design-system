import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor, fn } from 'storybook/test';
import { Menu, type MenuItem } from './Menu';
import { Modal } from '../Modal';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';

/**
 * Menu stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview / OverviewSingleChoice / SingleChoice。
 * 出方が幅で変わる (640px 未満は下から、以上は押した要素の近く) ので、撮影する story は
 * `chromatic.viewports = [375, 1280]` で両方の幅を撮る (フォーカスの輪の検査も同じ宣言を読んで両方の幅で走る、§8-4)。
 * 開いた状態は同時に 1 つしか出せない (popover="auto" / showModal) ので、「操作の一覧」(Overview) と
 * 「1 つ選ぶ」(OverviewSingleChoice) を別の story に分けて `open` で凍結する。
 * 撮影は動きを減らす設定で行う (開く動きの途中を撮らない)。
 * play はテストの既定の幅 (広い幅) で走る。狭い幅 (下から出る面) の操作は PR の表 (Playwright) で確かめた。
 * 下から出る面は開いてから 300ms ポインタを受け付けないので、狭い幅で play を書くときは 300ms 以上待ってから押す。
 */
type PlaygroundArgs = {
  title: string;
  kind: 'actions' | 'choice';
  placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

const SORTS = ['出発時刻順', '到着時刻順', '所要時間順', '乗り換えの少ない順'];

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/Menu',
  argTypes: {
    title: { control: 'text' },
    kind: { control: 'radio', options: ['actions', 'choice'] },
    placement: { control: 'select', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

/** 「1 つ選ぶ」の見本 (選んだ値を持つ) */
function SortMenu({ title = '並び順', onPick }: { title?: string; onPick?: (label: string) => void }) {
  const [sort, setSort] = React.useState(SORTS[0]);
  return (
    <Menu
      trigger={
        <Button variant="secondary" icon={<Icon name="expand_more" size="sm" aria-hidden />} iconPosition="right">
          {`${title}：${sort}`}
        </Button>
      }
      title={title}
      items={SORTS.map((label) => ({
        label,
        selected: label === sort,
        onSelect: () => {
          setSort(label);
          onPick?.(label);
        },
      }))}
    />
  );
}

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '入口を押して開き、項目を押す (または矢印キーで移動して Enter) と選んで閉じる。`kind` で「操作の一覧」と「1 つ選ぶ」を切り替える。幅 640px 未満で開くと下から出る。play は広い幅で、役割・入口の属性・フォーカスの移動・無効な項目を飛ばす・Enter で選ぶ・Tab で閉じる、を確かめる。',
      },
    },
  },
  args: {
    title: '予約を変更',
    kind: 'actions',
    placement: 'bottom-start',
    onRename: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
  },
  render: ({ title, kind, placement, onRename, onDuplicate, onDelete }) =>
    kind === 'choice' ? (
      <SortMenu title={title} />
    ) : (
      <Menu
        trigger={<Button>{title}</Button>}
        title={title}
        placement={placement}
        items={[
          { label: '名前を変更', icon: <Icon name="mode" size="sm" />, onSelect: onRename },
          { label: '共有 (準備中)', disabled: true, onSelect: () => {} },
          { label: '複製', onSelect: onDuplicate },
          { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: onDelete },
        ]}
      />
    ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '予約を変更' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const menu = await screen.findByRole('menu', { name: '予約を変更' });
    await expect(trigger).toHaveAttribute('aria-controls', menu.id);
    const items = within(menu).getAllByRole('menuitem');
    await expect(items).toHaveLength(4);

    // 開くと最初の有効な項目にフォーカス。↓ は無効な項目 (共有) を飛ばす。End・Home・先頭文字
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(items[2]).toHaveFocus());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(items[3]).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('複');
    await waitFor(() => expect(items[2]).toHaveFocus());

    // Enter で選ぶ → onSelect が 1 回、閉じて、フォーカスは入口
    await userEvent.keyboard('{Enter}');
    await expect(args.onDuplicate).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(trigger).toHaveFocus());

    // 押して選ぶ
    await userEvent.click(trigger);
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.click(items[3]);
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(trigger).toHaveFocus());

    // 無効な項目は押しても選ばれず、閉じない。フォーカスも項目から外れない (矢印・Tab が効き続ける)
    await userEvent.click(trigger);
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.click(items[1]);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(items[0]).toHaveFocus();
    // フォーカスが無効な項目にあるとき (スクリプトで移した等) は、Enter で何も選ばない (アクティブだった項目も選ばない)
    items[1].focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onRename).toHaveBeenCalledTimes(0);
    items[0].focus();

    // 押しかけてずらして離す (click にならない) と、フォーカスはその項目に移る。Enter はフォーカスのある項目を選ぶ
    // (アクティブだった「削除」ではない)
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(items[3]).toHaveFocus());
    await userEvent.pointer([{ keys: '[MouseLeft>]', target: items[0] }, { target: canvasElement }, { keys: '[/MouseLeft]' }]);
    await waitFor(() => expect(items[0]).toHaveFocus());
    // 矢印キーの続きも、フォーカスのある項目から (↓ は無効な項目を飛ばして 3 つ目へ、↑ で戻る)
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(items[2]).toHaveFocus());
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(args.onRename).toHaveBeenCalledTimes(1);
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));

    // Tab は閉じて入口に戻す (選ばない)
    await userEvent.click(trigger);
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('{Tab}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(args.onRename).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Overview (視覚回帰対象) — 開いた状態を凍結 ────────────

const ACTION_ITEMS: MenuItem[] = [
  { label: 'お気に入りに追加', icon: <Icon name="favorite" size="sm" />, onSelect: () => {} },
  { label: '新しいタブで開く', icon: <Icon name="open_in_new" size="sm" />, onSelect: () => {} },
  { label: 'カラム表示 (準備中)', disabled: true, onSelect: () => {} },
  { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: () => {} },
];

export const Overview: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280], prefersReducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態 (操作の一覧)。アイコン付き / ふつう / 無効 (準備中) / 破壊的 (赤系) の項目を 1 つに集めて `open` で凍結する。幅 375 では下から出る面、1280 では入口の近く。',
      },
    },
  },
  render: () => (
    <div className="p-8 pb-64 flex justify-center">
      <Menu
        trigger={<Button variant="secondary">操作</Button>}
        title="操作"
        placement="bottom"
        open
        onOpenChange={() => {}}
        items={ACTION_ITEMS}
      />
    </div>
  ),
};

export const OverviewSingleChoice: Story = {
  parameters: {
    chromatic: { viewports: [375, 1280], prefersReducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          '視覚回帰用の開いた状態 (1 つ選ぶ)。選択中 (2 つ目) の行の右にチェックが出る。幅 375 では下から出る面 (行は 48px 以上)、1280 では入口の近く。',
      },
    },
  },
  render: () => (
    <div className="p-8 pb-64 flex justify-center">
      <Menu
        trigger={<Button variant="secondary">並び順：到着時刻順</Button>}
        title="並び順"
        placement="bottom"
        open
        onOpenChange={() => {}}
        items={SORTS.map((label, i) => ({ label, selected: i === 1, onSelect: () => {} }))}
      />
    </div>
  ),
};

// ── 3. 1 つ選ぶの操作の確かめ (視覚回帰対象外) ────────────

export const SingleChoice: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '「1 つ選ぶ」メニューの操作。項目は menuitemradio + aria-checked、開いた直後のフォーカスは選択中の項目、選ぶと入口の文言が変わって閉じる。',
      },
    },
  },
  render: () => {
    const onPick = fn();
    return <SortMenu onPick={onPick} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '並び順：出発時刻順' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu', { name: '並び順' });
    const items = within(menu).getAllByRole('menuitemradio');
    await expect(items).toHaveLength(4);
    await expect(items[0]).toHaveAttribute('aria-checked', 'true');
    await expect(items[1]).toHaveAttribute('aria-checked', 'false');
    await waitFor(() => expect(items[0]).toHaveFocus());

    // 2 つ目を選ぶ → 入口の文言が変わって閉じる
    await userEvent.click(items[1]);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveTextContent('並び順：到着時刻順');
    await waitFor(() => expect(trigger).toHaveFocus());

    // もう一度開くと、選択中 (2 つ目) にフォーカスと印
    await userEvent.click(trigger);
    await waitFor(() => expect(items[1]).toHaveFocus());
    await expect(items[1]).toHaveAttribute('aria-checked', 'true');
    await expect(items[0]).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard('{Escape}');
  },
};

// ── 4. いろいろな場面 (視覚回帰対象外。手で触る・自動の操作で確かめる用) ────────────

type Scenario = 'actions' | 'inModal' | 'shrink' | 'throws' | 'modal' | 'nested' | 'controlled' | 'empty' | 'allDisabled' | 'long' | 'strict' | 'bottom';

function ScenarioDemo({ scenario }: { scenario: Scenario }) {
  const [log, setLog] = React.useState<string[]>([]);
  const add = (m: string) => setLog((l) => [...l, m]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);
  const [controlledOpen, setControlledOpen] = React.useState(false);
  const [shrinkItems, setShrinkItems] = React.useState(4);

  const body = (() => {
    switch (scenario) {
      case 'actions':
        return (
          <Menu
            trigger={<Button>操作</Button>}
            title="操作"
            items={[
              { label: '名前を変更', icon: <Icon name="mode" size="sm" />, onSelect: () => add('名前を変更') },
              { label: '共有 (準備中)', disabled: true, onSelect: () => add('共有') },
              { label: '複製', onSelect: () => add('複製') },
              { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: () => add('削除') },
            ]}
          />
        );
      case 'inModal':
        return (
          <>
            <Button onClick={() => setModalOpen(true)}>条件を開く</Button>
            <Modal open={modalOpen} onClose={() => { add('Modal の onClose'); setModalOpen(false); }} title="条件" size="sm">
              <Modal.Body>
                <SortMenu onPick={(l) => add(l)} />
              </Modal.Body>
            </Modal>
          </>
        );
      case 'shrink':
        return (
          <Menu
            trigger={<Button>操作</Button>}
            title="操作"
            onOpenChange={(o) => {
              // 開いて 300ms 後に、後ろの 2 項目が消える (開いている間に items が減る)
              if (o) window.setTimeout(() => setShrinkItems(2), 300);
              else setShrinkItems(4);
            }}
            items={['名前を変更', '複製', '移動', '削除'].slice(0, shrinkItems).map((label) => ({ label, onSelect: () => add(label) }))}
          />
        );
      case 'throws':
        return (
          <Menu
            trigger={<Button>操作</Button>}
            title="操作"
            items={[
              { label: '複製', onSelect: () => add('複製') },
              {
                label: '失敗する操作',
                onSelect: () => {
                  add('失敗する操作');
                  throw new Error('onSelect が失敗した (見本)');
                },
              },
            ]}
          />
        );
      case 'modal':
        return (
          <>
            <Menu
              trigger={<Button>予約を変更</Button>}
              title="予約を変更"
              items={[
                { label: '列車を変更', onSelect: () => add('列車を変更') },
                { label: '予約を取り消す', destructive: true, onSelect: () => setModalOpen(true) },
              ]}
            />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="予約を取り消しますか？" size="sm">
              <Modal.Body>取り消すと元に戻せません。</Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" onClick={() => setModalOpen(false)}>
                  戻る
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      case 'nested':
        return (
          <>
            <Menu
              trigger={<Button>操作</Button>}
              title="操作"
              items={[{ label: '並び順を選ぶ', onSelect: () => setSecondOpen(true) }]}
            />
            <Menu
              trigger={<Button variant="secondary">並び順</Button>}
              title="並び順"
              open={secondOpen}
              onOpenChange={setSecondOpen}
              items={SORTS.map((label) => ({ label, onSelect: () => add(label) }))}
            />
          </>
        );
      case 'controlled':
        return (
          <Menu
            trigger={<Button>操作</Button>}
            title="操作"
            open={controlledOpen}
            onOpenChange={(o) => {
              add(`onOpenChange(${o})`);
              setControlledOpen(o);
            }}
            items={[
              { label: '複製', onSelect: () => add('onSelect(複製)') },
              { label: '削除', destructive: true, onSelect: () => add('onSelect(削除)') },
            ]}
          />
        );
      case 'empty':
        return <Menu trigger={<Button>操作</Button>} title="操作" items={[]} />;
      case 'allDisabled':
        return (
          <Menu
            trigger={<Button>操作</Button>}
            title="操作"
            items={[
              { label: '複製 (準備中)', disabled: true, onSelect: () => add('複製') },
              { label: '削除 (準備中)', disabled: true, onSelect: () => add('削除') },
            ]}
          />
        );
      case 'long':
        return (
          <Menu
            trigger={<Button>駅を選ぶ</Button>}
            title="駅"
            items={Array.from({ length: 24 }, (_, i) => ({
              label: `駅 ${i + 1}`,
              selected: i === 17,
              onSelect: () => add(`駅 ${i + 1}`),
            }))}
          />
        );
      case 'strict':
        return (
          <React.StrictMode>
            <SortMenu onPick={(l) => add(l)} />
          </React.StrictMode>
        );
      case 'bottom':
        return (
          <div className="fixed inset-x-0 bottom-0 p-4 bg-surface">
            <SortMenu onPick={(l) => add(l)} />
          </div>
        );
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
  args: { scenario: 'actions' },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['actions', 'inModal', 'shrink', 'throws', 'modal', 'nested', 'controlled', 'empty', 'allDisabled', 'long', 'strict', 'bottom'],
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'いろいろな場面を手で触るための story (`scenario` で切り替える。play は持たない)。actions: 操作の一覧 (無効な項目あり) / inModal: Modal の中の Menu (Esc で Menu だけ閉じる) / shrink: 開いて 300ms 後に項目が減る / throws: onSelect が例外を投げる / modal: 選んだら Modal を開く / nested: 選んだら別の Menu を開く / controlled: open と onOpenChange の回数と順番を下に出す / empty: 項目が 0 個 / allDisabled: 全部無効 / long: 項目が多い (狭い幅では面の中でスクロール) / strict: StrictMode / bottom: 入口が画面の下端 (二度押しの確かめ)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
};

export const ReturnFocus: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'nested' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          '別のメニューで選んだら開くメニュー (nested)。2 つ目を閉じたら、フォーカスは 2 つ目の入口 (並び順) に戻る (ブラウザは開く前のフォーカス = 1 つ目の入口へ戻そうとする)。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '操作' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: '並び順を選ぶ' }));
    const second = await screen.findByRole('menu', { name: '並び順' });
    await waitFor(() => expect(within(second).getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.click(within(second).getByRole('menuitem', { name: '所要時間順' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: '並び順' })).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.getByTestId('log')).toHaveTextContent('所要時間順');
    await waitFor(() => expect(canvas.getByRole('button', { name: '並び順' })).toHaveFocus());
  },
};

export const ItemsShrink: StoryObj<{ scenario: Scenario }> = {
  args: { scenario: 'shrink' },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '開いている間に項目が減って、アクティブな項目が消える。フォーカスは近い有効な項目へ移り、矢印と Enter が効き続ける。',
      },
    },
  },
  render: ({ scenario }) => <ScenarioDemo scenario={scenario} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '操作' }));
    const menu = await screen.findByRole('menu', { name: '操作' });
    await userEvent.keyboard('{End}');
    // 300ms 後に後ろの 2 項目が消える → 残った最後 (複製) にフォーカス
    await waitFor(() => expect(within(menu).getAllByRole('menuitem')).toHaveLength(2));
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: '複製' })).toHaveFocus());
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: '名前を変更' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByTestId('log')).toHaveTextContent('名前を変更'));
  },
};
