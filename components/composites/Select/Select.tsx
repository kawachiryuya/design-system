import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Label } from '../../primitives/Label/Label';
import { FormMessage } from '../../_internal/FormMessage';

/** Select のサイズ */
export type SelectSize = 'small' | 'medium' | 'large';

interface SelectBaseProps {
  /**
   * サイズ。
   * - `small` 40px、密集 UI 用
   * - `medium` 48px、標準
   * - `large` 64px、モバイル CTA フォーム
   * @default 'medium'
   */
  size?: SelectSize;
  /** ラベルテキスト。指定すると `<label>` 要素が自動生成され `htmlFor`/`aria-*` 関連付けされる。 */
  label?: string;
  /** 先頭に表示するプレースホルダー選択肢（`<option value="" disabled>`）。未選択を強制したい時に使用。 */
  placeholder?: string;
  /** ヘルプテキスト（補助説明）。エラー時は非表示になり `errorMessage` に置き換わる。 */
  helpText?: string;
  /** 全幅表示（親要素の幅に追従）。 */
  fullWidth?: boolean;
}

/** エラー状態の Select — `errorMessage` が必須 */
interface SelectErrorProps extends SelectBaseProps {
  /** エラー状態。`true` で枠線赤・背景色変化・`aria-invalid="true"` 自動付与。 */
  error: true;
  /** エラーメッセージ（必須）。`aria-describedby` で select に関連付けられる。 */
  errorMessage: string;
}

/** 通常状態の Select */
interface SelectNormalProps extends SelectBaseProps {
  /** @default false */
  error?: false;
  /** 通常状態では使用不可。 */
  errorMessage?: never;
}

/**
 * Select Props — discriminated union
 *
 * `error` の値で型が分岐する（Input/Textarea と同パターン）:
 * - `error: true` → `errorMessage` 必須
 * - `error: false`（または省略） → `errorMessage` 使用不可
 *
 * @example
 *   // 基本
 *   <Select label="都道府県" required>
 *     <option value="tokyo">東京都</option>
 *     <option value="osaka">大阪府</option>
 *   </Select>
 *
 * @example
 *   // プレースホルダー（未選択を強制）
 *   <Select label="言語" placeholder="選択してください" required>
 *     <option value="ja">日本語</option>
 *     <option value="en">English</option>
 *   </Select>
 *
 * @example
 *   // エラー状態（errorMessage が型レベルで必須）
 *   <Select
 *     label="支払い方法"
 *     error
 *     errorMessage="支払い方法を選択してください"
 *   >
 *     <option value="card">クレジットカード</option>
 *   </Select>
 *
 * @example
 *   // 全幅 + 大サイズ
 *   <Select label="国" size="large" fullWidth>
 *     <option value="jp">Japan</option>
 *   </Select>
 *
 * @example
 *   // ヘルプテキスト付き
 *   <Select label="プラン" helpText="後から変更可能です">
 *     <option value="free">Free</option>
 *     <option value="pro">Pro</option>
 *   </Select>
 *
 * @see principles/patterns/forms.md
 */
export type SelectProps =
  (SelectErrorProps | SelectNormalProps) &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

/** Internal flexible type to allow destructuring across both discriminants */
type _InternalSelectProps = SelectBaseProps & {
  error?: boolean;
  errorMessage?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

/**
 * Select — Atomic Design: Composite
 *
 * @see SelectProps for usage examples.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      size = 'medium',
      label,
      placeholder,
      error = false,
      errorMessage,
      helpText,
      fullWidth = false,
      disabled,
      required,
      id,
      className = '',
      children,
      ...rest
    } = props as _InternalSelectProps;

    const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helpId = selectId ? `${selectId}-help` : undefined;

    // 明示的 height でタッチターゲットを保証（WCAG 2.5.5 AAA: 44px）
    const sizeConfig = {
      small: { style: 'h-10 pl-3 pr-10 text-sm', iconSize: 'sm' as const, iconRight: 'right-3' },
      medium: { style: 'h-12 pl-3 pr-12 text-base', iconSize: 'sm' as const, iconRight: 'right-3' },
      large: { style: 'h-16 pl-4 pr-12 text-lg', iconSize: 'md' as const, iconRight: 'right-4' },
    }[size];

    const sizeStyles = sizeConfig.style;

    const stateStyles = error
      ? 'border-border-error focus:border-border-error focus:ring-border-error bg-surface-error-muted'
      : 'border-border hover:border-border-strong focus:border-border-focus focus:ring-border-focus bg-surface';

    const selectClasses = [
      'block',
      'rounded-xs',
      'border',
      'text-onSurface',
      'appearance-none',
      'cursor-pointer',
      'transition-all',
      'duration-normal',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',
      'w-full',
      disabled ? 'opacity-50 cursor-not-allowed bg-surface-disabled' : '',
      sizeStyles,
      stateStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const describedBy = [
      error && errorId ? errorId : null,
      !error && helpText && helpId ? helpId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <Label htmlFor={selectId} size={size === 'large' ? 'large' : 'medium'} required={required} disabled={disabled}>
            {label}
          </Label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-required={required ? true : undefined}
            aria-describedby={describedBy}
            className={selectClasses}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {/* カスタム下矢印アイコン */}
          <span className={`absolute ${sizeConfig.iconRight} top-1/2 -translate-y-1/2 pointer-events-none text-onSurface-subtle flex items-center justify-center`}>
            <Icon name="expand_more" size={sizeConfig.iconSize} />
          </span>
        </div>
        <FormMessage
          helpText={helpText}
          helpId={helpId}
          error={error}
          errorMessage={errorMessage}
          errorId={errorId}
        />
      </div>
    );
  }
);

Select.displayName = 'Select';
