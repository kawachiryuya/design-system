import type { Meta, StoryObj } from '@storybook/react-vite';
import radiusToken from '../../tokens/source/radius.json';

const meta: Meta = {
  title: 'Tokens/Radius',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type RadiusEntry = { key: string; value: string; tw: string };

const RADII: RadiusEntry[] = Object.entries(radiusToken.radius).map(
  ([key, entry]) => ({
    key,
    value: (entry as { value: string }).value,
    tw: key === 'none' ? 'rounded-none' : `rounded-${key}`,
  }),
);

export const BorderRadius: Story = {
  parameters: {
    docs: {
      description: {
        story: '中核 sm/md/lg + 境界 none/full の 5 段。md がデフォルトで bare 形 `rounded` ≒ `rounded-md`。',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-8">
      {RADII.map((r) => (
        <div key={r.key} className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 bg-surface-primary"
            style={{
              borderRadius: r.value === '9999px' ? '9999px' : r.value,
            }}
          />
          <div className="text-center flex flex-col gap-1">
            <code className="bg-surface-inset text-onSurface px-[6px] py-[2px] rounded-sm font-mono text-xs inline-block">
              {r.key}
            </code>
            <span className="text-xs font-mono text-onSurface-muted">{r.value}</span>
            <span className="text-xs font-mono text-onSurface-muted">{r.tw}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
