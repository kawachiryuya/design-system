import React from 'react';

/**
 * Card Props
 * Reference: principles/patterns/data-display.md
 *
 * Molecule: 見出し・コンテンツ・フッターを持つ汎用コンテナ
 */
export interface CardProps {
  /** 外観バリアント */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** パディング */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** クリック可能（ホバー・フォーカス状態を付与） */
  clickable?: boolean;
  /** onClick ハンドラー */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** リンク先 URL（指定時は <a> でレンダリング） */
  href?: string;
  /** リンクの target 属性 */
  target?: string;
  /** リンクの rel 属性 */
  rel?: string;
  /** 追加CSSクラス */
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps {
  /** ボーダー表示 */
  divider?: boolean;
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
  /** ボーダー表示 */
  divider?: boolean;
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
  elevated: 'bg-surface shadow-md rounded-lg',
  outlined: 'bg-surface border border-border-muted rounded-lg',
  filled: 'bg-surface-inset border border-border-muted rounded-lg',
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
  href,
  target,
  rel,
  className = '',
  children,
}) => {
  const isLink = !!href;
  const isInteractive = isLink || clickable || !!onClick;

  const classes = [
    'overflow-hidden',
    variantStyles[variant],
    paddingStyles[padding],
    isInteractive
      ? 'cursor-pointer transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus'
      : '',
    isLink ? 'block no-underline text-inherit' : '',
    className,
  ].filter(Boolean).join(' ');

  if (isLink) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      onKeyDown={clickable || onClick ? (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLElement>);
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ divider = true, className = '', children }) => (
  <div className={[
    'px-4 py-3 font-medium text-onSurface',
    divider ? 'border-b border-border-muted' : '',
    className,
  ].filter(Boolean).join(' ')}>
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

const CardFooter: React.FC<CardFooterProps> = ({ justify = 'end', divider = true, className = '', children }) => (
  <div className={[
    'px-4 py-3 flex items-center gap-2',
    divider ? 'border-t border-border-muted' : '',
    justifyStyles[justify],
    className,
  ].filter(Boolean).join(' ')}>
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
