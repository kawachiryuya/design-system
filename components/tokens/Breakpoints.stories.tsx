import type { Meta, StoryObj } from '@storybook/react-vite';
import breakpointsToken from '../../tokens/source/breakpoints.json';
import { TokenPageHeader } from '@sb-blocks/TokenPageHeader';

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

const ENTRIES: BpEntry[] = Object.entries(breakpointsToken.screens).map(
  ([key, entry]) => ({
    key,
    value: (entry as { value: string }).value,
    description: DESCRIPTIONS[key] ?? '',
  }),
);

const MAX_PX = 1600; // 2xl 1536 が収まるバー幅

export const Scale: Story = {
  name: 'ブレイクポイント',
  render: () => (
    <div className="max-w-[900px]">
      <TokenPageHeader
        title="Breakpoints"
        intro="本リポは mobile-first 前提で、prefix なしの class が最小幅 (mobile) を表す。sm: 以上の prefix で viewport 幅がその値以上に達したときのみスタイル適用 (widening)。"
        utility="sm: / md: / lg: / xl: / 2xl:"
      >
        現状本リポ内では <code className="bg-surface-inset text-onSurface px-[6px] py-[1px] rounded-sm font-mono text-xs">sm:</code> の利用のみで md/lg/xl/2xl: は未使用 (mobile / tablet までの軽い適応に留めている)。下流 product が必要時に使えるよう Tailwind 標準と同じ 5 段階を維持。
      </TokenPageHeader>

      <div className="flex flex-col gap-3">
        {ENTRIES.map((bp) => {
          const px = parseInt(bp.value, 10);
          const widthPct = (px / MAX_PX) * 100;
          return (
            <div
              key={bp.key}
              className="grid items-center gap-4 py-3 px-4 rounded-md border border-border-muted bg-surface"
              style={{ gridTemplateColumns: '64px 80px 1fr auto' }}
            >
              <code className="bg-surface-inset text-onSurface px-2 py-1 rounded-sm font-mono text-xs text-center">
                {bp.key}:
              </code>
              <code className="font-mono text-xs text-onSurface-muted">
                {bp.value}
              </code>
              <div className="relative h-5 bg-surface-inset rounded-sm overflow-hidden">
                <div
                  className="h-full bg-surface-primary rounded-sm"
                  style={{ width: `${widthPct}%` }}
                  aria-label={`viewport width ${bp.value}`}
                />
              </div>
              <span className="text-xs text-onSurface-muted">{bp.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  ),
};
