import React from 'react';
import { Button } from '../../../../../../components/primitives/Button';
import { Icon } from '../../../../../../components/primitives/Icon';
import type { Look } from '../options';
import { ERROR, ON_FILL_BUTTON, SHAPE, SUCCESS } from './forms';
import { durationOf, type DismissReason, type ToastEntry } from './types';

/** 下へこれより多く動かして離すと消える (03-swipe.html と同じ) */
const SWIPE_PX = 24;
/** 出入りの動き (duration.normal) */
export const MOTION_MS = 200;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type PauseReason = 'hover' | 'focus' | 'press';

/**
 * 自動で消えるまでの残り時間。止める理由 (触れている・マウスが乗っている・フォーカスがある) が
 * 1 つでもある間は止め、無くなったら残りから再開する。`duration` 0 は消えない
 */
function useRemaining(duration: number, onTimeout: () => void) {
  const onTimeoutRef = React.useRef(onTimeout);
  onTimeoutRef.current = onTimeout;
  const reasons = React.useRef(new Set<PauseReason>());
  const remaining = React.useRef(duration);
  const startedAt = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = React.useCallback(() => {
    if (timer.current === null) return;
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - startedAt.current;
  }, []);

  const start = React.useCallback(() => {
    if (duration <= 0 || timer.current !== null || reasons.current.size > 0) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => {
      timer.current = null;
      onTimeoutRef.current();
    }, Math.max(0, remaining.current));
  }, [duration]);

  React.useEffect(() => {
    remaining.current = duration;
    start();
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [duration, start]);

  const pause = React.useCallback((why: PauseReason) => {
    reasons.current.add(why);
    stop();
  }, [stop]);
  const resume = React.useCallback((why: PauseReason) => {
    reasons.current.delete(why);
    start();
  }, [start]);

  return { pause, resume };
}

