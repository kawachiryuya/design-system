import React, { useState } from 'react';

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
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  busy: 'bg-error-500',
  away: 'bg-warning-400',
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
    'bg-primary-500',
    'bg-info-500',
    'bg-success-600',
    'bg-warning-600',
    'bg-error-500',
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
    showInitials ? getInitialsBgColor(name) : 'bg-neutral-200',
    className,
  ].join(' ');

  const ariaLabel = name || alt || 'ユーザーアバター';

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
          className={`font-semibold text-white leading-none ${sizes.text}`}
          aria-hidden="true"
        >
          {getInitials(name)}
        </span>
      ) : (
        // 画像もnameもない場合はプレースホルダーアイコン
        <svg
          className="w-1/2 h-1/2 text-neutral-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}

      {status && (
        <span
          className={[
            'absolute',
            'bottom-0',
            'right-0',
            'block',
            'ring-2',
            'ring-white',
            'rounded-full',
            sizes.statusDot,
            statusColorMap[status],
          ].join(' ')}
          role="img"
          aria-label={statusLabelMap[status]}
        />
      )}
    </span>
  );
};

Avatar.displayName = 'Avatar';
