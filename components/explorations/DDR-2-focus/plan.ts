// ─────────────────────────────────────────────────────────────────────────────
// 作り分ける: 案 (#131 「作り分ける案」の表の 1・2・4・5・6・7)。
//
// 規則: 輪は必ず 2px 以上。外側に輪を出す余地があれば「外側 2px＋すき間 2px」、無ければ「内側 2px」。
// 輪の色は border.focus の一色 (濃い塗りの内側に出す輪だけ白)。すき間は塗らず、下の面の色が見える。
// フォーカスは輪だけ、ホバーは塗りだけ。フォーカスが来る所には必ず輪を出す。
//
// 本体の部品には手を入れず、案の列に <style> で上書き CSS を当てて見せる (DDR-1 #123 と同じ、検討用の仮実装)。
// 輪は box-shadow (ring) でなく outline で描く: outline のすき間は塗られない (下の面が見える) ので
// 「すき間を塗らない」がそのまま実現でき、box-shadow のホバー (小さい部品の外側 4px) とも別の層になる。
// 部品が付けている ring は --tw-ring-* を空にして消す (ホバーの影 --tw-shadow は残る)。
// ─────────────────────────────────────────────────────────────────────────────

/** 状態セレクタを、本物の擬似クラス版と addon の強制クラス版の両方に展開する。 */
export const on = (sels: string[], state: 'focus-visible' | 'focus', suffix = '') =>
  [...sels.map((s) => `${s}:${state}${suffix}`), ...sels.map((s) => `${s}.pseudo-${state}${suffix}`)].join(',\n');

export const NO_RING = '--tw-ring-shadow: 0 0 #0000 !important; --tw-ring-offset-shadow: 0 0 #0000 !important;';
export const OUTER = `outline: 2px solid var(--plan-ring) !important; outline-offset: 2px !important; ${NO_RING}`;
export const INNER = `outline: 2px solid var(--plan-ring) !important; outline-offset: -2px !important; ${NO_RING}`;

/** 文字を入力する欄 (Checkbox / Radio を除く)。 */
const FIELDS = (scope: string) => [
  `${scope} input:not([type="checkbox"]):not([type="radio"])`,
  `${scope} textarea`,
  `${scope} select`,
];

