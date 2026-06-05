import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import semanticColors from '../../tokens/source/semantic-colors.json';

/**
 * Semantic color tokens の可視化カタログ。
 *
 * 入力: `tokens/source/semantic-colors.json` (`{ value, type, description }` 構造)。
 * 表示: 各 token を Tailwind class + description + 視覚プレビューで一覧。
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

// ── Background ───────────────────────────────────────────────

export const Background: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ページ最下層の背景。brand から独立した中性、下流 product が brand を変えても変わらない。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {pick(SC.bg, ['default']).map((e) => (
        <div key={e.key} className="border border-border-subtle rounded-md p-3 bg-surface">
          <div className="bg-background h-16 rounded-sm border border-border-subtle" />
          <CardHeader name={`bg.${e.key}`} twClass="bg-background" source={e.sourceValue} description={e.description} />
        </div>
      ))}
    </div>
  ),
};

// ── Surface ──────────────────────────────────────────────────

const SURFACE_ORDER = [
  'layer-1', 'layer-2', 'layer-3',
  'inset', 'overlay',
  'primary', 'secondary',
  'success', 'success-muted',
  'error', 'error-muted',
  'warning', 'warning-muted',
  'info', 'info-muted',
  'disabled', 'skeleton', 'neutral',
];

const SurfaceCard: React.FC<{ entry: ReturnType<typeof pick>[number] }> = ({ entry }) => (
  <div className="border border-border-subtle rounded-md p-3 bg-background">
    <div className={`${tw('bg-surface', entry.key)} h-16 rounded-sm border border-border-subtle`} />
    <CardHeader
      name={`surface.${entry.key}`}
      twClass={tw('bg-surface', entry.key)}
      source={entry.sourceValue}
      description={entry.description}
    />
  </div>
);

export const Surface: Story = {
  parameters: {
    docs: {
      description: {
        story: 'カード / モーダル / 役割色の塗り。階層 (`layer-1/2/3`) → 特殊役割 (`inset`/`overlay`) → Brand → 機能色 → 状態マーカーの順で並ぶ。機能色の組合せは Container Pairs story を参照。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {pick(SC.surface, SURFACE_ORDER).map((e) => <SurfaceCard key={e.key} entry={e} />)}
    </div>
  ),
};

// ── Text (on) ────────────────────────────────────────────────

const ON_ORDER = [
  'default', 'soft', 'muted',
  'primary', 'success', 'error', 'warning', 'info',
  'disabled', 'inverse',
];

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
        story: 'surface に載せるテキスト色。階層 (`default`/`soft`/`muted`) → 役割 (`primary`/`success`/...) → 状態 (`disabled`/`inverse`) の順。`inverse` は色付き背景に載せる白文字。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {pick(SC.on, ON_ORDER).map((e) => <OnTextCard key={e.key} entry={e} />)}
    </div>
  ),
};

// ── Border ───────────────────────────────────────────────────

const BORDER_ORDER = [
  'subtle', 'default', 'strong', 'emphasis',
  'success-subtle', 'success-emphasis',
  'error-subtle', 'error-emphasis',
  'warning-subtle', 'warning-emphasis',
  'info-subtle', 'info-emphasis',
  'focus',
];

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
        story: 'ボーダー色。強度軸 (`subtle`/`default`/`strong`/`emphasis`) → 機能色 × 強度 → `focus` の順。`focus` はキーボード focus リング兼 brand selected 状態。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {pick(SC.border, BORDER_ORDER).map((e) => <BorderCard key={e.key} entry={e} />)}
    </div>
  ),
};

// ── State (overlay) ──────────────────────────────────────────

const STATE_ORDER = [
  'hover', 'active',
  'hover-primary', 'active-primary',
  'hover-error', 'active-error',
];

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
        story: 'hover / active のオーバーレイ。中性 (どの背景にも汎用) → 色付き (白系背景に brand / error 色味を重ねる) の順。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {pick(SC.state, STATE_ORDER).map((e) => <StateCard key={e.key} entry={e} />)}
    </div>
  ),
};

// ── Container Pairs ──────────────────────────────────────────

type PairRole = {
  role: 'success' | 'error' | 'warning' | 'info';
  label: string;
};
const PAIR_ROLES: PairRole[] = [
  { role: 'success', label: '成功' },
  { role: 'error', label: 'エラー' },
  { role: 'warning', label: '警告' },
  { role: 'info', label: '情報' },
];

const PairRow: React.FC<{ pair: PairRole }> = ({ pair }) => {
  const { role, label } = pair;
  const solidTokens = [
    `surface.${role}`,
    `on.inverse`,
    `border.${role}-emphasis`,
  ];
  const softTokens = [
    `surface.${role}-muted`,
    `on.${role}`,
    `border.${role}-subtle`,
  ];

  return (
    <section className="border border-border-subtle rounded-md p-4 bg-surface flex flex-col gap-3">
      <h4 className="text-heading-xs m-0 text-onSurface">{label} ({role})</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <code className="text-xs font-mono text-onSurface-muted">強い塗り (Badge / dot) — 主張</code>
          <div className={`bg-surface-${role} border-2 border-border-${role}-emphasis rounded-md p-3 flex items-center gap-2`}>
            <span className="inline-block w-2 h-2 rounded-full bg-onSurface-inverse" />
            <span className="text-onSurface-inverse text-sm font-medium">{label}バッジ</span>
          </div>
          <ul className="m-0 pl-4 text-xs text-onSurface-muted flex flex-col gap-0.5">
            {solidTokens.map((t) => <li key={t}><code className="font-mono">{t}</code></li>)}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <code className="text-xs font-mono text-onSurface-muted">薄い塗り (Alert / 通知) — 落ち着き</code>
          <div className={`bg-surface-${role}-muted border border-border-${role}-subtle rounded-md p-3`}>
            <p className={`m-0 text-sm text-onSurface-${role} font-medium`}>{label}メッセージ</p>
            <p className="m-0 mt-1 text-xs text-onSurface-muted">補助テキスト・詳細説明など</p>
          </div>
          <ul className="m-0 pl-4 text-xs text-onSurface-muted flex flex-col gap-0.5">
            {softTokens.map((t) => <li key={t}><code className="font-mono">{t}</code></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const ContainerPairs: Story = {
  name: 'Container Pairs',
  parameters: {
    docs: {
      description: {
        story: '機能色 (success / error / warning / info) は 2 つの使い方がある: **強い塗り** (Badge / dot 等で目立たせる、白文字を載せる) と **薄い塗り** (Alert 背景等で落ち着かせる、role 色の濃い文字を載せる)。役割ごとに `surface` / `on` / `border` の token クラスタを 2 パターン併記。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {PAIR_ROLES.map((p) => <PairRow key={p.role} pair={p} />)}
    </div>
  ),
};
