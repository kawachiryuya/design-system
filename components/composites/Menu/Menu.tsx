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
import { Icon } from '../../primitives/Icon';
import { BottomSheet } from '../../_internal/BottomSheet/BottomSheet';
import { useIsNarrowViewport } from '../../_internal/useIsNarrowViewport';
import { useHideFocusRingUntilKey } from '../../_internal/useHideFocusRingUntilKey';
import { tv } from '../../_internal/tv';

/** Menu の配置 (floating-ui の Placement)。広い幅でだけ効く。 */
export type MenuPlacement = Placement;

/** Menu の 1 項目。 */
export interface MenuItem {
  /** 表示ラベル。 */
  label: React.ReactNode;
  /** 選んだとき (押す / Enter / Space) に呼ばれる。呼んだ後にメニューは閉じ、フォーカスは入口に戻る。 */
  onSelect: () => void;
  /** ラベル左に表示するアイコン (任意)。 */
  icon?: React.ReactNode;
  /**
   * 無効化。選べず、矢印キーの移動でも飛ばす (`aria-disabled`。押してもフォーカスは項目から外れない)。
   * @default false
   */
  disabled?: boolean;
  /**
   * 破壊的な操作 (削除等)。赤系で表示する。
   * @default false
   */
  destructive?: boolean;
  /**
   * 選択中か。**1 つでも `selected` (true / false) を持つ項目があるメニューは「1 つ選ぶ」メニュー**になり、
   * 項目は `menuitemradio` + `aria-checked`、選択中の行の右にチェックを出す。開いた直後のフォーカスも選択中の項目へ。
   * どの項目も `selected` を持たないメニューは「操作の一覧」(`menuitem`、チェックの列なし)。
   */
  selected?: boolean;
  /** 先頭文字での移動と読み上げ用のテキスト。`label` が文字列でない場合に指定する。 */
  textValue?: string;
}

/**
 * Menu Props
 *
 * 役割「選ぶ」の部品 (#157): 押した要素に属する選択肢・操作から 1 つを選ぶ。選んだら閉じる。
 * **出方は部品が幅で決める (使う側は選ばない)**: 画面の幅 640px 以上は押した要素の近くに出し
 * (native の `popover` + `@floating-ui/dom`)、640px 未満は画面の下から出す (内部の `BottomSheet`)。
 * どちらも外を押すと閉じる。開いている間に幅が境目をまたいだら閉じる (形を入れ替えない)。
 *
 * 使い方は 2 つ: 項目に `selected` を持たせた「1 つ選ぶ」(並び順・種別など。選択中の印が出る) と、
 * 持たせない「操作の一覧」(変更・複製・削除など)。フォームの欄で値を選んで送るものは `<Select>`。
 *
 * キーボードは WAI-ARIA APG の Menu Button パターン (どちらの幅でも同じ): 矢印・Home・End・先頭文字で移動、
 * Enter・Space で選ぶ、Esc で閉じる、Tab は閉じて入口に戻す。
 *
 * @example
 *   // 操作の一覧
 *   <Menu
 *     trigger={<Button>予約を変更</Button>}
 *     title="予約を変更"
 *     items={[
 *       { label: '列車を変更', onSelect: changeTrain },
 *       { label: '座席を変更', onSelect: changeSeat },
 *       { label: '予約を取り消す', icon: <Icon name="remove" />, destructive: true, onSelect: cancel },
 *     ]}
 *   />
 *
 * @example
 *   // 1 つ選ぶ (選択中の印)
 *   <Menu
 *     trigger={<Button variant="secondary">並び順：{label}</Button>}
 *     title="並び順"
 *     items={[
 *       { label: '出発時刻順', selected: sort === 'dep', onSelect: () => setSort('dep') },
 *       { label: '到着時刻順', selected: sort === 'arr', onSelect: () => setSort('arr') },
 *     ]}
 *   />
 */
export interface MenuProps {
  /**
   * 開閉の入口 (`<Button>` 等)。`aria-haspopup="menu"` / `aria-expanded` / `aria-controls` と
   * ref / onClick / onPointerDown が自動で付く。入口自身の `ref` は上書きされる。
   */
  trigger: React.ReactElement;
  /** メニューの項目。並べた順に出る。 */
  items: MenuItem[];
  /**
   * メニューの見出し (必須)。狭い幅では下から出る面の見出し、広い幅では `role="menu"` の読み上げ名になる。
   * 何を選ぶメニューかを短く (例: 「並び順」「予約を変更」)。
   */
  title: string;
  /**
   * 入口に対するメニューの位置。視界からはみ出す場合は flip / shift で調整する。**広い幅でだけ効く**。
   * @default 'bottom-start'
   */
  placement?: MenuPlacement;
  /**
   * 入口とメニューの距離 (px)。**広い幅でだけ効く**。
   * @default 8
   */
  offset?: number;
  /** 開閉の状態 (controlled)。省略時は uncontrolled。 */
  open?: boolean;
  /** 開閉が変わるとき (入口を押す / 選ぶ / Esc / Tab / 外を押す / 閉じるボタン / 帯を引く / 幅が境目をまたぐ) に呼ばれる。 */
  onOpenChange?: (open: boolean) => void;
  /** 広い幅のメニューのパネルに付ける追加の class。**狭い幅 (下から出る面) には付かない**。 */
  className?: string;
}

