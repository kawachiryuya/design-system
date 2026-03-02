import type { Meta, StoryObj } from '@storybook/react';
import animationToken from '../../tokens/animation.json';

const meta: Meta = {
  title: 'Tokens/Animation',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const DURATIONS = Object.entries(animationToken.duration).map(([key, value]) => ({
  key,
  value,
  tw: key === 'DEFAULT' ? 'duration-200' : `duration-${parseInt(value)}`,
}));

const EASINGS = Object.entries(animationToken.easing).map(([key, value]) => ({
  key,
  value,
  tw: key === 'ease-in-out' ? 'ease-in-out' : key === 'linear' ? 'ease-linear' : key,
}));

function AnimatedBar({ duration, easing }: { duration: string; easing: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#F5F5F5',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '8px',
          backgroundColor: '#4F46E5',
          borderRadius: '4px',
          transition: `transform ${duration} ${easing}`,
          position: 'absolute',
          left: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(200px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
        }}
      />
    </div>
  );
}

export const Durations: Story = {
  name: 'デュレーション',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Durations
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        fast（100ms）から slower（500ms）までの 4 段階。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>transitionDuration</code> に統合済み。バーにホバーして速度を比較。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {DURATIONS.map((d) => (
          <div
            key={d.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ width: '120px', flexShrink: 0 }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {d.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {d.value}
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '2px', fontFamily: 'monospace' }}>
                {d.tw}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <AnimatedBar duration={d.value} easing="cubic-bezier(0.4, 0, 0.2, 1)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Easings: Story = {
  name: 'イージング',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Easings
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        4 種のイージング関数。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>transitionTimingFunction</code> に統合済み。バーにホバーして動きを比較。
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {EASINGS.map((e) => (
          <div
            key={e.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ width: '120px', flexShrink: 0 }}>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 6px', borderRadius: '4px' }}>
                {e.key}
              </code>
              <span style={{ display: 'block', fontSize: '11px', color: '#A3A3A3', marginTop: '4px', fontFamily: 'monospace' }}>
                {e.tw}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <AnimatedBar duration="300ms" easing={e.value} />
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#737373', flexShrink: 0, minWidth: '200px', textAlign: 'right' }}>
              {e.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
