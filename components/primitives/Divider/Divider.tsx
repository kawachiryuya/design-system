import React from 'react';

/** Divider の向き */
export type DividerOrientation = 'horizontal' | 'vertical';

/** Divider の線の太さ */
export type DividerWeight = 'thin' | 'normal';

/**
 * Divider Props
 *
 * セクション区切り。`role="separator"` 自動付与で a11y 対応。
 *
 * @example
 *   // 基本（水平、薄い線）
 *   <Divider />
 *
 * @example
 *   // 中央ラベル付き（フォーム内の OR 区切り）
 *   <Divider label="または" />
 *
 * @example
 *   // 垂直（フレックスコンテナ内のアイテム区切り）
 *   <Divider orientation="vertical" />
 *
 * @example
 *   // 太線（強調的な区切り）
 *   <Divider weight="normal" />
 *
 * @see principles/layout/
 */
export interface DividerProps {
  /**
   * Divider の向き。
   * - `horizontal` 水平（`<hr>`、または label 付きなら `<div>`）
   * - `vertical` 垂直（`self-stretch` で親フレックスの高さに合わせる）
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * 中央に表示するラベルテキスト（`orientation='horizontal'` のみ有効）。
   * 「または」「以上」等のセクション間の関係を明示する用途。
   */
  label?: string;
  /**
   * 線の太さ。
   * - `thin` 1px（標準）
   * - `normal` 2px（強調）
   * @default 'thin'
   */
  weight?: DividerWeight;
  /** 追加 CSS クラス。 */
  className?: string;
}

/**
 * Divider — Atomic Design: Atom
 *
 * @see DividerProps for usage examples.
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  weight = 'thin',
  className = '',
}) => {
  const borderColor = 'border-border-muted';
  const hBorderClass = weight === 'thin' ? 'border-t' : 'border-t-2';
  const vBorderClass = weight === 'thin' ? 'border-l' : 'border-l-2';

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={[
          'self-stretch',
          vBorderClass,
          borderColor,
          className,
        ].join(' ')}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={['flex', 'items-center', 'gap-3', className].join(' ')}
      >
        <div className={['flex-1', hBorderClass, borderColor].join(' ')} />
        <span className="text-sm text-onSurface-muted whitespace-nowrap select-none">
          {label}
        </span>
        <div className={['flex-1', hBorderClass, borderColor].join(' ')} />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={[
        'w-full',
        'border-0',
        hBorderClass,
        borderColor,
        'm-0',
        className,
      ].join(' ')}
    />
  );
};

Divider.displayName = 'Divider';
