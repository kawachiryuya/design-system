import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';

const SAMPLE_IMG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop';
const PORTRAIT_IMG = 'https://i.pravatar.cc/300?img=47';

const meta: Meta<typeof Image> = {
  title: 'Primitives/_Image',
  component: Image,
  tags: ['autodocs'],
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

export const Default: Story = {};

export const AllAspectRatios: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-96">
      {(['square', 'video', 'portrait', 'wide'] as const).map((ratio) => (
        <div key={ratio}>
          <Image src={SAMPLE_IMG} alt="風景" aspectRatio={ratio} rounded="md" />
          <p className="text-xs text-onSurface-muted mt-1 text-center">{ratio}</p>
        </div>
      ))}
    </div>
  ),
};

export const AllObjectFit: Story = {
  render: () => (
    <div className="flex gap-4 w-96">
      {(['cover', 'contain', 'fill'] as const).map((fit) => (
        <div key={fit} className="flex-1">
          <Image src={SAMPLE_IMG} alt="風景" aspectRatio="square" objectFit={fit} />
          <p className="text-xs text-onSurface-muted mt-1 text-center">{fit}</p>
        </div>
      ))}
    </div>
  ),
};

export const Rounded: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-end w-96">
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
        <div key={r} className="flex flex-col items-center gap-1">
          <Image src={PORTRAIT_IMG} alt="プロフィール" aspectRatio="square"
            rounded={r} className="w-16" />
          <span className="text-xs text-onSurface-muted">{r}</span>
        </div>
      ))}
    </div>
  ),
};

export const ErrorFallback: Story = {
  name: '読み込みエラー（デフォルトフォールバック）',
  args: { src: 'https://invalid-url.example.com/image.jpg', alt: '存在しない画像' },
};

export const CustomFallback: Story = {
  name: '読み込みエラー（カスタムフォールバック）',
  args: {
    src: 'https://invalid-url.example.com/image.jpg',
    alt: '存在しない画像',
    fallback: (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-disabled text-onSurface-disabled gap-2">
        <span className="text-3xl">🖼️</span>
        <span className="text-xs">画像を読み込めませんでした</span>
      </div>
    ),
  },
};

export const Decorative: Story = {
  name: '装飾画像（alt="" + role="presentation"）',
  args: { alt: '', src: SAMPLE_IMG, aspectRatio: 'wide' },
};

export const BlogCard: Story = {
  name: '実践例: ブログカードのサムネイル',
  render: () => (
    <article className="w-72 border border-border-muted rounded-lg overflow-hidden">
      <Image src={SAMPLE_IMG} alt="山岳地帯の風景" aspectRatio="video" />
      <div className="p-4 space-y-2">
        <p className="text-xs text-onSurface-muted">2026.02.21</p>
        <h3 className="text-base font-medium text-onSurface leading-snug">
          デザインシステム構築のすすめ
        </h3>
        <p className="text-sm text-onSurface-muted line-clamp-2">
          一貫したUIを素早く組み立てるための基盤として、デザインシステムが果たす役割を解説します。
        </p>
      </div>
    </article>
  ),
};

export const Gallery: Story = {
  name: '実践例: 写真グリッド',
  render: () => (
    <div className="grid grid-cols-3 gap-1 w-72">
      {Array.from({ length: 6 }).map((_, i) => (
        <Image key={i} src={`https://picsum.photos/seed/${i + 1}/200`}
          alt={`写真 ${i + 1}`} aspectRatio="square" />
      ))}
    </div>
  ),
};
