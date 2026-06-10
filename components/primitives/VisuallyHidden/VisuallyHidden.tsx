import React from 'react';

/** レンダリング先 HTML 要素（`as` prop） */
export type VisuallyHiddenElement = 'span' | 'div' | 'p' | 'label';

/**
 * VisuallyHidden Props
 *
 * 視覚的には非表示だがスクリーンリーダには読まれるテキストを描画する。
 * icon-only Button の補助ラベル、フォームの追加説明、Modal close ボタンの代替テキストなど、
 * 視覚的にはアイコンや図形で意味を伝えつつ a11y 上はテキストを提供したい場面で使う。
 *
 * @example
 *   // icon-only Button にスクリーンリーダ向け説明を添える
 *   <Button aria-label="閉じる">
 *     <Icon name="x" />
 *     <VisuallyHidden>閉じる</VisuallyHidden>
 *   </Button>
 *
 * @example
 *   // フォームラベル（視覚的にはプレースホルダで代替、SR にはラベルを読ませる）
 *   <VisuallyHidden as="label" htmlFor="email">メールアドレス</VisuallyHidden>
 *   <Input id="email" placeholder="メールアドレス" />
 *
 * @example
 *   // 通知エリア（aria-live と組合せて画面遷移なしでメッセージを伝える）
 *   <VisuallyHidden role="status" aria-live="polite">
 *     保存しました
 *   </VisuallyHidden>
 */
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * レンダリング先 HTML 要素。
   * @default 'span'
   */
  as?: VisuallyHiddenElement;
  /** スクリーンリーダに読ませる内容（必須）。 */
  children: React.ReactNode;
  /**
   * `as="label"` のときに関連付ける form 要素の id (`<label htmlFor>` と同じ)。
   * `as="span"` 等の場合は HTML レベルで無視されるため、型としては許容する。
   */
  htmlFor?: string;
}

/**
 * VisuallyHidden — Atomic Design: Atom
 *
 * Tailwind の `sr-only` ユーティリティで視覚的に隠しつつ、DOM とアクセシビリティツリーには
 * 残る要素を描画する。a11y 補助の基盤として Modal の close ボタンや icon-only 操作で
 * 多用される。
 *
 * @see VisuallyHiddenProps for usage examples.
 */
export const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as = 'span', className = '', children, ...props }, ref) => {
    const Tag = as as React.ElementType;
    const classes = ['sr-only', className].filter(Boolean).join(' ');
    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';
