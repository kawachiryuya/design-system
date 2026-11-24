/**
 * 直前の操作が「指・マウス」か「キー」かを覚える (#157、AGENTS §3-2「フォーカスの規則」)。
 *
 * `ConfirmDialog`・`FormDialog` は入口を持たない (使う側が `open` で開く) ので、Menu・Popover のように
 * 「入口の click の `detail`」で開き方を知れない。代わりに、開いた・閉じた瞬間の直前の操作を見る:
 * 指・マウスなら、キーが押されるまで輪を出さない。キー・読み上げの「実行」(click の `detail` 0)・
 * まだ何も操作が無い (ページを開いた直後に `open` で開いた、story の Overview) ときは出す。
 *
 * - 文書に capture の listener を 3 つ (pointerdown・keydown・click) 付ける。**一度付けたら外さない**。
 *   開いている間だけの listener にしないのは、開く前の操作を知る必要があるため
 * - **付けるのは、このモジュールがブラウザで読み込まれたとき** (サーバーでは何もしない)。部品が描かれた後に付けると、
 *   `{open && <ConfirmDialog open … />}` のようにページで最初の dialog を開く押下が、付ける前に終わっていて覚えられない
 *   (#157 の独立した確認で出た)。AGENTS §5-2「module スコープで document を触らない」の例外 (`typeof document` で
 *   サーバーを避けるので SSR は壊れない)。部品の effect からも呼ぶ (読み込みがサーバーだけだった環境のための保険。2 回目以降は何もしない)
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

// ブラウザで読み込まれたら、すぐに付ける (上の説明)
trackInputModality();
