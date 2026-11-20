import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { useState } from 'react';
import { Tabs } from './Tabs';
import { Button } from '../../primitives/Button';
import { Caption } from '@sb-blocks/Caption';

/**
 * Tabs stories — VR 集約モデル (§5-3)
 *
 * 構成: Playground / Overview / EdgeCases / ManualActivation。
 * active/inactive/disabled/badge の tab 状態 + panel を Overview に集約。
 * 多数タブの固定幅 overflow は width 依存の構造ケースなので EdgeCases。
 * ManualActivation は挙動 (矢印 focus のみ / Enter 確定) の play テストで、見た目は Overview と同一のため
 *   disableSnapshot (VR 対象外)。
 * Controlled / プロフィール / ダッシュボード等の usage 合成は guideline の「使用例」へ移設。
 * variant / size / icon prop は無し。
 */
const sampleTabs = [
  {
    id: 'overview',
    label: '概要',
    content: (
      <div className="space-y-2">
        <p className="type-supporting text-onSurface">プロジェクトの概要ページです。</p>
        <p className="type-supporting text-onSurface-subtle">最終更新: 2026 年 2 月 21 日</p>
      </div>
    ),
  },
  {
    id: 'members',
    label: 'メンバー',
    badge: 5,
    // 押せるもので始まるパネル (パネルそのものには Tab で止まらず、Tab は招待ボタンへ直接進む、#136)
    content: (
      <div className="space-y-3">
        <Button variant="secondary" size="sm">メンバーを招待</Button>
        <ul className="space-y-2">
          {['田中 太郎', '鈴木 花子', '佐藤 一郎', '山田 次郎', '木村 三郎'].map((name) => (
            <li key={name} className="type-supporting text-onSurface">{name}</li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'settings',
    label: '設定',
    // 文章の後に押せるものがあるパネル (パネルに止まる。Tab だけで進む人が文章を飛ばさないため、#136)
    content: (
      <div className="space-y-3">
        <p className="type-supporting text-onSurface">設定ページです。</p>
        <Button variant="secondary" size="sm">設定を保存</Button>
      </div>
    ),
  },
  {
    id: 'disabled',
    label: '無効タブ',
    disabled: true,
    content: null,
  },
];

/**
 * 描画とパネルの測り直し (1 フレームにまとめている) が済むのを待つ。パネルの最初の値は「止まる」なので、
 * 待たずに「止まる」を確かめると、測る前の値で通ってしまう
 */
const nextFrames = (n = 3) =>
  new Promise<void>((resolve) => {
    const step = (left: number) => (left <= 0 ? resolve() : requestAnimationFrame(() => step(left - 1)));
    step(n);
  });

const meta: Meta<typeof Tabs> = {
  title: 'Composites/Tabs',
  component: Tabs,
  argTypes: {
    defaultActiveId: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  args: {
    tabs: sampleTabs,
    defaultActiveId: 'overview',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から defaultActiveId / ariaLabel を切替。キーボード操作 (← → Home End) と、パネルに Tab で止まる条件 (中身が押せるもので始まるとき以外は止まる。概要 = 文章だけ → 止まる / メンバー = ボタンで始まる → 止まらない / 設定 = 文章の後にボタン → 止まる) を play test で検証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTab = canvas.getByRole('tab', { name: '概要' });
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    // パネルに Tab で止まらないのは、中身が押せるもので始まるときだけ (#136、WAI-ARIA APG)。概要 = 文章だけ → 止まる
    await nextFrames();
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveAttribute('tabindex', '0'));
    await userEvent.click(firstTab);
    await userEvent.keyboard('{ArrowRight}');
    // 'メンバー' タブは badge:5 付きでアクセシブル名が「メンバー 5」になるため部分一致で取る
    const membersTab = canvas.getByRole('tab', { name: /メンバー/ });
    await expect(membersTab).toHaveAttribute('aria-selected', 'true');
    // メンバー = ボタンで始まる → パネルには止まらず、Tab はタブからボタンへ直接進む
    await waitFor(() => expect(canvas.getByRole('tabpanel')).not.toHaveAttribute('tabindex'));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'メンバーを招待' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(membersTab).toHaveFocus();
    await userEvent.keyboard('{End}');
    const settingsTab = canvas.getByRole('tab', { name: '設定' });
    await expect(settingsTab).toHaveAttribute('aria-selected', 'true');
    // 設定 = 文章の後にボタン → パネルに止まり (文章を飛ばさない)、もう一度 Tab でボタンへ
    await nextFrames();
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveAttribute('tabindex', '0'));
    await userEvent.tab();
    await expect(canvas.getByRole('tabpanel')).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: '設定を保存' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });
    await expect(settingsTab).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    // 文章だけのパネルに戻ると、また止まる
    await nextFrames();
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveAttribute('tabindex', '0'));
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// 1 つの tab bar に active/inactive/badge/disabled を集約 (panel は 1 行に短縮してノイズを抑える)。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。1 つの tab bar に active (概要) / inactive (設定) / badge (メンバー 5) / disabled (無効タブ) を集約し、選択中の panel を表示。',
      },
    },
  },
  render: () => (
    <Tabs
      ariaLabel="Tabs overview"
      defaultActiveId="overview"
      tabs={[
        { id: 'overview', label: '概要', content: <p className="type-supporting text-onSurface py-1">概要パネルの中身。</p> },
        { id: 'members', label: 'メンバー', badge: 5, content: <p className="type-supporting text-onSurface py-1">メンバーパネルの中身。</p> },
        { id: 'settings', label: '設定', content: <p className="type-supporting text-onSurface py-1">設定パネルの中身。</p> },
        { id: 'disabled', label: '無効タブ', disabled: true, content: null },
      ]}
    />
  ),
};

