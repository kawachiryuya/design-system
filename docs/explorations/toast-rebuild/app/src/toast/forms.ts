// 形は A「濃い面」がベース (1 回目で決まった、11-27)。「できなかった」の色だけを 3 案で切り替える。
// どれも design-system の semantic token の utility だけで書く。該当する token が無いところは、
// 一番近い semantic token の CSS 変数を arbitrary value で読む (生の色は書かない)。
import type { ErrorColor } from '../options';

/** 面の角丸と影 (A の濃い面) */
export const SHAPE = 'rounded-md shadow-lg';

/** できた: 濃い面 (surface.neutral-strong = neutral.700) に白い文字 */
export const SUCCESS = {
  face: 'bg-surface-neutral-strong text-onSurface-inverse',
  // 濃い面の上で読める役割色の semantic token が無い。一番近い「役割色の薄い段」= border.success-muted (green.200)
  icon: 'text-[color:var(--color-border-success-muted)]',
};

export interface ErrorStyle {
  face: string;
  /** アイコンの色。`disk` のときは赤い塗りの丸に白い印を描く (A3) */
  icon: string;
  disk: boolean;
}

export const ERRORS: Record<ErrorColor, ErrorStyle> = {
  // A1 濃い面のまま: アイコンの色だけ赤系 (border.error-muted = red.200。濃い面の上で読める赤の semantic token が無いので代わり)
  A1: { face: SUCCESS.face, icon: 'text-[color:var(--color-border-error-muted)]', disk: false },
  // A2 できなかった、は赤い面: surface.error (red.600) で塗り、白い文字
  A2: { face: 'bg-surface-error text-onSurface-inverse', icon: 'text-onSurface-inverse', disk: false },
  // A3 濃い面＋赤い印: アイコンを赤い塗りの丸 (surface.error) に白い印 (onSurface.inverse)。
  // 左端の赤い帯は surface.error と濃い面の差が 1.95:1 で 3:1 に届かず、届く明るい赤 (border.error-muted) は桃色に見えて
  // 「赤をはっきり」にならない。丸なら、意味を運ぶ白い印と赤い丸の差が 5.31:1 になる
  A3: { face: SUCCESS.face, icon: '', disk: true },
};

/** 濃い塗り・役割色の面の上の押せるもの: 白い文字、ホバーは黒 8% (DDR-1 の「濃い塗り」) */
export const ON_FILL_BUTTON =
  'text-onSurface-inverse hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)] active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]';
