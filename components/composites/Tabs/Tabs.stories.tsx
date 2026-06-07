import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Tabs } from './Tabs';
import { Badge } from '../../primitives/Badge/Badge';
import { Card } from '../Card/Card';
import { Caption } from '@sb-blocks/Caption';

/**
 * Tabs stories — 標準ストーリー構造に準拠
 *
 * 順序固定: Playground → States → EdgeCases
 *
 * Tabs は variant / size / icon prop を持たないため Variants / Sizes / WithIcon は省略 (§5-3)。
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
  // 横幅は story render 側で個別に制御 (full-width で表示しブラウザ伸縮で responsive 挙動を確認できる方針)
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ── 1. Playground ──────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
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
    const membersTab = canvas.getByRole('tab', { name: 'メンバー' });
    await expect(membersTab).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: '設定' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  },
};

// ── 2. States ──────────────────────────────────────────────────

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Active / Inactive / Disabled / With badge / Long label の構成パターン。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Caption text="Default (概要 が active)">
        <Tabs tabs={sampleTabs} defaultActiveId="overview" />
      </Caption>
      <Caption text="With badge (件数表示)">
        <Tabs
          defaultActiveId="all"
          tabs={[
            { id: 'all', label: 'すべて', badge: 128, content: <p className="text-sm">すべての通知</p> },
            { id: 'unread', label: '未読', badge: 12, content: <p className="text-sm">未読の通知</p> },
            { id: 'read', label: '既読', content: <p className="text-sm">既読の通知</p> },
          ]}
        />
      </Caption>
      <Caption text="Disabled タブ含む (キーボード矢印移動でスキップ)">
        <Tabs
          defaultActiveId="a"
          tabs={[
            { id: 'a', label: '利用可', content: <p className="text-sm">A タブ</p> },
            { id: 'b', label: '準備中', disabled: true, content: null },
            { id: 'c', label: '利用可', content: <p className="text-sm">C タブ</p> },
          ]}
        />
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '実利用例: Controlled (外部 state 同期) / プロフィールページ (badge 文字列 + 多タブ) / 多数のタブ (横スクロール) / Layout token (page 全体 max-w-container + タブ内 grid-base).',
      },
    },
  },
  render: () => {
    function ControlledDemo() {
      const [activeId, setActiveId] = useState('overview');
      return (
        <div className="space-y-3">
          <p className="text-xs text-onSurface-muted">アクティブ: <strong>{activeId}</strong></p>
          <Tabs tabs={sampleTabs} activeId={activeId} onChange={setActiveId} />
        </div>
      );
    }
    function ProfileDemo() {
      return (
        <div className="border border-border-subtle rounded-md overflow-hidden">
          <div className="p-4 bg-surface-layer-2 border-b border-border-subtle">
            <h2 className="font-semibold text-onSurface">田中 太郎</h2>
            <p className="text-sm text-onSurface-muted">UI デザイナー</p>
          </div>
          <div className="px-4">
            <Tabs
              defaultActiveId="posts"
              tabs={[
                {
                  id: 'posts',
                  label: '記事',
                  badge: 48,
                  content: (
                    <div className="space-y-3">
                      {['Atomic Design 入門', 'Tailwind CSS のすすめ', '色彩理論の基礎'].map((title) => (
                        <div key={title} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                          <span className="text-sm text-onSurface">{title}</span>
                          <Badge variant="neutral">公開中</Badge>
                        </div>
                      ))}
                    </div>
                  ),
                },
                { id: 'followers', label: 'フォロワー', badge: '1.2k', content: <p className="text-sm text-onSurface-muted">フォロワー一覧</p> },
                { id: 'following', label: 'フォロー中', badge: 320, content: <p className="text-sm text-onSurface-muted">フォロー中一覧</p> },
              ]}
            />
          </div>
        </div>
      );
    }
    function ManyDemo() {
      // overflow-x-auto の挙動を見せるため意図的に w-[480px] で狭める (full width だと 10 tab 収まってしまう)
      return (
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
      );
    }
    function PageDemo() {
      const members = [
        { name: '田中 太郎', role: 'デザイナー' },
        { name: '鈴木 花子', role: 'エンジニア' },
        { name: '佐藤 一郎', role: 'PM' },
        { name: '山田 次郎', role: 'エンジニア' },
        { name: '木村 三郎', role: 'デザイナー' },
        { name: '高橋 美咲', role: 'エンジニア' },
      ];
      return (
        <div className="max-w-container mx-auto px-container py-container border border-border-subtle rounded-md">
          <h1 className="text-heading-lg text-onSurface mb-4">プロジェクト設定</h1>
          <Tabs
            defaultActiveId="members"
            tabs={[
              { id: 'general', label: '一般', content: <p className="text-body-md text-onSurface-muted">一般設定のプレースホルダ。</p> },
              {
                id: 'members',
                label: 'メンバー',
                badge: members.length,
                content: (
                  <div className="grid-base">
                    {members.map((m) => (
                      <Card key={m.name} padding="md" className="col-span-4 md:col-span-4 lg:col-span-4">
                        <p className="text-label text-onSurface">{m.name}</p>
                        <p className="text-caption text-onSurface-muted mt-1">{m.role}</p>
                      </Card>
                    ))}
                  </div>
                ),
              },
              { id: 'billing', label: '課金', content: <p className="text-body-md text-onSurface-muted">課金情報のプレースホルダ。</p> },
            ]}
          />
          <p className="text-caption text-onSurface-muted mt-4">
            外側に <code>max-w-container mx-auto px-container py-container</code> で page 化、メンバータブ内で <code>grid-base</code> + <code>col-span-4</code> で 1/2/3 列レスポンシブ。Tabs と Layout token は併用可能。
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-8">
        <Caption text="Controlled (URL クエリ等と同期想定)">
          <ControlledDemo />
        </Caption>
        <Caption text="プロフィールページ (badge 文字列 + Layered surface)">
          <ProfileDemo />
        </Caption>
        <Caption text="多数のタブ (横スクロール overflow-x-auto、デモ用に意図的に狭めて表示)">
          <ManyDemo />
        </Caption>
        <Caption text="Layout token 適用 (page 全体 max-w-container + メンバータブ内 grid-base、Settings 典型例)">
          <PageDemo />
        </Caption>
      </div>
    );
  },
};
