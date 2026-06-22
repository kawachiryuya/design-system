'use client';

import React from 'react';
import {
  computePosition,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  type Placement,
} from '@floating-ui/dom';

/** Tooltip の配置 (floating-ui の Placement)。 */
export type TooltipPlacement = Placement;

/**
 * Tooltip Props
 *
 * トリガーに hover / focus したとき、その近くに短い補足テキストを浮かせる。
 * native の `popover="manual"` で top-layer に出し (overflow / z-index のクリップ回避)、
 * 位置決めは `@floating-ui/dom`、表示制御は hover / focus + 遅延で行う。`<Popover>` と同じ overlay 基盤。
 *
 * WCAG 1.4.13 (Content on Hover or Focus) 対応: Esc で閉じられる (Dismissible) / ツールチップ上に
 * ポインタを移しても消えない (Hoverable) / 自動では消えない (Persistent)。
 *
 * **トリガーは focusable な単一要素** (`<Button>` / `<Link>` 等、または `tabIndex={0}` を持つ要素) であること。
 * **content は短いテキストのみ** — 操作要素 (button / link) は入れない (tooltip は読み上げ補足であり操作対象ではない)。
 *
 * @example
 *   <Tooltip content="未保存の変更があります">
 *     <Button iconOnly icon={<Icon name="warning" />} aria-label="警告" />
 *   </Tooltip>
 */
export interface TooltipProps {
  /** トリガー要素 (focusable な単一要素)。`aria-describedby` と hover/focus ハンドラが自動注入される。 */
  children: React.ReactElement;
  /** 表示する短い補足テキスト (操作要素は入れない)。 */
  content: React.ReactNode;
  /**
   * 配置。視界からはみ出す場合は flip / shift で自動調整。
   * @default 'top'
   */
  placement?: TooltipPlacement;
  /**
   * トリガーとの距離 (px)。
   * @default 6
   */
  offset?: number;
  /**
   * hover で表示するまでの遅延 (ms)。focus 時は即時表示 (キーボード/SR のため)。
   * @default 300
   */
  delay?: number;
  /** パネルに付与する追加 class。 */
  className?: string;
}

const HIDE_DELAY = 120; // ポインタを trigger→tooltip へ移す猶予 (Hoverable)

/**
 * Tooltip — Atomic Design: Composite
 *
 * @see TooltipProps for usage examples.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  offset = 6,
  delay = 300,
  className = '',
}) => {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const referenceRef = React.useRef<HTMLElement | null>(null);
  const cleanupRef = React.useRef<(() => void) | null>(null);
  const showTimerRef = React.useRef<number | null>(null);
  const hideTimerRef = React.useRef<number | null>(null);
  const hoveredRef = React.useRef(false);
  const focusedRef = React.useRef(false);
  const dismissedRef = React.useRef(false); // Esc で閉じた間は再表示しない
  const escHandlerRef = React.useRef<((e: KeyboardEvent) => void) | null>(null);
  const tooltipId = React.useId();

  const clearTimers = () => {
    if (showTimerRef.current) { window.clearTimeout(showTimerRef.current); showTimerRef.current = null; }
    if (hideTimerRef.current) { window.clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
  };

  const setShown = React.useCallback((next: boolean) => {
    const panel = panelRef.current;
    const reference = referenceRef.current;
    if (!panel || typeof panel.showPopover !== 'function') return;
    const isOpen = panel.matches(':popover-open');

    if (next && !isOpen && reference) {
      panel.showPopover();
      const update = () => {
        computePosition(reference, panel, {
          strategy: 'fixed',
          placement,
          middleware: [offsetMiddleware(offset), flip({ padding: 8 }), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          panel.style.left = `${x}px`;
          panel.style.top = `${y}px`;
        });
      };
      cleanupRef.current = autoUpdate(reference, panel, update);
      // WCAG 1.4.13 Dismissible: 表示中は Esc で閉じる (focus が trigger 外でも効くよう document に張る)。
      const onEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { dismissedRef.current = true; setShown(false); }
      };
      escHandlerRef.current = onEsc;
      document.addEventListener('keydown', onEsc);
    } else if (!next && isOpen) {
      panel.hidePopover();
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (escHandlerRef.current) {
        document.removeEventListener('keydown', escHandlerRef.current);
        escHandlerRef.current = null;
      }
    }
  }, [placement, offset]);

  const scheduleShow = () => {
    clearTimers();
    if (dismissedRef.current) return;
    showTimerRef.current = window.setTimeout(() => setShown(true), delay);
  };
  const showNow = () => {
    clearTimers();
    if (dismissedRef.current) return;
    setShown(true);
  };
  const scheduleHide = () => {
    clearTimers();
    hideTimerRef.current = window.setTimeout(() => {
      if (!hoveredRef.current && !focusedRef.current) setShown(false);
    }, HIDE_DELAY);
  };

  // unmount 時の後始末。
  React.useEffect(() => {
    return () => {
      clearTimers();
      cleanupRef.current?.();
      if (escHandlerRef.current) document.removeEventListener('keydown', escHandlerRef.current);
    };
  }, []);

  const child = children as React.ReactElement<any>;
  const childProps = child.props;
  const triggerEl = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => { referenceRef.current = node; },
    'aria-describedby': tooltipId,
    onMouseEnter: (e: React.MouseEvent) => { childProps.onMouseEnter?.(e); hoveredRef.current = true; scheduleShow(); },
    onMouseLeave: (e: React.MouseEvent) => { childProps.onMouseLeave?.(e); hoveredRef.current = false; dismissedRef.current = false; scheduleHide(); },
    onFocus: (e: React.FocusEvent) => { childProps.onFocus?.(e); focusedRef.current = true; showNow(); },
    onBlur: (e: React.FocusEvent) => { childProps.onBlur?.(e); focusedRef.current = false; dismissedRef.current = false; scheduleHide(); },
  });

  // `popover` は @types/react 18 が未定義のため untyped spread で付与。manual = light-dismiss なし (hover/focus で制御)。
  const nativePopoverAttr = { popover: 'manual' } as Record<string, unknown>;

  return (
    <>
      {triggerEl}
      <div data-ds-root
        {...nativePopoverAttr}
        ref={panelRef}
        id={tooltipId}
        role="tooltip"
        // WCAG 1.4.13 Hoverable: tooltip 上にポインタを移しても消えないよう hover を拾う。
        onMouseEnter={() => { hoveredRef.current = true; clearTimers(); }}
        onMouseLeave={() => { hoveredRef.current = false; scheduleHide(); }}
        className={[
          'fixed inset-auto m-0 w-max max-w-[min(18rem,calc(100vw-2rem))]',
          'rounded-sm bg-surface-neutral-strong text-onSurface-inverse shadow-md',
          'px-2 py-1 text-caption',
          className,
        ].filter(Boolean).join(' ')}
      >
        {content}
      </div>
    </>
  );
};

Tooltip.displayName = 'Tooltip';
