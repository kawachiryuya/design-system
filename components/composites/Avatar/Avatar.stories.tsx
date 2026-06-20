import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Caption } from '@sb-blocks/Caption';

/**
 * Avatar stories — VR 集約モデル (§5-3)
 *
 * 構成: Playground / Overview。
 * content(image→initials→placeholder) / size / shape / status は内在軸で Overview に集約。
 * ユーザーカード / アバターグループ / メンバーリスト等の usage 合成は guideline 参照。
 */
const meta: Meta<typeof Avatar> = {
  title: 'Composites/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'radio', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy', 'away'] },
    src: { control: 'text' },
    name: { control: 'text' },
    alt: { control: 'text' },
  },
  args: {
    name: '田中 太郎',
    size: 'md',
    shape: 'circle',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const IMG = 'https://i.pravatar.cc/150?img=7';

// ── 1. Playground (視覚回帰対象外) ──────────────────────────────

export const Playground: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から size / shape / status / src / name を切替。src 未指定時は name のイニシャル、それも無ければプレースホルダーアイコンへフォールバック。',
      },
    },
  },
};

// ── 2. Overview (視覚回帰対象) ──────────────────────────────────
// props で作れる内在軸を集約: content fallback / size / shape / status (定義的な軸から順に)。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '視覚回帰用の総覧。shape (circle/square) / size (xs〜xl) / content (image → initials → placeholder の 3 段フォールバック) / status (online/offline/busy/away) を 1 枚に集約。読込失敗時は initials に落ちる (結果は initials と同じ見た目)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">content fallback (image → initials → placeholder)</div>
        <div className="flex flex-wrap gap-4 items-center">
          <Caption text="Image (src 指定)"><Avatar src={IMG} name="田中 太郎" /></Caption>
          <Caption text="Initials (src なし)"><Avatar name="田中 太郎" /></Caption>
          <Caption text="placeholder (src/name なし)"><Avatar /></Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">size (xs 24 / sm 32 / md 40 / lg 48 / xl 64)</div>
        <div className="flex items-end gap-4">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size} name="田中 太郎" src={IMG} />
              <span className="text-caption text-onSurface-muted font-mono">{size}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">shape (circle 個人 / square チーム・組織) — 角丸のみ比較するためイニシャルで統一</div>
        <div className="flex gap-6 items-center">
          <Caption text="circle"><Avatar shape="circle" size="lg" name="田中 太郎" /></Caption>
          <Caption text="square"><Avatar shape="square" size="lg" name="チーム A" /></Caption>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">status (online / offline / busy / away)</div>
        <div className="flex gap-6 items-center">
          {(['online', 'offline', 'busy', 'away'] as const).map((status) => (
            <div key={status} className="flex flex-col items-center gap-1">
              <Avatar size="lg" name="田中 太郎" status={status} src={IMG} />
              <span className="text-caption text-onSurface-muted font-mono">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
