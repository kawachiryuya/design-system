import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const SHADES: Shade[] = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const PALETTES: { name: string; label: string; colors: Record<Shade, string> }[] = [
  {
    name: 'primary',
    label: 'Primary (Indigo)',
    colors: {
      '50': '#EEF2FF', '100': '#E0E7FF', '200': '#C7D2FE', '300': '#A5B4FC',
      '400': '#818CF8', '500': '#6366F1', '600': '#4F46E5', '700': '#4338CA',
      '800': '#3730A3', '900': '#312E81',
    },
  },
  {
    name: 'neutral',
    label: 'Neutral (Gray)',
    colors: {
      '50': '#FAFAFA', '100': '#F5F5F5', '200': '#E5E5E5', '300': '#D4D4D4',
      '400': '#A3A3A3', '500': '#737373', '600': '#525252', '700': '#404040',
      '800': '#262626', '900': '#171717',
    },
  },
  {
    name: 'success',
    label: 'Success (Green)',
    colors: {
      '50': '#F0FDF4', '100': '#DCFCE7', '200': '#BBF7D0', '300': '#86EFAC',
      '400': '#4ADE80', '500': '#22C55E', '600': '#16A34A', '700': '#15803D',
      '800': '#166534', '900': '#14532D',
    },
  },
  {
    name: 'error',
    label: 'Error (Red)',
    colors: {
      '50': '#FEF2F2', '100': '#FEE2E2', '200': '#FECACA', '300': '#FCA5A5',
      '400': '#F87171', '500': '#EF4444', '600': '#DC2626', '700': '#B91C1C',
      '800': '#991B1B', '900': '#7F1D1D',
    },
  },
  {
    name: 'warning',
    label: 'Warning (Orange)',
    colors: {
      '50': '#FFFBEB', '100': '#FEF3C7', '200': '#FDE68A', '300': '#FCD34D',
      '400': '#FBBF24', '500': '#F59E0B', '600': '#D97706', '700': '#B45309',
      '800': '#92400E', '900': '#78350F',
    },
  },
  {
    name: 'info',
    label: 'Info (Blue)',
    colors: {
      '50': '#EFF6FF', '100': '#DBEAFE', '200': '#BFDBFE', '300': '#93C5FD',
      '400': '#60A5FA', '500': '#3B82F6', '600': '#2563EB', '700': '#1D4ED8',
      '800': '#1E40AF', '900': '#1E3A8A',
    },
  },
];

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function ColorSwatch({ shade, hex }: { shade: string; hex: string }) {
  const dark = isDark(hex);
  return (
    <div
      style={{
        backgroundColor: hex,
        padding: '12px 8px',
        borderRadius: shade === '50' ? '8px 8px 0 0' : shade === '900' ? '0 0 8px 8px' : '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 600, color: dark ? '#FFFFFF' : '#171717' }}>
        {shade}
      </span>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)' }}>
        {hex}
      </span>
    </div>
  );
}

function PaletteBlock({ palette }: { palette: (typeof PALETTES)[number] }) {
  return (
    <div style={{ minWidth: '180px', flex: '1 1 180px' }}>
      <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#404040' }}>
        {palette.label}
      </p>
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E5E5' }}>
        {SHADES.map((shade) => (
          <ColorSwatch key={shade} shade={shade} hex={palette.colors[shade]} />
        ))}
      </div>
    </div>
  );
}

export const Palettes: Story = {
  name: 'パレット一覧',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Color Palettes
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {PALETTES.map((palette) => (
          <PaletteBlock key={palette.name} palette={palette} />
        ))}
      </div>
    </div>
  ),
};

export const Semantic: Story = {
  name: 'セマンティックカラー',
  render: () => {
    const semanticColors = [
      { role: 'Primary — アクション・リンク・フォーカス', color: '#4F46E5', token: 'primary.600', usage: 'CTA, フォーカスリング, リンク' },
      { role: 'Success — 成功・完了', color: '#16A34A', token: 'success.600', usage: '保存完了, バリデーション成功' },
      { role: 'Error — エラー・失敗', color: '#DC2626', token: 'error.600', usage: 'フォームエラー, 削除, 警告' },
      { role: 'Warning — 注意', color: '#D97706', token: 'warning.600', usage: '注意喚起, 非推奨の操作' },
      { role: 'Info — 情報', color: '#2563EB', token: 'info.600', usage: 'ヘルプテキスト, ステータス情報' },
      { role: 'Neutral — テキスト・ボーダー', color: '#171717', token: 'neutral.900', usage: '本文テキスト' },
      { role: 'Neutral — サブテキスト', color: '#737373', token: 'neutral.500', usage: 'ヘルプテキスト, プレースホルダー' },
      { role: 'Neutral — ボーダー', color: '#D4D4D4', token: 'neutral.300', usage: '区切り線, 入力枠' },
      { role: 'Neutral — 背景', color: '#FAFAFA', token: 'neutral.50', usage: 'ページ背景, カード背景' },
    ];

    return (
      <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
          Semantic Colors
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {semanticColors.map((item) => (
            <div
              key={item.token}
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
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: item.color,
                  flexShrink: 0,
                  border: item.color === '#FAFAFA' ? '1px solid #E5E5E5' : 'none',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#171717' }}>
                  {item.role}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#737373' }}>
                  用途: {item.usage}
                </p>
              </div>
              <code style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                backgroundColor: '#F5F5F5',
                padding: '3px 8px',
                borderRadius: '4px',
                color: '#525252',
                flexShrink: 0,
              }}>
                {item.token}
              </code>
              <code style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#A3A3A3',
                flexShrink: 0,
                minWidth: '80px',
                textAlign: 'right',
              }}>
                {item.color}
              </code>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
