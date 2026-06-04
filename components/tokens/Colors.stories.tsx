import type { Meta, StoryObj } from '@storybook/react-vite';
import colorsToken from '../../tokens/colors.json';

const meta: Meta = {
  title: 'Tokens/Color/Primitive',
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