const item = tv({
  base: [
    'flex w-full items-center gap-2 text-left transition-colors',
    // フォーカスは輪だけ (内側 2px、キーボードのときだけ)。塗りはホバーだけ (AGENTS §3-2「フォーカスの規則」)
    'focus-ring-inset',
    // 無効は aria-disabled (disabled 属性にすると、押したときにフォーカスがメニューの外へ落ちる)
    'cursor-pointer aria-disabled:text-onSurface-disabled aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent',
  ],
  variants: {
    form: {
      // 押した要素の近く: 今までどおりの密度
      popover: 'px-3 py-2 type-supporting',
      // 下から出る面: 指で押すので 48px 以上
      sheet: 'min-h-12 px-4 py-3 type-body',
    },
    tone: {
      default: 'text-onSurface hover:bg-state-hover-primary',
      destructive: 'text-onSurface-error hover:bg-state-hover-error',
    },
  },
});

type Form = 'popover' | 'sheet';

/**
 * Menu — 役割「選ぶ」(Composite)
 *
 * @see MenuProps 使い方
 */
export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  title,
  placement = 'bottom-start',
  offset = 8,
  open,
  onOpenChange,
  className = '',
}) => {
  const narrow = useIsNarrowViewport();
  const form: Form = narrow ? 'sheet' : 'popover';
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const sheetRef = React.useRef<HTMLDialogElement | null>(null);
  const referenceRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const typeaheadRef = React.useRef<{ buffer: string; timer: number | null }>({ buffer: '', timer: null });
  const triggerPressRef = React.useRef<boolean | null>(null);
  const menuId = React.useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  /** 入口をポインタ (指・マウス。click の detail > 0) で押して開いたか。キーボード・読み上げの「実行」(detail 0)・外からの open は false */
  const [openedByPointer, setOpenedByPointer] = React.useState(false);
  const [, forceRender] = React.useReducer((n: number) => n + 1, 0);
  const openState = isControlled ? open : internalOpen;

  // 開いたときの形。幅が境目をまたいだら、その形はもう出さない (閉じる。形を入れ替えない)
  const formAtOpenRef = React.useRef<Form | null>(null);
  if (!openState) formAtOpenRef.current = null;
  else if (formAtOpenRef.current === null) formAtOpenRef.current = form;
  const shown = openState && formAtOpenRef.current === form;
  // ポインタで開いたときは、メニューの中でキーが押されるまでフォーカスの輪を出さない (#157。フォーカスは移す)
  const ring = useHideFocusRingUntilKey(shown && openedByPointer && form === 'popover');

  const isChoice = items.some((it) => it.selected !== undefined);
  const enabledIndexes = React.useMemo(
    () => items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0),
    [items],
  );
  const selectedIndex = items.findIndex((it) => it.selected && !it.disabled);
  const initialIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1);

  // 最新の値を handler / effect から読む
  const openRef = React.useRef(openState);
  openRef.current = openState;
  const isControlledRef = React.useRef(isControlled);
  isControlledRef.current = isControlled;
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const initialIndexRef = React.useRef(initialIndex);
  initialIndexRef.current = initialIndex;

  const requestOpenChange = React.useCallback((next: boolean) => {
    if (openRef.current === next) return;
    if (!isControlledRef.current) setInternalOpen(next);
    onOpenChangeRef.current?.(next);
  }, []);

  // 下から出る面に渡す、開いた直後のフォーカス先 (選択中の項目か、最初の有効な項目)
  const initialFocusRef = React.useMemo<React.RefObject<HTMLElement | null>>(
    () => ({
      get current() {
        return itemRefs.current[initialIndexRef.current] ?? null;
      },
    }),
    [],
  );

  // 開いたら、選択中 (無ければ最初の有効な項目) をアクティブに。閉じたら「ポインタで開いた」も消す (次に外から開いたときに持ち越さない)
  React.useEffect(() => {
    setActiveIndex(shown ? initialIndexRef.current : -1);
    if (!shown) setOpenedByPointer(false);
  }, [shown]);

  // 幅が境目をまたいだ: 開いていれば閉じる。親が開いたままにした (controlled で閉じない) ときは、新しい形で出し直す
  const prevFormRef = React.useRef(form);
  React.useEffect(() => {
    if (prevFormRef.current === form) return;
    prevFormRef.current = form;
    if (!openRef.current) return;
    formAtOpenRef.current = null;
    requestOpenChange(false);
    forceRender();
    // 広い幅のメニュー (popover) は外されたので、中にあったフォーカスは body に落ちている。入口に戻す
    const active = document.activeElement;
    if (!active || active === document.body) referenceRef.current?.focus();
  }, [form, requestOpenChange]);

  // 広い幅: popover の開閉と位置
  const wasShownRef = React.useRef(false);
  /** 閉じる直前 (beforetoggle) に、フォーカスがメニューの中にあったか。ブラウザは閉じるときに、開く前の要素へ勝手に戻すことがある */
  const focusWasInsideRef = React.useRef(false);
  React.useEffect(() => {
    if (form !== 'popover') return;
    const panel = panelRef.current;
    const reference = referenceRef.current;
    if (!panel || typeof panel.showPopover !== 'function') return;
    if (shown) {
      wasShownRef.current = true;
      if (!panel.matches(':popover-open')) panel.showPopover();
      if (!reference) return;
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
      return autoUpdate(reference, panel, update);
    }
    if (panel.matches(':popover-open')) panel.hidePopover();
    if (wasShownRef.current) {
      wasShownRef.current = false;
      // 閉じたら入口にフォーカスを戻す (中にフォーカスがあった / 何も無い所を押した)。
      // ブラウザは popover を閉じるとき、開く前にフォーカスがあった要素へ戻す (別のメニューから開いたときは入口でない) ので、
      // 閉じる直前に中にあったかで決める
      const active = document.activeElement;
      const inside = focusWasInsideRef.current;
      focusWasInsideRef.current = false;
      if (inside || !active || active === document.body || panel.contains(active)) reference?.focus();
    }
  }, [form, shown, placement, offset]);

  // 広い幅: 外を押す・Esc でブラウザが閉じた (light dismiss) ことを状態に伝える
  React.useEffect(() => {
    if (form !== 'popover') return;
    const panel = panelRef.current;
    if (!panel) return;
    const onBeforeToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === 'closed') focusWasInsideRef.current = panel.contains(document.activeElement);
    };
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === 'closed' && openRef.current) requestOpenChange(false);
    };
    panel.addEventListener('beforetoggle', onBeforeToggle);
    panel.addEventListener('toggle', onToggle);
    return () => {
      panel.removeEventListener('beforetoggle', onBeforeToggle);
      panel.removeEventListener('toggle', onToggle);
    };
  }, [form, requestOpenChange]);

  // 開いている間に items が変わってアクティブな項目が消えた・無効になった: 近い有効な項目へ移す。
  // 無ければ項目 0 個のときと同じ扱い (狭い幅は面そのもの、広い幅は入口にフォーカス)
  React.useEffect(() => {
    if (!shown || activeIndex < 0) return;
    if (activeIndex < items.length && !items[activeIndex].disabled) return;
    if (enabledIndexes.length === 0) {
      setActiveIndex(-1);
      (form === 'sheet' ? sheetRef.current : referenceRef.current)?.focus();
      return;
    }
    const nearest = enabledIndexes.reduce((a, b) => (Math.abs(b - activeIndex) < Math.abs(a - activeIndex) ? b : a));
    setActiveIndex(nearest);
  }, [shown, activeIndex, items, enabledIndexes, form]);

  // アクティブな項目へフォーカス (開いている間)。popover を出す effect の後に置く
  React.useEffect(() => {
    if (shown && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [shown, activeIndex]);

  React.useEffect(
    () => () => {
      const timer = typeaheadRef.current.timer;
      if (timer) window.clearTimeout(timer);
    },
    [],
  );

  const selectAt = (index: number) => {
    const it = items[index];
    if (!it || it.disabled) return;
    try {
      it.onSelect();
    } finally {
      // onSelect が例外を投げても閉じる (開いたまま・背景が止まったままにしない)。例外はそのまま上へ
      requestOpenChange(false);
    }
  };

  // 無効な項目・項目の間を押しても、フォーカスを項目から外さない (外れると矢印・Tab がメニューに届かなくなる)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!(e.target as Element).closest('[role^="menuitem"]:not([aria-disabled="true"])')) e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      // APG: Tab はメニューを閉じて入口にフォーカスを戻す (下から出る面でも同じ。面の閉じるボタンには Tab で行かない)
      e.preventDefault();
      requestOpenChange(false);
      return;
    }
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(activeIndex);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(enabledIndexes[(pos + 1) % enabledIndexes.length]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(enabledIndexes[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      // 選ぶのはフォーカスのある項目 (押しかけてずらしたときなど、activeIndex と輪の位置がずれていても、見えている輪の項目)
      e.preventDefault();
      const focused = itemRefs.current.findIndex((el) => el !== null && el === document.activeElement);
      if (focused >= 0) selectAt(focused);
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // 先頭文字: 入力した文字でラベルが始まる項目へ
      const ta = typeaheadRef.current;
      ta.buffer += e.key.toLowerCase();
      if (ta.timer) window.clearTimeout(ta.timer);
      ta.timer = window.setTimeout(() => {
        ta.buffer = '';
      }, 500);
      const match = enabledIndexes.find((i) => {
        const it = items[i];
        const text = (it.textValue ?? (typeof it.label === 'string' ? it.label : '')).toLowerCase();
        return text.startsWith(ta.buffer);
      });
      if (match !== undefined) setActiveIndex(match);
    }
  };

  const renderItems = (f: Form) =>
    items.map((it, index) => (
      <button
        key={index}
        ref={(el) => {
          itemRefs.current[index] = el;
        }}
        type="button"
        role={isChoice ? 'menuitemradio' : 'menuitem'}
        aria-checked={isChoice ? !!it.selected : undefined}
        aria-disabled={it.disabled || undefined}
        tabIndex={index === activeIndex ? 0 : -1}
        onClick={() => selectAt(index)}
        onFocus={() => {
          // フォーカスが項目に移ったら (押した・プログラム)、矢印キーの続きもそこから
          if (!it.disabled) setActiveIndex(index);
        }}
        className={item({ form: f, tone: it.destructive ? 'destructive' : 'default' })}
      >
        {it.icon && <span className="flex-shrink-0 inline-flex">{it.icon}</span>}
        <span className="flex-1 min-w-0">{it.label}</span>
        {isChoice && (
          // 選択中の印。読み上げは aria-checked が伝えるので、アイコンは読み上げから外す
          <span aria-hidden className="flex-shrink-0 inline-flex w-5 justify-center text-onSurface-primary">
            {it.selected && <Icon name="check" size="sm" aria-hidden />}
          </span>
        )}
      </button>
    ));

  const triggerNode = trigger as React.ReactElement<any>;
  const triggerEl = React.cloneElement(triggerNode, {
    ref: (node: HTMLElement | null) => {
      referenceRef.current = node;
    },
    'aria-haspopup': 'menu',
    'aria-expanded': shown,
    'aria-controls': menuId,
    onPointerDown: (e: React.PointerEvent) => {
      triggerNode.props.onPointerDown?.(e);
      // 押し始めた時点の開閉を覚える (広い幅では、押した瞬間にブラウザが外を押したとして閉じることがある)
      triggerPressRef.current = openRef.current;
    },
    onClick: (e: React.MouseEvent) => {
      triggerNode.props.onClick?.(e);
      const wasOpen = triggerPressRef.current ?? openRef.current;
      triggerPressRef.current = null;
      if (!wasOpen) setOpenedByPointer(e.detail > 0);
      requestOpenChange(!wasOpen);
    },
  });

  if (form === 'sheet') {
    return (
      <>
        {triggerEl}
        <BottomSheet
          ref={sheetRef}
          open={shown}
          onClose={() => requestOpenChange(false)}
          title={title}
          initialFocusRef={initialFocusRef}
          returnFocusRef={referenceRef}
          hideFocusRing={openedByPointer}
          bodyPadding="none"
        >
          {/* 面 (dialog) の名前が見出しなので、menu には名前を付けない (二重に読ませない) */}
          <div role="menu" id={menuId} onKeyDown={handleKeyDown} onMouseDown={handleMouseDown} className="flex flex-col pb-2">
            {renderItems('sheet')}
          </div>
        </BottomSheet>
      </>
    );
  }

  // `popover` は @types/react 18 が未定義のため untyped spread で付与 (初回 render から hidden に)。
  const nativePopoverAttr = { popover: 'auto' } as Record<string, unknown>;

  return (
    <>
      {triggerEl}
      <div
        data-ds-root
        data-ds-hide-focus-ring={ring.hidden ? '' : undefined}
        onKeyDownCapture={ring.onKeyDownCapture}
        {...nativePopoverAttr}
        ref={panelRef}
        id={menuId}
        role="menu"
        aria-label={title}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        className={[
          // popover で top-layer。UA の中央寄せを打ち消し floating-ui が left/top を設定。
          'fixed inset-auto m-0 min-w-[12rem] max-w-[min(20rem,calc(100vw-2rem))]',
          'bg-surface text-onSurface rounded-md border border-border-subtle shadow-lg',
          'py-1',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {renderItems('popover')}
      </div>
    </>
  );
};

Menu.displayName = 'Menu';
