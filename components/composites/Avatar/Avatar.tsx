import React, { useState } from 'react';
import { Icon } from '../../primitives/Icon';

/**
 * Avatar Props
 * Reference: principles/foundation/accessibility/overview.md
 */
export interface AvatarProps {
  /** 画像URL */
  src?: string;
  /** 画像の代替テキスト（装飾のみの場合は空文字） */
  alt?: string;
  /** ユーザー名（イニシャルフォールバック生成に使用） */
  name?: string;
  /** アバターサイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 形状 */
  shape?: 'circle' | 'square';
  /** オンライン状態インジケーター */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** 追加CSSクラス */
  className?: string;
}

const sizeMap = {
  xs: { container: 'w-6 h-6', text: 'text-xs', statusDot: 'w-1.5 h-1.5' },
  sm: { container: 'w-8 h-8', text: 'text-xs', statusDot: 'w-2 h-2' },
  md: { container: 'w-10 h-10', text: 'text-sm', statusDot: 'w-2.5 h-2.5' },
  lg: { container: 'w-14 h-14', text: 'text-base', statusDot: 'w-3 h-3' },
  xl: { container: 'w-20 h-20', text: 'text-xl', statusDot: 'w-3.5 h-3.5' },
};

const statusColorMap = {
  online: 'bg-surface-success',
  offline: 'bg-surface-neutral',
  busy: 'bg-surface-error',
  away: 'bg-surface-warning',
};

const statusLabelMap = {
  online: 'オンライン',
  offline: 'オフライン',
  busy: '取り込み中',
  away: '離席中',
};

/** 名前からイニシャルを生成（最大2文字） */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** イニシャル背景色を名前から決定論的に選択 */
function getInitialsBgColor(name: string): string {
  const colors = [
    'bg-surface-primary',
    'bg-surface-info',
    'bg-surface-success',
    'bg-surface-warning',
    'bg-surface-error',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Avatar Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Avatar src="/user.jpg" name="田中 太郎" />
 * <Avatar name="田中 太郎" size="lg" status="online" />
 * <Avatar size="md" shape="square" />
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizes = sizeMap[size];
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded';
  const showImage = src && !imgError;
  const showInitials = !showImage && name;

  const containerClass = [
    'relative',
    'inline-flex',
    'flex-shrink-0',
    'items-center',
    'justify-center',
    'overflow-hidden',
    'select-none',
    sizes.container,
    shapeClass,
    showInitials ? getInitialsBgColor(name) : 'bg-surface-skeleton',
    className,
  ].join(' ');

  const baseLabel = name || alt || 'ユーザーアバター';
  const ariaLabel = status ? `${baseLabel}（${statusLabelMap[status]}）` : baseLabel;

  return (
    <span className={containerClass} role="img" aria-label={ariaLabel}>
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? ''}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : showInitials ? (
        <span
          className={`font-semibold text-onSurface-inverse leading-none ${sizes.text}`}
          aria-hidden="true"
        >
          {getInitials(name)}
        </span>
      ) : (
        // 画像もnameもない場合はプレースホルダーアイコン
        <Icon name="person" className="w-1/2 h-1/2 text-onSurface-muted" />
      )}

      {/* ステータスドットは aria-label を外側コンテナに統合済みのため aria-hidden */}
      {status && (
        <span
          className={[
            'absolute',
            'bottom-0',
            'right-0',
            'block',
            'ring-2',
            'ring-surface',
            'rounded-full',
            sizes.statusDot,
            statusColorMap[status],
          ].join(' ')}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

Avatar.displayName = 'Avatar';
