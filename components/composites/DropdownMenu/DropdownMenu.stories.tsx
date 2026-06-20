import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor, fn } from 'storybook/test';
import { DropdownMenu } from './DropdownMenu';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';

/**
 * DropdownMenu stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview。
 * top-layer の menu は同時に 1 つしか開けないため、Overview は代表 1 枚 (icon / disabled / destructive /
 * 通常項目を 1 パネルに集約) を `open` 固定で凍結する。placement / roving フォーカス / typeahead /
 * controlled API は Playground (撮影外) + guideline で確認。
 * variant / size prop は無し。
 */
type PlaygroundArgs = {
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Composites/DropdownMenu',
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'トリガーで開き、矢印キーで項目移動 → Enter で選択 → 閉じる。menu/menuitem の role、roving フォーカス、Enter 選択を play test で保証。',
      },
    },
  },
  args: {
    onDuplicate: fn(),
    onRename: fn(),
    onDelete: fn(),
  },
  render: ({ onDuplicate, onRename, onDelete }) => (
    <DropdownMenu
      trigger={<Button>操作</Button>}
      aria-label="操作メニュー"
      items={[
        { label: '複製', onSelect: onDuplicate },
        { label: '名前を変更', onSelect: onRename },
        { label: '削除', destructive: true, onSelect: onDelete },
      ]}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '操作' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const menu = await screen.findByRole('menu', { name: '操作メニュー' });
    const items = within(menu).getAllByRole('menuitem');

    // 開くと最初の項目にフォーカス、ArrowDown で 2 番目へ
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(items[1]).toHaveFocus());

    // Enter で選択 → onSelect が呼ばれメニューが閉じる
    await userEvent.keyboard('{Enter}');
    await expect(args.onRename).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};

// ── 2. Overview (視覚回帰対象) — open 固定の代表 1 枚 ────────────
// 1 パネルに icon / 通常 / disabled / destructive を集約し menu の視覚バリエーションを一度に撮る。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の開状態。icon 付き / 通常 / disabled (準備中) / destructive (赤系) 項目を 1 パネルに集約し `open` 固定で凍結する。',
      },
    },
  },
  render: () => (
    <div className="p-8 pb-56 flex justify-center">
      <DropdownMenu
        trigger={<Button variant="secondary">操作</Button>}
        placement="bottom"
        open
        onOpenChange={() => {}}
        aria-label="操作メニュー"
        items={[
          { label: 'お気に入りに追加', icon: <Icon name="favorite" size="sm" />, onSelect: () => {} },
          { label: '新しいタブで開く', icon: <Icon name="open_in_new" size="sm" />, onSelect: () => {} },
          { label: 'カラム表示 (準備中)', disabled: true, onSelect: () => {} },
          { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: () => {} },
        ]}
      />
    </div>
  ),
};
