import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import spacingTokens from '../../tokens/source/spacing.json';

/**
 * Semantic spacing tokens の可視化カタログ。
 *
 * 入力: `tokens/source/spacing.json` の `spacing-semantic` セクション
 * (component.{sm,md,lg} / section.{sm,md,lg})。
 * 表示: 各 token を実際の幅でバーとして描画 + 参照先 primitive と Tailwind class。
 *
 * 注: semantic spacing token は Tailwind の `gap-component-sm` 等の class を生成するが、
 * 現状コンポーネント実装では primitive (`gap-2` 等) を直接使っている。
 * 「component 内 / section 間」の用途別語彙を持っておく抽象として保持しているが、
 * 強制までする運用はしていない (規約上の参考トークン)。
 */
const meta: Meta = {
  title: 'Tokens/Spacing/Semantic',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type Entry = { value: string; type: string; description?: string };

const SS = (spacingTokens as any)['spacing-semantic'] as {
  component: Record<string, Entry>;
  section: Record<string, Entry>;
};

/** `{spacing.2}` → `spacing.2` */
const formatRef = (v: string): string =>
  v.startsWith('{') ? v.slice(1, -1) : v;

/** `{spacing.2}` → 8px などの px 値を解決する小ヘルパ。Tailwind が CSS 変数経由で resolve するので
 * ここでは表示用に source spacing から自前 lookup する。 */
const primitiveSpacing = (spacingTokens as any).spacing as Record<string, Entry>;
const resolvePx = (ref: string): string => {
  if (!ref.startsWith('{')) return ref;
  const key = ref.slice(1, -1).replace(/^spacing\./, '');
  return primitiveSpacing[key]?.value ?? ref;
};

const SpacingBar: React.FC<{
  category: string;
  size: string;
  spec: Entry;
}> = ({ category, size, spec }) => {
  const px = resolvePx(spec.value);
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border-muted last:border-b-0">
      <div className="w-32 flex flex-col gap-1 text-xs font-mono">
        <code className="font-semibold text-onSurface">{`${category}.${size}`}</code>
        <code className="text-onSurface-muted">{`gap-${category}-${size}`}</code>
        <code className="text-onSurface-muted">→ {formatRef(spec.value)}</code>
        <code className="text-onSurface">{px}</code>
      </div>
      <div
        className="bg-surface-primary h-6 rounded-xs"
        style={{ width: px }}
        aria-label={`width ${px}`}
      />
      {spec.description && (
        <div className="text-xs text-onSurface-muted leading-snug flex-1 max-w-md">
          {spec.description}
        </div>
      )}
    </div>
  );
};

// ── 1. Component (component 内余白) ────────────────────────

export const Component: Story = {
  parameters: {
    docs: {
      description: {
        story: 'コンポーネント内部の余白 3 段階。Button の icon-label gap や form field 内の gap 等に使う想定。',
      },
    },
  },
  render: () => (
    <div className="bg-surface border border-border-muted rounded">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SpacingBar key={size} category="component" size={size} spec={SS.component[size]} />
      ))}
    </div>
  ),
};

// ── 2. Section (section 間余白) ────────────────────────────

export const Section: Story = {
  parameters: {
    docs: {
      description: {
        story: 'セクション間の余白 3 段階。同一カテゴリ内の見出し間 (sm) / カテゴリ境界 (md) / ページ大セクション境界 (lg)。',
      },
    },
  },
  render: () => (
    <div className="bg-surface border border-border-muted rounded">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SpacingBar key={size} category="section" size={size} spec={SS.section[size]} />
      ))}
    </div>
  ),
};
