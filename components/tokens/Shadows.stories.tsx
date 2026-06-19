import type { Meta, StoryObj } from '@storybook/react-vite';
import shadowsToken from '../../tokens/source/shadows.json';

const meta: Meta = {
  title: 'Tokens/Shadows',
  parameters: {
    layout: 'padded',
    // Tokens/* は値の可視化であり UI ではない → 視覚回帰対象外 (§9-4 / test-runner の axe 除外と対)。
    // token 値の変化は利用側コンポーネントの snapshot で捕捉される。
    chromatic: { disableSnapshot: true },
  },
};
export default meta;
type Story = StoryObj;

type ShadowEntry = { key: string; value: string; tw: string };

const SHADOWS: ShadowEntry[] = Object.entries(shadowsToken.shadow).map(
  ([key, entry]) => ({
    key,
    value: (entry as { value: string }).value,
    tw: key === 'none' ? 'shadow-none' : `shadow-${key}`,
  }),
);

export const Elevations: Story = {
  parameters: {
    docs: {
      description: {
        story: '中核 sm/md/lg + 境界 none の 4 段。md がデフォルトで bare 形 `shadow` ≒ `shadow-md`。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-8">
      {SHADOWS.map((s) => (
        <div key={s.key} className="flex flex-col items-center gap-3">
          <div
            className={`w-20 h-20 bg-surface rounded-md ${s.tw} ${s.key === 'none' ? 'border border-border-subtle' : ''}`}
          />
          <div className="text-center flex flex-col gap-1">
            <code className="bg-surface-inset text-onSurface px-1.5 py-0.5 rounded-sm font-mono text-xs inline-block">
              {s.key}
            </code>
            <span className="text-xs font-mono text-onSurface-muted">{s.tw}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TokenValues: Story = {
  parameters: {
    docs: {
      description: {
        story: '各 shadow の CSS box-shadow 値。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {SHADOWS.map((s) => (
        <div
          key={s.key}
          className="flex items-center gap-4 py-2.5 px-4 rounded-md border border-border-subtle bg-surface"
        >
          <code className="bg-surface-inset text-onSurface px-2 py-0.5 rounded-sm font-mono text-xs flex-shrink-0 min-w-[72px]">
            {s.key}
          </code>
          <span className="font-mono text-xs text-onSurface-muted flex-shrink-0 min-w-[90px]">
            {s.tw}
          </span>
          <span className="font-mono text-xs text-onSurface-muted break-all">{s.value}</span>
        </div>
      ))}
    </div>
  ),
};
