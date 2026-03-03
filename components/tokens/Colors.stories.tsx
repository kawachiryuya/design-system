import type { Meta, StoryObj } from '@storybook/react';
import colorsToken from '../../tokens/colors.json';

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const SHADES: Shade[] = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const PALETTE_LABELS: Record<string, string> = {
  primary: 'Primary (Teal)',
  neutral: 'Neutral (Gray)',
  success: 'Success (Green)',
  error: 'Error (Red)',
  warning: 'Warning (Orange)',
  info: 'Info (Blue)',
};

type PaletteEntry = { name: string; label: string; colors: Record<Shade, string> };

const ALL_PALETTES: Record<string, PaletteEntry> = Object.fromEntries(
  Object.entries(colorsToken)
    .filter(([key]) => key in PALETTE_LABELS)
    .map(([name, colors]) => [name, { name, label: PALETTE_LABELS[name], colors: colors as Record<Shade, string> }]),
);

const FUNCTIONAL_PALETTES: PaletteEntry[] = ['success', 'error', 'warning', 'info'].map((k) => ALL_PALETTES[k]);

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function ColorSwatch({ shade, hex }: { shade: string; hex: string }) {
  const dark = isDark(hex);
  return (
    <div
      style={{
        backgroundColor: hex,
        padding: '12px 8px',
        borderRadius: shade === '50' ? '8px 8px 0 0' : shade === '900' ? '0 0 8px 8px' : '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 600, color: dark ? '#FFFFFF' : '#171717' }}>
        {shade}
      </span>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)' }}>
        {hex}
      </span>
    </div>
  );
}

function PaletteBlock({ palette }: { palette: PaletteEntry }) {
  return (
    <div style={{ minWidth: '180px', flex: '1 1 180px' }}>
      <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#404040' }}>
        {palette.label}
      </p>
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E5E5' }}>
        {SHADES.map((shade) => (
          <ColorSwatch key={shade} shade={shade} hex={palette.colors[shade]} />
        ))}
      </div>
    </div>
  );
}

export const Palettes: Story = {
  name: 'グローバルカラー',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Global Colors
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        OKLCH ベースで知覚明度を統一したカラーパレット。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>colors</code> に統合済み。
      </p>

      {/* 1段目: White / Black */}
      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600, color: '#404040' }}>
        Base
      </h3>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'White', hex: colorsToken.base.white, tw: 'white' },
          { label: 'Black', hex: colorsToken.base.black, tw: 'black' },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: item.hex,
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
              }}
            />
            <p style={{ margin: '8px 0 2px', fontSize: '13px', fontWeight: 600, color: '#404040' }}>
              {item.label}
            </p>
            <p style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace', color: '#737373' }}>
              {item.hex}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'monospace', color: '#737373' }}>
              bg-{item.tw}
            </p>
          </div>
        ))}
      </div>

      {/* 2段目: Neutral (Grayscale) */}
      <div style={{ marginBottom: '40px' }}>
        <PaletteBlock palette={ALL_PALETTES['neutral']} />
      </div>

      {/* 3段目: Primary */}
      <div style={{ marginBottom: '40px' }}>
        <PaletteBlock palette={ALL_PALETTES['primary']} />
      </div>

      {/* 4段目: 機能色 (Success / Error / Warning / Info) */}
      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600, color: '#404040' }}>
        機能色
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {FUNCTIONAL_PALETTES.map((palette) => (
          <PaletteBlock key={palette.name} palette={palette} />
        ))}
      </div>
    </div>
  ),
};

/* ─── Semantic Colors ─── */

import semanticTokens from '../../tokens/semantic-colors.json';

type SemanticEntry = { value: string; description: string };

function resolveColor(ref: string): string {
  if (ref === 'white') return colorsToken.base.white;
  if (ref === 'black') return colorsToken.base.black;
  const alphaMatch = ref.match(/^(black|white)\/(\d+)$/);
  if (alphaMatch) {
    const base = alphaMatch[1] === 'black' ? '0, 0, 0' : '255, 255, 255';
    return `rgba(${base}, ${parseInt(alphaMatch[2], 10) / 100})`;
  }
  const [palette, shade] = ref.split('-');
  const p = colorsToken[palette as keyof typeof colorsToken];
  if (p && typeof p === 'object' && shade in p) {
    return (p as Record<string, string>)[shade];
  }
  return ref;
}

function isLightColor(ref: string): boolean {
  if (ref === 'white' || ref.endsWith('-50') || ref.endsWith('-100')) return true;
  if (ref.startsWith('black/') || ref.startsWith('white/')) return true;
  return false;
}

type CategoryConfig = {
  key: string;
  label: string;
  description: string;
  cssPrefix: string;
  twPrefix: string;
};

