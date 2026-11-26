/** 種類は 2 つ。見出しは無い (README 01・06) */
export type ToastVariant = 'success' | 'error';

/** 操作は 1 つ・短い言葉 */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

/** `toast()` に渡すもの: 1 文 + 操作 1 つまで */
export interface ToastInput {
  variant: ToastVariant;
  message: string;
  action?: ToastAction;
}

/** 消えた理由 (ページの記録に出す) */
export type DismissReason = 'timeout' | 'swipe' | 'close' | 'action';

export interface ToastEntry extends ToastInput {
  id: string;
  /** 出したときにフォーカスがあった要素。Toast の中にフォーカスがあるまま消えたら、ここへ戻す */
  returnFocus: HTMLElement | null;
  /** 消える途中 (動きのあと、DOM から外す) */
  exiting: boolean;
}

/** 秒数は部品が決める (README 04・06): できた 5 秒・操作つき 7 秒・できなかったは消えない */
export function durationOf(input: ToastInput): number {
  if (input.variant === 'error') return 0;
  return input.action ? 7000 : 5000;
}
