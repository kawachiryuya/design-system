import React from 'react';
import { tv } from '../../_internal/tv';

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
 * Divider のボーダースタイル定義 — `tailwind-variants` で orientation × weight を宣言的に保持。
 *
 * - base: 共通の border 色
 * - compoundVariants: 向き (top/left) × 太さ (1px/2px) の組合せ
 *
 * 注: Divider は orientation/label の組合せで描画 DOM が分岐 (hr / div / div+text) する。
 *     ここで導出するのは border ユーティリティ class のみで、container DOM は JSX 側で決める。
 */
const dividerBorderVariants = tv({
  base: 'border-border-subtle',
  variants: {
    orientation: {
      horizontal: '',
      vertical:   '',
    },
    weight: {
      thin:   '',
      normal: '',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', weight: 'thin',   class: 'border-t' },
    { orientation: 'horizontal', weight: 'normal', class: 'border-t-2' },
    { orientation: 'vertical',   weight: 'thin',   class: 'border-l' },
    { orientation: 'vertical',   weight: 'normal', class: 'border-l-2' },
  ],
  defaultVariants: { orientation: 'horizontal', weight: 'thin' },
});

/**
 * Divider — Atomic Design: Atom
 *
 * @see DividerProps for usage examples.
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  weight = 'thin',
  className,
}) => {
  const borderClass = dividerBorderVariants({ orientation, weight });

  if (orientation === 'vertical') {
    return (
      <div data-ds-root
        role="separator"
        aria-orientation="vertical"
        className={['self-stretch', borderClass, className].filter(Boolean).join(' ')}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={['flex items-center gap-3', className].filter(Boolean).join(' ')}
      >
        <div className={`flex-1 ${borderClass}`} />
        <span className="text-sm text-onSurface-muted whitespace-nowrap select-none">
          {label}
        </span>
        <div className={`flex-1 ${borderClass}`} />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={['w-full border-0 m-0', borderClass, className].filter(Boolean).join(' ')}
    />
  );
};

Divider.displayName = 'Divider';
