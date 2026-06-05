import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import typographyTokens from '../../tokens/source/typography.json';

/**
 * Semantic typography tokens の可視化カタログ。
 *
 * 入力: `tokens/source/typography.json` の `typography-semantic` セクション
 * (heading.{display,xl,lg,md,sm} / body.{lg,md,sm} / label / caption)。
 * 表示: 実テキストを対応する Tailwind class (`text-heading-xl` 等) で render。
 */
const meta: Meta = {
  title: 'Tokens/Typography/Semantic',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type StyleSpec = {
  'font-size': { value: string };
  'font-weight'?: { value: string };
  'line-height'?: { value: string };
  'letter-spacing'?: { value: string };
};

const SEMANTIC = (typographyTokens as any)['typography-semantic'] as {
  heading: Record<string, StyleSpec>;
  body: Record<string, StyleSpec>;
  label: StyleSpec;
  caption: StyleSpec;
};

const formatRef = (v: string): string =>
  v.startsWith('{') ? v.slice(1, -1).replace(/^typography\./, '') : v;

const HEADING_SAMPLE = '見出しテキスト · The quick brown fox';
const BODY_SAMPLE =
  'デザインシステムは React・TypeScript・Tailwind CSS を使って構築されています。一貫した UI 品質と開発体験を提供します。';
const LABEL_SAMPLE = 'フォーム入力ラベル';
const CAPTION_SAMPLE = '© 2026 design-system · 最終更新: 2026-06-04';

const StyleMeta: React.FC<{ name: string; twClass: string; spec: StyleSpec }> = ({
  name,
  twClass,
  spec,
}) => (
  <div className="flex flex-col gap-1 mt-3 text-xs font-mono">
    <code className="font-semibold text-onSurface">{name}</code>
    <code className="text-onSurface-muted">{twClass}</code>
    <code className="text-onSurface-muted">
      font-size: <span className="text-onSurface">{formatRef(spec['font-size'].value)}</span>
    </code>
    {spec['font-weight'] && (
      <code className="text-onSurface-muted">
        font-weight: <span className="text-onSurface">{formatRef(spec['font-weight'].value)}</span>
      </code>
    )}
    {spec['line-height'] && (
      <code className="text-onSurface-muted">
        line-height: <span className="text-onSurface">{formatRef(spec['line-height'].value)}</span>
      </code>
    )}
    {spec['letter-spacing'] && (
      <code className="text-onSurface-muted">
        letter-spacing: <span className="text-onSurface">{formatRef(spec['letter-spacing'].value)}</span>
      </code>
    )}
  </div>
);

type Entry = {
  name: string;
  twClass: string;
  spec: StyleSpec;
  sample: string;
  /** caption は muted で表示する慣習なのでフラグで切替 */
  muted?: boolean;
};

const ENTRIES: Entry[] = [
  ...(['display', 'xl', 'lg', 'md', 'sm'] as const).map((k) => ({
    name: `heading.${k}`,
    twClass: `text-heading-${k}`,
    spec: SEMANTIC.heading[k],
    sample: HEADING_SAMPLE,
  })),
  ...(['lg', 'md', 'sm'] as const).map((k) => ({
    name: `body.${k}`,
    twClass: `text-body-${k}`,
    spec: SEMANTIC.body[k],
    sample: BODY_SAMPLE,
  })),
  { name: 'label', twClass: 'text-label', spec: SEMANTIC.label, sample: LABEL_SAMPLE },
  { name: 'caption', twClass: 'text-caption', spec: SEMANTIC.caption, sample: CAPTION_SAMPLE, muted: true },
];

export const Catalog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Semantic typography 全 10 token を大→小の順で一覧。`heading.{display,xl,lg,md,sm}` / `body.{lg,md,sm}` / `label` / `caption`。各 token は font-size + font-weight + line-height + letter-spacing をセットで保持。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-prose">
      {ENTRIES.map((e) => (
        <div key={e.name} className="border border-border-subtle rounded-md p-4 bg-surface">
          <p className={`m-0 ${e.twClass} ${e.muted ? 'text-onSurface-muted' : 'text-onSurface'}`}>
            {e.sample}
          </p>
          <StyleMeta name={e.name} twClass={e.twClass} spec={e.spec} />
        </div>
      ))}
    </div>
  ),
};
