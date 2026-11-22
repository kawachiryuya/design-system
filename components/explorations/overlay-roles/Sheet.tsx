'use client';

import React from 'react';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

/**
 * 検討用の部品 (Issue #157): 下から出る形 / 画面いっぱい。
 *
 * このファイルは検討の置き場 (components/explorations/overlay-roles/) の中だけで使う。
 * 出荷する部品ではなく、決まりもすべて仮。
 *
 * 仮の決まり:
 * - 土台は `<dialog>` の `showModal()` (フォーカスの閉じ込め・Esc・背景はブラウザに任せる)。背景の色は Modal と同じ
 * - 背景を押すと閉じる (`closeOnBackdrop={false}` で閉じない。確認で使う)
 * - 画面の下端に付く・幅いっぱい・上の角だけ丸い (Modal と同じ rounded-md)
 * - 高さは中身なり、上限 85dvh。本体だけがスクロールし、見出しとフッターは固定
 * - 下端に `env(safe-area-inset-bottom)` の余白
 * - 開くときは下から 200ms (duration normal・easing out)。prefers-reduced-motion では動かさない。閉じる動きは無し
 * - 開いている間は背景をスクロールさせない。閉じたらフォーカスを開く前の要素 (押した要素) に戻す
 * - `full` = 画面いっぱい: 100dvh・角なし。上に見出しと閉じる、下にフッター固定
 */
export interface SheetProps {
  /** 開いているか */
  open: boolean;
  /** 閉じる要求 (Esc / 背景 / 閉じるボタン / 選んだとき) */
  onClose: () => void;
  /** 見出し */
  title: string;
  /** 下から (`sheet`) / 画面いっぱい (`full`) */
  form?: 'sheet' | 'full';
  /**
   * 背景を押して閉じるか。確認は false
   * @default true
   */
  closeOnBackdrop?: boolean;
  /**
   * 上端の短い横棒 (見た目だけ。引いて閉じる動きは無い)。`full` では出さない
   * @default false
   */
  handle?: boolean;
  /** フッター (固定)。確定・取り消しなど */
  footer?: React.ReactNode;
  /**
   * 本体の左右の余白を付けるか。行を端から端まで並べる「選ぶ」では false
   * @default true
   */
  padded?: boolean;
  children: React.ReactNode;
}

// 開く動きと、背景の止め方を補う CSS。Tailwind は arbitrary な animation の @keyframes を作らないので、ここで書く。
// 値は token の CSS 変数 (duration normal / easing out) を読む。
const SHEET_CSS = `
@keyframes x-sheet-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
.x-sheet[open] { animation: x-sheet-in var(--duration-normal) var(--easing-out); }
@media (prefers-reduced-motion: reduce) { .x-sheet[open] { animation: none; } }
`;

let lockCount = 0;
/** 背景のスクロールを止める (html と body の両方。重ねて開いても最後に閉じたときに戻す) */
function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return () => { lockCount -= 1; };
  const html = document.documentElement;
  const body = document.body;
  const prev = { html: html.style.overflow, body: body.style.overflow };
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  return () => {
    lockCount -= 1;
    html.style.overflow = prev.html;
    body.style.overflow = prev.body;
  };
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  title,
  form = 'sheet',
  closeOnBackdrop = true,
  handle = false,
  footer,
  padded = true,
  children,
}) => {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  const returnTo = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      // ブラウザも戻すが、戻さないブラウザに備えて明示する
      returnTo.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  const full = form === 'full';

  return (
    <dialog
      data-ds-root
      ref={ref}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === ref.current) onClose();
      }}
      className={[
        'x-sheet p-0 m-0 inset-x-0 bottom-0 top-auto w-full max-w-none',
        'bg-surface text-onSurface shadow-lg backdrop:bg-surface-overlay',
        'open:flex open:flex-col',
        full ? 'h-[100dvh] max-h-[100dvh] rounded-none' : 'max-h-[85dvh] rounded-t-md',
      ].join(' ')}
    >
      <style>{SHEET_CSS}</style>
      {handle && !full && (
        <div aria-hidden className="flex justify-center pt-2">
          <span className="block h-1 w-10 rounded-full bg-surface-neutral" />
        </div>
      )}
      <header className={['flex items-center justify-between gap-3 pl-4 pr-2', handle && !full ? 'pt-1' : 'pt-2', 'pb-1'].join(' ')}>
        <h2 id={titleId} className="type-section-title text-onSurface flex-1 min-w-0">
          {title}
        </h2>
        <Button variant="tertiary" size="md" iconOnly icon={<Icon name="close" />} aria-label="閉じる" onClick={onClose} />
      </header>
      <div
        className={[
          'flex-1 min-h-0 overflow-y-auto overscroll-contain type-body text-onSurface',
          padded ? 'px-4 pb-4' : 'pb-2',
          // フッターが無いときは本体の下に安全域の余白
          footer ? '' : 'pb-[calc(theme(spacing.4)+env(safe-area-inset-bottom))]',
        ].join(' ')}
      >
        {children}
      </div>
      {footer && (
        <footer className="border-t border-border-subtle px-4 pt-3 pb-[calc(theme(spacing.3)+env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      )}
    </dialog>
  );
};

/** 「選ぶ」の 1 行 */
export interface SheetOptionProps {
  /** 表示する文言 */
  label: string;
  /** 補足 (1 行) */
  description?: string;
  /** 選択中か。true で右にチェックの印 (選択肢に印が無い「操作の一覧」では undefined のまま) */
  selected?: boolean;
  /** 押したとき */
  onSelect: () => void;
  /** 破壊的な操作 */
  destructive?: boolean;
}

/**
 * 「選ぶ」の行。高さ 48px 以上、選択中は右にチェックの印。押したら onSelect (閉じるのは呼ぶ側)。
 * 選択中は「選択中」を読み上げ用の文字でも持つ (印は見た目だけ)。
 */
export const SheetOption: React.FC<SheetOptionProps> = ({ label, description, selected, onSelect, destructive }) => (
  <button
    type="button"
    onClick={onSelect}
    className={[
      'flex w-full min-h-12 items-center gap-3 px-4 py-2 text-left transition-colors focus-ring-inset',
      destructive ? 'text-onSurface-error hover:bg-state-hover-error' : 'text-onSurface hover:bg-state-hover-primary',
    ].join(' ')}
  >
    <span className="flex-1 min-w-0">
      <span className="block type-body">{label}</span>
      {description && <span className="block type-supporting text-onSurface-subtle">{description}</span>}
    </span>
    {selected && (
      <>
        <Icon size="md" color="primary">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Icon>
        <VisuallyHidden>（選択中）</VisuallyHidden>
      </>
    )}
  </button>
);
