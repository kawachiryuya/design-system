'use client';

import React from 'react';
import { Button } from '../../primitives/Button';
import { tv } from '../../_internal/tv';
import { DialogBase, DialogHeader } from '../../_internal/DialogBase';
import { firstTabbable } from '../../_internal/BottomSheet/BottomSheet';

/**
 * FormDialog Props
 *
 * 役割「作業」の部品 (#157): ひとまとまりの入力をして、確定するか取り消す。中身は本物の `<form>` で包まれ、
 * フッター (取り消し・確定) は部品が持つ。入力欄で Enter を押すと確定する (ブラウザのフォームの送信)。
 * 入力の無い長い中身 (読ませるだけ) は入れない (補足は `Popover`、長い文は別のページ)。
 * 確定の前に確かめるだけ (入力が無い) なら `ConfirmDialog`。
 *
 * - **狭い幅 (640px 未満) は画面いっぱい** (角丸・影なし)。見出しの行と × は上、フッターは下に固定で、本体だけスクロールする。
 *   フッターの下に端末の余白 (safe-area) を足す。**広い幅は中央の大きいカード** (幅 42rem まで、高さは画面の 85% まで)
 * - 形は CSS (`sm:`) で決める (サーバーで描いても崩れない)
 * - **外 (背景) を押しても閉じない**。Esc・×・取り消しボタンは、取り消しとして `onClose` を呼ぶ
 * - 確定 (確定ボタン・入力欄で Enter) は `onSubmit` を呼ぶだけで、自分では閉じない (親が `open` を false にする)。
 *   ページの移動 (フォームの既定の送信) は部品が止める。ブラウザの入力チェック (`required` など) は効く
 * - 開いた直後のフォーカスは、本体の中の最初の押せるもの (無ければ dialog そのもの)
 *
 * @example
 *   const [open, setOpen] = useState(false);
 *   <FormDialog
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="絞り込み"
 *     submitLabel="適用"
 *     onSubmit={(e) => { apply(new FormData(e.currentTarget)); setOpen(false); }}
 *   >
 *     <Input name="keyword" aria-label="キーワード" />
 *   </FormDialog>
 *
 * @example
 *   // 保存の処理を待つ
 *   <FormDialog open={open} onClose={close} title="座席の変更" submitLabel="変更する" onSubmit={save} submitLoading={saving}>
 *     …
 *   </FormDialog>
 */
export interface FormDialogProps
  extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'onCancel' | 'onSubmit' | 'title'> {
  /** 開閉の状態。親が持つ (部品は自分では閉じない)。 */
  open: boolean;
  /**
   * 取り消して閉じる要求が起きたときに呼ばれる (Esc・×・取り消しボタン、ブラウザが dialog を閉じたとき)。
   * 親で `open` を `false` にする。外 (背景) を押したときは呼ばれない。
   */
  onClose: () => void;
  /** 見出し (必須)。何の作業かを短く (例: 「絞り込み」「座席の変更」)。読み上げの名前にもなる。 */
  title: string;
  /** 入力 (Input・Select・Checkbox など)。部品が `<form>` で包む。 */
  children: React.ReactNode;
  /**
   * 確定したとき (確定ボタン・入力欄で Enter) に呼ばれる。`e.currentTarget` は `<form>` (`new FormData(e.currentTarget)` で値を読める)。
   * ページの移動 (既定の送信) は部品が止めてから呼ぶ。部品は閉じない (親が `open` を false にする)。
   */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** 確定ボタンの文言 (必須)。何をするかの動詞で (例: 「適用」「変更する」「保存」)。 */
  submitLabel: string;
  /**
   * 取り消しボタンの文言。
   * @default 'キャンセル'
   */
  cancelLabel?: string;
  /**
   * 確定ボタンを押せなくする。原則は押せるままにして、押した後に足りない所を伝える
   * (押せないボタンにはキーボードで来られず、押せない理由も伝わりにくい)。
   * @default false
   */
  submitDisabled?: boolean;
  /**
   * 確定の処理中か。true で確定ボタンを読み込み中 (押せない) にし、Enter でも確定しない。
   * @default false
   */
  submitLoading?: boolean;
  /**
   * 閉じたときにフォーカスを戻す要素。省略時は、開く前にフォーカスがあった要素。
   * Menu の項目から開いたときのように、開く前の要素が閉じた後に残らない場合に、入口を渡す。
   * 戻すのは、閉じたときにフォーカスが dialog の中にあったときだけ。
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** `<dialog>` に付ける追加の class。 */
  className?: string;
}

