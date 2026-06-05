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

const SAMPLE = '見出しテキスト · The quick brown fox';
const BODY_SAMPLE =
  'デザインシステムは React・TypeScript・Tailwind CSS を使って構築されています。一貫した UI 品質と開発体験を提供します。';

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

export const Headings: Story = {
  parameters: {
    docs: {
      description: {
        story: '見出し用 5 段階 (display / xl / lg / md / sm)。`text-heading-{key}` utility、Typography component の `variant="display" | "h1" | "h2" | "h3" | "h4"` にマッピング。',
      },
    },
  },
  render: () => {
    const order: Array<keyof typeof SEMANTIC.heading> = ['display', 'xl', 'lg', 'md', 'sm'];
    return (
      <div className="flex flex-col gap-6">
        {order.map((key) => {
          const spec = SEMANTIC.heading[key];
          const twClass = `text-heading-${key}`;
          return (
            <div key={key} className="border border-border-muted rounded-md p-4 bg-surface">
              <div className={`${twClass} text-onSurface`}>{SAMPLE}</div>
              <StyleMeta name={`heading.${key}`} twClass={twClass} spec={spec} />
            </div>
          );
        })}
      </div>
    );
  },
};

export const Body: Story = {
  parameters: {
    docs: {
      description: {
        story: '本文用 3 段階 (lg / md / sm)。`text-body-{key}` utility、Typography component の `variant="body-lg" | "body" | "body-sm"` にマッピング。',
      },
    },
  },
  render: () => {
    const order: Array<keyof typeof SEMANTIC.body> = ['lg', 'md', 'sm'];
    return (
      <div className="flex flex-col gap-6 max-w-prose">
        {order.map((key) => {
          const spec = SEMANTIC.body[key];
          const twClass = `text-body-${key}`;
          return (
            <div key={key} className="border border-border-muted rounded-md p-4 bg-surface">
              <p className={`${twClass} text-onSurface`}>{BODY_SAMPLE}</p>
              <StyleMeta name={`body.${key}`} twClass={twClass} spec={spec} />
            </div>
          );
        })}
      </div>
    );
  },
};

export const LabelAndCaption: Story = {
  name: 'Label & Caption',
  parameters: {
    docs: {
      description: {
        story: 'フォームラベル用 `label` (14px medium) と注釈用 `caption` (12px regular)。Typography component の `variant="label" | "caption"` にマッピング。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-prose">
      <div className="border border-border-muted rounded-md p-4 bg-surface">
        <span className="text-label text-onSurface">フォーム入力ラベル</span>
        <StyleMeta name="label" twClass="text-label" spec={SEMANTIC.label} />
      </div>
      <div className="border border-border-muted rounded-md p-4 bg-surface">
        <p className="text-caption text-onSurface-muted">© 2026 design-system · 最終更新: 2026-06-04</p>
        <StyleMeta name="caption" twClass="text-caption" spec={SEMANTIC.caption} />
      </div>
    </div>
  ),
};
