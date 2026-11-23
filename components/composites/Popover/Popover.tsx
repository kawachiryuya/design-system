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
import { BottomSheet, firstTabbable } from '../../_internal/BottomSheet/BottomSheet';
import { useIsNarrowViewport } from '../../_internal/useIsNarrowViewport';
import { useHideFocusRingUntilKey, hideFocusRingUntilKeyOrBlur } from '../../_internal/useHideFocusRingUntilKey';

/** Popover の配置 (floating-ui の Placement)。`bottom-start` / `top` / `right-end` 等。広い幅でだけ効く。 */
export type PopoverPlacement = Placement;

/**
 * Popover Props
 *
 * 役割「補足」の部品 (#157): 押した要素についての説明や軽い操作を出す。読み流せて、外を押すと閉じる。
 * **出方は部品が幅で決める (使う側は選ばない)**: 画面の幅 640px 以上は押した要素の近くに出し
 * (native の `popover="auto"` + `@floating-ui/dom`。フォーカスは閉じ込めない)、640px 未満は画面の下から出す
 * (内部の `BottomSheet`。背景が暗くなり、Tab で面の外 (背景のページ) には出ない)。開いている間に幅が境目をまたいだら閉じる
 * (形を入れ替えない)。
 *
 * 開いた直後のフォーカスは、どちらの幅でも中の最初の押せるもの (無ければ面・パネルそのもの)。
 * 閉じたら入口に戻す。戻せない確認・まとまった入力は Modal、選択肢から 1 つ選ぶのは `Menu`。
 *
 * @example
 *   // 基本 (uncontrolled)
 *   <Popover trigger={<Button>自由席について</Button>} title="自由席について">
 *     <p>自由席は 1〜3 号車です。混雑時は座れないことがあります。</p>
 *   </Popover>
 *
 * @example
 *   // controlled
 *   const [open, setOpen] = useState(false);
 *   <Popover trigger={<Button>アカウント</Button>} title="アカウント" open={open} onOpenChange={setOpen} placement="bottom-end">
 *     …
 *   </Popover>
 */
export interface PopoverProps {
  /**
   * 開閉の入口 (`<Button>` 等)。押すと開閉し、`aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` と
   * ref / onClick / onPointerDown が自動で付く。入口自身の `ref` は上書きされる。
   */
  trigger: React.ReactElement;
  /** 中身。 */
  children: React.ReactNode;
  /**
   * 見出し (必須)。狭い幅では下から出る面の見出し、広い幅ではパネル (`role="dialog"`) の読み上げ名になる
   * (広い幅の見た目には見出しを出さない)。何についての補足かを短く (例: 「自由席について」「アカウント」)。
   */
  title: string;
  /**
   * 入口に対するパネルの配置。視界からはみ出す場合は flip / shift で自動調整する。**広い幅でだけ効く**。
   * @default 'bottom-start'
   */
  placement?: PopoverPlacement;
  /**
   * 入口とパネルの距離 (px)。**広い幅でだけ効く**。
   * @default 8
   */
  offset?: number;
  /** 開閉の状態 (controlled)。省略時は uncontrolled。 */
  open?: boolean;
  /**
   * 開閉が変わるとき (入口を押す / Esc / 外を押す / 閉じるボタン / 帯を引く / 幅が境目をまたぐ) に呼ばれる。
   * controlled で親が閉じる要求を無視したとき、狭い幅の面は開いたまま、広い幅のパネルは消える (`aria-expanded` は
   * true のまま。入口を押すとパネルを出し直す)。
   */
  onOpenChange?: (open: boolean) => void;
  /** 広い幅のパネルに付ける追加の class。**狭い幅 (下から出る面) には付かない**。 */
  className?: string;
}

type Form = 'popover' | 'sheet';

