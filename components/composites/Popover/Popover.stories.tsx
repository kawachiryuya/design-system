import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Popover } from './Popover';
import { Button } from '../../primitives/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Popover stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Placements → RichContent → Controlled
 *
 * variant / size prop なしのため Variants / Sizes は省略 (§5-3)。
 * パネルは native `popover` で top-layer に出るため、各 story はトリガーを押して確認する。
 */
const meta: Meta<typeof Popover> = {
  title: 'Composites/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'トリガー click で開閉し、aria-expanded の連動と top-layer dialog の表示を play test で保証 (Esc / 外側クリックの light-dismiss は native popover に委譲)。',
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
    // (native popover の Esc/外側クリック light-dismiss は headless test-runner では不安定なため、
    //  決定的な toggle close を検証する。Esc 動作自体はブラウザ標準に委譲。)
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  },
};

// ── 2. Placements ──────────────────────────────────────────────

export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story: 'placement で配置を指定。視界からはみ出す場合は flip / shift で自動補正される (画面端で開いて確認)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['top', 'bottom-start', 'right', 'left-end'] as const).map((p) => (
        <Caption key={p} text={p}>
          <Popover trigger={<Button variant="secondary">{p}</Button>} placement={p} aria-label={`${p} の例`}>
            <p className="text-onSurface">placement = {p}</p>
          </Popover>
        </Caption>
      ))}
    </div>
  ),
};

// ── 3. RichContent ─────────────────────────────────────────────

export const RichContent: Story = {
  parameters: {
    docs: {
      description: {
        story: '見出し + 操作を含む構造化コンテンツ。開くとパネル内の最初の focusable へフォーカスが移り、Tab で内部を移動できる。',
      },
    },
  },
  render: () => (
    <Popover trigger={<Button>アカウント</Button>} placement="bottom-end" aria-label="アカウントメニュー">
      <div className="flex flex-col gap-2 min-w-[12rem]">
        <p className="text-label font-semibold text-onSurface">山田 太郎</p>
        <p className="text-caption text-onSurface-muted">taro@example.com</p>
        <hr className="border-border-subtle" />
        <Button variant="tertiary" size="sm">プロフィール</Button>
        <Button variant="tertiary" size="sm">設定</Button>
        <Button variant="destructive" size="sm">ログアウト</Button>
      </div>
    </Popover>
  ),
};

// ── 4. Controlled ──────────────────────────────────────────────

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'open / onOpenChange で外部 state から開閉を制御。light-dismiss (Esc / 外側クリック) も onOpenChange に伝わる。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <div className="flex items-center gap-3">
          <Popover
            trigger={<Button>フィルタ</Button>}
            open={open}
            onOpenChange={setOpen}
            aria-label="フィルタ"
          >
            <p className="text-onSurface">フィルタの内容…</p>
          </Popover>
          <span className="text-caption text-onSurface-muted">open: {String(open)}</span>
        </div>
      );
    }
    return <Demo />;
  },
};
