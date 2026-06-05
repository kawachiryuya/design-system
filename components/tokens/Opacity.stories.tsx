import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Opacity',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

type Entry = { key: string; value: number; description: string; usedBy: string };

const ENTRIES: Entry[] = [
  { key: 'disabled',       value: 0.5,  description: '操作不能 (cursor-not-allowed と組合せ)', usedBy: 'Button / Input / Textarea / Select / Radio / Checkbox / Switch' },
  { key: 'muted',          value: 0.7,  description: '控えめ表示 (装飾的 icon / 副次情報)',     usedBy: 'Link 外部リンクアイコン' },
  { key: 'spinner-track',  value: 0.25, description: 'spinner の円弧トラック (背景円)',         usedBy: 'Button (loading) / Spinner' },
  { key: 'spinner-spin',   value: 0.75, description: 'spinner の回転アーク',                    usedBy: 'Button (loading) / Spinner' },
];

export const Values: Story = {
  name: 'Semantic Opacity',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>Opacity</h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
        意味付けされた opacity 値。Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>opacity-{'{key}'}</code> utility で使う
        (<code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>opacity-disabled</code> /
        <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>opacity-spinner-track</code> 等)。
        Tailwind 既定の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>opacity-0/5/10/.../100</code>
        も並存。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ENTRIES.map((e) => (
          <div
            key={e.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 60px 80px 1fr',
              gap: '16px',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#FFFFFF',
            }}
          >
            <code style={{ fontSize: '13px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '4px 8px', borderRadius: '4px' }}>
              opacity-{e.key}
            </code>
            <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#737373' }}>{e.value}</code>
            <div
              style={{
                width: '48px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#006F50',
                opacity: e.value,
              }}
              aria-label={`opacity ${e.value} のサンプル`}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '13px', color: '#171717' }}>{e.description}</span>
              <span style={{ fontSize: '12px', color: '#A3A3A3' }}>使用: {e.usedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
