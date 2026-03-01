import React from 'react';

/**
 * Label Props
 * Reference: principles/patterns/forms.md
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 関連付けるフォームフィールドのID */
  htmlFor?: string;
  /** ラベルのサイズ */
  size?: 'small' | 'medium' | 'large';
  /** 必須マーク（* を表示） */
  required?: boolean;
  /** 任意マーク（「任意」を表示） */
  optional?: boolean;
  /** 無効状態（関連フィールドが disabled のとき） */
  disabled?: boolean;
  /** ラベルの内容 */
  children: React.ReactNode;
}

/**
 * Label Component
 *
 * Atomic Design: Atom
 *
 * フォームフィールドと関連付けるラベル。必須・任意の状態を視覚的・意味的に伝える。
 *
 * @example
 * <Label htmlFor="email" required>メールアドレス</Label>
 * <Label htmlFor="nickname" optional>ニックネーム</Label>
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
      'font-medium',
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
      ? ['text-neutral-400', 'cursor-not-allowed']
      : ['text-neutral-700'];

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
            className="text-error-500 font-normal"
            aria-label="必須"
          >
            *
          </span>
        )}

        {/* 任意マーク */}
        {optional && !required && (
          <span className="text-neutral-400 font-normal text-xs">
            （任意）
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
