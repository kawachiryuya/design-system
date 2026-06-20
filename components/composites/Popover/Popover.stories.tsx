import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Popover } from './Popover';
import { Button } from '../../primitives/Button';

/**
 * Popover stories — VR 集約モデル (§5-3) + overlay 特例 (§7-10)
 *
 * 構成: Playground / Overview。
 * top-layer の popover は同時に 1 つしか開けないため、Overview は代表 1 枚 (rich content + arrow) を
 * `open` 固定で凍結する。placement (top/bottom/left/right と flip/shift) / controlled API は
 * Playground (撮影外) + guideline で確認。
 * variant / size prop は無し。
 */
const meta: Meta<typeof Popover> = {
  title: 'Composites/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'トリガー click で開閉し、aria-expanded の連動と top-layer dialog の表示を play test で保証 (Esc / 外側クリックの light-dismiss は native popover に委譲)。placement / controlled もここで確認。',
      },
    },
  },
  render: () => (
    <Popover trigger={<Button>詳細</Button>} aria-label="補足情報">
      <p className="text-onSurface">
        このフィールドは公開プロフィールに表示されます。
      </p>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '詳細' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // 開く: aria-expanded=true、top-layer の dialog が可視
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const panel = await screen.findByRole('dialog', { name: '補足情報' });
    await expect(panel).toBeVisible();

    // 閉じる: トリガー再 click で toggle close。
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};

// ── 2. Overview (視覚回帰対象) — open 固定の代表 1 枚 ────────────
// top-layer popover は 1 つだけ。代表として見出し + 操作を含む rich content を開状態で撮る。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の開状態。見出し + 操作を含む構造化コンテンツ (アカウントメニュー) を `open` 固定で凍結する。arrow / shadow / 配置を確認できる。',
      },
    },
  },
  render: () => (
    <div className="p-8 pb-48 flex justify-center">
      <Popover
        trigger={<Button>アカウント</Button>}
        placement="bottom"
        open
        onOpenChange={() => {}}
        aria-label="アカウントメニュー"
      >
        <div className="flex flex-col gap-2 min-w-[12rem]">
          <p className="text-label font-semibold text-onSurface">山田 太郎</p>
          <p className="text-caption text-onSurface-muted">taro@example.com</p>
          <hr className="border-border-subtle" />
          <Button variant="tertiary" size="sm">プロフィール</Button>
          <Button variant="tertiary" size="sm">設定</Button>
          <Button variant="destructive" size="sm">ログアウト</Button>
        </div>
      </Popover>
    </div>
  ),
};
