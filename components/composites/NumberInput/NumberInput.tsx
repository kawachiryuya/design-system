import React from 'react';
import { Icon } from '../../primitives/Icon';
import { Typography } from '../../primitives/Typography/Typography';

export interface NumberInputProps {
  /** 現在の値 */
  value: number;
  /** 値変更コールバック */
  onChange: (value: number) => void;
  /** 最小値 */
  min?: number;
  /** 最大値 */
  max?: number;
  /** ラベル */
  label?: string;
  /** サイズ */
  size?: 'small' | 'medium';
  /** 無効状態 */
  disabled?: boolean;
  /** 減少ボタンの aria-label */
  decrementLabel?: string;
  /** 増加ボタンの aria-label */
  incrementLabel?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  label,
  size = 'medium',
  disabled = false,
  decrementLabel = '減らす',
  incrementLabel = '増やす',
}) => {
  const atMin = value <= min;
  const atMax = value >= max;

  const sizeStyles = {
    small: { container: 'h-10', button: 'w-10', display: 'w-8 text-sm' },
    medium: { container: 'h-12', button: 'w-12', display: 'w-10 text-base' },
  }[size];

  return (
    <div className="flex flex-col gap-1">
      {label && <Typography variant="label">{label}</Typography>}
      <div className={`flex items-center border border-border rounded-sm ${sizeStyles.container}`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || atMin}
          className={`${sizeStyles.button} h-full flex items-center justify-center text-onSurface-muted hover:text-onSurface disabled:opacity-30 transition-colors`}
          aria-label={decrementLabel}
        >
          <Icon name="remove" size="sm" color="inherit" />
        </button>
        <span className={`${sizeStyles.display} text-center font-medium text-onSurface`}>
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled || atMax}
          className={`${sizeStyles.button} h-full flex items-center justify-center text-onSurface-muted hover:text-onSurface disabled:opacity-30 transition-colors`}
          aria-label={incrementLabel}
        >
          <Icon name="add" size="sm" color="inherit" />
        </button>
      </div>
    </div>
  );
};
