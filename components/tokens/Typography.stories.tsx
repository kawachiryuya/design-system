import type { Meta, StoryObj } from '@storybook/react-vite';
import typographyToken from '../../tokens/source/typography.json';

const meta: Meta = {
  title: 'Tokens/Typography/Primitive',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type Entry = { value: string };
const extractValues = (
  group: Record<string, Entry | string[] | { value: string[] }>,
): Array<{ key: string; value: string }> =>
  Object.entries(group).map(([k, v]) => {
    if (Array.isArray(v)) return { key: k, value: v.join(', ') };
    if (typeof v === 'object' && Array.isArray((v as { value?: unknown }).value)) {
      return { key: k, value: ((v as { value: string[] }).value).join(', ') };
    }
    return { key: k, value: (v as Entry).value };
  });

const T = typographyToken.typography as Record<string, Record<string, Entry | { value: string[] }>>;
const FONT_SIZES = extractValues(T['font-size']);
const FONT_WEIGHTS = extractValues(T['font-weight']);
const LINE_HEIGHTS = extractValues(T['line-height']);
const LETTER_SPACINGS = extractValues(T['letter-spacing']);
const FONT_FAMILIES = extractValues(T['font-family']);

const WEIGHT_LABELS: Record<string, string> = {
  regular: 'Regular',
  medium: 'Medium',
  semibold: 'Semibold',
  bold: 'Bold',
};

const SAMPLE = '見出しテキスト · The quick brown fox';
const BODY_SAMPLE =
  'このデザインシステムはReact・TypeScript・Tailwind CSSを使用して構築されています。一貫したUI品質と開発体験を提供します。';

const KeyBadge: React.FC<{ k: string }> = ({ k }) => (
  <code className="bg-surface-inset text-onSurface px-[6px] py-[2px] rounded-sm font-mono text-xs inline-block">
    {k}
  </code>
);

export const FontSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs (12px) から 5xl (48px) までの 9 段階。`text-{key}` utility で参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col">
      {FONT_SIZES.map((size, i) => (
        <div
          key={size.key}
          className={`flex items-baseline gap-4 py-4 ${i < FONT_SIZES.length - 1 ? 'border-b border-border-subtle' : ''}`}
        >
          <div className="w-20 flex-shrink-0 flex flex-col gap-1">
            <KeyBadge k={size.key} />
            <span className="text-xs font-mono text-onSurface-muted">{size.value}</span>
            <span className="text-xs font-mono text-onSurface-muted">text-{size.key}</span>
          </div>
          <span className="text-onSurface leading-tight" style={{ fontSize: size.value }}>
            {SAMPLE}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const FontWeights: Story = {
  parameters: {
    docs: {
      description: {
        story: 'regular (400) から bold (700) までの 4 段階。`font-{key}` utility で参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col">
      {FONT_WEIGHTS.map((weight, i) => (
        <div
          key={weight.key}
          className={`flex items-center gap-4 py-5 ${i < FONT_WEIGHTS.length - 1 ? 'border-b border-border-subtle' : ''}`}
        >
          <div className="w-[120px] flex-shrink-0 flex flex-col gap-1">
            <KeyBadge k={weight.key} />
            <span className="text-xs font-mono text-onSurface-muted">{weight.value}</span>
            <span className="text-xs font-mono text-onSurface-muted">font-{weight.key}</span>
          </div>
          <span
            className="text-onSurface"
            style={{ fontSize: '24px', fontWeight: Number(weight.value) }}
          >
            {WEIGHT_LABELS[weight.key] ?? weight.key} — {SAMPLE}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const LineHeights: Story = {
  parameters: {
    docs: {
      description: {
        story: 'tight (1.25) から relaxed (1.75) までの段階。`leading-{key}` utility で参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {LINE_HEIGHTS.map((lh) => (
        <div
          key={lh.key}
          className="flex-1 basis-[240px] p-5 rounded-md border border-border-subtle bg-surface"
        >
          <div className="mb-3 flex gap-2 items-center">
            <KeyBadge k={lh.key} />
            <span className="text-xs font-mono text-onSurface-muted">{lh.value}</span>
            <span className="text-xs font-mono text-onSurface-muted">leading-{lh.key}</span>
          </div>
          <p className="m-0 text-sm text-onSurface" style={{ lineHeight: lh.value }}>
            {BODY_SAMPLE}
          </p>
        </div>
      ))}
    </div>
  ),
};

export const LetterSpacings: Story = {
  parameters: {
    docs: {
      description: {
        story: 'tight (-0.02em) / normal (0) / wide (0.02em) の 3 段階。`tracking-{key}` utility で参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col">
      {LETTER_SPACINGS.map((ls, i) => (
        <div
          key={ls.key}
          className={`flex items-center gap-4 py-5 ${i < LETTER_SPACINGS.length - 1 ? 'border-b border-border-subtle' : ''}`}
        >
          <div className="w-[120px] flex-shrink-0 flex flex-col gap-1">
            <KeyBadge k={ls.key} />
            <span className="text-xs font-mono text-onSurface-muted">{ls.value}</span>
            <span className="text-xs font-mono text-onSurface-muted">tracking-{ls.key}</span>
          </div>
          <span className="text-xl text-onSurface" style={{ letterSpacing: ls.value }}>
            {SAMPLE}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const FontFamilies: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sans / mono の 2 スタック。`font-{key}` utility で参照。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {FONT_FAMILIES.map((ff) => (
        <div key={ff.key} className="p-5 rounded-md border border-border-subtle bg-surface">
          <div className="mb-3 flex gap-2 items-center">
            <KeyBadge k={ff.key} />
            <span className="text-xs font-mono text-onSurface-muted">font-{ff.key}</span>
          </div>
          <p className="m-0 mb-2 text-xl text-onSurface" style={{ fontFamily: ff.value }}>
            {SAMPLE}
          </p>
          <p className="m-0 text-xs font-mono text-onSurface-muted break-all">{ff.value}</p>
        </div>
      ))}
    </div>
  ),
};
