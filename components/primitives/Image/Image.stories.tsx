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
        story: 'props で作れる内在軸を集約: aspectRatio (square / video / portrait / wide / auto) + objectFit (cover / contain / fill) + rounded (none〜full)。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">aspectRatio (square / video / portrait / wide / auto)</div>
        {/* Caption (items-start) だと絶対配置 img の比率ボックスが幅0に潰れるため、
            stretch する flex-col セルで囲んで幅を与える。 */}
        <div className="grid grid-cols-2 gap-4">
          {(['square', 'video', 'portrait', 'wide'] as const).map((ratio) => (
            <div key={ratio} className="flex flex-col gap-1">
              <Image src={SAMPLE_IMG} alt="風景" aspectRatio={ratio} rounded="md" />
              <span className="text-xs text-onSurface-muted">{ratio}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <Image src={PORTRAIT_IMG} alt="プロフィール" aspectRatio="auto" />
            <span className="text-xs text-onSurface-muted">auto (固定なし)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">objectFit: cover (デフォルト) / contain (余白許容) / fill (歪み、通常非推奨)</div>
        <div className="grid grid-cols-3 gap-2">
          {(['cover', 'contain', 'fill'] as const).map((fit) => (
            <div key={fit} className="flex flex-col gap-1">
              <Image src={SAMPLE_IMG} alt="風景" aspectRatio="square" objectFit={fit} />
              <span className="text-xs text-onSurface-muted text-center">{fit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-onSurface-muted">rounded (none / sm / md / lg / full)</div>
        <div className="flex flex-wrap gap-3 items-end">
          {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
            <div key={r} className="flex flex-col items-center gap-1">
              <Image src={PORTRAIT_IMG} alt="プロフィール" aspectRatio="square" rounded={r} className="w-14" />
              <span className="text-xs text-onSurface-muted">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 3. EdgeCases (VR 対象) ─────────────────────────────────────
// props だけでは作れない文脈依存: 読み込み失敗時の fallback UI (default / custom)。
// ※ objectFit / rounded は内在軸として Overview に集約。
// ※ 装飾画像 (alt="") は非視覚 (role 付与の差) なので VR から除外。

export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story: '読み込み失敗時の fallback: default (onError で placeholder) / custom (fallback prop で JSX 差し替え)。src の失敗という文脈で初めて出る状態。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-96">
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
    </div>
  ),
};
