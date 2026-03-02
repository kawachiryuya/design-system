import type { Meta, StoryObj } from '@storybook/react';
import radiusToken from '../../tokens/radius.json';

const meta: Meta = {
  title: 'Tokens/Radius',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const RADII = Object.entries(radiusToken.radius).map(([key, value]) => ({
  key,
  value,
  tw: key === 'DEFAULT' ? 'rounded' : key === 'none' ? 'rounded-none' : `rounded-${key}`,
}));

export const BorderRadius: Story = {
  name: '角丸',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Border Radius
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        none（0）から full（9999px）までの 6 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>borderRadius</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {RADII.map((r) => (
          <div
            key={r.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#4F46E5',
                borderRadius: r.value === '9999px' ? '9999px' : r.value,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                {r.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {r.value}
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '2px', fontFamily: 'monospace' }}>
                {r.tw}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
