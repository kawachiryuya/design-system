import React from 'react';
import { Label } from '../../primitives/Label/Label';

/** Switch のサイズ */
export type SwitchSize = 'small' | 'medium' | 'large';

/** ラベル位置 */
export type SwitchLabelPosition = 'left' | 'right';

/**
 * Switch Props
 *
 * トグルスイッチ。`role="switch"` 自動付与で a11y 対応。
 * **設計原則**: 即時反映される設定に使用（フォーム送信不要）。送信フローでは Checkbox を使う。
 *
 * @example
 *   // 基本（controlled）
 *   <Switch label="メール通知" checked={enabled} onChange={setEnabled} />
 *
 * @example
 *   // 説明付き（設定画面）
 *   <Switch
 *     label="ダークモード"
 *     description="OS の設定に従う場合は無効化"
 *     checked={isDark}
 *     onChange={setDark}
 *   />
 *
 * @example
 *   // ラベル左配置（テーブル風 UI）
 *   <Switch
 *     label="自動更新"
 *     labelPosition="left"
 *     checked={autoUpdate}
 *     onChange={setAutoUpdate}
 *   />
 *
 * @example
 *   // 小サイズ + 高密度 UI
 *   <Switch label="WiFi" size="small" checked={wifi} onChange={setWifi} />
 *
 * @see principles/Patterns/forms.mdx
 * @see principles/Interaction/state/overview.mdx
 */
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /**
   * オン/オフの状態（controlled）。
   * @default false
   */
  checked?: boolean;
  /** 状態変更コールバック。次の状態（反転後）が引数に渡される。 */
  onChange?: (checked: boolean) => void;
  /**
   * サイズ。
   * - `small` トラック 32px（密集 UI）
   * - `medium` トラック 44px（標準）
   * - `large` トラック 56px（モバイル設定画面）
   * @default 'medium'
   */
  size?: SwitchSize;
  /** ラベルテキスト。クリックでもトグルする。 */
  label?: string;
  /** ラベルの補足テキスト（より小さく、ミュート色）。 */
  description?: string;
  /**
   * ラベルの位置。
   * @default 'right'
   */
  labelPosition?: SwitchLabelPosition;
  /**
   * 無効状態。
   * @default false
   */
  disabled?: boolean;
}

/**
 * Switch — Atomic Design: Composite
 *
 * @see SwitchProps for usage examples.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onChange,
      size = 'medium',
      label,
      description,
      labelPosition = 'right',
      disabled = false,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const switchId = id || (label ? `switch-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    // Track sizes
    const trackSize = {
      small: 'w-8 h-4',
      medium: 'w-[44px] h-6',
      large: 'w-[56px] h-8',
    }[size];

    // Thumb sizes and positions
    const thumbSize = { small: 'w-3 h-3', medium: 'w-5 h-5', large: 'w-6 h-6' }[size];
    const thumbOff = { small: 'translate-x-[2px]', medium: 'translate-x-[2px]', large: 'translate-x-1' }[size];
    const thumbOn = { small: 'translate-x-[18px]', medium: 'translate-x-[22px]', large: 'translate-x-[28px]' }[size];


    const trackClasses = [
      'relative',
      'inline-flex',
      'flex-shrink-0',
      'rounded-full',
      'transition-colors',
      'duration-normal',
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-border-focus',
      trackSize,
      checked ? 'bg-surface-primary' : 'bg-surface-neutral',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');

    const thumbClasses = [
      'pointer-events-none',
      'inline-block',
      'rounded-full',
      'bg-surface',
      'shadow',
      'ring-0',
      'transition-transform',
      'duration-normal',
      'self-center',
      thumbSize,
      checked ? thumbOn : thumbOff,
    ]
      .filter(Boolean)
      .join(' ');

    const labelEl = (label || description) && (
      <div className="flex flex-col gap-[2px]">
        {label && (
          <Label
            htmlFor={switchId}
            size={size === 'large' ? 'large' : 'medium'}
            disabled={disabled}
            onClick={!disabled ? handleClick : undefined}
          >
            {label}
          </Label>
        )}
        {description && (
          <span className="text-xs text-onSurface-muted leading-normal">{description}</span>
        )}
      </div>
    );

    return (
      <div className={`inline-flex ${description ? 'items-start' : 'items-center'} gap-3 ${className}`}>
        {labelPosition === 'left' && labelEl}
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={trackClasses}
          {...props}
        >
          <span className={thumbClasses} />
        </button>
        {labelPosition === 'right' && labelEl}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
