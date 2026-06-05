import type { Meta, StoryObj } from '@storybook/react-vite';
import colorsToken from '../../tokens/source/colors.json';
import semanticColors from '../../tokens/source/semantic-colors.json';

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

const FUNCTIONAL_PALETTES: Palette[] = ['success', 'error', 'warning', 'info'].map(
  (k) => ALL_PALETTES[k],
);

/** brand + functional 以外の補助 palette (30° 刻みで hue wheel を埋める、下流 product 用) */
const EXTRA_PALETTES: Palette[] = ['yellow', 'lime', 'cyan', 'sky', 'violet', 'purple', 'pink']
  .map((k) => ALL_PALETTES[k])
  .filter(Boolean);

type SCEntry = { value: string; type?: string; description?: string };
const buildReverseIndex = (): Record<string, string[]> => {
  const index: Record<string, string[]> = {};
  const groups = semanticColors.color as Record<string, Record<string, SCEntry>>;
  const refPattern = /\{color\.([^}]+)\}/g;
  for (const [groupName, entries] of Object.entries(groups)) {
    for (const [key, entry] of Object.entries(entries)) {
      const matches = [...entry.value.matchAll(refPattern)];
      const semanticName = key === 'default' ? groupName : `${groupName}.${key}`;
      for (const m of matches) {
        const primitiveKey = m[1];
        if (!index[primitiveKey]) index[primitiveKey] = [];
        if (!index[primitiveKey].includes(semanticName)) {
          index[primitiveKey].push(semanticName);
        }
      }
    }
  }
  return index;
};

const REVERSE_INDEX = buildReverseIndex();

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function ColorSwatch({
  shade,
  hex,
  usedBy,
  isFirst,
  isLast,
}: {
  shade: string;
  hex: string;
  usedBy: string[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const dark = isDark(hex);
  const subColor = dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)';
  return (
    <div
      className="flex flex-col px-2 py-3 gap-1"
      style={{
        backgroundColor: hex,
        borderRadius: isFirst ? '8px 8px 0 0' : isLast ? '0 0 8px 8px' : '0',
        color: dark ? '#FFFFFF' : '#171717',
      }}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold">{shade}</span>
        <span className="text-[11px] font-mono" style={{ color: subColor }}>
          {hex}
        </span>
      </div>
      {usedBy.length > 0 && (
        <div className="text-[10px] font-mono leading-tight" style={{ color: subColor }}>
          → {usedBy.join(', ')}
        </div>
      )}
    </div>
  );
}

function PaletteBlock({ palette }: { palette: Palette }) {
  const shades = Object.keys(palette.shades);
  return (
    <div className="min-w-[260px] flex-1 basis-[260px]">
      <p className="text-body-sm font-semibold text-onSurface m-0 mb-2">{palette.label}</p>
      <div className="rounded-md overflow-hidden border border-border-muted">
        {shades.map((shade, i) => (
          <ColorSwatch
            key={shade}
            shade={shade}
            hex={palette.shades[shade]}
            usedBy={REVERSE_INDEX[`${palette.name}.${shade}`] ?? []}
            isFirst={i === 0}
            isLast={i === shades.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export const Base: Story = {
  parameters: {
    docs: {
      description: {
        story: 'White / Black の絶対基準色。`bg-white` / `bg-black` で直接参照。',
      },
    },
  },
  render: () => (
    <div className="flex gap-4">
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
  ),
};

export const Neutral: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Grayscale 10 段。text / border / surface 各方面に幅広く参照される。',
      },
    },
  },
  render: () => <PaletteBlock palette={ALL_PALETTES['neutral']} />,
};

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ブランドカラー (Teal)。primary.25 は bg.default 専用、primary.700 が surface.primary の主体。',
      },
    },
  },
  render: () => <PaletteBlock palette={ALL_PALETTES['primary']} />,
};

export const Functional: Story = {
  parameters: {
    docs: {
      description: {
        story: 'success / error / warning / info の 4 機能色。各 10 段で UI 状態を表現。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {FUNCTIONAL_PALETTES.map((palette) => (
        <PaletteBlock key={palette.name} palette={palette} />
      ))}
    </div>
  ),
};

export const Extra: Story = {
  name: '補助 palette (Extra)',
  parameters: {
    docs: {
      description: {
        story: '本リポの semantic 層では参照しない補助 palette (hue 30° 刻みで wheel を埋める)。下流 product がブランドカラーや図表・カテゴリ分類で使うための予備。既存 palette と同じ OKLCH 明度カーブで生成。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {EXTRA_PALETTES.map((palette) => (
        <PaletteBlock key={palette.name} palette={palette} />
      ))}
    </div>
  ),
};
