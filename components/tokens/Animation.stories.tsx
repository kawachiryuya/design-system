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

/** 自動ループする可視化バー。animationName で keyframes を切替、duration / easing は CSS 側で指定。 */
function LoopingBar({
  animationName,
  duration,
  easing,
}: {
  animationName: string;
  duration: string;
  easing: string;
}) {
  return (
    <div className="w-full h-2 bg-surface-inset rounded-sm overflow-hidden relative">
      <div
        className="w-10 h-2 bg-surface-primary rounded-sm absolute top-0"
        style={{
          animation: `${animationName} ${duration} infinite`,
          animationTimingFunction: easing,
        }}
      />
    </div>
  );
}

/** 全 story 共通サイクル長 (ms)。各行はこの長さでループし、token duration 中だけ動いて残りは静止。 */
const ANIMATION_CYCLE_MS = 2500;

/** 動きの後に長い静止を挟む keyframes を生成。token duration 中だけ動き、残りは pause。 */
function generateKeyframes(name: string, motionMs: number): string {
  const forwardPct = (motionMs / ANIMATION_CYCLE_MS) * 100;
  const returnEndPct = 50 + forwardPct;
  return `
@keyframes ${name} {
  0% { left: 0; }
  ${forwardPct.toFixed(2)}% { left: calc(100% - 2.5rem); }
  50% { left: calc(100% - 2.5rem); }
  ${returnEndPct.toFixed(2)}% { left: 0; }
  100% { left: 0; }
}
`;
}

const DURATION_KEYFRAMES = DURATIONS
  .map((d) => generateKeyframes(`tokens-animation-slide-${d.key}`, parseInt(d.value, 10)))
  .join('\n');

/** Easings 側は全行 800ms の動き + 同じ pause パターン (1 keyframe で全 easing 共有)。 */
const EASING_MOTION_MS = 800;
const EASING_KEYFRAMES = generateKeyframes('tokens-animation-slide-easing', EASING_MOTION_MS);

const Row: React.FC<{ entry: AnimEntry; bar: React.ReactNode; trailingValue?: string }> = ({
  entry,
  bar,
  trailingValue,
}) => (
  <div className="flex items-center gap-4 p-4 rounded-md border border-border-subtle bg-surface">
    <div className="w-[120px] flex-shrink-0 flex flex-col gap-1">
      <code className="bg-surface-inset text-onSurface px-1.5 py-0.5 rounded-sm font-mono text-xs inline-block self-start">
        {entry.key}
      </code>
      <span className="text-xs font-mono text-onSurface-muted">{entry.value}</span>
      <span className="text-xs font-mono text-onSurface-muted">{entry.tw}</span>
    </div>
    <div className="flex-1 min-w-[260px]">{bar}</div>
    {trailingValue && (
      <span className="text-xs font-mono text-onSurface-muted flex-shrink-0 min-w-[200px] text-right">
        {trailingValue}
      </span>
    )}
  </div>
);

export const Durations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'アニメーションの長さ。fast (100ms) → slower (500ms) の 4 段階。全行が 2.5 秒のサイクルで同期し、各 token の duration 中だけ動いて残りは静止する。長さの差を直接比較できる。',
      },
    },
  },
  render: () => (
    <>
      <style>{DURATION_KEYFRAMES}</style>
      <div className="flex flex-col gap-4">
        {DURATIONS.map((d) => (
          <Row
            key={d.key}
            entry={d}
            bar={
              <LoopingBar
                animationName={`tokens-animation-slide-${d.key}`}
                duration={`${ANIMATION_CYCLE_MS}ms`}
                easing="cubic-bezier(0.4, 0, 0.2, 1)"
              />
            }
          />
        ))}
      </div>
    </>
  ),
};

export const Easings: Story = {
  parameters: {
    docs: {
      description: {
        story: 'アニメーション中の速度カーブ。全行が 2.5 秒のサイクルで同期し、共通の 800ms 区間だけ各 easing で動いて残りは静止する。加減速の差を直接比較できる。',
      },
    },
  },
  render: () => (
    <>
      <style>{EASING_KEYFRAMES}</style>
      <div className="flex flex-col gap-4">
        {EASINGS.map((e) => (
          <Row
            key={e.key}
            entry={e}
            bar={
              <LoopingBar
                animationName="tokens-animation-slide-easing"
                duration={`${ANIMATION_CYCLE_MS}ms`}
                easing={e.value}
              />
            }
            trailingValue={e.value}
          />
        ))}
      </div>
    </>
  ),
};
