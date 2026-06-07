import React from 'react';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

/** Modal のサイズ */
export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * Modal Props
 *
 * ネイティブ `<dialog>` 要素 (`HTMLDialogElement.showModal()`) を採用し、
 * focus trap / Esc キーでの close / ::backdrop オーバーレイ / 開閉時のフォーカス管理を
 * ブラウザ標準機能に委ねる。React 側では open 状態の同期と onClose のディスパッチのみ担う。
 *
 * 構造は compound component (`Modal.Body` / `Modal.Footer`)。Header は `title` prop で
 * 既定の見出し + close ボタンを描画する (より高度なヘッダが必要なら省略し本文側に組み込む)。
 *
 * @example
 *   // 基本
 *   const [open, setOpen] = useState(false);
 *   <Modal open={open} onClose={() => setOpen(false)} title="変更を保存しますか？">
 *     <Modal.Body>未保存の編集内容があります。保存しますか？</Modal.Body>
 *     <Modal.Footer>
 *       <Button variant="tertiary" onClick={() => setOpen(false)}>キャンセル</Button>
 *       <Button variant="primary" onClick={handleSave}>保存</Button>
 *     </Modal.Footer>
 *   </Modal>
 *
 * @example
 *   // タイトルなし、Body に独自構造を入れる
 *   <Modal open={open} onClose={close} size="lg" aria-labelledby="custom-title">
 *     <Modal.Body>
 *       <h2 id="custom-title" className="text-heading-md mb-2">
 *         カスタム見出し
 *       </h2>
 *       <p>本文…</p>
 *     </Modal.Body>
 *   </Modal>
 *
 * @see principles/Foundation/accessibility/focus-management.mdx
 * @see principles/Foundation/accessibility/keyboard-navigation.mdx
 */
export interface ModalProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'onClose'> {
  /** モーダルの開閉状態。 */
  open: boolean;
  /**
   * 閉じる要求が発生したときに呼ばれる (Esc キー / overlay クリック / close ボタン)。
   * 親側で `open` を `false` に更新すること。
   */
  onClose: () => void;
  /**
   * 既定のヘッダに表示するタイトル。指定すると `aria-labelledby` を自動接続する。
   * より複雑な見出しが必要なら省略して `Modal.Body` 内に直接書く。
   */
  title?: React.ReactNode;
  /**
   * サイズ。
   * - `sm` ≈ 24rem (確認ダイアログ等)
   * - `md` ≈ 32rem (標準)
   * - `lg` ≈ 42rem (フォーム等の中規模)
   * - `full` ≈ 90vw (大きなコンテンツ)
   * @default 'md'
   */
  size?: ModalSize;
  /**
   * Esc キーで close するか。
   * @default true
   */
  closeOnEsc?: boolean;
  /**
   * ::backdrop (背景) クリックで close するか。
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * 既定のヘッダの close ボタンを非表示にする。タイトルだけ残したい場合に使う。
   * @default false
   */
  hideCloseButton?: boolean;
  children: React.ReactNode;
}

/** Modal.Body Props */
export interface ModalBodyProps {
  className?: string;
  children: React.ReactNode;
}

/** Modal.Footer Props */
export interface ModalFooterProps {
  /**
   * フッター内のアクション配置。
   * @default 'end'
   */
  justify?: 'start' | 'end' | 'between';
  className?: string;
  children: React.ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
  sm:   'sm:max-w-sm',
  md:   'sm:max-w-md',
  lg:   'sm:max-w-2xl',
  full: 'sm:max-w-[90vw]',
};

/**
 * Modal — Atomic Design: Organism (a11y 観点では Block)
 *
 * @see ModalProps for usage examples.
 */
const ModalRoot: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  hideCloseButton = false,
  className = '',
  children,
  ...rest
}) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    if (closeOnEsc) onClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnOverlayClick) return;
    if (e.target === dialogRef.current) onClose();
  };

  const ariaLabelledBy = title ? titleId : rest['aria-labelledby'];

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleClick}
      aria-labelledby={ariaLabelledBy}
      aria-modal="true"
      className={[
        'p-0 m-auto w-[calc(100%-2rem)]',
        sizeStyles[size],
        'bg-surface text-onSurface rounded-md shadow-lg',
        'backdrop:bg-surface-overlay',
        'open:flex open:flex-col open:max-h-[85vh]',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {(title || !hideCloseButton) && (
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border-subtle">
          {title ? (
            <h2 id={titleId} className="text-heading-md text-onSurface flex-1">
              {title}
            </h2>
          ) : <span aria-hidden className="flex-1" />}
          {!hideCloseButton && (
            <Button variant="tertiary" size="sm" onClick={onClose}>
              <Icon name="close" />
              <VisuallyHidden>閉じる</VisuallyHidden>
            </Button>
          )}
        </header>
      )}
      {children}
    </dialog>
  );
};

ModalRoot.displayName = 'Modal';

const ModalBody: React.FC<ModalBodyProps> = ({ className = '', children }) => (
  <div className={['px-5 py-4 overflow-y-auto text-body-md text-onSurface', className].filter(Boolean).join(' ')}>
    {children}
  </div>
);
ModalBody.displayName = 'Modal.Body';

const justifyStyles = {
  start:   'justify-start',
  end:     'justify-end',
  between: 'justify-between',
};

const ModalFooter: React.FC<ModalFooterProps> = ({ justify = 'end', className = '', children }) => (
  <footer className={[
    'flex items-center gap-2 px-5 py-3 border-t border-border-subtle',
    justifyStyles[justify],
    className,
  ].filter(Boolean).join(' ')}>
    {children}
  </footer>
);
ModalFooter.displayName = 'Modal.Footer';

export const Modal = Object.assign(ModalRoot, {
  Body: ModalBody,
  Footer: ModalFooter,
});
