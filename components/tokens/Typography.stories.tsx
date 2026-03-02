import type { Meta, StoryObj } from '@storybook/react';
import typographyToken from '../../tokens/typography.json';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const WEIGHT_LABELS: Record<string, string> = {
  light: 'Light',
  regular: 'Regular',
  medium: 'Medium',
  semibold: 'Semibold',
  bold: 'Bold',
};

const FONT_SIZES = Object.entries(typographyToken.fontSize).map(([key, px]) => ({ key, px }));

const FONT_WEIGHTS = Object.entries(typographyToken.fontWeight).map(([key, value]) => ({
  key,
  value: Number(value),
  label: WEIGHT_LABELS[key] ?? key,
}));

const LINE_HEIGHTS = Object.entries(typographyToken.lineHeight).map(([key, value]) => ({ key, value }));

const LETTER_SPACINGS = Object.entries(typographyToken.letterSpacing).map(([key, value]) => ({ key, value }));

const FONT_FAMILIES = Object.entries(typographyToken.fontFamily).map(([key, stack]) => ({
  key,
  stack: (stack as string[]).join(', '),
}));

const SAMPLE = '見出しテキスト · The quick brown fox';
const BODY_SAMPLE = 'このデザインシステムはReact・TypeScript・Tailwind CSSを使用して構築されています。一貫したUI品質と開発体験を提供します。';

export const FontSizes: Story = {
  name: 'フォントサイズ',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Font Sizes
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373' }}>
        xs（12px）から 6xl（60px）までの 10 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>fontSize</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {FONT_SIZES.map((size, i) => (
          <div
            key={size.key}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              padding: '16px 0',
              borderBottom: i < FONT_SIZES.length - 1 ? '1px solid #F5F5F5' : 'none',
            }}
          >
            <div style={{ width: '80px', flexShrink: 0 }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {size.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {size.px}
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '2px', fontFamily: 'monospace' }}>
                text-{size.key}
              </span>
            </div>
            <span style={{ fontSize: size.px, color: '#171717', lineHeight: '1.25' }}>
              {SAMPLE}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FontWeights: Story = {
  name: 'フォントウェイト',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Font Weights
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373' }}>
        light（300）から bold（700）までの 5 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>fontWeight</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {FONT_WEIGHTS.map((weight, i) => (
          <div
            key={weight.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 0',
              borderBottom: i < FONT_WEIGHTS.length - 1 ? '1px solid #F5F5F5' : 'none',
            }}
          >
            <div style={{ width: '120px', flexShrink: 0 }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {weight.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {weight.value}
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '2px', fontFamily: 'monospace' }}>
                font-{weight.key}
              </span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: weight.value, color: '#171717' }}>
              {weight.label} — {SAMPLE}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LineHeights: Story = {
  name: '行間',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Line Heights
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373' }}>
        tight（1.25）から loose（2）までの 4 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>lineHeight</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {LINE_HEIGHTS.map((lh) => (
          <div
            key={lh.key}
            style={{
              flex: '1 1 240px',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {lh.key}
              </code>
              <span style={{ fontSize: '12px', color: '#A3A3A3', fontFamily: 'monospace' }}>
                {lh.value}
              </span>
              <span style={{ fontSize: '11px', color: '#A3A3A3', fontFamily: 'monospace' }}>
                leading-{lh.key}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#171717', lineHeight: lh.value }}>
              {BODY_SAMPLE}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LetterSpacings: Story = {
  name: '字間',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Letter Spacings
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373' }}>
        tight（-0.02em）/ normal（0）/ wide（0.02em）の 3 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>letterSpacing</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {LETTER_SPACINGS.map((ls, i) => (
          <div
            key={ls.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 0',
              borderBottom: i < LETTER_SPACINGS.length - 1 ? '1px solid #F5F5F5' : 'none',
            }}
          >
            <div style={{ width: '120px', flexShrink: 0 }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {ls.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {ls.value}
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '2px', fontFamily: 'monospace' }}>
                tracking-{ls.key}
              </span>
            </div>
            <span style={{ fontSize: '20px', color: '#171717', letterSpacing: ls.value }}>
              {SAMPLE}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FontFamilies: Story = {
  name: 'フォントファミリー',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Font Families
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373' }}>
        sans / serif / mono の 3 スタック。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>fontFamily</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {FONT_FAMILIES.map((ff) => (
          <div
            key={ff.key}
            style={{
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {ff.key}
              </code>
              <span style={{ fontSize: '11px', color: '#A3A3A3', fontFamily: 'monospace' }}>
                font-{ff.key}
              </span>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '20px', color: '#171717', fontFamily: ff.stack }}>
              {SAMPLE}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#A3A3A3', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {ff.stack}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};
