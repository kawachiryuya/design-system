import type { Meta, StoryObj } from '@storybook/react-vite';
import colorsToken from '../../tokens/source/colors.json';

const meta: Meta = {
  title: 'Tokens/Color/Primitive',
  parameters: {
    layout: 'padded',
    // Tokens/* は値の可視化であり UI ではない → 視覚回帰対象外 (§9-4 / test-runner の axe 除外と対)。
    // token 値の変化は利用側コンポーネントの snapshot で捕捉される。
    chromatic: { disableSnapshot: true },
  },
};
export default meta;
type Story = StoryObj;

const PALETTE_LABELS: Record<string, string> = {
  teal: 'Teal',
  neutral: 'Neutral',
  green: 'Green',
  red: 'Red',
  orange: 'Orange',
  blue: 'Blue',
  yellow: 'Yellow',
  lime: 'Lime',
  cyan: 'Cyan',
  sky: 'Sky',
  violet: 'Violet',
  purple: 'Purple',
  pink: 'Pink',
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

/** semantic 層で参照しない補助 palette (30° 刻みで hue wheel を埋める、下流 product 用) */
const EXTRA_PALETTES: Palette[] = ['yellow', 'lime', 'cyan', 'sky', 'violet', 'purple', 'pink']
  .map((k) => ALL_PALETTES[k])
  .filter(Boolean);

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/**
 * 横並びストリップ用の小型 swatch (shade + hex を中央に表示)。
 */
function ColorSwatch({
  shade,
  hex,
  isFirst,
  isLast,
}: {
  shade: string;
  hex: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const dark = isDark(hex);
  const subColor = dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)';
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-2 py-4 gap-[2px]"
      style={{
        backgroundColor: hex,
        borderRadius: isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0',
        color: dark ? '#FFFFFF' : '#171717',
      }}
    >
      <span className="text-xs font-semibold leading-none">{shade}</span>
      <span className="text-[10px] font-mono leading-none" style={{ color: subColor }}>
        {hex}
      </span>
    </div>
  );
}

/**
 * 横並びストリップ (palette 1 つを左→右に展開)。
 * 複数 palette を縦に積んで cross-palette 比較しやすくする。
 */
function PaletteStrip({ palette }: { palette: Palette }) {
  const shades = Object.keys(palette.shades);
  return (
    <div>
      <p className="text-body-sm font-semibold text-onSurface m-0 mb-2">{palette.label}</p>
      <div className="flex rounded-md overflow-hidden border border-border-subtle">
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

/**
 * Base (White / Black) を 1 行に横並びで圧縮表示。
 * 他 hue palette の strip と「同じ swatch 幅 × 同じ高さ」で揃え、catalog 全体の縦幅を抑える。
 */
const BASE_COLORS = [
  { label: 'White', hex: colorsToken.color.base.white.value },
  { label: 'Black', hex: colorsToken.color.base.black.value },
];

/** semantic で参照される hue (Tokens/Color/Semantic で `surface.primary` 等の参照先になる) */
const HUE_PALETTES: Palette[] = ['neutral', 'teal', 'green', 'red', 'orange', 'blue'].map(
  (k) => ALL_PALETTES[k],
);

function BaseRow() {
  return (
    <div className="flex gap-2">
      {BASE_COLORS.map((c) => {
        const dark = isDark(c.hex);
        const subColor = dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)';
        return (
          <div key={c.label} className="flex-shrink-0">
            <p className="text-body-sm font-semibold text-onSurface m-0 mb-2">{c.label}</p>
            <div
              className="rounded-md border border-border-subtle flex flex-col items-center justify-center px-2 py-4 gap-[2px]"
              style={{ backgroundColor: c.hex, color: dark ? '#FFFFFF' : '#171717', width: '64px' }}
            >
              <span className="text-[10px] font-mono leading-none" style={{ color: subColor }}>
                {c.hex}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const Catalog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Primitive Color の全体カタログ。White / Black から各 hue palette まで横ストリップで縦に並べ、cross-palette 比較を容易に。White / Black は 1 行に横並び圧縮。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 min-w-[640px]">
      <BaseRow />
      {HUE_PALETTES.map((palette) => (
        <PaletteStrip key={palette.name} palette={palette} />
      ))}
      {EXTRA_PALETTES.map((palette) => (
        <PaletteStrip key={palette.name} palette={palette} />
      ))}
    </div>
  ),
};
