// 形は A「濃い面」がベース、「できなかった」は A2 の赤い面 (どちらも 11-27 に決まった)。
// どれも design-system の semantic token の utility だけで書く。該当する token が無いところは、
// 一番近い semantic token の CSS 変数を arbitrary value で読む (生の色は書かない)。

/** 面の角丸と影 (A の濃い面) */
export const SHAPE = 'rounded-md shadow-lg';

/** できた: 濃い面 (surface.neutral-strong = neutral.700) に白い文字 */
export const SUCCESS = {
  face: 'bg-surface-neutral-strong text-onSurface-inverse',
  // 濃い面の上で読める役割色の semantic token が無い。一番近い「役割色の薄い段」= border.success-muted (green.200)
  icon: 'text-[color:var(--color-border-success-muted)]',
};

/** できなかった: A2 (赤い面、11-27 に決まった)。surface.error (red.600) で塗り、白い文字 */
export const ERROR = {
  face: 'bg-surface-error text-onSurface-inverse',
  icon: 'text-onSurface-inverse',
};

/** 濃い塗り・役割色の面の上の押せるもの: 白い文字、ホバーは黒 8% (DDR-1 の「濃い塗り」) */
export const ON_FILL_BUTTON =
  'text-onSurface-inverse hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)] active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]';
