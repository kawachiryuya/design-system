import React, { useState } from 'react';
import { Icon } from '../Icon';

/**
 * Image Props
 * Reference: principles/content/ / principles/foundation/accessibility/overview.md
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** 画像URL */
  src: string;
  /** 代替テキスト（装飾画像は空文字 "" を明示的に渡す） */
  alt: string;
  /** アスペクト比コンテナ */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  /** object-fit */
  objectFit?: 'cover' | 'contain' | 'fill';
  /** 角丸 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** 遅延読み込み */
  lazy?: boolean;
  /** エラー時に表示する代替コンテンツ（省略時はプレースホルダー） */
  fallback?: React.ReactNode;
  /** 追加CSSクラス（コンテナに適用） */
  className?: string;
}

const aspectRatioStyles = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
  auto: '',
};

const objectFitStyles = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-xs',
  md: 'rounded',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const FallbackPlaceholder: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-surface-disabled">
    <Icon name="image" size="xl" color="disabled" />
  </div>
);

/**
 * Image Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Image src="/photo.jpg" alt="チームの集合写真" aspectRatio="video" />
 * <Image src="/logo.png" alt="" aspectRatio="square" objectFit="contain" />
 * <Image src="/portrait.jpg" alt="山田 花子" aspectRatio="portrait" rounded="full" />
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = 'auto',
  objectFit = 'cover',
  rounded = 'none',
  lazy = true,
  fallback,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const isDecorative = alt === '';

  const containerClass = [
    'relative',
    'overflow-hidden',
    'bg-surface-disabled',
    aspectRatioStyles[aspectRatio],
    roundedStyles[rounded],
    className,
  ].filter(Boolean).join(' ');

  const imgClass = [
    aspectRatio !== 'auto' ? 'absolute inset-0 w-full h-full' : 'w-full h-auto block',
    objectFitStyles[objectFit],
    roundedStyles[rounded],
  ].join(' ');

  const imgElement = !hasError ? (
    <img
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      role={isDecorative ? 'presentation' : undefined}
      className={imgClass}
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
    <div className={containerClass}>
      {imgElement}
    </div>
  );
};

Image.displayName = 'Image';
