import type { Meta, StoryObj } from '@storybook/react-vite';
import breakpointsToken from '../../tokens/source/breakpoints.json';

const meta: Meta = {
  title: 'Tokens/Breakpoints',
  parameters: {
    layout: 'padded',
    // Tokens/* は値の可視化であり UI ではない → 視覚回帰対象外 (§9-4 / test-runner の axe 除外と対)。
    // token 値の変化は利用側コンポーネントの snapshot で捕捉される。
    chromatic: { disableSnapshot: true },
  },
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

const MAX_PX = 1600;

export const Scale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'mobile-first 前提で、prefix なしの class が最小幅 (mobile) を表す。`sm:` 以上で viewport が指定幅以上のときのみスタイル適用 (widening 方向)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {ENTRIES.map((bp) => {
        const px = parseInt(bp.value, 10);
        const widthPct = (px / MAX_PX) * 100;
        return (
          <div
            key={bp.key}
            className="grid items-center gap-4 py-3 px-4 rounded-md border border-border-subtle bg-surface"
            style={{ gridTemplateColumns: '64px 80px 1fr auto' }}
          >
            <code className="bg-surface-inset text-onSurface px-2 py-1 rounded-sm font-mono text-xs text-center">
              {bp.key}:
            </code>
            <code className="font-mono text-xs text-onSurface-muted">{bp.value}</code>
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
  ),
};
