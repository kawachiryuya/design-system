import type { Meta, StoryObj } from '@storybook/react';
import spacingToken from '../../tokens/spacing.json';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const SPACING_SCALE = Object.entries(spacingToken.spacing).map(([key, value]) => ({ key, value }));

const SEMANTIC_DESCRIPTIONS: Record<string, string> = {
  tight: 'アイコンとテキストの間など、最小の間隔',
  default: 'ボタン内パディング（垂直）など、標準の間隔',
  comfortable: '余裕を持たせたコンポーネント内間隔',
};

const SEMANTIC_COMPONENT = Object.entries(spacingToken.semantic.component).map(([key, value]) => ({
  key: `component.${key}`,
  value,
  desc: SEMANTIC_DESCRIPTIONS[key] ?? '',
}));

const SEMANTIC_SECTION_DESCRIPTIONS: Record<string, string> = {
  small: 'セクション間の最小マージン',
  default: 'セクション間の標準マージン',
  large: 'ページ内の大きなセクション区切り',
};

const SEMANTIC_SECTION = Object.entries(spacingToken.semantic.section).map(([key, value]) => ({
  key: `section.${key}`,
  value,
  desc: SEMANTIC_SECTION_DESCRIPTIONS[key] ?? '',
}));

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
                  width: Math.max(px, 2),
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
