import React from 'react';

/**
 * Icon Props
 * Reference: principles/Typography/iconography/
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** アイコンのサイズ（principles/Typography/iconography/sizes.md） */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** アイコンの色（セマンティックカラー） */
  color?: 'inherit' | 'neutral' | 'primary' | 'success' | 'error' | 'warning' | 'disabled';
  /**
   * アクセシブルなラベル（aria-label）。
   * 装飾目的のみのアイコンは省略し、aria-hidden が自動で true になる。
   * インタラクティブ要素やテキストなしで意味を伝える場合は必ず指定する。
   */
  label?: string;
  /** SVGアイコンのchildren */
  children: React.ReactNode;
}

/** サイズ → px 値のマップ（principles/Typography/iconography/sizes.md） */
const sizePx = {
  xs:  12,
  sm:  16,
  md:  20,
  lg:  24,
  xl:  32,
  '2xl': 48,
} as const;

/** カラー → Tailwind クラスのマップ（tokens/colors.json） */
const colorClass = {
  inherit:  'text-current',
  neutral:  'text-neutral-700',
  primary:  'text-primary-600',
  success:  'text-success-600',
  error:    'text-error-600',
  warning:  'text-warning-600',
  disabled: 'text-neutral-400',
} as const;

/**
 * Icon Component
 *
 * Atomic Design: Atom
 *
 * SVGアイコンのラッパー。サイズ・カラー・アクセシビリティを統一的に管理する。
 * アイコンライブラリは Heroicons (Outline) を推奨。
 *
 * @example
 * // 装飾アイコン（aria-hidden）
 * <Icon size="md"><path d="..." /></Icon>
 *
 * // 意味を持つアイコン（aria-label あり）
 * <Icon size="md" label="検索"><path d="..." /></Icon>
 *
 * // カラー指定
 * <Icon size="md" color="error"><path d="..." /></Icon>
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 'md',
      color = 'inherit',
      label,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const px = sizePx[size];

    const iconClasses = [
      'inline-block',
      'flex-shrink-0',
      colorClass[color],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClasses}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? 'img' : undefined}
        focusable="false"
        {...props}
      >
        {children}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
