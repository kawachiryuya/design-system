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
  /** 線の色 */
  color?: 'neutral' | 'primary';
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
 * <Divider color="primary" />
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  color = 'neutral',
  weight = 'thin',
  className = '',
}) => {
  const colorStyles = {
    neutral: 'border-neutral-200',
    primary: 'border-primary-200',
  };

  const weightStyles = {
    thin: 'border-0',
    normal: 'border-0',
  };

  const borderClass = [colorStyles[color]].join(' ');
  const heightClass = weight === 'thin' ? 'border-t' : 'border-t-2';
  const heightVerticalClass = weight === 'thin' ? 'border-l' : 'border-l-2';

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={[
          'inline-block',
          'self-stretch',
          'h-auto',
          'min-h-full',
          heightVerticalClass,
          borderClass,
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
        <div className={['flex-1', heightClass, borderClass].join(' ')} />
        <span className="text-sm text-neutral-500 whitespace-nowrap select-none">
          {label}
        </span>
        <div className={['flex-1', heightClass, borderClass].join(' ')} />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={[
        'w-full',
        heightClass,
        borderClass,
        weightStyles[weight],
        'm-0',
        className,
      ].join(' ')}
    />
  );
};

Divider.displayName = 'Divider';
