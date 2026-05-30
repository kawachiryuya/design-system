import React, { useState } from 'react';
import { Icon } from '../../primitives/Icon';

/** Avatar のサイズ */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Avatar の形状 */
export type AvatarShape = 'circle' | 'square';

/** Avatar のオンラインステータス */
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

/**
 * Avatar Props
 *
 * ユーザー画像。`src` 不在/読込失敗時は `name` のイニシャル、それも無ければアイコンへフォールバック。
 * `role="img"` + `aria-label`（name や alt + ステータス）を自動付与。
 *
 * @example
 *   // 基本（画像 + 名前）
 *   <Avatar src="/user.jpg" name="田中 太郎" />
 *
 * @example
 *   // 名前だけ（イニシャル + 名前ハッシュで色決定）
 *   <Avatar name="田中 太郎" size="lg" />
 *
 * @example
 *   // オンラインステータス付き（チャット用途）
 *   <Avatar
 *     src="/user.jpg"
 *     name="田中 太郎"
 *     status="online"
 *   />
 *
 * @example
 *   // 角丸（チームアイコン等）
 *   <Avatar src="/team.jpg" alt="チーム A" shape="square" size="md" />
 *
 * @example
 *   // フォールバック表示（src も name もなし）
 *   <Avatar size="lg" />
 *
 * @see principles/Foundation/accessibility/overview.md
 */
export interface AvatarProps {
  /** 画像 URL。未指定 / 読込失敗時は `name` イニシャル → アイコンの順にフォールバック。 */
  src?: string;
  /**
   * 画像の代替テキスト。装飾のみの場合は空文字 `""`。
   * `name` 指定時はそれが優先で `aria-label` に反映される。
   */
  alt?: string;
  /**
   * ユーザー名。
   * - `src` 不在時のイニシャルフォールバック生成（最大 2 文字）に使用
   * - `aria-label` に反映
   * - 名前ハッシュで背景色を決定論的に選択
   */
  name?: string;
  /**
   * サイズ。
   * - `xs` 24px、サイドバー・コメント
   * - `sm` 32px、リスト
   * - `md` 40px、標準
   * - `lg` 56px、プロフィールカード
   * - `xl` 80px、プロフィール画面ヒーロー
   * @default 'md'
   */
  size?: AvatarSize;
  /**
   * 形状。
   * - `circle` 円形（個人アカウント）
   * - `square` 角丸正方形（チーム・組織）
   * @default 'circle'
   */
  shape?: AvatarShape;
  /**
   * オンラインステータス。`true` で右下にドット表示、`aria-label` にも追記される。
   * - `online` 緑、`offline` グレー、`busy` 赤、`away` 黄
   */
  status?: AvatarStatus;
  /** 追加 CSS クラス。 */
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
