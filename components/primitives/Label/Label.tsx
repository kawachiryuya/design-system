import React from 'react';
import { tv } from '../../_internal/tv';

/** Label のサイズ */
export type LabelSize = 'sm' | 'md' | 'lg';

/**
 * Label Props
 *
 * フォームフィールドのラベル。必須/任意の状態を視覚的・a11y 的に伝える。
 * `required` と `optional` は同時指定すると `required` が優先される（実装側のフォールバック）。
 *
 * @example
 *   // 必須項目
 *   <Label htmlFor="email" required>メールアドレス</Label>
 *
 * @example
 *   // 任意項目
 *   <Label htmlFor="nickname" optional>ニックネーム</Label>
 *
 * @example
 *   // フィールドが disabled の時に追従
 *   <Label htmlFor="readonly-field" disabled>読み取り専用</Label>
 *
 * @example
 *   // 大サイズ（モバイル CTA フォーム）
 *   <Label htmlFor="phone" size="lg" required>電話番号</Label>
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 関連付けるフォームフィールドの `id`（HTML `<label for="...">` に対応）。 */
  htmlFor?: string;
  /**
   * ラベルのサイズ（typography トークンに対応）。
   * - `sm` 12px、`md` 14px、`lg` 16px
   * @default 'md'
   */
  size?: LabelSize;
  /**
   * 必須項目マーク（`*` を `aria-label="必須"` 付きで表示）。
   * @default false
   */
  required?: boolean;
  /**
   * 任意項目マーク（「（任意）」を表示）。
   * @default false
   */
  optional?: boolean;
  /**
   * 無効状態。関連フィールドが `disabled` のときに合わせて使う。
   * @default false
   */
  disabled?: boolean;
  /** ラベルテキスト（必須）。 */
  children: React.ReactNode;
}

/**
 * Label のスタイル定義 — `tailwind-variants` で size / disabled を宣言的に保持。
 *
 * - base: 全 size 共通 (flex / font / select-none)
 * - variants.size: text-size のみ (sm=12px / md=14px / lg=16px)
 * - variants.disabled: 操作不能化 (色 + cursor)
 *
 * required/optional マークは JSX 側で条件分岐。required と optional の同時指定は
 * required を優先するフォールバックを JSX 側で実装。
 */
const labelVariants = tv({
  base: ['inline-flex', 'items-center', 'gap-1', 'font-normal', 'leading-tight', 'select-none'],
  variants: {
    // size は semantic typography token に対応:
    // - sm: text-caption (12px regular)
    // - md: text-body-sm (14px regular)
    // - lg: text-body-md (16px regular)
    // Label.base の font-normal を維持するため text-label (medium) は使わず body-sm 経由で regular に
    size: {
      sm: 'text-caption',
      md: 'text-body-sm',
      lg: 'text-body-md',
    },
    disabled: {
      true:  'text-onSurface-disabled cursor-not-allowed',
      false: 'text-onSurface cursor-pointer',
    },
  },
  defaultVariants: { size: 'md', disabled: false },
});

/**
 * Label — Atomic Design: Atom
 *
 * @see LabelProps for usage examples.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      htmlFor,
      size,
      required = false,
      optional = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={labelVariants({ size, disabled, className })}
        {...props}
      >
        {children}

        {/* 必須マーク (required と optional は排他的。required を優先) */}
        {required && !optional && (
          <span
            className="text-onSurface-error font-normal"
            aria-label="必須"
          >
            *
          </span>
        )}

        {/* 任意マーク。`text-onSurface-muted` で AA 4.5:1 (4.69:1) を確保 */}
        {optional && !required && (
          <span className="text-onSurface-muted font-normal text-caption">
            （任意）
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
