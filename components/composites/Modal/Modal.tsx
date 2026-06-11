import React from 'react';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';

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
  /**
   * 開いた直後にフォーカスを当てる要素の ref。未指定時は browser 既定 (最初の focusable = 通常 close ボタン)。
   * 確認ダイアログでは Footer の primary アクションを指定し、SR が先に主要操作を読むようにする。
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
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
const ModalRoot = React.forwardRef<HTMLDialogElement, ModalProps>(({
  open,
  onClose,
  title,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  hideCloseButton = false,
  initialFocusRef,
  className = '',
  children,
  ...rest
}, ref) => {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  const titleId = React.useId();

  // 外部 ref と内部 dialogRef の両方へ代入する callback ref (open 同期 / overlay 判定で内部 ref が必要)。
  const setDialogRef = React.useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal は最初の focusable (通常 close ボタン) に focus する。
      // initialFocusRef 指定時はその直後に上書きして主要アクション等へ移す。
      if (initialFocusRef?.current) initialFocusRef.current.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocusRef]);

  // 背景スクロールロック。native `<dialog>.showModal()` は背後ページのホイール/スワイプ
  // スクロールを止めないため、開いている間だけ body の overflow を hidden にする。
  // CSS (`.storybook/tailwind.css`) は consumer に出荷されないので JS 側で制御する。
  // 従前値を save/restore するため、ネストした複数 Modal でも cleanup の LIFO 順で正しく復元される。
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
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
      ref={setDialogRef}
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
        <header className="flex items-start justify-between gap-3 p-5">
          {title ? (
            <h2 id={titleId} className="text-heading-md text-onSurface flex-1">
              {title}
            </h2>
          ) : <span aria-hidden className="flex-1" />}
          {!hideCloseButton && (
            <Button
              variant="tertiary"
              size="sm"
              iconOnly
              icon={<Icon name="close" />}
              aria-label="閉じる"
              onClick={onClose}
            />
          )}
        </header>
      )}
      {children}
    </dialog>
  );
});

ModalRoot.displayName = 'Modal';

const ModalBody: React.FC<ModalBodyProps> = ({ className = '', children }) => (
  <div className={['p-5 overflow-y-auto text-body-md text-onSurface', className].filter(Boolean).join(' ')}>
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
    'flex items-center gap-2 p-5',
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
