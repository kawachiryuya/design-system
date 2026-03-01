import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const SPACING_SCALE: { key: string; value: string }[] = [
  { key: '0', value: '0px' },
  { key: '1', value: '4px' },
  { key: '2', value: '8px' },
  { key: '3', value: '12px' },
  { key: '4', value: '16px' },
  { key: '5', value: '20px' },
  { key: '6', value: '24px' },
  { key: '8', value: '32px' },
  { key: '10', value: '40px' },
  { key: '12', value: '48px' },
  { key: '16', value: '64px' },
  { key: '20', value: '80px' },
  { key: '24', value: '96px' },
];

const SEMANTIC_COMPONENT: { key: string; value: string; desc: string }[] = [
  { key: 'component.tight', value: '4px', desc: 'アイコンとテキストの間など、最小の間隔' },
  { key: 'component.default', value: '8px', desc: 'ボタン内パディング（垂直）など、標準の間隔' },
  { key: 'component.comfortable', value: '12px', desc: '余裕を持たせたコンポーネント内間隔' },
];

const SEMANTIC_SECTION: { key: string; value: string; desc: string }[] = [
  { key: 'section.small', value: '32px', desc: 'セクション間の最小マージン' },
  { key: 'section.default', value: '48px', desc: 'セクション間の標準マージン' },
  { key: 'section.large', value: '64px', desc: 'ページ内の大きなセクション区切り' },
];

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
                  backgroundColor: '#4F46E5',
                  borderRadius: '3px',
                  flexShrink: 0,
                  transition: 'width 0.2s',
                }}
              />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#737373' }}>
                {s.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ),
};

export const Semantic: Story = {
  name: 'セマンティックスペーシング',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Semantic Spacing
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#737373' }}>
        用途に応じた名前付きスペーシング。数値ではなく意味で参照する。
      </p>

      <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#404040' }}>
        Component — コンポーネント内の間隔
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
        {SEMANTIC_COMPONENT.map((s) => {
          const px = parseInt(s.value);
          return (
            <div
              key={s.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FFFFFF',
              }}
            >
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, minWidth: '160px' }}>
                {s.key}
              </code>
              <div
                style={{
                  height: '16px',
                  width: Math.max(px * 2, 2),
                  backgroundColor: '#818CF8',
                  borderRadius: '3px',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#A3A3A3', flexShrink: 0 }}>
                {s.value}
              </span>
              <span style={{ fontSize: '13px', color: '#737373' }}>
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>

      <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#404040' }}>
        Section — セクション間の余白
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SEMANTIC_SECTION.map((s) => {
          const px = parseInt(s.value);
          return (
            <div
              key={s.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FFFFFF',
              }}
            >
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, minWidth: '160px' }}>
                {s.key}
              </code>
              <div
                style={{
                  height: '16px',
                  width: Math.max(px, 2),
                  backgroundColor: '#6366F1',
                  borderRadius: '3px',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#A3A3A3', flexShrink: 0 }}>
                {s.value}
              </span>
              <span style={{ fontSize: '13px', color: '#737373' }}>
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ),
};