const formDialog = tv({
  slots: {
    dialog: [
      // 狭い幅: 画面いっぱい (UA の中央寄せ・最大幅・最大高さを上書き)。上端に端末の余白
      'p-0 m-0 w-full max-w-none h-[100dvh] max-h-none rounded-none shadow-none pt-[env(safe-area-inset-top)]',
      // 広い幅: 中央の大きいカード
      'sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-2xl sm:h-auto sm:max-h-[85dvh] sm:rounded-md sm:shadow-lg sm:pt-0',
      'open:flex open:flex-col overflow-hidden',
      'bg-surface text-onSurface',
      'backdrop:bg-surface-overlay',
      // 中に押せるものが無いと dialog そのものにフォーカスが来る
      'focus-ring-inset',
    ],
    form: 'flex-auto min-h-0 flex flex-col',
    // 本体だけスクロール。高さは flex-auto (flex-1 は iPhone の Safari で高さが潰れた、#157)
    body: 'flex-auto min-h-0 overflow-y-auto overscroll-contain px-5 pt-2 pb-5 type-body text-onSurface',
    // 取り消し → 確定の順に右寄せ。収まらないときは折り返す。狭い幅は下端に端末の余白を足す
    footer: [
      'shrink-0 flex flex-wrap items-center justify-end gap-2 px-5 pt-4 border-t border-border-subtle',
      'pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4',
    ],
  },
});

/**
 * FormDialog — 役割「作業」(Composite)
 *
 * @see FormDialogProps 使い方
 */
export const FormDialog = React.forwardRef<HTMLDialogElement, FormDialogProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      onSubmit,
      submitLabel,
      cancelLabel = 'キャンセル',
      submitDisabled = false,
      submitLoading = false,
      returnFocusRef,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const titleId = React.useId();
    const bodyRef = React.useRef<HTMLDivElement | null>(null);
    const styles = formDialog();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      // ページの移動は常に止める
      e.preventDefault();
      // 中に置いた別のフォーム (Popover などの中) の送信は、React では親のここまで届く。自分のフォームの分だけ扱う
      if (e.target !== e.currentTarget) return;
      // 中に置いた別の重なり (Menu・Popover。狭い幅は `<dialog>` の面、広い幅は `popover` 属性のパネル) の中から起きた送信
      // (そこの入力欄で Enter・そこの送信ボタン) では確定しない
      const dialog = e.currentTarget.closest('dialog');
      const submitter = (e.nativeEvent as SubmitEvent).submitter;
      const fromNested = (el: Element | null) => !!el && el.closest('dialog, [popover]') !== dialog;
      if (fromNested(submitter) || fromNested(document.activeElement)) return;
      if (submitDisabled || submitLoading) return;
      onSubmit?.(e);
    };

    return (
      <DialogBase
        {...rest}
        ref={ref}
        open={open}
        onClose={onClose}
        returnFocusRef={returnFocusRef}
        getInitialFocus={() => firstTabbable(bodyRef.current)}
        aria-labelledby={titleId}
        className={[styles.dialog(), className].filter(Boolean).join(' ')}
      >
        <form className={styles.form()} onSubmit={handleSubmit}>
          <DialogHeader titleId={titleId} title={title} onClose={onClose} className="shrink-0 pb-2" />
          <div ref={bodyRef} className={styles.body()}>
            {children}
          </div>
          <div className={styles.footer()}>
            <Button variant="tertiary" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button type="submit" variant="primary" disabled={submitDisabled} isLoading={submitLoading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogBase>
    );
  },
);

FormDialog.displayName = 'FormDialog';
