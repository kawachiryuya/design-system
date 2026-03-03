import React from 'react';

/**
 * Divider Props
 * Reference: principles/layout/ spacing principles
 */
export interface DividerProps {
  /** 向き */
  orientation?: 'horizontal' | 'vertical';
  /** 中央に表示するラベルテキスト（horizontal のみ） */
  label?: string;
  /** 線の太さ */
  weight?: 'thin' | 'normal';
  /** 追加CSSクラス */
  className?: string;
}

/**
 * Divider Component
 *
 * Atomic Design: Atom
 *
 * @example
 * <Divider />
 * <Divider label="または" />
 * <Divider orientation="vertical" />
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
