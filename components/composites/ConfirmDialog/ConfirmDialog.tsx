'use client';

import React from 'react';
import { Button } from '../../primitives/Button';
import { tv } from '../../_internal/tv';
import { DialogBase, DialogHeader } from '../../_internal/DialogBase';

/**
 * ConfirmDialog Props
 *
 * 役割「確認」の部品 (#157): 操作を実行する前に、本当に実行してよいかを確かめる。ボタンは部品が持つ 2 つ
 * (取り消し・確定) だけで、使う側はフッターを組まない。中身は短い説明 (`children`) だけで、入力は置かない
 * (入力があるなら `FormDialog`)。
 *
 * - どの幅でも画面の中央のカード (幅 28rem = 448px まで。狭い幅は左右 16px の余白)
 * - **外 (背景) を押しても閉じない**。Esc・×・取り消しボタンは、取り消しとして `onClose` を呼ぶ
 * - 確定ボタンは `onConfirm` を呼ぶだけで、自分では閉じない (親が `open` を false にする)
 * - 開いた直後のフォーカスは、`destructive` のときは取り消しボタン (誤って確定しないため)、そうでなければ確定ボタン
 * - `role="alertdialog"`。読み上げの名前は見出し (`title`)、説明は `children` (`aria-describedby`)
 *
 * @example
 *   // 戻せない操作の確認
 *   <ConfirmDialog
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="予約を取り消しますか？"
 *     confirmLabel="取り消す"
 *     destructive
 *     onConfirm={() => { cancelReservation(); setOpen(false); }}
 *   >
 *     取り消すと元に戻せません。
 *   </ConfirmDialog>
 *
 * @example
 *   // Menu の項目から開く: 閉じたらフォーカスを Menu の入口へ戻す (Menu の面はもう閉じているので、指定しないと body に行く)
 *   <ConfirmDialog open={open} onClose={close} title="変更を保存しますか？" confirmLabel="保存" onConfirm={save}
 *     returnFocusRef={menuTriggerRef} />
 *
 * @example
 *   // 確定の処理を待つ
 *   <ConfirmDialog open={open} onClose={close} title="送信しますか？" confirmLabel="送信" onConfirm={send} confirmLoading={sending} />
 */
export interface ConfirmDialogProps
  extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel' | 'title' | 'children'> {
  /** 開閉の状態。親が持つ (部品は自分では閉じない)。 */
  open: boolean;
  /**
   * 取り消して閉じる要求が起きたときに呼ばれる (Esc・×・取り消しボタン、ブラウザが dialog を閉じたとき)。
   * 親で `open` を `false` にする。外 (背景) を押したときは呼ばれない。
   */
  onClose: () => void;
  /** 見出し (必須)。何を確かめるかを問いの形で短く (例: 「予約を取り消しますか？」)。読み上げの名前にもなる。 */
  title: string;
  /** 短い説明 (任意)。確定すると何が起きるか・戻せるか。入力は置かない (入力があるなら `FormDialog`)。 */
  children?: React.ReactNode;
  /** 確定ボタンの文言 (必須)。何をするかの動詞で (例: 「取り消す」「削除」「保存」)。「OK」「はい」にしない。 */
  confirmLabel: string;
  /** 確定ボタンを押したときに呼ばれる。部品は閉じない (親が `open` を false にする)。 */
  onConfirm?: () => void;
  /**
   * 取り消しボタンの文言。
   * @default 'キャンセル'
   */
  cancelLabel?: string;
  /**
   * 戻せない・壊す操作の確認か。true で確定ボタンを destructive (赤) にし、開いた直後のフォーカスを取り消しボタンに置く。
   * @default false
   */
  destructive?: boolean;
  /**
   * 確定の処理中か。true で確定ボタンを読み込み中 (押せない) にする。
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * 閉じたときにフォーカスを戻す要素。省略時は、開く前にフォーカスがあった要素。
   * Menu の項目から開いたときのように、開く前の要素が閉じた後に残らない場合に、入口を渡す。
   * 戻すのは、閉じたときにフォーカスが dialog の中か、どこにも無い (body) ときだけ。
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** `<dialog>` に付ける追加の class。 */
  className?: string;
}

const confirmDialog = tv({
  slots: {
    dialog: [
      'p-0 m-auto w-[calc(100%-2rem)] max-w-md',
      'bg-surface text-onSurface rounded-md shadow-lg',
      'backdrop:bg-surface-overlay',
      'open:flex open:flex-col max-h-[85dvh]',
      // 中に押せるものがあるので dialog そのものには来ないが、来たとき (ブラウザの都合) も輪を出す
      'focus-ring-inset',
    ],
    description: 'px-5 pt-2 overflow-y-auto type-body text-onSurface',
    // 取り消し → 確定の順に右寄せ。収まらないときは折り返す
    footer: 'flex flex-wrap items-center justify-end gap-2 p-5',
  },
});

/**
 * ConfirmDialog — 役割「確認」(Composite)
 *
 * @see ConfirmDialogProps 使い方
 */
export const ConfirmDialog = React.forwardRef<HTMLDialogElement, ConfirmDialogProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      confirmLabel,
      onConfirm,
      cancelLabel = 'キャンセル',
      destructive = false,
      confirmLoading = false,
      returnFocusRef,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const titleId = React.useId();
    const descriptionId = React.useId();
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);
    const confirmRef = React.useRef<HTMLButtonElement | null>(null);
    const styles = confirmDialog();
    const hasDescription = children !== undefined && children !== null && children !== false && children !== '';

    return (
      <DialogBase
        {...rest}
        ref={ref}
        open={open}
        onClose={onClose}
        returnFocusRef={returnFocusRef}
        // destructive は取り消し、そうでなければ確定。確定が読み込み中 (押せない) なら取り消し
        getInitialFocus={() =>
          destructive || confirmLoading ? cancelRef.current : confirmRef.current
        }
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={[styles.dialog(), className].filter(Boolean).join(' ')}
      >
        <DialogHeader titleId={titleId} title={title} onClose={onClose} />
        {hasDescription && (
          <div id={descriptionId} className={styles.description()}>
            {children}
          </div>
        )}
        <div className={styles.footer()}>
          <Button ref={cancelRef} variant="tertiary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={destructive ? 'destructive' : 'primary'}
            isLoading={confirmLoading}
            onClick={() => onConfirm?.()}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogBase>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';
