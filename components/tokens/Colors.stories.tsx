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
            <p style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace', color: '#A3A3A3' }}>
              {item.hex}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'monospace', color: '#A3A3A3' }}>
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

export const Semantic: Story = {
  name: 'セマンティックカラー',
  render: () => {
    const semanticColors = [
      { role: 'Primary — アクション・リンク・フォーカス', token: 'primary.600', tw: 'primary-600', color: colorsToken.primary['600'], usage: 'CTA, フォーカスリング, リンク' },
      { role: 'Success — 成功・完了', token: 'success.600', tw: 'success-600', color: colorsToken.success['600'], usage: '保存完了, バリデーション成功' },
      { role: 'Error — エラー・失敗', token: 'error.600', tw: 'error-600', color: colorsToken.error['600'], usage: 'フォームエラー, 削除, 警告' },
      { role: 'Warning — 注意', token: 'warning.600', tw: 'warning-600', color: colorsToken.warning['600'], usage: '注意喚起, 非推奨の操作' },
      { role: 'Info — 情報', token: 'info.600', tw: 'info-600', color: colorsToken.info['600'], usage: 'ヘルプテキスト, ステータス情報' },
      { role: 'Neutral — テキスト', token: 'neutral.900', tw: 'neutral-900', color: colorsToken.neutral['900'], usage: '本文テキスト' },
      { role: 'Neutral — サブテキスト', token: 'neutral.500', tw: 'neutral-500', color: colorsToken.neutral['500'], usage: 'ヘルプテキスト, プレースホルダー' },
      { role: 'Neutral — ボーダー', token: 'neutral.300', tw: 'neutral-300', color: colorsToken.neutral['300'], usage: '区切り線, 入力枠' },
      { role: 'Neutral — 背景', token: 'neutral.50', tw: 'neutral-50', color: colorsToken.neutral['50'], usage: 'ページ背景, カード背景' },
      { role: 'Base — 白', token: 'base.white', tw: 'white', color: colorsToken.base.white, usage: 'カード背景, テキスト（ダーク上）' },
      { role: 'Base — 黒', token: 'base.black', tw: 'black', color: colorsToken.base.black, usage: '最大コントラストのテキスト' },
    ];

    return (
      <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
          Semantic Colors
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {semanticColors.map((item) => (
            <div
              key={item.token}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: item.color,
                  flexShrink: 0,
                  border: (item.color === colorsToken.neutral['50'] || item.color === colorsToken.base.white) ? '1px solid #E5E5E5' : 'none',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#171717' }}>
                  {item.role}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#737373' }}>
                  用途: {item.usage}
                </p>
              </div>
              <code style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                backgroundColor: '#F5F5F5',
                padding: '3px 8px',
                borderRadius: '4px',
                color: '#525252',
                flexShrink: 0,
              }}>
                {item.token}
              </code>
              <code style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#A3A3A3',
                flexShrink: 0,
                minWidth: '80px',
                textAlign: 'right',
              }}>
                {item.color}
              </code>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#A3A3A3', flexShrink: 0 }}>
                bg-{item.tw} / text-{item.tw}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
