import { expect, waitFor } from 'storybook/test';

/**
 * 狭い幅で走らせる play の共通の部品 (#165、AGENTS §8-4「幅で構造が変わる story」)。
 *
 * 狭い幅の動きを確かめる story は、自分が走る幅を Storybook の viewport の global で宣言する
 * (`globals: NARROW_RUN`)。test-runner は描く前 (preVisit) にその幅にし、終わったら元の幅に戻す
 * (`.storybook/test-runner.ts`)。人が Storybook で開いたときも、同じ宣言でその幅に固定して見える。
 * play は 1 つの幅の期待だけを書く (幅を見て分けない)。最初に `expectRunWidth()` で、本当にその幅で
 * 走っているかを確かめる (宣言が効かずに既定の幅で走ったまま通る、を防ぐ)。
 */

/** 狭い幅の代表 (iPhone の 375 × 667)。撮影の幅 (`chromatic.viewports` の 375) と同じ幅 */
export const NARROW_WIDTH = 375;
export const NARROW_RUN = { viewport: { value: `${NARROW_WIDTH}-667`, isRotated: false } };

/** play がその幅で走っていることを確かめる */
export async function expectRunWidth(width = NARROW_WIDTH) {
  await expect(window.innerWidth).toBe(width);
}

/**
 * 動きを減らす設定の強制を外した story (`parameters.reducedMotion = { disable: true }`) が、本当に動きのある状態で
 * 走っていることを確かめる (外したつもりで、動きの無い別の道を通って通る、を防ぐ)
 */
export async function expectMotion() {
  await expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
}

/**
 * 下から出る面 (`BottomSheet`) は開いてから 300ms ポインタを受け付けない (二度押しの守り)。
 * 指・マウスで面の中を押す前に、それを越えるまで待つ (動きの終わりを待つのではない。時間の決まりそのもの)
 */
export const afterOpenGuard = () => new Promise((r) => setTimeout(r, 350));

/** 下から出る面として開いていること: 開いた `<dialog>`・画面の下端に幅いっぱい */
export async function expectBottomSheet(sheet: HTMLElement) {
  await waitFor(() => expect((sheet as HTMLDialogElement).open).toBe(true));
  await expect(sheet.tagName).toBe('DIALOG');
  await expect(sheet).toHaveAttribute('data-state', 'open');
  // 下から上がる動きの終わり (動きを減らす設定でも、遷移は 1 フレームかかる) を位置で待つ
  await waitFor(() => {
    const r = sheet.getBoundingClientRect();
    expect(Math.round(r.width)).toBe(window.innerWidth);
    expect(Math.abs(r.bottom - window.innerHeight)).toBeLessThanOrEqual(1);
  });
}

/**
 * 背景 (::backdrop) を押す。押し始めと離した場所の両方が背景のときだけ閉じる決まりなので、
 * 面の上端より上の 1 点で pointerdown を送り、背景の上の click (dialog に届く) を送る
 */
export function pressBackdrop(sheet: HTMLElement) {
  const r = sheet.getBoundingClientRect();
  const at = { clientX: r.left + 10, clientY: Math.max(1, r.top - 20) };
  sheet.dispatchEvent(new PointerEvent('pointerdown', { ...at, bubbles: true, isPrimary: true, pointerType: 'touch' }));
  sheet.dispatchEvent(new PointerEvent('pointerup', { ...at, bubbles: true, isPrimary: true, pointerType: 'touch' }));
  sheet.dispatchEvent(new MouseEvent('click', { ...at, bubbles: true, detail: 1 }));
}

/**
 * Esc。合成のキー入力ではブラウザが dialog に cancel を出さないので、Esc を押したときに
 * ブラウザが送る cancel を直接送る (本物の Esc は #164 の Playwright の表で確かめた)
 */
export function pressEscape(sheet: HTMLElement) {
  sheet.dispatchEvent(new Event('cancel', { cancelable: true }));
}
