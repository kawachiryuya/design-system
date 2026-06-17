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

/** DropdownMenu の配置 (floating-ui の Placement)。 */
export type DropdownMenuPlacement = Placement;

/** DropdownMenu の 1 項目。 */
export interface DropdownMenuItem {
  /** 表示ラベル。 */
  label: React.ReactNode;
  /** 選択時 (click / Enter / Space) のコールバック。選択後メニューは閉じる。 */
  onSelect: () => void;
  /** ラベル左に表示するアイコン (任意)。 */
  icon?: React.ReactNode;
  /**
   * 無効化。キーボードナビゲーションでスキップされる。
   * @default false
   */
  disabled?: boolean;
  /**
   * 破壊的操作 (削除等)。赤系で表示する。
   * @default false
   */
  destructive?: boolean;
  /**
   * typeahead / SR 用のテキスト。`label` が文字列でない場合に指定する。
   */
  textValue?: string;
}

/**
 * DropdownMenu Props
 *
 * トリガーから開く単一階層のアクションメニュー。WAI-ARIA APG の Menu Button パターンに準拠。
 * native の `popover` 属性 (top-layer / 外側クリック・Esc の light-dismiss) を土台にし、
 * 位置決めは `@floating-ui/dom` (offset / flip / shift)、項目移動は `menu` / `menuitem` の
 * roving tabindex + 矢印キー + typeahead で行う。`<Popover>` と同じ overlay 基盤を共有する。
 *
 * @example
 *   <DropdownMenu
 *     trigger={<Button>操作</Button>}
 *     aria-label="行の操作"
 *     items={[
 *       { label: '名前を変更', icon: <Icon name="mode" />, onSelect: rename },
 *       { label: '複製', onSelect: duplicate },
 *       { label: '削除', icon: <Icon name="remove" />, destructive: true, onSelect: remove },
 *     ]}
 *   />
 */
export interface DropdownMenuProps {
  /**
   * 開閉のトリガー要素 (`<Button>` 等)。`aria-haspopup="menu"` / `aria-expanded` /
   * `aria-controls` と ref / onClick が自動注入される。トリガー自身の `ref` は上書きされる。
   */
  trigger: React.ReactElement;
  /** メニュー項目の配列。順序通りに表示される。 */
  items: DropdownMenuItem[];
  /**
   * トリガーに対するメニューの配置。視界からはみ出す場合は flip / shift で自動調整。
   * @default 'bottom-start'
   */
  placement?: DropdownMenuPlacement;
  /**
   * トリガーとメニューの距離 (px)。
   * @default 8
   */
  offset?: number;
  /** 開閉状態 (controlled)。省略時は uncontrolled。 */
  open?: boolean;
  /** 開閉が変化したとき (トリガー操作 / 選択 / Esc / 外側クリック) に呼ばれる。 */
  onOpenChange?: (open: boolean) => void;
  /** メニュー (`role="menu"`) の `aria-label`。用途を SR に伝えるため指定推奨。 */
  'aria-label'?: string;
  /** メニューパネルに付与する追加 class。 */
  className?: string;
}

