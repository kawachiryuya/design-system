import type { Meta, StoryObj } from '@storybook/react-vite';
import colorsToken from '../../tokens/source/colors.json';
import { TokenPageHeader, TokenSectionHeading } from '@sb-blocks/TokenPageHeader';

const meta: Meta = {
  title: 'Tokens/Color/Primitive',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

const PALETTE_LABELS: Record<string, string> = {
  primary: 'Primary (Teal)',
  neutral: 'Neutral (Gray)',
  success: 'Success (Green)',
  error: 'Error (Red)',
  warning: 'Warning (Orange)',
  info: 'Info (Blue)',
};

type Palette = { name: string; label: string; shades: Record<string, string> };
type ShadeEntry = { value: string; type: string };

const extractShades = (palette: Record<string, ShadeEntry>): Record<string, string> =>
  Object.fromEntries(Object.entries(palette).map(([k, v]) => [k, v.value]));

const ALL_PALETTES: Record<string, Palette> = Object.fromEntries(
  Object.entries(colorsToken.color)
    .filter(([key]) => key in PALETTE_LABELS)
    .map(([name, palette]) => [
      name,
      {
        name,
        label: PALETTE_LABELS[name],
        shades: extractShades(palette as Record<string, ShadeEntry>),
      },
    ]),
);

const FUNCTIONAL_PALETTES: Palette[] = ['success', 'error', 'warning', 'info'].map(
  (k) => ALL_PALETTES[k],
);

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function ColorSwatch({
  shade,
  hex,
  isFirst,
  isLast,
}: { shade: string; hex: string; isFirst: boolean; isLast: boolean }) {
  const dark = isDark(hex);
  return (
    <div
      className="flex justify-between items-center px-2 py-3"
      style={{
        backgroundColor: hex,
        borderRadius: isFirst ? '8px 8px 0 0' : isLast ? '0 0 8px 8px' : '0',
        color: dark ? '#FFFFFF' : '#171717',
      }}
    >
      <span className="text-xs font-semibold">{shade}</span>
      <span
        className="text-[11px] font-mono"
        style={{ color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)' }}
      >
        {hex}
      </span>
    </div>
  );
}

function PaletteBlock({ palette }: { palette: Palette }) {
  const shades = Object.keys(palette.shades);
  return (
    <div className="min-w-[180px] flex-1 basis-[180px]">
      <p className="text-body-sm font-semibold text-onSurface m-0 mb-2">{palette.label}</p>
      <div className="rounded-md overflow-hidden border border-border-muted">
        {shades.map((shade, i) => (
          <ColorSwatch
            key={shade}
            shade={shade}
            hex={palette.shades[shade]}
            isFirst={i === 0}
            isLast={i === shades.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export const Palettes: Story = {
  name: 'グローバルカラー',
  render: () => (
    <div>
      <TokenPageHeader
        title="Global Colors"
        intro="OKLCH ベースで知覚明度を統一したカラーパレット。Tailwind の colors に統合済み。各 palette の shade は semantic-colors.json から参照されて bg-surface-* / text-onSurface-* / border-border-* 等の utility になる (実装では semantic 経由で参照、primitive 直接利用は禁止)。"
        utility="bg-{palette}-{shade} / text-{palette}-{shade} (※ 利用は禁止、semantic 経由で)"
      />

      <TokenSectionHeading>Base</TokenSectionHeading>
      <div className="flex gap-4 mb-2">
        {[
          { label: 'White', hex: colorsToken.color.base.white.value, tw: 'white' },
          { label: 'Black', hex: colorsToken.color.base.black.value, tw: 'black' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div
              className="w-20 h-20 rounded-md border border-border-muted"
              style={{ backgroundColor: item.hex }}
            />
            <p className="m-0 mt-2 text-body-sm font-semibold text-onSurface">{item.label}</p>
            <p className="m-0 text-xs font-mono text-onSurface-muted">{item.hex}</p>
            <p className="m-0 mt-[2px] text-xs font-mono text-onSurface-muted">bg-{item.tw}</p>
          </div>
        ))}
      </div>

      <TokenSectionHeading>Neutral (Grayscale)</TokenSectionHeading>
      <PaletteBlock palette={ALL_PALETTES['neutral']} />

      <TokenSectionHeading>Primary</TokenSectionHeading>
      <PaletteBlock palette={ALL_PALETTES['primary']} />

      <TokenSectionHeading>機能色</TokenSectionHeading>
      <div className="flex flex-wrap gap-6">
        {FUNCTIONAL_PALETTES.map((palette) => (
          <PaletteBlock key={palette.name} palette={palette} />
        ))}
      </div>
    </div>
  ),
};
