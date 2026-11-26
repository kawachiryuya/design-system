import React from 'react';
import type { Look } from '../options';
import { ToastItem, exitDelay } from './ToastItem';
import type { DismissReason, ToastEntry, ToastInput } from './types';

interface ToastContextValue {
  /** Toast を出す。返り値の id で消せる */
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  /** 帯で選んでいる案 (検討のページだけの指定。出荷する部品には無い) */
  look: Look;
  /** 消えたときに呼ぶ (ページの記録用) */
  onDismissed?: (entry: ToastEntry, reason: DismissReason) => void;
  children: React.ReactNode;
}

/**
 * 枚数 (README 05 の B 案): ふだんは 1 枚で入れ替え。「できなかった」が出ている間はそれを残し、
 * 新しい 1 枚をその上に (最大 2 枚)。残すのは、出ている「できなかった」のうち一番新しい 1 枚
 */
function nextStack(current: ToastEntry[], added: ToastEntry): ToastEntry[] {
  const live = current.filter((t) => !t.exiting);
  const keep = [...live].reverse().find((t) => t.variant === 'error');
  // 消える途中のものは、動きが終わるまで残す (入れ替えで外れるものは動かさずに外す)
  const leaving = current.filter((t) => t.exiting);
  return [...leaving, ...(keep ? [keep] : []), added];
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ look, onDismissed, children }) => {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const counter = React.useRef(0);
  const toastsRef = React.useRef(toasts);
  toastsRef.current = toasts;
  const onDismissedRef = React.useRef(onDismissed);
  onDismissedRef.current = onDismissed;

  const remove = React.useCallback((id: string, reason: DismissReason) => {
    const entry = toastsRef.current.find((t) => t.id === id);
    if (!entry || entry.exiting) return;
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    onDismissedRef.current?.(entry, reason);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), exitDelay());
  }, []);

  const toast = React.useCallback((input: ToastInput) => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    const active = document.activeElement;
    const entry: ToastEntry = {
      ...input,
      id,
      exiting: false,
      returnFocus: active instanceof HTMLElement && active !== document.body ? active : null,
    };
    setToasts((prev) => nextStack(prev, entry));
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => remove(id, 'close'), [remove]);
  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  // 読み上げ: できた = role="status" (polite)、できなかった = role="alert" (assertive)。
  // 入れ物は空でも常に置く (中身を足したときに確実に読まれるように。今の ToastProvider と同じ)。
  // 並び: 下が古い。「できなかった」(残るもの) は下、新しい「できた」はその上
  const successes = toasts.filter((t) => t.variant === 'success');
  const errors = toasts.filter((t) => t.variant === 'error').reverse();
  const render = (list: ToastEntry[]) =>
    list.map((t) => <ToastItem key={t.id} entry={t} look={look} onDismiss={remove} />);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 置き場: 下に出す。下のナビは避けずに、その上に重ねる (z-toast)。
          どの幅も下の中央 (広い幅も中央、1 回目で決まった)。狭い幅は左右に余白を取る。最大幅は content.max-width.sm (28rem) */}
      <div
        data-ds-root
        className="pointer-events-none fixed inset-x-0 bottom-0 z-toast flex justify-center px-4 pb-4 shell:px-6 shell:pb-6"
      >
        <div className="flex w-full max-w-content-sm flex-col">
          <div role="status" aria-live="polite" aria-relevant="additions" className="flex flex-col">
            {render(successes)}
          </div>
          <div role="alert" aria-live="assertive" aria-relevant="additions" className="flex flex-col">
            {render(errors)}
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast は <ToastProvider> の中で使う');
  return ctx;
}
