import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { VisuallyHidden } from './VisuallyHidden';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { Caption } from '@sb-blocks/Caption';

/**
 * VisuallyHidden stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → EdgeCases
 * (Variants/Sizes/States/WithIcon すべて該当なし — VisuallyHidden は単一形態の
 *  視覚非表示テキスト。視覚要素を持たないため discrete な variant がない。)
 *
 * Docs (Guideline) は VisuallyHidden.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof VisuallyHidden> = {
  title: 'Primitives/VisuallyHidden',
  component: VisuallyHidden,
  argTypes: {
    as: { control: 'radio', options: ['span', 'div', 'p', 'label'] },
    children: { control: 'text' },
    htmlFor: { control: 'text' },
  },
  args: {
    children: 'スクリーンリーダ専用テキスト',
    as: 'span',
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// sr-only class の自動付与を play test で保証。
// 視覚的には何も見えないので、上下に説明テキストを decoartor で追加する。

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-onSurface-muted">
          下の <code>VisuallyHidden</code> はブラウザに見えないが、VoiceOver / NVDA 等では読み上げられる:
        </p>
        <Story />
        <p className="text-sm text-onSurface-muted">↑ ここに非表示テキスト</p>
      </div>
    ),
  ],
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。視覚的には見えないが DOM にテキストが存在し、`sr-only` クラスが当たることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // sr-only クラスで視覚非表示だが getByText では拾える (アクセシビリティツリーには残る)
    const hidden = canvas.getByText('スクリーンリーダ専用テキスト');
    await expect(hidden).toBeInTheDocument();
    await expect(hidden).toHaveClass('sr-only');
  },
};

// ── 2. EdgeCases ───────────────────────────────────────────────
// VisuallyHidden は単独で意味を持たない (常に何かと組合せて使う) ため、
// 主要な統合パターン (icon-only Button / form label / live region) を集約。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'VisuallyHidden の主要な統合パターン: icon-only Button の補助ラベル / 視覚的に省略するフォームラベル / aria-live 通知エリアの 3 例。視覚は何もないが、SR で動作確認すると効果が分かる。',
      },
    },
  },
  render: () => {
    const LiveRegionDemo: React.FC = () => {
      const [message, setMessage] = React.useState('');
      return (
        <div className="flex flex-col gap-2">
          <Button onClick={() => setMessage(`保存しました (${new Date().toLocaleTimeString()})`)}>
            保存
          </Button>
          <p className="text-sm text-onSurface-muted">
            ボタンを押すと、視覚的には何も変わらないが SR が即時メッセージを読み上げる
          </p>
          <VisuallyHidden role="status" aria-live="polite">
            {message}
          </VisuallyHidden>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-8 w-96">
        <Caption text='icon-only Button の補助ラベル (Button iconOnly の aria-label と同等の SR テキスト)'>
          <div className="flex items-center gap-3">
            <Button variant="tertiary">
              <Icon name="favorite" />
              <VisuallyHidden>お気に入りに追加</VisuallyHidden>
            </Button>
            <span className="text-sm text-onSurface-muted">
              アイコンが視覚、VisuallyHidden が SR の補助テキスト
            </span>
          </div>
        </Caption>

        <Caption text='form label を視覚的に省略しつつ SR には残す (placeholder と組合せ)'>
          <form className="flex flex-col gap-2">
            <VisuallyHidden as="label" htmlFor="vh-search">
              サイト内検索キーワード
            </VisuallyHidden>
            <Input id="vh-search" type="search" placeholder="検索…" />
          </form>
        </Caption>

        <Caption text='aria-live 通知エリア (画面遷移なしの一時メッセージ通知)'>
          <LiveRegionDemo />
        </Caption>
      </div>
    );
  },
};