export interface ToastItemProps {
  entry: ToastEntry;
  look: Look;
  onDismiss: (id: string, reason: DismissReason) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ entry, look, onDismiss }) => {
  const { id, variant, message, action, exiting } = entry;
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(prefersReducedMotion);
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef<{ pointerId: number; y0: number; dy: number } | null>(null);

  const leave = React.useCallback(
    (reason: DismissReason) => {
      // Toast の中にフォーカスがあるまま消えるなら、出したときの場所へ戻す (body に落とさない)
      const el = ref.current;
      if (el && el.contains(document.activeElement) && entry.returnFocus?.isConnected) {
        entry.returnFocus.focus({ preventScroll: true });
      }
      onDismiss(id, reason);
    },
    [entry.returnFocus, id, onDismiss],
  );

  const { pause, resume } = useRemaining(exiting ? 0 : durationOf(entry), () => leave('timeout'));

  // 出る動き: 1 フレーム目は下にずらして透明、次のフレームで定位置へ (動きを減らす設定では最初から定位置)
  React.useEffect(() => {
    if (shown) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [shown]);

  const setOffset = (dy: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--toast-dy', `${dy}px`);
    el.style.setProperty('--toast-opacity', String(Math.max(0.3, 1 - dy / 120)));
  };

  // 下へ払う: 指 (マウス) に付いて下へだけ動く。ボタンの上で始めた操作は払う動きにしない (押せるように)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exiting) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pause('press');
    if ((e.target as Element).closest('button')) return;
    drag.current = { pointerId: e.pointerId, y0: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    d.dy = Math.max(0, e.clientY - d.y0);
    setOffset(d.dy);
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    resume('press');
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (d.dy > SWIPE_PX && e.type === 'pointerup') {
      leave('swipe');
    } else {
      setOffset(0);
    }
  };

  const isError = variant === 'error';
  const face = isError ? ERROR.face : SUCCESS.face;
  const iconColor = isError ? ERROR.icon : SUCCESS.icon;
  const closeText = isError && look.close === 'text';
  const closeIcon = isError && look.close === 'icon';
  // 文字のボタンの並び: 「閉じる」が左、操作 (主) が右端
  const labels = [...(closeText ? ['閉じる'] : []), ...(action ? [action.label] : [])];
  const hasButtons = labels.length > 0;
  // ボタンの位置 (× は並びに数えず、いつも右上)。fit はここでは決めず、CSS (flex-wrap) が幅から決める
  const place: 'right' | 'below' | 'fit' = !hasButtons
    ? 'right'
    : look.place === 'fit'
      ? 'fit'
      : look.place === 'below' || labels.length >= 2
        ? 'below'
        : look.place === 'chars' && [...labels[0]].length >= 5
          ? 'below'
          : 'right';
  const state = exiting ? 'exiting' : shown ? 'open' : 'entering';

  const buttons = (
    <>
      {closeText && (
        <Button
          variant="tertiary"
          size="sm"
          aria-label="通知を閉じる"
          className={['shrink-0 whitespace-nowrap font-regular', ON_FILL_BUTTON].join(' ')}
          onClick={() => leave('close')}
        >
          閉じる
        </Button>
      )}
      {action && (
        <Button
          variant="tertiary"
          size="sm"
          className={['shrink-0 whitespace-nowrap font-bold', ON_FILL_BUTTON].join(' ')}
          onClick={() => {
            action.onClick();
            leave('action');
          }}
        >
          {action.label}
        </Button>
      )}
    </>
  );

  return (
    <div
      ref={ref}
      data-ds-root
      data-toast-id={id}
      data-variant={variant}
      data-state={state}
      data-dragging={dragging ? '' : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerEnter={(e) => e.pointerType === 'mouse' && pause('hover')}
      onPointerLeave={(e) => e.pointerType === 'mouse' && resume('hover')}
      onFocus={() => pause('focus')}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume('focus');
      }}
      className={[
        'pointer-events-auto mt-2 flex gap-2 py-2 pl-4 touch-none select-none',
        hasButtons || closeIcon ? 'pr-2' : 'pr-4',
        face,
        SHAPE,
        // 動き: 位置は CSS 変数 (払っている間の指の位置) を読む。出る前・消えるときは data-state で決める
        '[transform:translateY(var(--toast-dy,0px))] opacity-[var(--toast-opacity,1)]',
        'transition-[transform,opacity] duration-normal ease-out motion-reduce:transition-none',
        'data-[dragging]:transition-none',
        'data-[state=entering]:[transform:translateY(1rem)] data-[state=entering]:opacity-0',
        'data-[state=exiting]:[transform:translateY(calc(var(--toast-dy,0px)_+_100%))] data-[state=exiting]:opacity-0 data-[state=exiting]:pointer-events-none',
      ].join(' ')}
    >
      {/* 文とボタン (群) の並び。data-place で決める:
          right = 1 行に横並び (文が縮んで折り返す) / below = ボタンはいつも次の行 /
          fit = flex-wrap。文の basis は auto (= 1 行のときの幅)、ボタンは margin-left: auto。
          両方が 1 行に入れば横並び、入らなければボタンが次の行へ回り、文は面の幅いっぱいで折り返す */}
      <div
        data-place={place}
        className="group/row flex min-w-0 flex-1 items-center self-center data-[place=below]:flex-wrap data-[place=fit]:flex-wrap"
      >
        <div className="flex min-w-0 items-start gap-3 py-2.5 group-data-[place=right]/row:flex-1 group-data-[place=below]/row:flex-1 group-data-[place=fit]/row:flex-[1_1_auto]">
          {/* アイコンは 1 行目に固定: 入れ物を 1 行の高さ (type-supporting の行間 1.5em) にして、その中で上下の真ん中 */}
          <span className={['type-supporting flex h-[1.5em] shrink-0 items-center', iconColor].join(' ')}>
            <Icon name={isError ? 'error' : 'check_circle'} size="sm" />
          </span>
          <p className="type-supporting min-w-0 flex-[1_1_auto]">{message}</p>
        </div>
        {hasButtons && (
          <div
            data-toast-buttons
            className="ml-auto flex shrink-0 items-center gap-1 pl-2 group-data-[place=below]/row:-mt-1 group-data-[place=below]/row:basis-full group-data-[place=below]/row:justify-end"
          >
            {buttons}
          </div>
        )}
      </div>
      {closeIcon && (
        <Button
          variant="tertiary"
          size="sm"
          iconOnly
          icon={<Icon name="close" size="sm" />}
          aria-label="通知を閉じる"
          className={['shrink-0 self-start', ON_FILL_BUTTON].join(' ')}
          onClick={() => leave('close')}
        />
      )}
    </div>
  );
};

/** 消える動きのあと DOM から外すまでの時間 */
export function exitDelay(): number {
  return prefersReducedMotion() ? 0 : MOTION_MS;
}