// ── 3. EdgeCases (視覚回帰対象) ─────────────────────────────────
// 多数タブを固定幅 (w-[480px]) に入れた時の overflow-x-auto 挙動 = width + tab 数依存の構造ケース。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '多数のタブ (10 件) を固定幅 w-[480px] に収めた時の横スクロール (overflow-x-auto) 挙動 — コンテナ幅 + tab 数依存の構造ケース。Controlled / プロフィール / ダッシュボードの usage は guideline 使用例へ移設。',
      },
    },
  },
  render: () => (
    <Caption text="多数のタブ (10 件、固定幅 w-[480px] で横スクロール)">
      <div className="w-[480px]">
        <Tabs
          defaultActiveId="t1"
          tabs={Array.from({ length: 10 }, (_, i) => ({
            id: `t${i + 1}`,
            label: `タブ ${i + 1}`,
            content: <p className="type-supporting">タブ {i + 1} の中身</p>,
          }))}
        />
      </div>
    </Caption>
  ),
};

// ── 4. ManualActivation (視覚回帰対象外: 挙動テスト、見た目は Overview と同一) ────

export const ManualActivation: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: '`activationMode="manual"`: 矢印キーは focus のみ移動し、`Enter` / `Space` で選択確定。panel が遅延ロード / 通信を伴う場合に使う。矢印で選択が変わらず Enter で確定することを play test で保証。見た目は Overview と同一のため VR 対象外。',
      },
    },
  },
  render: () => {
    function Demo() {
      const [v, setV] = useState('overview');
      return <Tabs tabs={sampleTabs} activeId={v} onChange={setV} activationMode="manual" ariaLabel="manual demo" />;
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('tab', { name: '概要' });
    first.focus();
    await expect(first).toHaveAttribute('aria-selected', 'true');

    // 矢印は focus のみ移動 (選択は変わらない)
    await userEvent.keyboard('{ArrowRight}');
    const members = canvas.getByRole('tab', { name: /メンバー/ });
    await waitFor(() => expect(members).toHaveFocus());
    await expect(members).toHaveAttribute('aria-selected', 'false');
    await expect(first).toHaveAttribute('aria-selected', 'true');

    // Enter で選択確定
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(members).toHaveAttribute('aria-selected', 'true'));
  },
};
