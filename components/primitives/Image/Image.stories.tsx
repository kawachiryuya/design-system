import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Image } from './Image';
import { Caption } from '@sb-blocks/Caption';

const SAMPLE_IMG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop';
const PORTRAIT_IMG = 'https://i.pravatar.cc/300?img=47';
const BROKEN_IMG = 'https://invalid-url.example.com/image.jpg';

/**
 * Image stories — 標準ストーリー構造に準拠
 *
 * 順序: Playground → Overview → EdgeCases
 * (Sizes は width/height 連続値で discrete サイズなし、States は Image が静的、
 *  WithIcon は icon prop なし、いずれも省略)
 *
 * Docs (Guideline) は Image.guideline.mdx 側で `<Meta of={...} />` 経由で統合される。
 */
const meta: Meta<typeof Image> = {
  title: 'Primitives/Image',
  component: Image,
  argTypes: {
    aspectRatio: { control: 'select', options: ['square', 'video', 'portrait', 'wide', 'auto'] },
    objectFit: { control: 'radio', options: ['cover', 'contain', 'fill'] },
    rounded: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    lazy: { control: 'boolean' },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
  args: {
    src: SAMPLE_IMG,
    alt: '山の風景写真',
    aspectRatio: 'video',
    objectFit: 'cover',
    rounded: 'none',
    lazy: true,
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Image>;

// ── 1. Playground ──────────────────────────────────────────────
// args を全開放、Controls から props を探索する起点。
// alt の自動反映 (img の accessible name) を play test で保証。

export const Playground: Story = {
  parameters: {
    // Playground は Controls 探索の起点 → 視覚回帰対象外 (#78 / §5-3: 静的カタログが VR 対象)
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story: 'Controls から props を切り替えて props 単位の挙動を確認する起点。alt が img の accessible name に反映されることを play test で保証。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByAltText('山の風景写真');
    await expect(img).toBeInTheDocument();
  },
};

// ── 2. Overview (VR 対象) ────────────────────────────────────────────────
// 5 種類のアスペクト比を静的に並べる。"どの比率の枠で見せるか" の判断材料。

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story: '5 種類のアスペクト比 (square 1:1 / video 16:9 / portrait 3:4 / wide 21:9 / auto = 比率固定なし) の比較。コンテンツの種類 (写真 / ロゴ / プロフィール / バナー / アイコン) で選ぶ。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-96">
      {(['square', 'video', 'portrait', 'wide'] as const).map((ratio) => (
        <Caption key={ratio} text={ratio}>
          <Image src={SAMPLE_IMG} alt="風景" aspectRatio={ratio} rounded="md" />
        </Caption>
      ))}
      <Caption text="auto (固定なし)">
        <Image src={PORTRAIT_IMG} alt="プロフィール" aspectRatio="auto" />
      </Caption>
    </div>
  ),
};

// ── 3. EdgeCases ───────────────────────────────────────────────
// objectFit (3 種) / rounded (5 段階) / 読み込みエラー fallback (default / custom) /
// 装飾画像 (alt="" + role="presentation") など、視覚や a11y の境界条件を確認。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'objectFit / rounded のサブ軸 / 読み込み失敗時の default フォールバック + custom フォールバック / alt="" の装飾画像扱いなど、Image の境界条件を一覧。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <Caption text="objectFit: cover (デフォルト) / contain (余白を許容) / fill (歪み、通常非推奨)">
        <div className="grid grid-cols-3 gap-2">
          {(['cover', 'contain', 'fill'] as const).map((fit) => (
            <div key={fit} className="flex flex-col gap-1">
              <Image src={SAMPLE_IMG} alt="風景" aspectRatio="square" objectFit={fit} />
              <span className="text-xs text-onSurface-muted text-center">{fit}</span>
            </div>
          ))}
        </div>
      </Caption>

      <Caption text="rounded: 5 段階の角丸 (none / sm / md / lg / full)">
        <div className="flex flex-wrap gap-3 items-end">
          {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
            <div key={r} className="flex flex-col items-center gap-1">
              <Image src={PORTRAIT_IMG} alt="プロフィール" aspectRatio="square" rounded={r} className="w-14" />
              <span className="text-xs text-onSurface-muted">{r}</span>
            </div>
          ))}
        </div>
      </Caption>

      <Caption text="読み込みエラー (デフォルト fallback) — onError で placeholder を表示">
        <div className="w-48">
          <Image src={BROKEN_IMG} alt="存在しない画像" aspectRatio="video" />
        </div>
      </Caption>

      <Caption text="読み込みエラー (カスタム fallback) — fallback prop で JSX 差し替え">
        <div className="w-48">
          <Image
            src={BROKEN_IMG}
            alt="存在しない画像"
            aspectRatio="video"
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-disabled text-onSurface-disabled gap-2">
                <span className="text-3xl">🖼️</span>
                <span className="text-xs">画像を読み込めませんでした</span>
              </div>
            }
          />
        </div>
      </Caption>

      <Caption text='装飾画像 — alt="" で role="presentation" が自動付与され SR から無視される'>
        <Image src={SAMPLE_IMG} alt="" aspectRatio="wide" />
      </Caption>
    </div>
  ),
};
