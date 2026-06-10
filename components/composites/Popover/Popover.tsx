import React from 'react';
import {
  computePosition,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  type Placement,
} from '@floating-ui/dom';

/** Popover の配置 (floating-ui の Placement)。`bottom-start` / `top` / `right-end` 等。 */
export type PopoverPlacement = Placement;

/**
 * Popover Props
 *
 * native の `popover` 属性 (top-layer / 外側クリック・Esc での light-dismiss) を土台にし、
 * 位置決めだけ `@floating-ui/dom` (offset / flip / shift + autoUpdate) で行う。
 * focus trap は張らない非モーダルの overlay。`DropdownMenu` / `Tooltip` はこの Popover を土台に積む想定。
 *
 * @example
 *   // 基本 (uncontrolled)
 *   <Popover trigger={<Button>詳細</Button>} aria-label="補足情報">
 *     <p>このフィールドは公開プロフィールに表示されます。</p>
 *   </Popover>
 *
 * @example
 *   // controlled
 *   const [open, setOpen] = useState(false);
 *   <Popover trigger={<Button>メニュー</Button>} open={open} onOpenChange={setOpen} placement="bottom-end">
 *     …
 *   </Popover>
 */
export interface PopoverProps {
  /**
   * 開閉のトリガー要素 (`<Button>` 等)。クリックで開閉し、
   * `aria-haspopup` / `aria-expanded` / `aria-controls` と ref / onClick が自動注入される。
   * トリガー自身の `ref` は Popover が管理するため上書きされる。
   */
  trigger: React.ReactElement;
  /** パネルに表示する内容。 */
  children: React.ReactNode;
  /**
   * トリガーに対するパネルの配置。視界からはみ出す場合は flip / shift で自動調整する。
   * @default 'bottom-start'
   */
  placement?: PopoverPlacement;
  /**
   * トリガーとパネルの距離 (px)。
   * @default 8
   */
  offset?: number;
  /**
   * 開閉状態 (controlled)。省略時は uncontrolled (内部 state で管理)。
   */
  open?: boolean;
  /**
   * 開閉が変化したときに呼ばれる (トリガー操作 / Esc / 外側クリックの light-dismiss いずれも)。
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * パネルの `aria-label`。パネル内に見出しが無い場合は指定推奨 (SR がダイアログの用途を読み上げる)。
   */
  'aria-label'?: string;
  /** パネルに付与する追加 class。 */
  className?: string;
}

/**
 * Popover — Atomic Design: Composite
 *
 * @see PopoverProps for usage examples.
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom-start',
  offset = 8,
  open,
  onOpenChange,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const referenceRef = React.useRef<HTMLElement | null>(null);
  const cleanupRef = React.useRef<(() => void) | null>(null);
  const panelId = React.useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const openState = isControlled ? open : internalOpen;

  // 最新の props / state を読む toggle ハンドラ。listener は mount 時に一度だけ張る。
  const handleToggleRef = React.useRef<(nowOpen: boolean) => void>(() => {});
  handleToggleRef.current = (nowOpen: boolean) => {
    if (!isControlled) setInternalOpen(nowOpen);
    onOpenChange?.(nowOpen);

    const panel = panelRef.current;
    const reference = referenceRef.current;
    if (!panel) return;

    cleanupRef.current?.();
    cleanupRef.current = null;

    if (nowOpen && reference) {
      // floating-ui で位置決め (offset → flip → shift)。scroll / resize に autoUpdate で追従。
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
      // パネル内の最初の focusable へ (無ければパネル本体) フォーカス移動。
      requestAnimationFrame(() => {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );
        (focusables[0] ?? panel).focus();
      });
    } else if (!nowOpen) {
      // 閉じたら trigger にフォーカスを戻す。ただし外側の別コントロールを押して閉じた場合
      // (focus がそこへ移っている) は奪わない。Esc / 空白クリック / 内部 focus 残りのみ戻す。
      const active = document.activeElement;
      if (active === document.body || panel.contains(active)) {
        reference?.focus();
      }
    }
  };

  // mount 時に toggle listener を張る (popover 属性は render 側で付与済み)。
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onToggle = (e: Event) => {
      handleToggleRef.current((e as ToggleEvent).newState === 'open');
    };
    panel.addEventListener('toggle', onToggle);
    return () => {
      panel.removeEventListener('toggle', onToggle);
      cleanupRef.current?.();
    };
  }, []);

  const setOpenDom = React.useCallback((next: boolean) => {
    const panel = panelRef.current;
    if (!panel || typeof panel.showPopover !== 'function') return;
    const isOpenNow = panel.matches(':popover-open');
    if (next && !isOpenNow) panel.showPopover();
    else if (!next && isOpenNow) panel.hidePopover();
  }, []);

  // controlled: open prop の変化を DOM へ反映。
  React.useEffect(() => {
    if (isControlled) setOpenDom(open);
  }, [isControlled, open, setOpenDom]);

  const triggerNode = trigger as React.ReactElement<any>;
  const triggerEl = React.cloneElement(triggerNode, {
    ref: (node: HTMLElement | null) => {
      referenceRef.current = node;
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': openState,
    'aria-controls': panelId,
    onClick: (e: React.MouseEvent) => {
      triggerNode.props.onClick?.(e);
      setOpenDom(!panelRef.current?.matches(':popover-open'));
    },
  });

  // `popover` は @types/react 18 が未定義のため untyped spread で付与 (初回 render から
  // top-layer の hidden 状態にするため、effect ではなく render で設定する)。
  const nativePopoverAttr = { popover: 'auto' } as Record<string, unknown>;

  return (
    <>
      {triggerEl}
      <div
        {...nativePopoverAttr}
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={[
          // popover 属性で top-layer に出る。UA の中央寄せ (inset:0; margin:auto) を打ち消し、
          // floating-ui が left/top を inline で設定する。
          'fixed inset-auto m-0 w-max max-w-[min(20rem,calc(100vw-2rem))]',
          'bg-surface text-onSurface rounded-md border border-border-subtle shadow-lg',
          'p-4 text-body-sm',
          'focus:outline-none',
          className,
        ].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </>
  );
};

Popover.displayName = 'Popover';
