import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import typographyTokens from '../../tokens/source/typography.json';

/**
 * Semantic typography tokens の可視化カタログ。
 *
 * 入力: `tokens/source/typography.json` の `typography-semantic` セクション
 * ({hero,page,section,item}-title / body / supporting / control.{sm,md,lg} / label / caption)。
 * 表示: 実テキストを対応する Tailwind class (`type-page-title` 等) で render。
 */
const meta: Meta = {
  title: 'Tokens/Typography/Semantic',
  parameters: {
    layout: 'padded',
    // Tokens/* は値の可視化であり UI ではない → 視覚回帰対象外 (§9-4 / test-runner の axe 除外と対)。
    // token 値の変化は利用側コンポーネントの snapshot で捕捉される。
    chromatic: { disableSnapshot: true },
  },
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
  'hero-title': StyleSpec;
  'page-title': StyleSpec;
  'section-title': StyleSpec;
  'item-title': StyleSpec;
  body: StyleSpec;
  supporting: StyleSpec;
  control: Record<string, StyleSpec>;
  label: StyleSpec;
  caption: StyleSpec;
};

const formatRef = (v: string): string =>
  v.startsWith('{') ? v.slice(1, -1).replace(/^typography\./, '') : v;

const TITLE_SAMPLE = '見出しテキスト · The quick brown fox';
const BODY_SAMPLE =
  'デザインシステムは React・TypeScript・Tailwind CSS を使って構築されています。一貫した UI 品質と開発体験を提供します。';
const SUPPORTING_SAMPLE = '入力内容は保存され、次回から自動で補完されます。';
const CONTROL_SAMPLE = '予約する';
const LABEL_SAMPLE = 'フォーム入力ラベル';
const CAPTION_SAMPLE = '© 2026 design-system · 最終更新: 2026-06-04';

const StyleMeta: React.FC<{ name: string; twClass: string; spec: StyleSpec }> = ({
  name,
  twClass,
  spec,
}) => (
  <div className="flex flex-col gap-1 mt-3 text-xs font-mono">
    <code className="font-medium text-onSurface">{name}</code>
    <code className="text-onSurface-subtle">{twClass}</code>
    <code className="text-onSurface-subtle">
      font-size: <span className="text-onSurface">{formatRef(spec['font-size'].value)}</span>
    </code>
    {spec['font-weight'] && (
      <code className="text-onSurface-subtle">
        font-weight: <span className="text-onSurface">{formatRef(spec['font-weight'].value)}</span>
      </code>
    )}
    {spec['line-height'] && (
      <code className="text-onSurface-subtle">
        line-height: <span className="text-onSurface">{formatRef(spec['line-height'].value)}</span>
      </code>
    )}
    {spec['letter-spacing'] && (
      <code className="text-onSurface-subtle">
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
  ...(['hero-title', 'page-title', 'section-title', 'item-title'] as const).map((k) => ({
    name: k,
    twClass: `type-${k}`,
    spec: SEMANTIC[k],
    sample: TITLE_SAMPLE,
  })),
  { name: 'body', twClass: 'type-body', spec: SEMANTIC.body, sample: BODY_SAMPLE },
  { name: 'supporting', twClass: 'type-supporting', spec: SEMANTIC.supporting, sample: SUPPORTING_SAMPLE },
  ...(['sm', 'md', 'lg'] as const).map((k) => ({
    name: `control.${k}`,
    twClass: `type-control-${k}`,
    spec: SEMANTIC.control[k],
    sample: CONTROL_SAMPLE,
  })),
  { name: 'label', twClass: 'type-label', spec: SEMANTIC.label, sample: LABEL_SAMPLE },
  { name: 'caption', twClass: 'type-caption', spec: SEMANTIC.caption, sample: CAPTION_SAMPLE, muted: true },
];

export const Catalog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Semantic typography 全 11 token を大→小の順で一覧。`{hero,page,section,item}-title` / `body` / `supporting` / `control.{sm,md,lg}` / `label` / `caption`。各 token は font-size + font-weight + line-height + letter-spacing をセットで保持。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-prose">
      {ENTRIES.map((e) => (
        <div key={e.name} className="border border-border-subtle rounded-md p-4 bg-surface">
          <p className={`m-0 ${e.twClass} ${e.muted ? 'text-onSurface-subtle' : 'text-onSurface'}`}>
            {e.sample}
          </p>
          <StyleMeta name={e.name} twClass={e.twClass} spec={e.spec} />
        </div>
      ))}
    </div>
  ),
};