const CATEGORIES: CategoryConfig[] = [
  { key: 'background', label: 'Background', description: 'ページ最下層の背景色。ダークモード時に切り替わる基盤レイヤー。', cssPrefix: '--color-bg', twPrefix: 'bg-background' },
  { key: 'surface', label: 'Surface', description: 'カード・モーダル等のコンポーネント背景。background の上に載るレイヤー。', cssPrefix: '--color-surface', twPrefix: 'bg-surface' },
  { key: 'onSurface', label: 'On Surface', description: 'テキスト・アイコンの色。surface / background 上に配置される前景要素。', cssPrefix: '--color-on', twPrefix: 'text-onSurface' },
  { key: 'border', label: 'Border', description: 'ボーダー・区切り線・フォーカスリング。', cssPrefix: '--color-border', twPrefix: 'border-border' },
  { key: 'state', label: 'State', description: 'hover / active / dragged の透過オーバーレイレイヤー。色定義ではなく透過で表現。', cssPrefix: '--color-state', twPrefix: 'bg-state' },
];

function SemanticTokenRow({ name, entry, cssPrefix, twPrefix }: { name: string; entry: SemanticEntry; cssPrefix: string; twPrefix: string }) {
  const resolved = resolveColor(entry.value);
  const light = isLightColor(entry.value);
  const isTransparent = entry.value.includes('/');
  const cssVar = `${cssPrefix}-${name}`;
  const twClass = name === 'default' ? twPrefix : `${twPrefix}-${name}`;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto auto auto',
        gap: '12px',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #E5E5E5',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Swatch */}
      <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: light ? '1px solid #E5E5E5' : 'none' }}>
        {isTransparent && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-conic-gradient(#E5E5E5 0% 25%, #FFFFFF 0% 50%)',
            backgroundSize: '8px 8px',
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: resolved }} />
      </div>
      {/* Name + description */}
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#171717' }}>{name}</p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#737373' }}>{entry.description}</p>
      </div>
      {/* Tailwind class */}
      <code style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#F5F5F5', padding: '3px 8px', borderRadius: '4px', color: '#525252', whiteSpace: 'nowrap' }}>
        {twClass}
      </code>
      {/* CSS var */}
      <code style={{ fontSize: '11px', fontFamily: 'monospace', color: '#737373', whiteSpace: 'nowrap' }}>
        {cssVar}
      </code>
      {/* Resolved value */}
      <code style={{ fontSize: '11px', fontFamily: 'monospace', color: '#737373', textAlign: 'right', whiteSpace: 'nowrap', minWidth: '80px' }}>
        {resolved}
      </code>
    </div>
  );
}

function SemanticCategory({ config }: { config: CategoryConfig }) {
  const tokens = semanticTokens[config.key as keyof typeof semanticTokens] as Record<string, SemanticEntry>;

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#171717' }}>
        {config.label}
      </h3>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#737373' }}>
        {config.description}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Object.entries(tokens).map(([name, entry]) => (
          <SemanticTokenRow key={name} name={name} entry={entry} cssPrefix={config.cssPrefix} twPrefix={config.twPrefix} />
        ))}
      </div>
    </div>
  );
}

export const Semantic: Story = {
  name: 'セマンティックカラー',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Semantic Colors
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
        用途別に分類したセマンティックカラートークン。
        第1軸 <strong>WHERE</strong>（どこに塗るか）× 第2軸 <strong>WHAT</strong>（どんな意図か）で構成。
        CSS custom properties で定義し、ダークモード切り替えに対応可能。
      </p>

      {CATEGORIES.map((config) => (
        <SemanticCategory key={config.key} config={config} />
      ))}

      {/* Usage Example */}
      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600, color: '#171717' }}>
        Usage Example — Alert コンポーネント
      </h3>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        {/* Live demo using CSS vars */}
        <div style={{
          backgroundColor: 'var(--color-surface-error)',
          border: '1px solid var(--color-border-error)',
          borderRadius: '8px',
          padding: '16px',
          minWidth: '320px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-on-error)', fontSize: '16px' }}>&#9888;</span>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--color-on-error)' }}>
              エラーが発生しました
            </p>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-on-default)' }}>
            入力内容を確認してください。
          </p>
        </div>

        {/* Mapping table */}
        <table style={{ fontSize: '13px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 16px 6px 0', borderBottom: '1px solid #E5E5E5', color: '#737373', fontWeight: 500 }}>要素</th>
              <th style={{ textAlign: 'left', padding: '6px 0', borderBottom: '1px solid #E5E5E5', color: '#737373', fontWeight: 500 }}>Tailwind クラス</th>
            </tr>
          </thead>
          <tbody>
            {[
              { element: '背景', tw: 'bg-surface-error' },
              { element: 'ボーダー', tw: 'border-border-error' },
              { element: 'アイコン・タイトル', tw: 'text-onSurface-error' },
              { element: '本文テキスト', tw: 'text-onSurface' },
            ].map((row) => (
              <tr key={row.element}>
                <td style={{ padding: '6px 16px 6px 0', color: '#171717' }}>{row.element}</td>
                <td style={{ padding: '6px 0' }}>
                  <code style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px', color: '#525252' }}>
                    {row.tw}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};
