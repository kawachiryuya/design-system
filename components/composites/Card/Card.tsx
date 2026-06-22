import React from 'react';

/** Card の外観バリアント */
export type CardVariant = 'elevated' | 'outlined' | 'filled';

/** Card のパディング */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/** CardFooter の content 配置 */
export type CardFooterJustify = 'start' | 'end' | 'between';

/**
 * Card Props
 *
 * 見出し・コンテンツ・フッターを持つ汎用コンテナ。compound component パターン
 * （`Card.Header` / `Card.Body` / `Card.Footer`）でレイアウト構築。
 *
 * **インタラクティブ化**: `href` 指定で `<a>` タグ、`clickable` or `onClick` 指定で
 * `<div role="button">` として a11y 対応（キーボード操作も自動付与）。
 *
 * @example
 *   // 基本（compound パターン）
 *   <Card variant="outlined">
 *     <Card.Header>タイトル</Card.Header>
 *     <Card.Body>本文コンテンツ</Card.Body>
 *     <Card.Footer justify="end">
 *       <Button>保存</Button>
 *     </Card.Footer>
 *   </Card>
 *
 * @example
 *   // 影付き（強調表示、モーダル風）
 *   <Card variant="elevated" padding="lg">
 *     <p>強調されたコンテンツ</p>
 *   </Card>
 *
 * @example
 *   // クリック可能カード（リスト項目）
 *   <Card variant="outlined" clickable onClick={() => navigate('/detail')}>
 *     <Card.Body>
 *       <h3>記事タイトル</h3>
 *       <p>概要...</p>
 *     </Card.Body>
 *   </Card>
 *
 * @example
 *   // リンクカード（外部 URL）
 *   <Card variant="outlined" href="https://example.com" target="_blank">
 *     <Card.Body>外部記事</Card.Body>
 *   </Card>
 *
 * @example
 *   // フッターのアクション両端配置
 *   <Card variant="outlined">
 *     <Card.Body>確認内容</Card.Body>
 *     <Card.Footer justify="between">
 *       <Button variant="tertiary">キャンセル</Button>
 *       <Button variant="primary">確定</Button>
 *     </Card.Footer>
 *   </Card>
 */
export interface CardProps {
  /**
   * 外観バリアント。
   * - `elevated` 影付き（強調・浮き上がる印象）
   * - `outlined` 枠線（標準、リスト等）
   * - `filled` 塗りつぶし（控えめな区切り）
   * @default 'outlined'
   */
  variant?: CardVariant;
  /**
   * 全体パディング。compound（Header/Body/Footer）使用時は通常 `none`、
   * 直接 children を入れる時は `md` 等を指定。
   * @default 'none'
   */
  padding?: CardPadding;
  /**
   * クリック可能。`true` で hover/focus スタイル + `role="button"` + キーボード操作。
   * `onClick` を渡せば自動で true になるため通常省略可。
   * @default false
   */
  clickable?: boolean;
  /** クリックハンドラー。指定すると自動的に clickable 扱いになる。 */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** リンク先 URL。指定時は `<a>` でレンダリング、`onClick` も併用可。 */
  href?: string;
  /** リンクの target 属性（`_blank` 等）。`_blank` 時は rel="noopener noreferrer" 自動付与。 */
  target?: string;
  /** リンクの rel 属性。target="_blank" 時のみデフォルト noopener noreferrer が適用される。 */
  rel?: string;
  /** 追加 CSS クラス。 */
  className?: string;
  children: React.ReactNode;
}

/** Card.Header Props */
export interface CardHeaderProps {
  /**
   * 下部ボーダー表示（Body との区切り）。default は false (typography と padding で
   * 階層を示す、Material 3 / shadcn と同じ default なし方針)。明示的な区切りが
   * 欲しい場合のみ true。
   * @default false
   */
  divider?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Card.Body Props */
export interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

/** Card.Footer Props */
export interface CardFooterProps {
  /**
   * フッター内のアクション配置。
   * - `start` 左寄せ
   * - `end` 右寄せ（標準、保存/キャンセル等の主要アクション）
   * - `between` 両端配置（左にキャンセル、右に確定）
   * @default 'end'
   */
  justify?: CardFooterJustify;
  /**
   * 上部ボーダー表示（Body との区切り）。default は false (typography と padding で
   * 階層を示す、Material 3 / shadcn と同じ default なし方針)。action button と
   * body の明示的区切りが欲しい場合のみ true。
   * @default false
   */
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

// Card variant 設計:
// - elevated: layer-1 + shadow で浮き上がり感
// - outlined: layer-1 + 薄い border で控えめな枠
// - filled: layer-2 (= 1 段下) + border で塗りつぶし感、layer-1 より沈める意図
const variantStyles = {
  elevated: 'bg-surface shadow-md rounded-md',
  outlined: 'bg-surface border border-border-subtle rounded-md',
  filled: 'bg-surface-layer-2 border border-border-subtle rounded-md',
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
    // hover は shadow-md に弱める (outlined / filled で「影なし → shadow-lg」が大きすぎたため)。
    // focus に ring-offset-focus を追加し Button family と整合。
    isInteractive
      ? 'cursor-pointer transition-shadow duration-normal hover:shadow-md focus-visible:outline-none focus-visible:ring-focus focus-visible:ring-border-focus focus-visible:ring-offset-focus'
      : '',
    isLink ? 'block no-underline text-inherit' : '',
    className,
  ].filter(Boolean).join(' ');

  if (isLink) {
    return (
      <a data-ds-root
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
    <div data-ds-root
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

const CardHeader: React.FC<CardHeaderProps> = ({ divider = false, className = '', children }) => (
  <div className={[
    // semantic typography 明示 (旧 font-medium のみだと font-size 継承で曖昧)
    'px-4 py-3 text-body-md font-semibold text-onSurface',
    divider ? 'border-b border-border-subtle' : '',
    className,
  ].filter(Boolean).join(' ')}>
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ className = '', children }) => (
  <div className={['px-4 py-3', className].join(' ')}>
    {children}
  </div>
);

const justifyStyles = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
};

const CardFooter: React.FC<CardFooterProps> = ({ justify = 'end', divider = false, className = '', children }) => (
  <div className={[
    'px-4 py-3 flex items-center gap-2',
    divider ? 'border-t border-border-subtle' : '',
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
