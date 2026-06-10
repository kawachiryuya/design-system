import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, screen, waitFor, fn } from 'storybook/test';
import { DropdownMenu } from './DropdownMenu';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Caption } from '@sb-blocks/Caption';

/**
 * DropdownMenu stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → WithIcons → States → Controlled
 *
 * variant / size prop なしのため Variants / Sizes は省略 (§5-3)。
 * メニューは native `popover` で top-layer に出るため、各 story はトリガーを押して確認する。
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

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
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

// ── 2. WithIcons ───────────────────────────────────────────────

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'アイコン付き + 破壊的項目 (destructive で赤系)。アカウントメニュー等の典型構成。',
      },
    },
  },
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">操作</Button>}
      placement="bottom-end"
      aria-label="操作メニュー"
      items={[
        { label: 'お気に入りに追加', icon: <Icon name="favorite" size="sm" />, onSelect: () => {} },
        { label: '新しいタブで開く', icon: <Icon name="open_in_new" size="sm" />, onSelect: () => {} },
        { label: '削除', icon: <Icon name="remove" size="sm" />, destructive: true, onSelect: () => {} },
      ]}
    />
  ),
};

// ── 3. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '無効項目 (disabled) はキーボード移動でスキップされ、typeahead (項目名の先頭文字入力でジャンプ) も効く。',
      },
    },
  },
  render: () => (
    <DropdownMenu
      trigger={<Button>表示</Button>}
      aria-label="表示メニュー"
      items={[
        { label: 'リスト表示', onSelect: () => {} },
        { label: 'グリッド表示', onSelect: () => {} },
        { label: 'カラム表示 (準備中)', disabled: true, onSelect: () => {} },
        { label: 'コンパクト表示', onSelect: () => {} },
      ]}
    />
  ),
};

// ── 4. Controlled ──────────────────────────────────────────────

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'open / onOpenChange で外部 state から開閉を制御。選択 / Esc / 外側クリックも onOpenChange に伝わる。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <div className="flex items-center gap-3">
          <DropdownMenu
            trigger={<Button>並び替え</Button>}
            open={open}
            onOpenChange={setOpen}
            aria-label="並び替え"
            items={[
              { label: '新着順', onSelect: () => {} },
              { label: '人気順', onSelect: () => {} },
              { label: '価格が安い順', onSelect: () => {} },
            ]}
          />
          <Caption text={`open: ${String(open)}`}><span /></Caption>
        </div>
      );
    }
    return <Demo />;
  },
};
