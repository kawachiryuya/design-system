import React from 'react';

/**
 * Card Props
 * Reference: principles/patterns/data-display.md
 *
 * Molecule: 見出し・コンテンツ・フッターを持つ汎用コンテナ
 */
export interface CardProps {
  /** 外観バリアント */
  variant?: 'elevated' | 'outlined' | 'flat';
  /** パディング */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** クリック可能（ホバー・フォーカス状態を付与） */
  clickable?: boolean;
  /** onClick ハンドラー */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** 追加CSSクラス */
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardFooterProps {
  /** フッター内のアクションを右端に揃える */
  justify?: 'start' | 'end' | 'between';
  className?: string;
  children: React.ReactNode;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantStyles = {
  elevated: 'bg-white shadow-md rounded-lg',
  outlined: 'bg-white border border-neutral-200 rounded-lg',
  flat: 'bg-neutral-50 rounded-lg',
};

/**
 * Card Component
 *
 * Atomic Design: Molecule
 *
 * @example
 * <Card variant="outlined">
 *   <Card.Header>タイトル</Card.Header>
 *   <Card.Body>本文コンテンツ</Card.Body>
 *   <Card.Footer justify="end">
 *     <Button>保存</Button>
 *   </Card.Footer>
 * </Card>
 */
export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  variant = 'outlined',
  padding = 'none',
  clickable = false,
  onClick,
  className = '',
  children,
}) => {
  const isInteractive = clickable || !!onClick;

  const classes = [
    'overflow-hidden',
    variantStyles[variant],
    paddingStyles[padding],
    isInteractive
      ? 'cursor-pointer transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
      : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => (
  <div className={['px-4 py-3 border-b border-neutral-200 font-medium text-neutral-800', className].join(' ')}>
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ className = '', children }) => (
  <div className={['p-4', className].join(' ')}>
    {children}
  </div>
);

const justifyStyles = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
};

const CardFooter: React.FC<CardFooterProps> = ({ justify = 'end', className = '', children }) => (
  <div className={[
    'px-4 py-3 border-t border-neutral-200 flex items-center gap-2',
    justifyStyles[justify],
    className,
  ].join(' ')}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
