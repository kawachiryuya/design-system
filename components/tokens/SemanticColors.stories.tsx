import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import semanticColors from '../../tokens/source/semantic-colors.json';

/**
 * Semantic color tokens の可視化カタログ。
 *
 * 入力: `tokens/source/semantic-colors.json` (source、`{ value, type, description }` 構造)。
 * 表示: グループごとに sub-section 分けし、各 token の Tailwind class + description + 視覚プレビューを描画。
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

/** group の subset を抽出 (順序は keys の通り、未定義 key はスキップ) */
const pick = (group: Record<string, Entry>, keys: string[]) =>
  keys
    .filter((k) => group[k] !== undefined)
    .map((key) => ({
      key,
      description: group[key].description ?? '',
      sourceValue: formatValue(group[key].value),
    }));

const Section: React.FC<{ title: string; intro?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  intro,
  children,
}) => (
  <section className="flex flex-col gap-3">
    <div>
      <h3 className="text-heading-sm m-0 text-onSurface">{title}</h3>
      {intro && <p className="m-0 mt-1 text-body-sm text-onSurface-muted">{intro}</p>}
    </div>
    {children}
  </section>
);

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

// ── Surface ──────────────────────────────────────────────────
// グループ: Layer 階層 / 特殊役割 / Brand / Functional (intense + container) / State indicator

const SURFACE_LAYER = ['layer-1', 'layer-2', 'layer-3'];
const SURFACE_SPECIAL = ['inset', 'overlay'];
const SURFACE_BRAND = ['primary', 'secondary'];
const SURFACE_FUNCTIONAL = [
  'success', 'success-muted',
  'error', 'error-muted',
  'warning', 'warning-muted',
  'info', 'info-muted',
];
const SURFACE_STATE = ['disabled', 'skeleton', 'neutral'];

const SurfaceCard: React.FC<{ entry: ReturnType<typeof pick>[number]; prefix?: string }> = ({
  entry,
  prefix = 'surface',
}) => (
  <div className="border border-border-subtle rounded-md p-3 bg-background">
    <div className={`${tw('bg-surface', entry.key)} h-16 rounded-sm border border-border-subtle`} />
    <CardHeader
      name={`${prefix}.${entry.key}`}
      twClass={tw('bg-surface', entry.key)}
      source={entry.sourceValue}
      description={entry.description}
    />
  </div>
);

