import type { Meta, StoryObj } from '@storybook/react-vite';
import spacingToken from '../../tokens/spacing.json';

const meta: Meta = {
  title: 'Tokens/Spacing/Primitive',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const SPACING_SCALE = Object.entries(spacingToken.spacing).map(([key, value]) => ({ key, value }));

export const Scale: Story = {
  name: 'スペーシングスケール',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Spacing Scale
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        8px を基準としたスケール。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>spacing</code> に統合済み。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SPACING_SCALE.map((s) => {
          const px = parseInt(s.value);
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', flexShrink: 0, textAlign: 'right' }}>
                <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                  {s.key}
                </code>
              </div>
              <div
                style={{
                  height: '20px',
                  width: Math.max(px, 2),
                  backgroundColor: '#008965',
                  borderRadius: '3px',
                  flexShrink: 0,
                  transition: 'width 0.2s',
                }}
              />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#737373', flexShrink: 0 }}>
                {s.value}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#A3A3A3' }}>
                p-{s.key} / gap-{s.key} / m-{s.key}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ),
};

