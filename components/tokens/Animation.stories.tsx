import type { Meta, StoryObj } from '@storybook/react-vite';
import animationToken from '../../tokens/source/animation.json';

const meta: Meta = {
  title: 'Tokens/Animation',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

type AnimEntry = { key: string; value: string; tw: string };

const DURATIONS: AnimEntry[] = Object.entries(animationToken.duration).map(
  ([key, entry]) => ({
    key,
    value: (entry as { value: string }).value,
    tw: `duration-${key}`,
  }),
);

const EASINGS: AnimEntry[] = Object.entries(animationToken.easing).map(
  ([key, entry]) => ({
    key,
    value: (entry as { value: string }).value,
    tw: key === 'ease-in-out' ? 'ease-in-out' : key === 'linear' ? 'ease-linear' : key,
  }),
);

function AnimatedBar({ duration, easing }: { duration: string; easing: string }) {
  return (
    <div className="w-full h-2 bg-surface-inset rounded-sm overflow-hidden relative">
      <div
        className="w-10 h-2 bg-surface-primary rounded-sm absolute left-0"
        style={{ transition: `transform ${duration} ${easing}` }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(200px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
        }}
      />
    </div>
  );
}

export const Durations: Story = {
  name: 'デュレーション',
  parameters: {
    docs: {
      description: {
        story: 'fast (100ms) から slower (500ms) までの 4 段階。バーにホバーして速度を比較。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {DURATIONS.map((d) => (
        <div
          key={d.key}
          className="flex items-center gap-4 p-4 rounded-md border border-border-subtle bg-surface"
        >
          <div className="w-[120px] flex-shrink-0 flex flex-col gap-1">
            <code className="bg-surface-inset text-onSurface px-[6px] py-[2px] rounded-sm font-mono text-xs inline-block self-start">
              {d.key}
            </code>
            <span className="text-xs font-mono text-onSurface-muted">{d.value}</span>
            <span className="text-xs font-mono text-onSurface-muted">{d.tw}</span>
          </div>
          <div className="flex-1">
            <AnimatedBar duration={d.value} easing="cubic-bezier(0.4, 0, 0.2, 1)" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Easings: Story = {
  name: 'イージング',
  parameters: {
    docs: {
      description: {
        story: 'イージング関数。バーにホバーして動きを比較。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {EASINGS.map((e) => (
        <div
          key={e.key}
          className="flex items-center gap-4 p-4 rounded-md border border-border-subtle bg-surface"
        >
          <div className="w-[120px] flex-shrink-0 flex flex-col gap-1">
            <code className="bg-surface-inset text-onSurface px-[6px] py-[2px] rounded-sm font-mono text-xs inline-block self-start">
              {e.key}
            </code>
            <span className="text-xs font-mono text-onSurface-muted">{e.tw}</span>
          </div>
          <div className="flex-1">
            <AnimatedBar duration="300ms" easing={e.value} />
          </div>
          <span className="text-xs font-mono text-onSurface-muted flex-shrink-0 min-w-[200px] text-right">
            {e.value}
          </span>
        </div>
      ))}
    </div>
  ),
};
