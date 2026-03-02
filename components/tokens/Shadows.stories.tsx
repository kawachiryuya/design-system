import type { Meta, StoryObj } from '@storybook/react';
import shadowsToken from '../../tokens/shadows.json';

const meta: Meta = {
  title: 'Tokens/Shadows',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const SHADOWS = Object.entries(shadowsToken.shadow).map(([key, value]) => ({
  key,
  value,
  tw: key === 'DEFAULT' ? 'shadow' : key === 'none' ? 'shadow-none' : `shadow-${key}`,
}));

export const Elevations: Story = {
  name: 'エレベーション',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Shadows
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        none から 2xl までの 7 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>boxShadow</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {SHADOWS.map((s) => (
          <div
            key={s.key}
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
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: s.value === 'none' ? 'none' : s.value,
                border: s.value === 'none' ? '1px solid #E5E5E5' : 'none',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                {s.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {s.tw}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ margin: '48px 0 16px', fontSize: '15px', fontWeight: 600, color: '#404040' }}>
        トークン値
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SHADOWS.map((s) => (
          <div
            key={s.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, minWidth: '72px' }}>
              {s.key}
            </code>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#A3A3A3', flexShrink: 0, minWidth: '90px' }}>
              {s.tw}
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#737373', wordBreak: 'break-all' }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