/**
 * Popover — 役割「補足」(Composite)
 *
 * @see PopoverProps 使い方
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
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
  const referenceRef = React.useRef<HTMLElement | null>(null);
  /** 入口を押し始めた時点の開閉 (状態) と、広い幅のパネルが実際に出ていたか */
  const triggerPressRef = React.useRef<{ open: boolean; panelShown: boolean } | null>(null);
  const panelId = React.useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  /** 入口をポインタ (指・マウス。click の detail > 0) で押して開いたか。キーボード・読み上げの「実行」(detail 0)・外からの open は false */
  const [openedByPointer, setOpenedByPointer] = React.useState(false);
  const [, forceRender] = React.useReducer((n: number) => n + 1, 0);
  const openState = isControlled ? open : internalOpen;

  // 開いたときの形。幅が境目をまたいだら、その形はもう出さない (閉じる。形を入れ替えない)
  const formAtOpenRef = React.useRef<Form | null>(null);
  if (!openState) formAtOpenRef.current = null;
  else if (formAtOpenRef.current === null) formAtOpenRef.current = form;
  const shown = openState && formAtOpenRef.current === form;
  // ポインタで開いたときは、パネルの中でキーが押されるまでフォーカスの輪を出さない (#157。フォーカスは移す)
  const ring = useHideFocusRingUntilKey(shown && openedByPointer && form === 'popover');

  // 最新の値を handler / effect から読む
  const openRef = React.useRef(openState);
  openRef.current = openState;
  const isControlledRef = React.useRef(isControlled);
  isControlledRef.current = isControlled;
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  /** 開いている間の最後の操作が、ポインタ (指・マウスの押し始め) か、キーか。閉じ方の見分けに使う */
  const lastInputRef = React.useRef<'pointer' | 'key'>('key');

  /**
   * 開閉の要求。閉じるとき、最後の操作がポインタなら (外を押す・帯を引く・閉じるボタンや入口を押す)、
   * 入口へ戻すフォーカスに輪を出さない (次にキーが押されるか、入口からフォーカスが外れるまで)。
   * 幅が境目をまたいで閉じるときは `neutral` (今までどおり輪を出す側)
   */
  const requestOpenChange = React.useCallback((next: boolean, neutral = false) => {
    if (openRef.current === next) return;
    if (!next && !neutral && lastInputRef.current === 'pointer') hideFocusRingUntilKeyOrBlur(referenceRef.current);
    if (!isControlledRef.current) setInternalOpen(next);
    onOpenChangeRef.current?.(next);
  }, []);

  // 開いている間の最後の操作を覚える (開いたときは、開き方から始める)
  React.useEffect(() => {
    if (!shown) return;
    lastInputRef.current = openedByPointer ? 'pointer' : 'key';
    const onPointer = () => {
      lastInputRef.current = 'pointer';
    };
    const onKey = () => {
      lastInputRef.current = 'key';
    };
    // 押して実行した (detail > 0) か、キーボード・読み上げの「実行」か (detail 0)。閉じるボタン・入口に効く
    const onClick = (e: MouseEvent) => {
      lastInputRef.current = e.detail > 0 ? 'pointer' : 'key';
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [shown, openedByPointer]);

  // 閉じたら「ポインタで開いた」も消す (次に外から開いたときに持ち越さない)
  React.useEffect(() => {
    if (!shown) setOpenedByPointer(false);
  }, [shown]);

  // 幅が境目をまたいだ: 開いていれば閉じる。親が開いたままにした (controlled で閉じない) ときは、新しい形で出し直す
  const prevFormRef = React.useRef(form);
  React.useEffect(() => {
    if (prevFormRef.current === form) return;
    prevFormRef.current = form;
    if (!openRef.current) return;
    formAtOpenRef.current = null;
    requestOpenChange(false, true);
    forceRender();
    // 広い幅のパネル (popover) は外されたので、中にあったフォーカスは body に落ちている。入口に戻す
    const active = document.activeElement;
    if (!active || active === document.body) referenceRef.current?.focus();
  }, [form, requestOpenChange]);

  // 広い幅: popover の開閉・位置・開いた直後のフォーカス
  /** 広い幅のパネルを、今回開いてから出したか (開いた直後のフォーカスを 1 回だけ当てる・閉じたときに入口へ戻す) */
  const wasShownRef = React.useRef(false);
  /** 閉じる直前 (beforetoggle) に、フォーカスがパネルの中にあったか。ブラウザは閉じるときに、開く前の要素へ勝手に戻すことがある */
  const focusWasInsideRef = React.useRef(false);
  React.useEffect(() => {
    if (form !== 'popover') {
      // 下から出る形のときは、広い幅のパネルは無い (外された)。次に広い幅で開いたら、最初のフォーカスを当て直す
      wasShownRef.current = false;
      return;
    }
    const panel = panelRef.current;
    const reference = referenceRef.current;
    if (!panel || typeof panel.showPopover !== 'function') return;
    if (shown) {
      if (!panel.matches(':popover-open')) panel.showPopover();
      if (!wasShownRef.current) {
        wasShownRef.current = true;
        // 中の最初の押せるもの、無ければパネルそのもの (狭い幅の面と同じ判定)
        (firstTabbable(panel) ?? panel).focus();
      }
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
      // 閉じたら入口にフォーカスを戻す (中にフォーカスがあった / 何も無い所を押した)。外の別の押せるものを押して
      // 閉じたときは、そちらへ移ったフォーカスを奪わない。ブラウザは popover を閉じるとき、開く前にフォーカスがあった要素へ
      // 戻す (別の Menu などから開いたときは入口でない) ので、閉じる直前に中にあったかで決める。
      // 「何も無い所を押した」は、フォーカスが入口を含む入れ物に移ったとき: body のほか、Modal (`<dialog>`) の中の
      // 何も無い所を押すと、フォーカスは Modal そのものに移る
      const active = document.activeElement;
      const inside = focusWasInsideRef.current;
      focusWasInsideRef.current = false;
      const emptyPress = !active || active === document.body || (!!reference && active.contains(reference));
      if (inside || emptyPress || panel.contains(active)) reference?.focus();
    }
  }, [form, shown, placement, offset]);

  // 広い幅: 外を押す・Esc でブラウザが閉じた (light dismiss) ことを状態に伝える。
  // controlled で親が閉じる要求を無視したときは、パネルは消えたまま (状態は開いたまま、自分からは出し直さない。Menu と同じ)。
  // その状態で入口を押したときは、入口の click でパネルを出し直す (Menu は何も起きない。main の Popover は押すと出た)
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

  // 広い幅で Modal (`<dialog>`) の中に置かれたとき: 開いている間に Modal の背景を押すと、ブラウザがパネルを閉じ (light dismiss)、
  // 同じ押下の click で Modal も閉じてしまう。1 回の押下で閉じるのは一番上の重なり (このパネル) だけにする
  // (狭い幅の面と同じ。面の背景を押すと面だけ閉じる)。止めるのは、パネルが開いている間に押し始めて Modal そのもの
  // (背景・余白) で離した click だけ
  React.useEffect(() => {
    if (form !== 'popover' || !shown) return;
    const host = panelRef.current?.parentElement?.closest('dialog');
    if (!host) return;
    let pressedOnHost = false;
    const onDown = (e: PointerEvent) => {
      pressedOnHost = e.target === host;
    };
    const onClick = (e: MouseEvent) => {
      const swallow = pressedOnHost && e.target === host;
      pressedOnHost = false;
      if (!swallow) return;
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [form, shown]);

  const triggerNode = trigger as React.ReactElement<any>;
  const triggerEl = React.cloneElement(triggerNode, {
    ref: (node: HTMLElement | null) => {
      referenceRef.current = node;
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': shown,
    'aria-controls': panelId,
    onPointerDown: (e: React.PointerEvent) => {
      triggerNode.props.onPointerDown?.(e);
      // 押し始めた時点の開閉を覚える (広い幅では、押して離した瞬間にブラウザが外を押したとして閉じる。
      // その後の click で開き直さない)。パネルが実際に出ていたかも覚える (親が閉じる要求を無視して消えたままのとき用)
      triggerPressRef.current = { open: openRef.current, panelShown: !!panelRef.current?.matches(':popover-open') };
    },
    onClick: (e: React.MouseEvent) => {
      triggerNode.props.onClick?.(e);
      // 覚えた値を使うのは、押して出た click (detail > 0) だけ。押しかけて離れた (click にならなかった) 後の
      // キーボードの Enter・Space (detail 0) に、古い値を持ち越さない
      const pressed = triggerPressRef.current;
      triggerPressRef.current = null;
      const usePressed = e.detail > 0 && pressed !== null;
      const wasOpen = usePressed ? pressed.open : openRef.current;
      const panel = panelRef.current;
      const panelShown = usePressed ? pressed.panelShown : !!panel?.matches(':popover-open');
      if (usePressed && pressed.open && pressed.panelShown && form === 'popover' && panel && !panel.matches(':popover-open')) {
        // 広い幅で、パネルが出ている間に入口を押した: この押下でブラウザが外を押したとして閉じた (light dismiss)。
        // 閉じる要求はその知らせ (toggle) の側が出すので、click の側では出さない (1 回の押下で onOpenChange(false) を 2 回呼ばない)。
        // 知らせの側に残すのは、押しかけて外で離した (click にならない) ときも閉じる要求が出るため
        return;
      }
      if (wasOpen && form === 'popover' && panel && !panelShown) {
        // 広い幅で、controlled の親が閉じる要求を無視したため、状態は開いたままパネルだけ消えている。
        // 閉じる要求をもう一度出しても何も起きないので、パネルを出し直す (main の Popover と同じく、押せば出る)
        if (!panel.matches(':popover-open')) panel.showPopover();
        setOpenedByPointer(e.detail > 0);
        (firstTabbable(panel) ?? panel).focus();
        return;
      }
      if (!wasOpen) setOpenedByPointer(e.detail > 0);
      requestOpenChange(!wasOpen);
    },
  });

  if (form === 'sheet') {
    return (
      <>
        {triggerEl}
        <BottomSheet
          id={panelId}
          open={shown}
          onClose={() => requestOpenChange(false)}
          title={title}
          returnFocusRef={referenceRef}
          hideFocusRing={openedByPointer}
        >
          {/* 指で読むので本文の大きさ (広い幅のパネルは type-supporting のまま) */}
          <div className="type-body text-onSurface">{children}</div>
        </BottomSheet>
      </>
    );
  }

  // `popover` は @types/react 18 が未定義のため untyped spread で付与 (初回 render から
  // top-layer の hidden 状態にするため、effect ではなく render で設定する)。
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
        id={panelId}
        role="dialog"
        aria-label={title}
        tabIndex={-1}
        className={[
          // popover 属性で top-layer に出る。UA の中央寄せ (inset:0; margin:auto) を打ち消し、
          // floating-ui が left/top を inline で設定する。
          'fixed inset-auto m-0 w-max max-w-[min(20rem,calc(100vw-2rem))]',
          'bg-surface text-onSurface rounded-md border border-border-subtle shadow-lg',
          'p-4 type-supporting',
          // 中に押せるものが無いとパネル自体にフォーカスが来る。来たときは内側 2px の輪 (キーボードのときだけ、AGENTS §3-2「フォーカスの規則」)
          'focus-ring-inset',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </>
  );
};

Popover.displayName = 'Popover';