/**
 * DropdownMenu — Atomic Design: Composite
 *
 * @see DropdownMenuProps for usage examples.
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
  offset = 8,
  open,
  onOpenChange,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const referenceRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const cleanupRef = React.useRef<(() => void) | null>(null);
  const typeaheadRef = React.useRef<{ buffer: string; timer: number | null }>({ buffer: '', timer: null });
  const panelId = React.useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const openState = isControlled ? open : internalOpen;

  const enabledIndexes = React.useMemo(
    () => items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0),
    [items]
  );

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
      // 開いたら最初の有効項目をアクティブにする (focus は activeIndex の effect で行う)。
      setActiveIndex(enabledIndexes[0] ?? -1);
    } else if (!nowOpen) {
      setActiveIndex(-1);
      // 閉じたら trigger にフォーカスを戻す (内部に focus が残る / 空白クリック / Esc)。
      const active = document.activeElement;
      if (active === document.body || panel.contains(active)) {
        reference?.focus();
      }
    }
  };

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

  // アクティブ項目へフォーカス (開いている間)。
  React.useEffect(() => {
    if (openState && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [openState, activeIndex]);

  const setOpenDom = React.useCallback((next: boolean) => {
    const panel = panelRef.current;
    if (!panel || typeof panel.showPopover !== 'function') return;
    const isOpenNow = panel.matches(':popover-open');
    if (next && !isOpenNow) panel.showPopover();
    else if (!next && isOpenNow) panel.hidePopover();
  }, []);

  React.useEffect(() => {
    if (isControlled) setOpenDom(open);
  }, [isControlled, open, setOpenDom]);

  const moveActive = (nextIndex: number) => {
    setActiveIndex(nextIndex);
  };

  const selectAt = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    item.onSelect();
    setOpenDom(false);
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(activeIndex);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(enabledIndexes[(pos + 1) % enabledIndexes.length]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      moveActive(enabledIndexes[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      moveActive(enabledIndexes[enabledIndexes.length - 1]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectAt(activeIndex);
    } else if (e.key === 'Tab') {
      // APG: Tab はメニューを閉じてフォーカスを trigger に戻す (予測可能な focus 位置)。
      e.preventDefault();
      setOpenDom(false);
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // typeahead: 入力文字でラベル先頭一致する項目へ。
      const ta = typeaheadRef.current;
      ta.buffer += e.key.toLowerCase();
      if (ta.timer) window.clearTimeout(ta.timer);
      ta.timer = window.setTimeout(() => { ta.buffer = ''; }, 500);
      const match = enabledIndexes.find((i) => {
        const item = items[i];
        const text = (item.textValue ?? (typeof item.label === 'string' ? item.label : '')).toLowerCase();
        return text.startsWith(ta.buffer);
      });
      if (match !== undefined) moveActive(match);
    }
  };

  const triggerNode = trigger as React.ReactElement<any>;
  const triggerEl = React.cloneElement(triggerNode, {
    ref: (node: HTMLElement | null) => {
      referenceRef.current = node;
    },
    'aria-haspopup': 'menu',
    'aria-expanded': openState,
    'aria-controls': panelId,
    onClick: (e: React.MouseEvent) => {
      triggerNode.props.onClick?.(e);
      setOpenDom(!panelRef.current?.matches(':popover-open'));
    },
  });

  // `popover` は @types/react 18 が未定義のため untyped spread で付与 (初回 render から hidden に)。
  const nativePopoverAttr = { popover: 'auto' } as Record<string, unknown>;

  return (
    <>
      {triggerEl}
      <div
        {...nativePopoverAttr}
        ref={panelRef}
        id={panelId}
        role="menu"
        aria-label={ariaLabel}
        onKeyDown={handlePanelKeyDown}
        className={[
          // popover で top-layer。UA の中央寄せを打ち消し floating-ui が left/top を設定。
          'fixed inset-auto m-0 min-w-[12rem] max-w-[min(20rem,calc(100vw-2rem))]',
          'bg-surface text-onSurface rounded-md border border-border-subtle shadow-lg',
          'py-1 focus:outline-none',
          className,
        ].filter(Boolean).join(' ')}
      >
        {items.map((item, index) => (
          <button
            key={index}
            ref={(el) => { itemRefs.current[index] = el; }}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => selectAt(index)}
            className={[
              'flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm transition-colors',
              'focus:outline-none',
              item.disabled
                ? 'text-onSurface-disabled cursor-not-allowed'
                : item.destructive
                  ? 'text-onSurface-error hover:bg-state-hover-error focus:bg-state-hover-error cursor-pointer'
                  : 'text-onSurface hover:bg-state-hover focus:bg-state-hover cursor-pointer',
            ].join(' ')}
          >
            {item.icon && <span className="flex-shrink-0 inline-flex">{item.icon}</span>}
            <span className="flex-1 min-w-0">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

DropdownMenu.displayName = 'DropdownMenu';
