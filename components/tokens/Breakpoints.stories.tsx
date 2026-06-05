import type { Meta, StoryObj } from '@storybook/react-vite';
import breakpointsToken from '../../tokens/breakpoints.json';

const meta: Meta = {
  title: 'Tokens/Breakpoints',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

type BpEntry = { key: string; value: string; description: string };

const DESCRIPTIONS: Record<string, string> = {
  sm: 'small tablets / 大型 mobile (landscape)',
  md: 'tablets 標準 (iPad portrait 等)',
  lg: 'desktop / tablets (landscape)',
  xl: 'wide desktop。本リポの主要ターゲット',
  '2xl': 'extra wide desktop / 大画面',
};

const ENTRIES: BpEntry[] = Object.entries(breakpointsToken.screens).map(([key, value]) => ({
  key,
  value,
  description: DESCRIPTIONS[key] ?? '',
}));

const MAX_PX = 1600; // 2xl 1536 が収まるバー幅

export const Scale: Story = {
  name: 'ブレイクポイント',
  render: () => (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#171717' }}>
        Breakpoints
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
        Tailwind の <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>screens</code> に統合済み。
        本リポは <strong>mobile-first 前提</strong> で、prefix なしの class が最小幅 (mobile) を表す。
        <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>sm:</code>
        以上の prefix で viewport 幅がその値以上に達したときのみスタイルを適用する (widening 方向)。
      </p>

      <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#737373', lineHeight: 1.6 }}>
        現状本リポ内では <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>sm:</code>
        の利用のみで <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>md/lg/xl/2xl:</code>
        は未使用 (mobile / tablet までの軽い適応に留めている)。
        ただし下流 product が必要時に <code style={{ backgroundColor: '#F5F5F5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>md:</code>
        以降も使えるよう、Tailwind 標準と同じ 5 段階を維持している。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ENTRIES.map((bp) => {
          const px = parseInt(bp.value, 10);
          const widthPct = (px / MAX_PX) * 100;
          return (
            <div
              key={bp.key}
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 80px 1fr auto',
                gap: '16px',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FFFFFF',
              }}
            >
              <code style={{ fontSize: '13px', fontFamily: 'monospace', color: '#525252', backgroundColor: '#F5F5F5', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                {bp.key}:
              </code>
              <code style={{ fontSize: '12px', fontFamily: 'monospace', color: '#737373' }}>
                {bp.value}
              </code>
              <div style={{ position: 'relative', height: '20px', backgroundColor: '#F5F5F5', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    backgroundColor: '#006F50',
                    borderRadius: '4px',
                  }}
                  aria-label={`viewport width ${bp.value}`}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#737373' }}>
                {bp.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ),
};
