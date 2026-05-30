import React from 'react';

/** Label のサイズ */
export type LabelSize = 'small' | 'medium' | 'large';

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
 *   <Label htmlFor="phone" size="large" required>電話番号</Label>
 *
 * @see principles/Patterns/forms.md
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 関連付けるフォームフィールドの `id`（HTML `<label for="...">` に対応）。 */
  htmlFor?: string;
  /**
   * ラベルのサイズ（typography トークンに対応）。
   * - `small` 12px、`medium` 14px、`large` 16px
   * @default 'medium'
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
 * Label — Atomic Design: Atom
 *
 * @see LabelProps for usage examples.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      htmlFor,
      size = 'medium',
      required = false,
      optional = false,
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = [
      'inline-flex',
      'items-center',
      'gap-1',
      'font-normal',
      'leading-tight',
      'select-none',
    ];

    // Size styles (tokens/typography.json + spacing.json)
    const sizeStyles = {
      small: ['text-xs'],   // 12px
      medium: ['text-sm'],  // 14px
      large: ['text-base'], // 16px
    };

    // State styles
    const stateStyles = disabled
      ? ['text-onSurface-disabled', 'cursor-not-allowed']
      : ['text-onSurface', 'cursor-pointer'];

    const labelClasses = [
      ...baseStyles,
      ...sizeStyles[size],
      ...stateStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={labelClasses}
        {...props}
      >
        {children}

        {/* 必須マーク（required と optional は排他的。required を優先） */}
        {required && !optional && (
          <span
            className="text-onSurface-error font-normal"
            aria-label="必須"
          >
            *
          </span>
        )}

        {/* 任意マーク */}
        {optional && !required && (
          <span className="text-onSurface-subtle font-normal text-xs">
            （任意）
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
