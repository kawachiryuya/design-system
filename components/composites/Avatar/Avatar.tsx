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
 * @see principles/Foundation/accessibility/overview.mdx
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
   * サイズ。container は全 step +8 等差 (24→32→40→48→64) で Material 3 / Carbon と整合。
   * - `xs` 24px、サイドバー・コメント
   * - `sm` 32px、リスト
   * - `md` 40px、標準
   * - `lg` 48px、プロフィールカード
   * - `xl` 64px、プロフィール画面ヒーロー
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

// container は全 step +8 等差 (24/32/40/48/64) で grid 整合。
// initials は container の 38-40% を狙う (xs は 24px で詰まるため text-xs 維持)。
// statusDot は container の 25% で統一。w-[6px] / w-[10px] は bracket リテラル
// (このリポは spacing scale から .5 step (1.5/2.5/3.5) を除外している、
// memory: custom-spacing-scale)。
const sizeMap = {
  xs: { container: 'w-6 h-6',   text: 'text-xs',  statusDot: 'w-[6px] h-[6px]' },
  sm: { container: 'w-8 h-8',   text: 'text-xs',  statusDot: 'w-2 h-2' },
  md: { container: 'w-10 h-10', text: 'text-base', statusDot: 'w-[10px] h-[10px]' },
  lg: { container: 'w-12 h-12', text: 'text-lg',  statusDot: 'w-3 h-3' },
  xl: { container: 'w-16 h-16', text: 'text-2xl', statusDot: 'w-4 h-4' },
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

  // 外側 wrapper: 位置基準のみ。overflow-visible で status dot が円形境界の外に出ても
  // クリップされない。inline-flex flex-shrink-0 でサイズ計算は外側で行う。
  const wrapperClass = [
    'relative',
    'inline-flex',
    'flex-shrink-0',
    sizes.container,
    className,
  ].join(' ');

  // 内側 image clipping container: 画像/イニシャルだけを円/角丸でクリップ。
  // status dot は wrapper 側に配置するため、ここの overflow-hidden の影響を受けない。
  const innerClass = [
    'flex',
    'items-center',
    'justify-center',
    'overflow-hidden',
    'select-none',
    'w-full',
    'h-full',
    shapeClass,
    showInitials ? getInitialsBgColor(name) : 'bg-surface-skeleton',
  ].join(' ');

  const baseLabel = name || alt || 'ユーザーアバター';
  const ariaLabel = status ? `${baseLabel}（${statusLabelMap[status]}）` : baseLabel;

  return (
    <span className={wrapperClass} role="img" aria-label={ariaLabel}>
      <span className={innerClass}>
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
      </span>

      {/* ステータスドットは aria-label を外側 wrapper に統合済みのため aria-hidden。
          wrapper 直下 (overflow-visible) に配置することで円形境界の外でもクリップされない。 */}
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
