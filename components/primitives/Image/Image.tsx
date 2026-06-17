'use client';

import React, { useState } from 'react';
import { tv } from '../../_internal/tv';
import { Icon } from '../Icon';

/** アスペクト比プリセット */
export type ImageAspectRatio = 'square' | 'video' | 'portrait' | 'wide' | 'auto';

/** object-fit 挙動 */
export type ImageObjectFit = 'cover' | 'contain' | 'fill';

/** 角丸サイズ */
export type ImageRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Image Props
 *
 * `<img>` のラッパー。アスペクト比固定 / object-fit / フォールバック / lazy 読み込みを統合。
 * a11y: `alt` 必須化。装飾画像は空文字 `""` を明示的に渡す（`role="presentation"` 自動付与）。
 *
 * @example
 *   // 基本（16:9 のサムネイル）
 *   <Image src="/photo.jpg" alt="チームの集合写真" aspectRatio="video" />
 *
 * @example
 *   // ロゴ（正方形 + contain）
 *   <Image src="/logo.png" alt="" aspectRatio="square" objectFit="contain" />
 *
 * @example
 *   // プロフィール画像（円形）
 *   <Image src="/avatar.jpg" alt="山田 花子" aspectRatio="square" rounded="full" />
 *
 * @example
 *   // 装飾画像（alt="" で a11y 観点の対応）
 *   <Image src="/decoration.svg" alt="" aspectRatio="auto" />
 *
 * @example
 *   // エラー時カスタムフォールバック
 *   <Image
 *     src={maybeBrokenUrl}
 *     alt="プロフィール"
 *     fallback={<DefaultAvatar />}
 *   />
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** 画像 URL（必須）。 */
  src: string;
  /**
   * 代替テキスト（必須）。
   * - **意味のある画像**: 内容を簡潔に説明する日本語/英語
   * - **装飾画像**: 空文字 `""` を明示的に渡す → `role="presentation"` 自動付与
   */
  alt: string;
  /**
   * アスペクト比プリセット。
   * - `square` 1:1, `video` 16:9, `portrait` 3:4, `wide` 21:9
   * - `auto` 比率固定なし（画像本来のサイズで描画）
   * @default 'auto'
   */
  aspectRatio?: ImageAspectRatio;
  /**
   * object-fit 挙動。
   * - `cover`: コンテナを埋め、はみ出し部分は切り抜き
   * - `contain`: コンテナ内に全体を収め、余白を許容
   * - `fill`: コンテナを変形して埋める（歪みあり、通常非推奨）
   * @default 'cover'
   */
  objectFit?: ImageObjectFit;
  /**
   * 角丸サイズ。
   * @default 'none'
   */
  rounded?: ImageRounded;
  /**
   * 遅延読み込み（`loading="lazy"`）。Above-the-fold 画像は `false` に。
   * @default true
   */
  lazy?: boolean;
  /** 読み込みエラー時に表示する代替コンテンツ。省略時はプレースホルダーアイコン。 */
  fallback?: React.ReactNode;
  /** コンテナに適用される追加 CSS クラス。 */
  className?: string;
}

/**
 * Image のスタイル定義 — `tailwind-variants` で aspectRatio × objectFit × rounded を
 * 宣言的に保持。aspectRatio='auto' は img を bare で描画、それ以外は container div で
 * ラップして absolute 配置するため、container と img で別 variants を用意する。
 */
const imageContainerVariants = tv({
  base: 'relative overflow-hidden bg-surface-disabled',
  variants: {
    aspectRatio: {
      square:   'aspect-square',
      video:    'aspect-video',
      portrait: 'aspect-[3/4]',
      wide:     'aspect-[21/9]',
      auto:     '',
    },
    rounded: {
      none: 'rounded-none',
      sm:   'rounded-sm',
      md:   'rounded',
      lg:   'rounded-lg',
      full: 'rounded-full',
    },
  },
});

const imageImgVariants = tv({
  base: '',
  variants: {
    // aspectRatio='auto' は通常フロー、それ以外は container 内で absolute 配置
    aspectRatio: {
      auto:     'w-full h-auto block',
      square:   'absolute inset-0 w-full h-full',
      video:    'absolute inset-0 w-full h-full',
      portrait: 'absolute inset-0 w-full h-full',
      wide:     'absolute inset-0 w-full h-full',
    },
    objectFit: {
      cover:   'object-cover',
      contain: 'object-contain',
      fill:    'object-fill',
    },
    rounded: {
      none: 'rounded-none',
      sm:   'rounded-sm',
      md:   'rounded',
      lg:   'rounded-lg',
      full: 'rounded-full',
    },
  },
});

const FallbackPlaceholder: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-surface-disabled">
    <Icon name="image" size="xl" color="disabled" />
  </div>
);

/**
 * Image — Atomic Design: Atom
 *
 * @see ImageProps for usage examples.
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = 'auto',
  objectFit = 'cover',
  rounded = 'none',
  lazy = true,
  fallback,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const isDecorative = alt === '';

  const imgElement = !hasError ? (
    <img
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      role={isDecorative ? 'presentation' : undefined}
      className={imageImgVariants({ aspectRatio, objectFit, rounded })}
      onError={() => setHasError(true)}
      {...props}
    />
  ) : (
    fallback ?? <FallbackPlaceholder />
  );

  if (aspectRatio === 'auto') {
    return imgElement as React.ReactElement;
  }

  return (
    <div className={imageContainerVariants({ aspectRatio, rounded, className })}>
      {imgElement}
    </div>
  );
};

Image.displayName = 'Image';
