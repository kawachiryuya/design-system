import React from 'react';
import { getIconDef, type IconRenderMode } from './iconRegistry';

/**
 * Icon Props
 * Reference: principles/Typography/iconography/
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** レジストリからアイコンを取得（children と排他） */
  name?: string;
  /** アイコンのサイズ（principles/Typography/iconography/sizes.md） */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** アイコンの色（セマンティックカラー） */
  color?: 'inherit' | 'neutral' | 'primary' | 'success' | 'error' | 'warning' | 'info' | 'disabled';
  /**
   * アクセシブルなラベル（aria-label）。
   * 装飾目的のみのアイコンは省略し、aria-hidden が自動で true になる。
   * インタラクティブ要素やテキストなしで意味を伝える場合は必ず指定する。
   */
  label?: string;
  /** レンダリングモード: fill=Material Icons, stroke=Heroicons系。name 指定時はレジストリから自動判定。 */
  variant?: IconRenderMode;
  /** SVGアイコンのchildren（name と排他） */
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
 * Icon Component
 *
 * Atomic Design: Atom
 *
 * SVGアイコンのラッパー。サイズ・カラー・アクセシビリティを統一的に管理する。
 * Material Symbols Outlined を推奨アイコンソースとし、カスタム SVG も利用可能。
 *
 * @example
 * // レジストリからアイコンを取得
 * <Icon name="search" size="md" />
 *
 * // カスタム SVG（stroke 系）
 * <Icon size="md"><path d="..." /></Icon>
 *
 * // カスタム SVG（fill 系）
 * <Icon size="md" variant="fill"><path d="..." /></Icon>
 *
 * // カラー指定
 * <Icon name="error" size="md" color="error" />
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
