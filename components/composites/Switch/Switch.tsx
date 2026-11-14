'use client';

import React from 'react';
import { Label } from '../../primitives/Label/Label';
import { FormDescription } from '../../_internal/FormDescription';

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
 *   // 説明付き（description は SR にも aria-describedby で伝わる）
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
 */
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /**
   * オン/オフの状態（controlled）。
   * @default false
   */
  checked?: boolean;
  /** 状態変更コールバック。次の状態（反転後）が引数に渡される。 */
  onChange?: (checked: boolean) => void;
  /** ラベルテキスト。クリックでもトグルする。 */
  label?: string;
  /** ラベルの補足テキスト (supporting サイズ、SR には `aria-describedby` で伝わる)。 */
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
      label,
      description,
      labelPosition = 'right',
      disabled = false,
      id,
      className = '',
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const switchId = id || `switch-${reactId}`;
    const descId = description ? `${switchId}-desc` : undefined;

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

    // 状態は data-* 属性で駆動し、見た目は data-[state=...] / data-[disabled] variant で当てる
    // (スタイリング3規律 2、AGENTS §5-2)。class の条件付加はしない。
    const switchState = checked ? 'checked' : 'unchecked';

    // Track 48×24 (2px の枠を含む)、thumb 20×20。枠は両状態とも 2px で持ち (on は透明)、thumb の幾何を状態間で揃える。
    // off は「薄い塗り + 2px の輪郭 (border.strong、白地に 3:1) + 灰色の小さいつまみ (surface.neutral)」。
    // 面を灰色で埋めず、状態の識別は輪郭とつまみが担う (#109 Color-5)。on は primary の塗り + 白いつまみ。
    const trackClasses =
      'relative inline-flex flex-shrink-0 w-12 h-6 rounded-full border-2 transition-colors duration-normal cursor-pointer ' +
      'focus:outline-none focus-visible:ring-focus focus-visible:ring-offset-focus focus-visible:ring-border-focus ' +
      'data-[state=checked]:bg-surface-primary data-[state=checked]:border-transparent ' +
      'data-[state=unchecked]:bg-surface-subtle data-[state=unchecked]:border-border-strong ' +
      // ホバー: 小さい部品なので外側 4px の輪 (白地の規則 brand 8%、AGENTS §3-2)。disabled では出さない
      'hover:shadow-[0_0_0_4px_var(--color-state-hover-primary)] data-[disabled]:hover:shadow-none ' +
      'data-[disabled]:opacity-disabled data-[disabled]:cursor-not-allowed';

    // 内側 (44×20) を基準に: off は左端 (translate 0)、on は右端 (translate 24px)。off のつまみは 75% に縮めて輪郭との間を空ける
    const thumbClasses =
      'pointer-events-none inline-block w-5 h-5 rounded-full ring-0 transition-transform duration-normal self-center ' +
      'data-[state=checked]:bg-surface data-[state=checked]:shadow data-[state=checked]:translate-x-6 ' +
      'data-[state=unchecked]:bg-surface-neutral data-[state=unchecked]:translate-x-0 data-[state=unchecked]:scale-75';

    const labelEl = (label || description) && (
      <div className="flex flex-col gap-[2px]">
        {label && (
          <Label
            htmlFor={switchId}
            size="md"
            disabled={disabled}
            onClick={!disabled ? handleClick : undefined}
          >
            {label}
          </Label>
        )}
        {description && (
          <FormDescription id={descId}>{description}</FormDescription>
        )}
      </div>
    );

    // aria-describedby に description id と利用者指定 id を結合
    const ariaDescribedBy = [descId, ariaDescribedByProp]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div data-ds-root className={`inline-flex ${description ? 'items-start' : 'items-center'} gap-3 ${className}`}>
        {labelPosition === 'left' && labelEl}
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          data-state={switchState}
          data-disabled={disabled || undefined}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={trackClasses}
          {...props}
        >
          <span data-state={switchState} className={thumbClasses} />
        </button>
        {labelPosition === 'right' && labelEl}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
