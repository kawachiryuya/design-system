import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const FONT_SIZES: { key: string; px: string }[] = [
  { key: 'xs', px: '12px' },
  { key: 'sm', px: '14px' },
  { key: 'base', px: '16px' },
  { key: 'lg', px: '18px' },
  { key: 'xl', px: '20px' },
  { key: '2xl', px: '24px' },
  { key: '3xl', px: '30px' },
  { key: '4xl', px: '36px' },
  { key: '5xl', px: '48px' },
  { key: '6xl', px: '60px' },
];

const FONT_WEIGHTS: { key: string; value: number; label: string }[] = [
  { key: 'light', value: 300, label: 'Light' },
  { key: 'regular', value: 400, label: 'Regular' },
  { key: 'medium', value: 500, label: 'Medium' },
  { key: 'semibold', value: 600, label: 'Semibold' },
  { key: 'bold', value: 700, label: 'Bold' },
];

const LINE_HEIGHTS: { key: string; value: string }[] = [
  { key: 'tight', value: '1.25' },
  { key: 'normal', value: '1.5' },
  { key: 'relaxed', value: '1.75' },
  { key: 'loose', value: '2' },
];

const LETTER_SPACINGS: { key: string; value: string }[] = [
  { key: 'tight', value: '-0.02em' },
  { key: 'normal', value: '0' },
  { key: 'wide', value: '0.02em' },
];

const SAMPLE = '見出しテキスト · The quick brown fox';
const BODY_SAMPLE = 'このデザインシステムはReact・TypeScript・Tailwind CSSを使用して構築されています。一貫したUI品質と開発体験を提供します。';

export const FontSizes: Story = {
  name: 'フォントサイズ',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Font Sizes
      </h2>
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
      <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Font Weights
      </h2>
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
      <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Line Heights
      </h2>
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
      <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Letter Spacings
      </h2>
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
