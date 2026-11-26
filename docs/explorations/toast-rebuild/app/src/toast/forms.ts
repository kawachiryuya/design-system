// 形と色の 4 案。どれも design-system の semantic token の utility だけで書く。
// 該当する token が無いところ (A の「濃い面の上のアイコンの色」) は、一番近い semantic token の
// CSS 変数を arbitrary value で読む (生の色は書かない)。代わりに使った token は A の icon のコメントに書く。
import type { FormKey } from '../options';
import type { ToastVariant } from './types';

export interface FormStyle {
  /** 面の塗り・枠・文字色 */
  face: Record<ToastVariant, string>;
  /** 角丸と影 (案ごとに「その方向なら自然」な 1 つ) */
  shape: string;
  /** 先頭のアイコンの色 */
  icon: Record<ToastVariant, string>;
  /** 操作 (Button tertiary sm) に足す class。空なら Button の tertiary のまま */
  action: Record<ToastVariant, string>;
  /** 閉じる × (Button iconOnly tertiary sm) に足す class */
  close: Record<ToastVariant, string>;
}

/** 濃い塗り・役割色の面の上の押せるもの: 白い文字、ホバーは黒 8% (DDR-1 の「濃い塗り」) */
const onFill =
  'text-onSurface-inverse hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)] active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]';
/** 薄い面・白い面の上の × : 中性の文字色、ホバーは黒 8% (今の Toast の × と同じ) */
const closeNeutral =
  'hover:shadow-[inset_0_0_0_9999px_var(--color-state-hover)] active:shadow-[inset_0_0_0_9999px_var(--color-state-active)]';

export const FORMS: Record<FormKey, FormStyle> = {
  // 今のまま: 今の Toast.tsx の success / error のクラス (役割色の薄い箱)
  current: {
    face: {
      success: 'bg-surface-success-muted border border-border-success-muted text-onSurface-success',
      error: 'bg-surface-error-muted border border-border-error-muted text-onSurface-error',
    },
    shape: 'rounded-md shadow-md',
    icon: { success: 'text-onSurface-success', error: 'text-onSurface-error' },
    action: { success: '', error: '' },
    close: {
      success: `text-onSurface-success ${closeNeutral}`,
      error: `text-onSurface-error ${closeNeutral}`,
    },
  },
  // A 濃い面: 反転した濃い面 (Tooltip・Badge solid neutral と同じ surface.neutral-strong) に白い文字。
  // success / error はアイコンの形と色で見分ける
  A: {
    face: {
      success: 'bg-surface-neutral-strong text-onSurface-inverse',
      error: 'bg-surface-neutral-strong text-onSurface-inverse',
    },
    shape: 'rounded-md shadow-lg',
    icon: {
      // 濃い面の上で読める役割色の semantic token が無い。一番近い「役割色の薄い段」= border.*-muted (green.200 / red.200)
      success: 'text-[color:var(--color-border-success-muted)]',
      error: 'text-[color:var(--color-border-error-muted)]',
    },
    action: { success: `${onFill} font-bold`, error: `${onFill} font-bold` },
    close: { success: onFill, error: onFill },
  },
  // B 白い面＋影: 白 (surface) の面に、はっきりした影 (shadow.lg) と細い枠 (border.subtle)。アイコンに役割色
  B: {
    face: {
      success: 'bg-surface border border-border-subtle text-onSurface',
      error: 'bg-surface border border-border-subtle text-onSurface',
    },
    shape: 'rounded-lg shadow-lg',
    icon: { success: 'text-onSurface-success', error: 'text-onSurface-error' },
    action: { success: '', error: '' },
    close: {
      success: `text-onSurface-subtle ${closeNeutral}`,
      error: `text-onSurface-subtle ${closeNeutral}`,
    },
  },
  // C 役割色で塗った面: success は surface.success (green.600)、error は surface.error (red.600) に白い文字
  C: {
    face: {
      success: 'bg-surface-success text-onSurface-inverse',
      error: 'bg-surface-error text-onSurface-inverse',
    },
    shape: 'rounded-md shadow-md',
    icon: { success: 'text-onSurface-inverse', error: 'text-onSurface-inverse' },
    action: { success: `${onFill} font-bold`, error: `${onFill} font-bold` },
    close: { success: onFill, error: onFill },
  },
};
