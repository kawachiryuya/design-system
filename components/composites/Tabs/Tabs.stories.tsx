import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { useState } from 'react';
import { Tabs } from './Tabs';
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
        <p className="text-sm text-onSurface">プロジェクトの概要ページです。</p>
        <p className="text-sm text-onSurface-muted">最終更新: 2026 年 2 月 21 日</p>
      </div>
    ),
  },
  {
    id: 'members',
    label: 'メンバー',
    badge: 5,
    content: (
      <ul className="space-y-2">
        {['田中 太郎', '鈴木 花子', '佐藤 一郎', '山田 次郎', '木村 三郎'].map((name) => (
          <li key={name} className="text-sm text-onSurface">{name}</li>
        ))}
      </ul>
    ),
  },
  {
    id: 'settings',
    label: '設定',
    content: <p className="text-sm text-onSurface">設定ページです。</p>,
  },
  {
    id: 'disabled',
    label: '無効タブ',
    disabled: true,
    content: null,
  },
];

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
        story: 'Controls から defaultActiveId / ariaLabel を切替。キーボード操作 (← → Home End) を play test で検証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTab = canvas.getByRole('tab', { name: '概要' });
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(firstTab);
    await userEvent.keyboard('{ArrowRight}');
    // 'メンバー' タブは badge:5 付きでアクセシブル名が「メンバー 5」になるため部分一致で取る
    const membersTab = canvas.getByRole('tab', { name: /メンバー/ });
    await expect(membersTab).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: '設定' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
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
        { id: 'overview', label: '概要', content: <p className="text-sm text-onSurface py-1">概要パネルの中身。</p> },
        { id: 'members', label: 'メンバー', badge: 5, content: <p className="text-sm text-onSurface py-1">メンバーパネルの中身。</p> },
        { id: 'settings', label: '設定', content: <p className="text-sm text-onSurface py-1">設定パネルの中身。</p> },
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
            content: <p className="text-sm">タブ {i + 1} の中身</p>,
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