export const PLAN_CSS = [
  // 輪の色。既定は border.focus。エラーの色の比較列だけ赤に戻す
  `[data-plan] { --plan-ring: var(--color-border-focus); }`,
  `[data-plan][data-plan-color="red"] { --plan-ring: var(--color-border-error-strong); }`,

  // ── 外側に余地がある → 外側 2px＋すき間 2px (キーボードのときだけ) ──
  `${on(['[data-plan] a', '[data-plan] button', '[data-plan] input[type="checkbox"]', '[data-plan] input[type="radio"]', '[data-plan] [role="button"]'], 'focus-visible')} { ${OUTER} }`,

  // ── 外側に余地が無い (枠の中に詰まっている・端で切れる) → 内側 2px (キーボードのときだけ) ──
  `${on(
    [
      '[data-plan][data-part="number"] button',
      '[data-plan][data-part="accordion"] button',
      '[data-plan][data-part="search"] button',
      '[data-plan] [role="radiogroup"] [role="radio"]',
      '[data-plan] [role="tab"]',
      '[data-plan] [role="menuitem"]',
    ],
    'focus-visible'
  )} { ${INNER} }`,
  // フォーカスが来るだけの領域にも輪 (内側 2px、キーボードのときだけ)
  `${on(['[data-plan] [role="tabpanel"]', '[data-plan][data-part="splitpane"] [tabindex="0"]', '[data-plan] [role="dialog"]'], 'focus-visible')} { ${INNER} }`,
  // 濃い塗りの内側に出す輪だけ白 (SegmentedControl の選択中)。-2px だと輪が部品の端に乗り、白地と溶けて
  // 「部品が小さくなった」ように見えるので、塗りが外側に 2px 残るよう -4px に下げる
  `${on(['[data-plan] [role="radiogroup"] [role="radio"][aria-checked="true"]'], 'focus-visible')} { outline-color: var(--color-surface-default) !important; outline-offset: -4px !important; }`,

  // ── メニューの項目: フォーカスの塗りを外す (塗りはホバーだけ) ──
  `[data-plan] [role="menuitem"]:focus:not(:hover), [data-plan] [role="menuitem"].pseudo-focus:not(.pseudo-hover) { background-color: transparent !important; }`,

  // ── 入力欄 案 A: 軸どおり外側 2px＋すき間 2px。クリックでも出す (:focus)。枠線は変えない ──
  `${on([...FIELDS('[data-plan="p"]'), ...FIELDS('[data-plan="a"]')], 'focus')} { ${OUTER} border-color: var(--color-border-default) !important; }`,
  `${on([...FIELDS('[data-plan="p"]'), ...FIELDS('[data-plan="a"]')], 'focus', '[aria-invalid="true"]')} { border-color: var(--color-border-error-strong) !important; }`,

  // ── 入力欄 案 B: 入力欄だけ例外。内側 2px＋枠線の色 (エラーのときは枠線は赤のまま) ──
  `${on(FIELDS('[data-plan="b"]'), 'focus')} { outline: none !important; ${NO_RING} box-shadow: inset 0 0 0 2px var(--plan-ring) !important; border-color: var(--plan-ring) !important; }`,
  `${on(FIELDS('[data-plan="b"]'), 'focus', '[aria-invalid="true"]')} { border-color: var(--color-border-error-strong) !important; }`,

  // ── 内側の輪の角を、枠の角丸に合わせる版 (data-corner="round") ──
  // Accordion: 項目の枠は rounded-md (8px) + overflow-hidden。見出しの button を 8 - 1 (枠線) = 7px に
  `[data-corner="round"][data-part="accordion"] button[data-state="closed"] { border-radius: calc(var(--radius-md) - 1px); }`,
  `[data-corner="round"][data-part="accordion"] button[data-state="open"] { border-radius: calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0; }`,
  // NumberInput: 枠は rounded-sm (4px)。左端・右端の button を 4 - 1 = 3px に
  `[data-corner="round"][data-part="number"] button:first-of-type { border-radius: calc(var(--radius-sm) - 1px) 0 0 calc(var(--radius-sm) - 1px); }`,
  `[data-corner="round"][data-part="number"] button:last-of-type { border-radius: 0 calc(var(--radius-sm) - 1px) calc(var(--radius-sm) - 1px) 0; }`,
  // Tabs のパネル: 枠は無い。輪だけ rounded-sm に
  `[data-corner="round"] [role="tabpanel"] { border-radius: var(--radius-sm); }`,
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 「決めた記録」(Decisions.stories.tsx) だけで使う、捨てた案・採った案の見せ方。`data-v` で切り替える。
// 案の基本 (PLAN_CSS) の上に重ねる。
// ─────────────────────────────────────────────────────────────────────────────
export const DECISION_CSS = [
  // 論点 2 捨てた案「枠線を持つかで分ける」: 自分の枠線を持つ部品 → 内側、持たない部品 → 外側
  `${on(['[data-plan][data-v="axis-border"][data-part="chip"] button', '[data-plan][data-v="axis-border"][data-part="secondary"] button'], 'focus-visible')} { ${INNER} }`,
  `${on(['[data-plan][data-v="axis-border"][data-part="accordion"] button', '[data-plan][data-v="axis-border"] [role="tab"]'], 'focus-visible')} { ${OUTER} }`,

  // 論点 4 捨てた案「部品の色に合わせる」: エラーは赤、Alert の閉じるは文字色
  `[data-plan][data-v="match"] { --plan-ring: var(--color-border-error-strong); }`,
  `[data-plan][data-v="match"][data-part="alert"] { --plan-ring: currentColor; }`,

  // 論点 5 捨てた案: 縁ぴったりの白 (-2px) / 縁に border.focus＋内側に白の二重
  `${on(['[data-plan][data-v="fill-edge"] [role="radio"][aria-checked="true"]'], 'focus-visible')} { outline-offset: -2px !important; }`,
  `${on(['[data-plan][data-v="fill-double"] [role="radio"][aria-checked="true"]'], 'focus-visible')} { outline-color: var(--color-border-focus) !important; outline-offset: -2px !important; box-shadow: inset 0 0 0 3px var(--color-surface-default) !important; }`,

  // 論点 6 捨てた案「輪＋塗り」: 輪は出すが、フォーカスの塗りも残す
  `[data-plan][data-v="ringfill"] [role="menuitem"]:focus:not(:hover), [data-plan][data-v="ringfill"] [role="menuitem"].pseudo-focus:not(.pseudo-hover) { background-color: var(--color-state-hover-primary) !important; }`,

  // 論点 7+8 採った案「領域の内側に余白」(量は実装の PR で決める。写真は Tabs 16px / SplitPane 8px)
  `[data-plan][data-v="pad"] [role="tabpanel"] { padding-inline: 16px; }`,
  `[data-plan][data-v="pad"][data-part="splitpane"] [tabindex="0"] { padding: 8px; }`,
  // 論点 7+8 捨てた案「中身は動かさず箱だけ広げる」
  `[data-plan][data-v="expand"] [role="tabpanel"] { margin-inline: -16px; padding-inline: 16px; }`,
  `[data-plan][data-v="expand"][data-part="splitpane"] [tabindex="0"] { margin: -8px; padding: 8px; }`,

  // 写真用: 閉じた popover のパネルを、その場に静的に並べる (重なって開く overlay を 1 枚に並べるため)
  `[data-static-panel] [popover] { display: block !important; position: static !important; inset: auto !important; margin: 0 !important; }`,
].join('\n');

/**
 * 狭い幅 (md 未満) では列を縦に積み、各セルの上に列の名前 (`data-col`) を出す。
 * 広い幅では列の見出しの行があるので出さない。
 */
export const MOBILE_CSS = `@media (max-width: 767.98px) {
  [data-col]::before { content: attr(data-col); display: block; margin-bottom: 4px; font-size: var(--typography-font-size-xs); font-weight: 700; color: var(--color-on-surface-subtle); }
}`;
