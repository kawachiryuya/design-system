import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import semanticColors from '../../tokens/source/semantic-colors.json';

/**
 * Semantic color tokens の可視化カタログ。
 *
 * 入力: `tokens/source/semantic-colors.json` (source、`{ value, type, description }` 構造)。
 * 表示: 各 token の Tailwind class + description + 視覚プレビュー。
 */
const meta: Meta = {
  title: 'Tokens/Color/Semantic',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type Entry = { value: string; type: string; description?: string };
const SC = semanticColors.color as Record<string, Record<string, Entry>>;

/** `{color.primary.700}` → `primary.700`、`rgba(...)` 等はそのまま */
const formatValue = (v: string): string =>
  v.startsWith('{') ? v.slice(1, -1).replace(/^color\./, '') : v;

/** `default` キーは prefix のみ、それ以外は `prefix-key` */
const tw = (prefix: string, key: string): string =>
  key === 'default' ? prefix : `${prefix}-${key}`;

const list = (group: Record<string, Entry>) =>
  Object.entries(group).map(([key, entry]) => ({
    key,
    description: entry.description ?? '',
    sourceValue: formatValue(entry.value),
  }));

const CardHeader: React.FC<{
  name: string;
  twClass: string;
  source: string;
  description: string;
}> = ({ name, twClass, source, description }) => (
  <div className="flex flex-col gap-1 mt-3">
    <code className="text-xs font-mono font-semibold text-onSurface">{name}</code>
    <code className="text-xs font-mono text-onSurface-muted">{twClass}</code>
    <code className="text-xs font-mono text-onSurface-muted">→ {source}</code>
    {description && (
      <p className="text-xs text-onSurface-muted leading-relaxed mt-1">{description}</p>
    )}
  </div>
);

export const Surface: Story = {
  name: 'Background & Surface',
  parameters: {
    docs: {
      description: {
        story: 'ページ最下層 (`bg.default`) と コンテンツサーフェス (`surface.*`) のカテゴリ。`bg-background` / `bg-surface-*` で参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-heading-sm m-0 mb-3 text-onSurface">bg (ページ最下層)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list(SC.bg).map((e) => (
            <div key={e.key} className="border border-border-muted rounded-md p-3 bg-surface">
              <div className="bg-background h-16 rounded-sm border border-border-muted" />
              <CardHeader name={`bg.${e.key}`} twClass="bg-background" source={e.sourceValue} description={e.description} />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-heading-sm m-0 mb-3 text-onSurface">surface (カード / モーダル / 状態色)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list(SC.surface).map((e) => (
            <div key={e.key} className="border border-border-muted rounded-md p-3 bg-background">
              <div className={`${tw('bg-surface', e.key)} h-16 rounded-sm border border-border-muted`} />
              <CardHeader name={`surface.${e.key}`} twClass={tw('bg-surface', e.key)} source={e.sourceValue} description={e.description} />
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};

export const Text: Story = {
  name: 'Text (on)',
  parameters: {
    docs: {
      description: {
        story: 'テキスト色のセマンティック token。`inverse` は色面背景上で白文字を使う想定、他は白系背景前提で AA 4.5:1 を満たす。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {list(SC.on).map((e) => {
        const bgClass = e.key === 'inverse' ? 'bg-surface-primary' : 'bg-surface';
        return (
          <div key={e.key} className="border border-border-muted rounded-md p-3 bg-background">
            <div className={`${bgClass} p-4 rounded-sm border border-border-muted`}>
              <span className={`${tw('text-onSurface', e.key)} text-base font-medium`}>テキストサンプル · The quick brown fox</span>
            </div>
            <CardHeader name={`on.${e.key}`} twClass={tw('text-onSurface', e.key)} source={e.sourceValue} description={e.description} />
          </div>
        );
      })}
    </div>
  ),
};

export const Border: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ボーダー色のセマンティック token。state 色 + muted 版 (Alert container) も含む。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {list(SC.border).map((e) => (
        <div key={e.key} className="bg-surface rounded-md p-3">
          <div className={`border-2 ${tw('border-border', e.key)} h-16 rounded-sm bg-background`} />
          <CardHeader name={`border.${e.key}`} twClass={tw('border-border', e.key)} source={e.sourceValue} description={e.description} />
        </div>
      ))}
    </div>
  ),
};

export const State: Story = {
  name: 'State (overlay)',
  parameters: {
    docs: {
      description: {
        story: 'hover / active 等のオーバーレイ用 rgba token。中性 (黒) と primary / error の色味付きを使い分け。color-mix() で primitive と連動。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {list(SC.state).map((e) => (
        <div key={e.key} className="bg-surface rounded-md p-3 border border-border-muted">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative bg-background h-16 rounded-sm border border-border-muted overflow-hidden">
              <div className={`absolute inset-0 ${tw('bg-state', e.key)}`} />
              <div className="absolute bottom-1 left-2 text-xs font-mono text-onSurface-muted">on bg</div>
            </div>
            <div className={`flex-1 relative h-16 rounded-sm border border-border-muted overflow-hidden ${
              e.key.includes('error') ? 'bg-surface-error' :
              e.key.includes('primary') ? 'bg-surface-primary' : 'bg-neutral-700'
            }`}>
              <div className={`absolute inset-0 ${tw('bg-state', e.key)}`} />
              <div className="absolute bottom-1 left-2 text-xs font-mono text-onSurface-inverse">on color</div>
            </div>
          </div>
          <CardHeader name={`state.${e.key}`} twClass={tw('bg-state', e.key)} source={e.sourceValue} description={e.description} />
        </div>
      ))}
    </div>
  ),
};
