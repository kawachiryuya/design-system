import React from 'react';
import { getIconDef, type IconRenderMode } from './iconRegistry';

/** Icon のサイズ（principles/Typography/iconography/sizes.md） */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/** Icon のセマンティックカラー */
export type IconColor =
  | 'inherit'
  | 'neutral'
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'disabled';

/**
 * Icon Props
 *
 * SVG アイコンのラッパー。サイズ・カラー・アクセシビリティを統一管理。
 * `name` で iconRegistry から取得、または `children` でカスタム SVG パスを直接渡す。
 *
 * @example
 *   // レジストリからアイコン取得（推奨）
 *   <Icon name="search" size="md" />
 *
 * @example
 *   // 意味のあるアイコン（label 必須、role="img" 自動付与）
 *   <Icon name="error" size="md" color="error" label="エラー" />
 *
 * @example
 *   // 装飾目的（label 省略 → aria-hidden="true" 自動付与）
 *   <Icon name="chevron_right" size="sm" />
 *
 * @example
 *   // カスタム SVG パス（stroke 系・デフォルト）
 *   <Icon size="md" label="カスタム"><path d="M3 12h18" /></Icon>
 *
 * @example
 *   // カスタム SVG パス（fill 系、Material Icons 系）
 *   <Icon size="md" variant="fill"><path d="..." /></Icon>
 *
 * @see principles/Typography/iconography/
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * iconRegistry に登録されたアイコン名。`children` と排他。
   * 利用可能な name 一覧は `getIconNames()` で取得可能。
   */
  name?: string;
  /**
   * アイコンサイズ（px は内部で 20/24/32/48 にマップ）。
   * @default 'md'
   */
  size?: IconSize;
  /**
   * アイコンカラー。`inherit` は親要素の色を継承（Button 内のアイコン等で多用）。
   * @default 'inherit'
   */
  color?: IconColor;
  /**
   * アクセシブルなラベル（`aria-label`）。
   * - **意味のあるアイコン**（成功/警告/エラー等）: 必ず指定（`role="img"` 自動付与）
   * - **装飾目的**（テキスト隣のアイコン等）: 省略 → `aria-hidden="true"` 自動付与
   */
  label?: string;
  /**
   * レンダリングモード:
   * - `fill`: Material Icons 系（パスを塗りつぶし）
   * - `stroke`: Heroicons 系（パスを線描画）
   * `name` 指定時は iconRegistry から自動判定されるため通常不要。
   */
  variant?: IconRenderMode;
  /** カスタム SVG パス要素。`name` と排他。 */
  children?: React.ReactNode;
}

/** サイズ → px 値のマップ（principles/Typography/iconography/sizes.md） */
const sizePx = {
  sm:  20,
  md:  24,
  lg:  32,
  xl:  48,
} as const;

/** カラー → Tailwind クラスのマップ（semantic-colors.json） */
const colorClass = {
  inherit:  'text-current',
  neutral:  'text-onSurface',
  primary:  'text-onSurface-primary',
  success:  'text-onSurface-success',
  error:    'text-onSurface-error',
  warning:  'text-onSurface-warning',
  info:     'text-onSurface-info',
  disabled: 'text-onSurface-disabled',
} as const;

/**
 * Icon — Atomic Design: Atom
 *
 * @see IconProps for usage examples.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size = 'md',
      color = 'inherit',
      label,
      variant,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const def = name ? getIconDef(name) : undefined;
    const resolvedLabel = label ?? def?.label;
    const mode = def?.mode ?? variant ?? 'stroke';
    const viewBox = def?.viewBox ?? '0 0 24 24';
    const px = sizePx[size];

    const iconClasses = [
      'inline-block',
      'flex-shrink-0',
      colorClass[color],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const fillProps =
      mode === 'fill'
        ? { fill: 'currentColor', stroke: 'none' as const }
        : { fill: 'none' as const, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={px}
        height={px}
        viewBox={viewBox}
        {...fillProps}
        className={iconClasses}
        aria-hidden={resolvedLabel ? undefined : true}
        aria-label={resolvedLabel}
        role={resolvedLabel ? 'img' : undefined}
        focusable="false"
        {...props}
      >
        {def
          ? def.paths.map((d, i) => <path key={i} d={d} />)
          : children}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
