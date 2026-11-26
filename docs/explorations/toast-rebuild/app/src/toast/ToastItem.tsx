import React from 'react';
import { Button } from '../../../../../../components/primitives/Button';
import { Icon } from '../../../../../../components/primitives/Icon';
import type { Look } from '../options';
import { ERRORS, ON_FILL_BUTTON, SHAPE, SUCCESS } from './forms';
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
  const face = isError ? ERRORS[look.error].face : SUCCESS.face;
  const iconColor = isError ? ERRORS[look.error].icon : SUCCESS.icon;
  const disk = isError && ERRORS[look.error].disk;
  const closeText = isError && look.close === 'text';
  const closeIcon = isError && look.close === 'icon';
  // 文字のボタンの並び: 「閉じる」が左、操作 (主) が右端
  const buttonCount = (closeText ? 1 : 0) + (action ? 1 : 0);
  // ボタンの位置。× は並びに数えず、いつも右上 (1 行目)
  const below = buttonCount > 0 && (look.place === 'below' || (look.place === 'auto' && buttonCount >= 2));
  const right = buttonCount > 0 && !below;
  const trailingButton = right || closeIcon;
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
        trailingButton ? 'pr-2' : 'pr-4',
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
      <div className="flex min-w-0 flex-1 flex-col self-center">
        <div className="flex items-start gap-3 py-2.5">
          {/* アイコンは 1 行目に固定: 入れ物を 1 行の高さ (type-supporting の行間 1.5em) にして、その中で上下の真ん中 */}
          <span className={['type-supporting flex h-[1.5em] shrink-0 items-center', iconColor].join(' ')}>
            {disk ? (
              // A3: 赤い塗りの丸 (surface.error) に白い「!」(onSurface.inverse)
              <Icon size="sm" variant="fill">
                <circle cx="12" cy="12" r="10" className="fill-[var(--color-surface-error)]" />
                <path d="M13 17h-2v-2h2v2zm0-4h-2V7h2v6z" className="fill-[var(--color-on-surface-inverse)]" />
              </Icon>
            ) : (
              <Icon name={isError ? 'error' : 'check_circle'} size="sm" />
            )}
          </span>
          <p className="type-supporting min-w-0 flex-1">{message}</p>
        </div>
        {below && <div className="-mt-1 flex justify-end gap-1">{buttons}</div>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-1 self-center">{buttons}</div>}
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
