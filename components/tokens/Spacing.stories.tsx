import type { Meta, StoryObj } from '@storybook/react-vite';
import spacingToken from '../../tokens/source/spacing.json';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type SpacingEntry = { key: string; value: string };

// ソースキーは `0_5` のアンダースコア表記 (Style Dictionary の dot-path 干渉回避、
// tokens/source/spacing.json 参照)。表示と Tailwind utility 名は `0.5` の標準形に
// 戻して扱う。
const SPACING_SCALE: SpacingEntry[] = Object.entries(spacingToken.spacing)
  .map(([key, entry]) => ({
    key: key.replace(/_/g, '.'),
    value: (entry as { value: string }).value,
  }))
  .sort((a, b) => parseFloat(a.key) - parseFloat(b.key));

export const Scale: Story = {
  parameters: {
    docs: {
      description: {
        story: '8px (= spacing.2) を基準とした数値スケール。Tailwind の spacing utility (`p-{key}` / `m-{key}` / `gap-{key}`) に統合済み。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {SPACING_SCALE.map((s) => {
        const px = parseInt(s.value, 10);
        return (
          <div key={s.key} className="flex items-center gap-4">
            <div className="w-12 flex-shrink-0 text-right">
              <code className="bg-surface-inset text-onSurface px-1.5 py-0.5 rounded-sm font-mono text-xs inline-block">
                {s.key}
              </code>
            </div>
            <div
              className="h-5 bg-surface-primary rounded-sm flex-shrink-0"
              style={{ width: Math.max(px, 2) }}
              aria-hidden
            />
            <span className="font-mono text-xs text-onSurface-muted flex-shrink-0">
              {s.value}
            </span>
            <span className="font-mono text-xs text-onSurface-muted">
              p-{s.key} / gap-{s.key} / m-{s.key}
            </span>
          </div>
        );
      })}
    </div>
  ),
};
