import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Alert } from './Alert';
import { Button } from '../../primitives/Button/Button';
import { Link } from '../../primitives/Link/Link';
import { Caption } from '@sb-blocks/Caption';

/**
 * Alert stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → Variants → States → EdgeCases
 *
 * Alert は size prop / icon prop を持たないため Sizes / WithIcon は省略 (§5-3)。
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
  // 全 story を w-96 でラップする (parameters.noWrap=true で個別に解除可能、memory: storybook-decorator-inheritance)
  decorators: [(Story, ctx) =>
    ctx.parameters.noWrap ? <Story /> : <div className="w-96"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof Alert>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  args: { onClose: fn() },
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から variant / title / hideIcon 等を切り替えて挙動を確認する起点。閉じるボタン click で onClose が呼ばれることを play test で保証。',
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

// ── 2. Variants ────────────────────────────────────────────────

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: '5 つの variant を縦並びで比較。success/error/warning/info は意味色、neutral は色を出さない補足情報用。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="success" title="完了">操作が正常に完了しました。</Alert>
      <Alert variant="error" title="エラー">入力内容に誤りがあります。確認してください。</Alert>
      <Alert variant="warning" title="注意">この操作は取り消せません。</Alert>
      <Alert variant="info" title="お知らせ">システムメンテナンスを 2 月 25 日に実施します。</Alert>
      <Alert variant="neutral">一般的な補足情報。特に緊急度はありません。</Alert>
    </div>
  ),
};

// ── 3. States ──────────────────────────────────────────────────
// Alert は配置に応じて Default / WithTitle / WithoutIcon / Dismissible の 4 構成パターンがある。
// 閉じるボタンの hover / focus-visible は pseudo-states で強制表示。

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '4 つの構成パターン (本文のみ / タイトル付き / アイコン非表示 / 閉じるボタン付き) と、閉じるボタンの hover/focus-visible 状態。Dismissible は実際の click → 消える挙動を含む。',
      },
    },
    pseudo: {
      hover: ['#close-hover'],
      focusVisible: ['#close-focus'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Caption text="Default (本文のみ)">
        <Alert variant="info">一般的なお知らせメッセージ。</Alert>
      </Caption>
      <Caption text="With title (タイトル + 本文)">
        <Alert variant="success" title="保存しました">変更内容が正常に保存されました。</Alert>
      </Caption>
      <Caption text="Without icon (hideIcon)">
        <Alert variant="warning" hideIcon>アイコンなしのコンパクト表示。</Alert>
      </Caption>
      <Caption text="Dismissible (onClose 指定)">
        <Alert variant="info" title="新機能" onClose={() => {}}>
          ダッシュボードに新しい分析機能が追加されました。
          <Link href="#" className="ml-1" underline="always">詳細を見る</Link>
        </Alert>
      </Caption>
      <Caption text="Close button: Hover (pseudo-states で強制)">
        <div id="close-hover">
          <Alert variant="error" title="エラー" onClose={() => {}}>
            閉じるボタンに hover 中の状態。
          </Alert>
        </div>
      </Caption>
      <Caption text="Close button: Focus-visible (pseudo-states で強制)">
        <div id="close-focus">
          <Alert variant="error" title="エラー" onClose={() => {}}>
            閉じるボタンに focus 中の状態。
          </Alert>
        </div>
      </Caption>
    </div>
  ),
};

// ── 4. EdgeCases ───────────────────────────────────────────────
// 長文 / 内部にリスト・Action buttons・Link を含むケース。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '長文本文 / リスト付き / 内部 Action buttons / Link 埋込 / Layout token (max-w-container-narrow + space-y-section-sm で通知エリア) など、現実の利用で出るケース。',
      },
    },
    // 最後の Layout token 例を全幅表示するため meta の w-96 decorator を解除
    noWrap: true,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="w-96 flex flex-col gap-4">
      <Caption text="長文本文 (自然折返し)">
        <Alert variant="info" title="プライバシーポリシー更新">
          2026 年 1 月 1 日からプライバシーポリシーが変更されます。お客様の個人情報の取り扱いに関する新しい規約をご確認ください。詳細は設定画面からご覧いただけます。
        </Alert>
      </Caption>
      <Caption text="フォームエラー一覧 (リスト)">
        <Alert variant="error" title="3 件のエラーがあります">
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>メールアドレスの形式が正しくありません</li>
            <li>パスワードは 8 文字以上にしてください</li>
            <li>生年月日を入力してください</li>
          </ul>
        </Alert>
      </Caption>
      <Caption text="内部に Action buttons">
        <Alert variant="warning" title="メールアドレスが未確認です">
          <p>アカウントのすべての機能を使うにはメールアドレスの確認が必要です。</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm">確認メールを再送</Button>
            <Button size="sm" variant="tertiary">後で行う</Button>
          </div>
        </Alert>
      </Caption>
      <Caption text="本文に Link 埋込">
        <Alert variant="info" title="新機能">
          ベータ版を公開しました。<Link href="#" underline="always">詳細を見る</Link>
        </Alert>
      </Caption>
      </div>

      <Caption text="Layout token 適用 (max-w-container-narrow + space-y-section-sm、ページ上部の通知エリア典型例)">
        <div className="w-full px-container py-container max-w-container-narrow mx-auto">
          <div className="space-y-section-sm">
            <Alert variant="warning" title="メンテナンスのお知らせ" onClose={() => {}}>
              3 月 10 日 02:00〜06:00 にサーバーメンテナンスを実施します。期間中はサービスを利用できません。
            </Alert>
            <Alert variant="info" title="新機能リリース" onClose={() => {}}>
              ダッシュボードに新しい分析機能が追加されました。<Link href="#" underline="always">詳細</Link>
            </Alert>
            <Alert variant="success">先月の利用レポートを送信しました。</Alert>
          </div>
        </div>
      </Caption>
    </div>
  ),
};
