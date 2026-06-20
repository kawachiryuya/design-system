import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Alert } from './Alert';
import { Caption } from '@sb-blocks/Caption';

/**
 * Alert stories — VR 集約モデル (§5-3)
 *
 * 構成: Playground / Overview。
 * Alert は size/icon prop を持たない。長文折返しは Playground (title/children の Controls) で
 * 再現できるため EdgeCases は持たない。リッチな children / 通知エリアの usage は guideline 参照。
 *
 * Docs (Guideline) は Alert.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Alert> = {
  title: 'Composites/Alert',
  component: Alert,
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'warning', 'info', 'neutral'] },
    title: { control: 'text' },
    hideIcon: { control: 'boolean' },
    children: { control: 'text' },
    onClose: { control: false },
  },
  args: {
    variant: 'info',
    title: 'お知らせ',
    children: 'アラートのメッセージがここに入ります。',
  },
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-96"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Alert>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  args: { onClose: fn() },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から variant / title / hideIcon 等を切替。閉じるボタン click で onClose が呼ばれることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const closeBtn = canvas.getByRole('button', { name: '閉じる' });
    await userEvent.click(closeBtn);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: variant (5) / 構成 (title・hideIcon・dismissible) / close 状態。

export const Overview: Story = {
  parameters: {
    noWrap: true,
    docs: {
      description: {
        story: '視覚回帰用の総覧。variant (success/error/warning/info/neutral) と構成 (本文のみ / タイトル付き / hideIcon / dismissible) + 閉じるボタンの hover/focus を 1 枚に集約。',
      },
    },
    pseudo: {
      hover: ['#close-hover'],
      focusVisible: ['#close-focus'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">variant (success / error / warning / info / neutral)</div>
        <div className="flex flex-col gap-3 w-96 max-w-full">
          <Alert variant="success" title="完了">操作が正常に完了しました。</Alert>
          <Alert variant="error" title="エラー">入力内容に誤りがあります。確認してください。</Alert>
          <Alert variant="warning" title="注意">この操作は取り消せません。</Alert>
          <Alert variant="info" title="お知らせ">システムメンテナンスを 2 月 25 日に実施します。</Alert>
          <Alert variant="neutral">一般的な補足情報。特に緊急度はありません。</Alert>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">構成 (本文のみ / タイトル付き / hideIcon / dismissible) + close hover/focus</div>
        <div className="flex flex-col gap-4 w-96 max-w-full">
          <Caption text="Default (本文のみ)">
            <Alert variant="info">一般的なお知らせメッセージ。</Alert>
          </Caption>
          <Caption text="With title">
            <Alert variant="success" title="保存しました">変更内容が正常に保存されました。</Alert>
          </Caption>
          <Caption text="hideIcon (アイコンなし)">
            <Alert variant="warning" hideIcon>アイコンなしのコンパクト表示。</Alert>
          </Caption>
          <Caption text="Dismissible (onClose)">
            <Alert variant="info" title="新機能" onClose={() => {}}>ダッシュボードに新機能が追加されました。</Alert>
          </Caption>
          <Caption text="close button: Hover (pseudo)">
            <div id="close-hover">
              <Alert variant="error" title="エラー" onClose={() => {}}>閉じるボタンに hover 中の状態。</Alert>
            </div>
          </Caption>
          <Caption text="close button: Focus-visible (pseudo)">
            <div id="close-focus">
              <Alert variant="error" title="エラー" onClose={() => {}}>閉じるボタンに focus 中の状態。</Alert>
            </div>
          </Caption>
        </div>
      </div>
    </div>
  ),
};