export const Background: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ページ最下層の canvas (`bg.default`)。brand から独立した中性、bg-background utility 経由で参照。Surface (elevated 層) とは別 namespace。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <Section title="bg (ページ最下層)" intro="brand から独立した中性 canvas。下流 product が brand を override しても bg は変わらない (Multi-product hub 設計)。">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pick(SC.bg, ['default']).map((e) => (
            <div key={e.key} className="border border-border-subtle rounded-md p-3 bg-surface">
              <div className="bg-background h-16 rounded-sm border border-border-subtle" />
              <CardHeader name={`bg.${e.key}`} twClass="bg-background" source={e.sourceValue} description={e.description} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Surface: Story = {
  parameters: {
    docs: {
      description: {
        story: 'コンテンツサーフェス (`surface.*`)。Layer 階層 / 特殊役割 / Brand / Functional / State indicator の 5 グループに分類。Background (`bg.default`) は別 story 参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <Section title="Layer 階層 (depth)" intro="ページ→入れ子→深い入れ子の elevation 階層 (Carbon 流 numeric)。bg-surface (DEFAULT) は layer-1 を指す。">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pick(SC.surface, SURFACE_LAYER).map((e) => <SurfaceCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="特殊役割" intro="depth 軸とは別の用途 (input 凹み / modal 背景マスク)。">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pick(SC.surface, SURFACE_SPECIAL).map((e) => <SurfaceCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="Brand" intro="Primary ボタンや選択状態の brand 色。primary (intense) と secondary (container) のペア。">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pick(SC.surface, SURFACE_BRAND).map((e) => <SurfaceCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="Functional (Container ペア)" intro="success/error/warning/info の状態色。intense (X) + container (X-muted) のペア。Alert / Badge solid 等で利用。">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pick(SC.surface, SURFACE_FUNCTIONAL).map((e) => <SurfaceCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="State indicator" intro="disabled / skeleton / status marker (offline 等) 用。container 単独で text counterpart は不要 (status は小さな塗りなので)。">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pick(SC.surface, SURFACE_STATE).map((e) => <SurfaceCard key={e.key} entry={e} />)}
        </div>
      </Section>
    </div>
  ),
};

// ── Text (on) ────────────────────────────────────────────────
// グループ: Hierarchy / Role / State

const ON_HIERARCHY = ['default', 'soft', 'muted'];
const ON_ROLE = ['primary', 'success', 'error', 'warning', 'info'];
const ON_STATE = ['disabled', 'inverse'];

const OnTextCard: React.FC<{ entry: ReturnType<typeof pick>[number] }> = ({ entry }) => {
  const bgClass = entry.key === 'inverse' ? 'bg-surface-primary' : 'bg-surface';
  return (
    <div className="border border-border-subtle rounded-md p-3 bg-background">
      <div className={`${bgClass} p-4 rounded-sm border border-border-subtle`}>
        <span className={`${tw('text-onSurface', entry.key)} text-base font-medium`}>
          テキストサンプル · The quick brown fox
        </span>
      </div>
      <CardHeader
        name={`on.${entry.key}`}
        twClass={tw('text-onSurface', entry.key)}
        source={entry.sourceValue}
        description={entry.description}
      />
    </div>
  );
};

export const Text: Story = {
  name: 'Text (on)',
  parameters: {
    docs: {
      description: {
        story: 'テキスト色のセマンティック token。Hierarchy 軸 (default/soft/muted)、Role 軸 (primary/success/error/warning/info)、State 軸 (disabled/inverse) の 3 グループに分類。`inverse` は色面背景上で白文字。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <Section title="Hierarchy (階層)" intro="主テキスト → 副テキスト → 補助テキストの 3 段。Material 3 / Polaris 流の階層軸。">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pick(SC.on, ON_HIERARCHY).map((e) => <OnTextCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="Role (役割)" intro="brand 色 (primary) と状態色 (success/error/warning/info) の役割別。Link や状態通知メッセージで使う。">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pick(SC.on, ON_ROLE).map((e) => <OnTextCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="State (状態)" intro="disabled は操作不能、inverse は色面背景上の反転テキスト (Primary ボタン等)。">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pick(SC.on, ON_STATE).map((e) => <OnTextCard key={e.key} entry={e} />)}
        </div>
      </Section>
    </div>
  ),
};

// ── Border ───────────────────────────────────────────────────
// グループ: 強度軸 (neutral) / Role × intensity / Interactive

const BORDER_INTENSITY = ['subtle', 'default', 'strong', 'emphasis'];
const BORDER_ROLE = [
  'success-subtle', 'success-emphasis',
  'error-subtle', 'error-emphasis',
  'warning-subtle', 'warning-emphasis',
  'info-subtle', 'info-emphasis',
];
const BORDER_INTERACTIVE = ['focus'];

const BorderCard: React.FC<{ entry: ReturnType<typeof pick>[number] }> = ({ entry }) => (
  <div className="bg-surface rounded-md p-3">
    <div className={`border-2 ${tw('border-border', entry.key)} h-16 rounded-sm bg-background`} />
    <CardHeader
      name={`border.${entry.key}`}
      twClass={tw('border-border', entry.key)}
      source={entry.sourceValue}
      description={entry.description}
    />
  </div>
);

export const Border: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ボーダー色のセマンティック token。強度軸 (subtle/default/strong/emphasis) / Role × intensity / Interactive の 3 グループ。Primer 流の {role}-{intensity} 命名。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <Section title="強度軸 (neutral)" intro="subtle → default → strong → emphasis の 4 段。container 枠 / 区切り / 強調枠など neutral border の用途別。">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pick(SC.border, BORDER_INTENSITY).map((e) => <BorderCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="Role × intensity" intro="success/error/warning/info の機能色 × subtle (container 枠、Alert 等) / emphasis (強調枠、Badge outline 等) のペア。">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pick(SC.border, BORDER_ROLE).map((e) => <BorderCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="Interactive" intro="focus ring 用 (キーボード focus + Branded selected の interactive 表現)。強度軸とは独立。">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pick(SC.border, BORDER_INTERACTIVE).map((e) => <BorderCard key={e.key} entry={e} />)}
        </div>
      </Section>
    </div>
  ),
};

// ── State (overlay) ──────────────────────────────────────────
// グループ: 中性 / 色付き

const STATE_NEUTRAL = ['hover', 'active'];
const STATE_TINTED = ['hover-primary', 'active-primary', 'hover-error', 'active-error'];

const StateCard: React.FC<{ entry: ReturnType<typeof pick>[number] }> = ({ entry }) => (
  <div className="bg-surface rounded-md p-3 border border-border-subtle">
    <div className="flex gap-2 mb-3">
      <div className="flex-1 relative bg-background h-16 rounded-sm border border-border-subtle overflow-hidden">
        <div className={`absolute inset-0 ${tw('bg-state', entry.key)}`} />
        <div className="absolute bottom-1 left-2 text-xs font-mono text-onSurface-muted">on bg</div>
      </div>
      <div className={`flex-1 relative h-16 rounded-sm border border-border-subtle overflow-hidden ${
        entry.key.includes('error') ? 'bg-surface-error' :
        entry.key.includes('primary') ? 'bg-surface-primary' : 'bg-neutral-700'
      }`}>
        <div className={`absolute inset-0 ${tw('bg-state', entry.key)}`} />
        <div className="absolute bottom-1 left-2 text-xs font-mono text-onSurface-inverse">on color</div>
      </div>
    </div>
    <CardHeader
      name={`state.${entry.key}`}
      twClass={tw('bg-state', entry.key)}
      source={entry.sourceValue}
      description={entry.description}
    />
  </div>
);

export const State: Story = {
  name: 'State (overlay)',
  parameters: {
    docs: {
      description: {
        story: 'hover / active のオーバーレイ token。中性 (どの背景にも汎用)、色付き (白系背景に brand/error tint を重ねる) の 2 グループ。color-mix() で primitive と連動 (outputReferences 経由でランタイム brand override も伝播)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <Section title="中性 overlay" intro="rgba 黒で汎用的に重ねる。Primary Button (緑bg) や Pagination 等で利用。dark mode では rgba 白に反転する想定 (将来対応)。">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pick(SC.state, STATE_NEUTRAL).map((e) => <StateCard key={e.key} entry={e} />)}
        </div>
      </Section>

      <Section title="色付き overlay (tinted)" intro="白系背景に brand (teal) / error (red) 色味を重ねる。Secondary/Tertiary/Destructive Button 等で brand 感を保持。">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pick(SC.state, STATE_TINTED).map((e) => <StateCard key={e.key} entry={e} />)}
        </div>
      </Section>
    </div>
  ),
};
