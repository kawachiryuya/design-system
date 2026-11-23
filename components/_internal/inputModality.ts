/**
 * 直前の操作が「指・マウス」か「キー」かを覚える (#157、AGENTS §3-2「フォーカスの規則」)。
 *
 * `ConfirmDialog`・`FormDialog` は入口を持たない (使う側が `open` で開く) ので、Menu・Popover のように
 * 「入口の click の `detail`」で開き方を知れない。代わりに、開いた・閉じた瞬間の直前の操作を見る:
 * 指・マウスなら、キーが押されるまで輪を出さない。キー・読み上げの「実行」(click の `detail` 0)・
 * まだ何も操作が無い (ページを開いた直後に `open` で開いた、story の Overview) ときは出す。
 *
 * - 文書に capture の listener を 3 つ (pointerdown・keydown・click) 付ける。**一度付けたら外さない**
 *   (付けるのは最初に部品が描かれた後の effect の中。描画中・サーバーでは触らない)。開いている間だけの
 *   listener にしないのは、開く前の操作を知る必要があるため
 * - 覚えるのは最後の 1 つだけ (値は 3 通り)。印や時刻は持たない
 */
type Modality = 'pointer' | 'key' | null;

let last: Modality = null;
let installed = false;

/** 文書に listener を付ける (2 回目以降は何もしない)。effect の中から呼ぶ */
export function trackInputModality(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('pointerdown', () => { last = 'pointer'; }, true);
  document.addEventListener('keydown', () => { last = 'key'; }, true);
  // 読み上げの「実行」は pointerdown も keydown も出さず、detail 0 の click だけが来ることがある
  document.addEventListener('click', (e) => { last = e.detail > 0 ? 'pointer' : 'key'; }, true);
}

/** 直前の操作が指・マウスだったか (まだ何も無ければ false) */
export function lastInputWasPointer(): boolean {
  return last === 'pointer';
}
