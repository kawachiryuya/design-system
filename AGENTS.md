# AGENTS.md — AI 向け運用規約

Claude Code / Cursor などの AI コーディングエージェントが本リポを操作する際の **実装ルール** を集約。設計戦略 (なぜ・何を) は [`design-system-strategy.md`](./design-system-strategy.md) を参照。

---

## 1. 新規セッションで最初に読むもの

> ルートの [`CLAUDE.md`](./CLAUDE.md) は本ファイルへのブリッジ (Claude Code の自動読込点) であり、規約の実体は持たない。実装規約の SSoT は本 AGENTS.md。

1. [`README.md`](./README.md) — リポ全体像とビルドコマンド
2. [`design-system-strategy.md`](./design-system-strategy.md) — Primitives/Composites 構成、common/product 分離、トークン階層
3. 本ファイル — 実装規約と禁則
4. [`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) — semantic 色の構造
5. [`components/primitives/Button/Button.tsx`](./components/primitives/Button/Button.tsx) — Primitive 実装パターンの参照点
6. [`components/composites/Card/Card.tsx`](./components/composites/Card/Card.tsx) — Composite 実装パターンの参照点

---

## 2. コンポーネント選択フロー

### 用途別マッピング

| やりたいこと | 第一候補 | 補足 |
|---|---|---|
| 主要アクション | `<Button variant="primary">` | 1 画面に primary は通常 1 個 |
| 副次アクション | `<Button variant="secondary">` | primary と並べて対比 |
| 補助アクション | `<Button variant="tertiary">` | 取り消し / 戻る等 |
| 遷移 / 外部リンク | `<Link>` | `<Button>` ではない |
| 状態通知 (成功/警告等) | `<Alert>` | success/error/warning/info/neutral |
| 補足ラベル | `<Badge>` | 主張の弱い情報マーカー |
| アイコン | `<Icon>` | 直接 SVG 埋込みではなく必ず `<Icon>` |
| テキストの装飾的階層 | `<Typography>` | `<h1>` 直書きより推奨 |
| ローディング | `<Spinner>` または `<Skeleton>` | 待機状態の見せ方で使い分け |
| スクリーンリーダ専用テキスト | `<VisuallyHidden>` | icon-only Button の補助ラベル / live region |
| モーダル表示 | `<Modal>` | ネイティブ `<dialog>` ベース。確認ダイアログ・フォーム入力等 |
| アンカー付き overlay (補助情報 / 軽い操作) | `<Popover>` | native `popover` 属性 + floating-ui。非モーダル。確認・重要操作は Modal |
| アクションメニュー (選択して実行) | `<DropdownMenu>` | Popover 基盤 + `menu`/`menuitem` roving。値の保持は Select/SegmentedControl |
| hover/focus の短い補足 | `<Tooltip>` | Popover 基盤 + `role="tooltip"`/`aria-describedby`。操作・複数行は Popover |
| 一時通知 | `<Toast>` / `useToast()` | 操作結果の一時表示。Alert (インライン定常) と棲み分け |
| 要素の縦並び | `<Stack>` | 等間隔で縦積み。spacing は token 経由 |
| 要素の横並び | `<Cluster>` | 等間隔で横並び + 折返し対応 |
| 中央配置 | `<Center>` | 縦横中央、内側コンテナ用 |
| ページ全体の骨格 (header / nav / content / footer) | `<AppShell>` | sticky header + bottom nav + body slot 構造 |
| 左右 2 カラム (main / aside) | `<TwoColumn>` | レスポンシブで縦スタックに切替 |
| 左右の領域分割 (master-detail) | `<SplitPane>` | 固定幅 list pane + 流動 detail pane。リサイズ機能はなし (`listWidth` で固定幅指定) |

### Primitive vs Composite

判定基準を **構造と状態の 2 軸** で厳密化する (2026-06-04 Phase 1)。

- **Primitive** (`components/primitives/`): **単一の HTML 要素を装飾**する薄いラッパー、かつ **状態管理を持たない**
- **Composite** (`components/composites/`): いずれかを満たす場合
  - 複数の HTML 要素 / Primitive を組み合わせる (例: Switch の `<Label>` + `<button>` 内包)
  - 状態管理を持つ (例: Modal の open/close、CheckboxGroup の group state)
  - 振る舞いを持つ (focus trap / portal / animation / overlay 等)

判定の具体例:

| Component | 判定 | 理由 |
|---|---|---|
| Button / Link / Icon / Typography / Label | Primitive | 単一 HTML 要素、状態なし |
| Badge | Primitive | 単一 `<span>`、状態なし |
| Spinner / Skeleton / Divider / VisuallyHidden | Primitive | 単一要素、状態なし |
| Input / Textarea / Image | Primitive | 単一 HTML 要素 (`<input>` / `<textarea>` / `<img>`)、状態は uncontrolled or controlled prop のみ |
| Center / Stack / Cluster | Primitive (Layout) | 単一 `<div>` ラッパーで子要素を flex/grid 配置するのみ、状態なし |
| Switch | Composite | `<Label>` 内包 + `<button role="switch">`、label position 切替 |
| Checkbox / Radio | Composite | `<Label>` + `<input>` + `<FormMessage>` を内包、`CheckboxGroup` / `RadioGroup` で group state |
| ProgressBar | Composite | label + value 表示 + track + fill の **複数 `<div>` / `<span>`** 構造 |
| Modal / Toast / Popover / DropdownMenu / Tooltip | Composite | portal / focus trap / overlay |
| Card / Tabs / Accordion / Pagination | Composite | 構造の組合せ + 状態管理 |
| AppShell / TwoColumn / SplitPane | Composite (Layout) | 複数 slot (header / nav / main / aside 等) + レスポンシブ振る舞い |

### 禁則

- `<button>` 直接使用禁止 → 必ず `<Button>`
- `<a>` 直接使用禁止 → 必ず `<Link>` (native `<a>` が必須な場面のみ例外)
- 色の primitive 直接指定禁止: `bg-blue-500` / `bg-primary-600` / `bg-teal-500` (hue 直参照) → §3 の semantic 色を使う
- インラインスタイルでの色指定禁止: `style={{ color: '#xxx' }}`

### スタイリング3規律 (A2 配信 / 将来の scoped CSS・WC 化の前提)

配信を Tailwind 非依存化 (A2) しても、将来の component-scoped CSS 生成 / Web Components 化を**ほぼゼロコストで「将来実行可能」に保つ**ための著者規律。属性駆動 + トークン経由にしておけば、将来 `tv` config → `data-*` キーの scoped CSS への変換が機械作業になり、変換後の値もすべて `var()` 参照 = themeable に保たれる。

1. **色は必ず semantic トークン経由。** 生 hex・arbitrary 色 (`bg-[#...]`)、**primitive hue 直参照 (`bg-teal-500`)** も禁止 (§3 / §3-7 で lint 強制)。直値は生成 CSS に焼き付き、ブランド override に追従しない。
2. **コンポーネント状態は `data-*` 属性で駆動。** `open` / `loading` / `selected` / `checked` / `disabled` 等は class を条件付加 (`checked ? 'bg-x' : 'bg-y'`) せず、要素に `data-state="open"` / `data-loading` 等を付け、`data-[state=open]:` / `data-[loading]:` の variant で当てる。DOM 契約が属性ベースになり、scoped CSS 生成・WC 化がほぼ機械作業になる (著者の手間は tv boolean variant とほぼ同じ)。
3. **動的な値は inline style でなく CSS 変数で。** floating-ui の位置や progress の % は `style={{ '--progress': pct } as React.CSSProperties}` で渡し、CSS 側はトークン参照のままにする。themeable な部分を CSS に残せ、Shadow DOM にもそのまま移植できる。

> 状態の「class 条件付加」検知の自動化は難しいため、規律 2 は当面**規約 + レビュー運用** (規律 1 は §3-7 lint で機械強制)。移行は §7 の手順で 1 コンポーネント = 1 PR で段階的に進める。出荷する `data-*` 属性名は silent-break 面 (§10-2)。

---

## 3. トークン参照ルール

### トークン階層

```
tokens/source/colors.json          ← primitive tokens (10-step scale: primary-50〜900 等)
tokens/source/semantic-colors.json ← semantic tokens (WHERE × WHAT)
   └ value で primitive を参照、description で意味付け
tokens/build/variables.css         ← Style Dictionary で自動生成された CSS 変数
tokens/preset.cjs                  ← Tailwind preset、各 PJ tailwind.config.js が継承
```

### 参照優先順位 (厳守)

1. **Semantic を最優先**: `bg-surface-primary` / `text-onSurface-default` / `border-border-default`
2. **Primitive 直参照は禁止**: PJ override 互換性のため
3. **インラインスタイルでの色指定は禁止**

### 例

```tsx
// ✅ OK
<div className="bg-surface-primary text-onSurface-inverse">CTA</div>
<div className="bg-surface-success-muted border border-border-success-muted">成功</div>

// ❌ NG
<div className="bg-primary-600 text-white">CTA</div>
<div style={{ backgroundColor: '#008965' }}>CTA</div>
```

### トークン参照の使い分け

- **TypeScript / 型付き参照**: `import { COLORS, SPACING } from '../tokens'` → `tokens/index.ts` 経由
- **CSS 変数**: `var(--color-surface-primary)` → `tokens/build/variables.css` を `@import`
- **Tailwind**: `tokens/preset.cjs` 経由。各 PJ の `tailwind.config.js` で `presets: [require('.../tokens/preset.cjs')]` で継承

### semantic token を定義するときの規約

[`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) で新規 semantic token を追加・更新するときの規約 (token メンテナ向け、利用側は §3 上記まででよい)。

**3-1. value は必ず primitive 参照、生 hex は禁止**

```jsonc
// ✅ OK
"surface": { "primary": { "value": "{color.teal.700}" } }
// ❌ NG
"surface": { "primary": { "value": "#006F50" } }
```

理由: 生 hex は下流 product が hue palette (`teal` 等) を override しても connect しない (silent link)。`{color.X.Y}` で参照しておけば下流の override に自動追従する。**2026-06-04 以降、`bg.default` も含めて semantic は全て primitive 経由**。

**ランタイム連動**: Style Dictionary は `outputReferences: true` (style-dictionary.config.js) で primitive 参照を build 時に解決せず `var(--color-teal-700)` として CSS 出力する。これにより **下流 product は CSS 変数を 1 行 override するだけで全 semantic chain に伝播** (再 build 不要):

```css
/* product 側 */
:root {
  --color-teal-700: #5B4C99;  /* brand を violet 系に変更 */
}
/* → --color-surface-primary, --color-on-primary, --color-border-focus,
       --color-state-hover-primary 等が自動的に violet ベースに切り替わる */
```

> **注: primitive override は generator 領域のショートカット**。上記の `--color-teal-700` 直接 override は「既定パレットと同じ幾何 (10 段・L 正規化・step→role アンカー) を流用してよい」単一ブランド向けの簡便法。真のマルチブランド・テーマ契約は **semantic 層 (§3-8 / #59)** に置く: ブランドは `--color-surface-primary` 等の semantic トークンを直接供給し、primitive ramp は契約でなく「種色から準拠 ramp を作る任意の generator」の領域に格下げする。

**3-2. 透過オーバーレイは `color-mix()` で primitive と連動させる**

primitive 色に半透明を載せた overlay (`state.hover-primary` 等) は、CSS `color-mix()` + Style Dictionary 参照で書く:

```jsonc
// ✅ OK
"hover-primary": {
  "value": "color-mix(in srgb, {color.teal.700} 8%, transparent)"
}
// ❌ NG (旧バージョンのハードコード、teal.700 変更時に手動更新必要)
"hover-primary": {
  "value": "rgba(0, 111, 80, 0.08)"
}
```

`color-mix()` 対応ブラウザ: Safari 16.4 / Chrome 111 / Firefox 113 以降 (2023 春以降)。

中性 (黒/白) オーバーレイ (`state.hover` 等) は primitive 依存がないので `rgba(0, 0, 0, 0.08)` 等の生 rgba でよい。

**state token 命名規約**:
- **中性 overlay** (汎用、どの背景にも重ねられる): `state.hover` / `state.active`
- **色味付き overlay** (白系背景に重ねて role 感を出す): `state.{state}-{role}` 形式 — `state.hover-primary` / `state.active-primary` / `state.hover-error` / `state.active-error`
- 新規 role 追加時 (例: success/warning/info 用のホバー) は `state.hover-{role}` のパターンに従う

旧 `state.hover-on-X` 命名は、「on-」が「X 背景の上に」と読まれる紛らわしさを解消するため `state.hover-X` に統一済 (CHANGELOG 軸 5)。

**3-3. `bg.default` は brand から独立した中性 canvas**

`bg.default` は `color.neutral.50` を参照し、brand 色 (teal) からは独立。理由: 下流 product が brand を別 hue に変えても bg は中性のまま保たれ、product 共通の「中立的ページ canvas」を提供できるため。

brand 色の薄 tint をページ最下層に敷きたい product は、PJ 側で `bg-{brand}-25` などの brand-coupled token を追加し、`bg.default` の参照先を override する。本リポは default として brand 連動を採用しない (Multi-product hub の独立性を優先)。

**3-4-2. Surface layer 階層 (Carbon 流 numeric)**

Surface は **depth 階層** を numeric (`layer-1/2/3`) で表現し、特殊役割 (`inset` / `overlay`) と役割色 (`primary` / `success` 等) は別軸:

```
bg.default       (neutral.50)   ページ最下層
surface.layer-1  (white)        layer 1: ページ上のカード・モーダル
surface.layer-2  (neutral.50)   layer 2: layer-1 の入れ子 (Section 等)
surface.layer-3  (neutral.100)  layer 3: さらに深い入れ子 (rare)

surface.inset    (neutral.50)   sunken control (Input field / Code block 等の凹み)
surface.overlay  (rgba)         Modal の背景マスク
surface.{role}   (各色)         brand / functional / state
```

**`bg-surface` (DEFAULT alias)** は **layer-1** を指す (Tailwind の preset で alias 設定)。最頻利用なので簡潔記法を残す。

**dark mode 視点**: 各 layer の dark 値は**同名 semantic 変数を `[data-mode=dark]` セレクタで再定義**して与える (軸別変数名は作らない、機構と命名規約は §3-9)。light で深い (深い = darker neutral) のと逆に、dark では深い = brighter neutral になる:
- light: layer-1 white / layer-2 neutral.50 / layer-3 neutral.100
- dark (将来): layer-1 neutral.900 / layer-2 neutral.800 / layer-3 neutral.700 (仮)

---

**3-4-3. Container ペアパターン (Material 3 流の精神を本リポ命名で実現)**

Material 3 の Container ペア (`{role}` + `on-{role}` + `{role}-container` + `on-{role}-container`) は、本リポでは **既に実態として揃っている** が命名は独自。下表で対応を明示:

| Role | Intense (solid) | Text on intense | Container (soft) | Text on container |
|---|---|---|---|---|
| Brand (Primary) | `surface.primary` (teal.700) | `on.inverse` (white) | `surface.secondary` (teal.50) | `on.primary` (teal.700) |
| Success | `surface.success` (green.500) | `on.inverse` (white) | `surface.success-muted` (green.50) | `on.success` (green.700) |
| Error | `surface.error` (red.500) | `on.inverse` (white) | `surface.error-muted` (red.50) | `on.error` (red.700) |
| Warning | `surface.warning` (orange.400) | `on.inverse` (white) | `surface.warning-muted` (orange.50) | `on.warning` (orange.700) |
| Info | `surface.info` (blue.500) | `on.inverse` (white) | `surface.info-muted` (blue.50) | `on.info` (blue.700) |

**Container 単独で intense なし** (自然な設計):
- `surface.disabled` + `on.disabled` (disabled は常に弱いはず、intense 不要)
- `surface.skeleton` (loader、text なし)

**Status indicator は text counterpart 不要** (小さな塗り、テキストを載せない):
- `surface.neutral` (offline / off 等、success/error/warning と並列の status)

**実装例** (Alert success が Container ペアパターンに合致):
```tsx
'bg-surface-success-muted text-onSurface-success border-border-success-subtle'
//   ↑ container          ↑ on-container          ↑ border-on-container
```

**命名選定の経緯**: Material 3 流に `-container` / `primary-container` に rename する案も検討 (軸 2)、構造は不変なので **見送り** とした。実態に合わせて命名を変える利得より、既存 callsite / 学習資産の温存を優先。`-muted` / `secondary` の命名は本リポの semantic 規約として確定。

---

**3-5. Primitive Color は hue 名、role 名は Semantic 層に集約**

Primitive 層 (`tokens/source/colors.json`) は **hue 名のみ** (`teal` / `green` / `red` / `orange` / `blue` / `neutral` / 他 7 補助 hue) で構成する。`primary` / `success` / `error` / `warning` / `info` のような **role 名は Semantic 層** (`surface.primary` / `on.success` 等) でのみ定義し、Primitive 層には持ち込まない。

理由: 2 層アーキテクチャの純度を保つため。`primary` は概念上「ブランドの中核色」というロール (= 意味付け) であり、teal という色相そのものではない。下流 product が brand を別 hue に変えたい場合、Semantic 層で `surface.primary` の参照先を `{color.violet.700}` 等に差し替えるだけで Primitive 層は触らない設計。

**3-4. semantic-only スケール (z-index / opacity / focus-ring)**

「具体値より役割名で意図が伝わる」種類のスケールは **primitive 層を持たず semantic 名のみ** で運用する。生数値での参照は禁止。

- `z-index`: `dropdown / sticky / overlay / modal / popover / toast / tooltip` の 7 layer。`z-modal` のように使う (`z-50` 等の Tailwind 既定は並存するが新規利用は避ける)
- `opacity`: `disabled / muted / spinner-track / spinner-spin` の意味付き 4 値。`opacity-disabled` のように使う
- `focus-ring`: `ring-focus` (width=2px) / `ring-offset-focus` (offset=2px)。色は `border-focus` (semantic-colors) と組合せる: `focus-visible:ring-focus focus-visible:ring-offset-focus focus-visible:ring-border-focus`

**なぜ semantic-only か** (≠ color/spacing の 2 層構成): これらは **palette 的に再利用される primitive 層が概念上存在しない** ため。
- `z-index = 1000` という値自体は意味を持たず「modal レイヤ」という役割名で初めて意図が立つ。`z-index.layer-1: 1000 → z-modal: layer-1` のような primitive を挟むと中継が無価値
- `opacity` は 0.0〜1.0 の連続値で palette 化できない。Tailwind 既定の `opacity-0/5/10/.../100` が事実上の primitive 役
- `focus-ring` はそもそも 1〜2 値しかなく palette を作る意義がない

下流 product 側で override したいときは PJ の `tailwind.config.js` で `theme.extend.zIndex.modal = '...'` のように **semantic 名を直接書き換える**。

---

### サイズスケール内の `md = default` 規約

サイズスケールを持つカテゴリでは、**`md` をカノニカルなデフォルト値** とし、**中核は `sm / md / lg` の 3 段で揃える**。境界値 (`none` / `full`) は必要に応じて追加するが、`xs` / `xl` / `2xl` のような外側の段はデフォルトでは持たない (実利用が薄く、`md = default` の見え方を歪めるため)。

source token には DEFAULT キーを足さず (size label の純度を保つため)、`tokens/preset.cjs` で `DEFAULT` エイリアスを `md` にマップする:

```js
// tokens/preset.cjs
boxShadow:    { ...t.shadow,  DEFAULT: t.shadow.md  },
borderRadius: { ...t.radius,  DEFAULT: t.radius.md  },
```

これにより `rounded` ≒ `rounded-md`、`shadow` ≒ `shadow-md` で動く。

**対象カテゴリ**:
- `radius`: `none / sm / md / lg / full` (5 段、中核 sm/md/lg + 境界 none/full)
- `shadow`: `none / sm / md / lg` (4 段、中核 sm/md/lg + 境界 none)
- **コンポーネントの `size` prop**: `Input` / `Label` / `Button` / `Badge` 等の Primitive、および `SearchBar` / `Radio` / `Checkbox` / `Switch` / `SegmentedControl` / `NumberInput` / `Select` 等の Composite で **`sm / md / lg` の文字列リテラル** に統一 (`small` / `medium` / `large` 表記は禁止)。これにより `<Button size="md">` / `rounded-md` / `shadow-md` / `text-md` が同じ `md` で並ぶ。Spinner (`xs/sm/md/lg/xl/2xl`) や Icon (`sm/md/lg/xl`)、Avatar (`xs/sm/md/lg/xl`) のように境界スケールを持つ component も、ラベル流派は `sm/md/lg` で揃える
- **Button の Radius は size 連動**: `Button size="sm" → rounded-sm` / `size="md" → rounded-md` / `size="lg" → rounded-lg`。size と radius が同じラベルで揃うため設計が直感的

**非対象**:
- **`font-size`**: Tailwind の慣習で `text-base` が body text のデフォルトとして広く認知されているため、`base` ラベルをそのまま維持 (本リポでも `text-base` は 16px の body 用途)
- **`spacing`**: 0〜96 の数値スケールで size label でないため対象外
- **その他 semantic ラベル系** (font-weight, line-height, letter-spacing, animation duration/easing, font-family, breakpoints, color palette): 用途ラベル / 数値スケールであり、`md = default` 規約は適用しない

#### density は size 段と直交する大域モード (#61)

`density` (comfortable / compact) は size 段 (`sm/md/lg`) と**直交する**。混同しない:

- **size = インスタンス選択** — デザイナーが要素ごとに `<Button size="md">` を選ぶ。
- **density = コンテキストの大域モード** — 画面/領域単位で comfortable ↔ compact を切り替える。compact の中の小ボタン、comfortable の中の大ボタンが両立する。

したがって **compact を 4 つ目のサイズ段にしない**。compact は新スケール段でなく、**既存スケールの*値*を `[data-density=compact]` 下で再評価**したもの: `--control-height-md` が comfortable 48 / compact 36 と、同じ `md` トークンの別値を持つ (#60 §3-9 の「同名変数をセレクタで再定義」と一致)。コンポーネントは `md` を使い続け、density 属性が解決値を変える。

値の持ち方は **per-density 明示値** (global multiplier `×0.8` は不可: タッチ最小ヒット域の床を割る / トークン種で圧縮率が非線形 / 読みのタイポは density で縮めない / グリッド `12×0.8=9.6` を外す)。

> 本バッチは**構造規約のみ**。control-height 等の per-density 実値・pointer 適用機構・compact ヒット域検証は範囲外 (#61、実需要待ち)。

---

### 例外

PJ 側 (本リポを依存として使う product 側) で、ブランド固有の見栄え調整のために primitive スケールを extend する場合は OK (ただし semantic を上書きする方を推奨)。

---

### 3-6. Token Catalog Story / Guideline の規約

[`components/tokens/`](./components/tokens/) 配下の token カタログは component とは別構造で運用する。Props を持たず、token scale を視覚化するのが目的。component 規約 (§5) は適用しない。

**ファイル構成** (2 ファイル):

| ファイル | 担当 |
|---|---|
| `TokenCategory.stories.tsx` | flat catalog の Storybook story (1 story = 1 軸) |
| `TokenCategory.guideline.mdx` | 概要 + カタログ link + (任意) 設計方針 / 迷ったらこれ + 関連 |

**Story (`.stories.tsx`) の規約**:

- **flat catalog**: 各 story は 1 grid で並べる (内部 subsection 禁止、認知負荷の元)
- **軸が複数あれば story を分ける**:
  - 例: Typography → `FontSizes` / `FontWeights` / `LineHeights` / `LetterSpacings` / `FontFamilies` の 5 story
  - 例: SemanticColors → `Background` / `Surface` / `Text` / `Border` / `State` / `ContainerPairs` の 6 story
- **軸が 1 つは 1 story** (`Catalog` 等の名前で 1 つにする)
  - 例: Spacing / Radius / ZIndex / Opacity / Breakpoints / Colors (Primitive)
- **特殊な比較 view** は追加 story として持ってよい (例: SemanticColors の `Container Pairs` は機能色の組合せパターン)
- 各 story に `parameters.docs.description.story` で 1 文の説明 (`.guideline.mdx` の Story 概要欄にも表示される)
- **`tags: ['autodocs']` は付けない** (`.guideline.mdx` 側が Docs を兼ねる)
- 色・余白は semantic Tailwind utility (`bg-surface` / `text-onSurface` 等) で描画

**Guideline (`.guideline.mdx`) の規約** — 標準セクション (上から順):

1. **`# Token Category`** — h1 タイトル
2. **`## 概要`** — 1〜2 文。「何の token か / どの utility で使うか / Primitive vs Semantic の位置付け」
3. **`## カタログ`** — story への link list。**`<Story of={...} />` 埋め込みは禁止** (Catalog は story 側で完結させ、Guideline はリンクのみ)。複数 story がある場合は箇条書きで全 story を 1 行説明付きで列挙
4. **`## 設計方針`** (任意) — why の箇条書き。how (具体値) は story が見せるので冗長にしない
5. **`## 迷ったらこれ`** (任意) — quick-pick 表。複数候補から迷う場面が多い token (Color / Typography / Spacing 等) で有効
6. **`## 関連`** (必須) — 他 token / AGENTS.md §3 / `design-system-strategy.md` 設計原則 へのリンク

**書かない**:

- Story を `<Story of={...} />` で guideline 内に埋め込まない
- Material 3 / Carbon / Primer 等の他 DS 用語を user-facing docs に書かない (設計の "why" は AGENTS.md に集約)
- 設計移行履歴 (「旧 X」「旧 Y」等) を `description` フィールドに残さない (CHANGELOG が SSoT)

**参考実装**:

- [`components/tokens/Colors.{stories,guideline}`](./components/tokens/) — Primitive 軸 1 (palette catalog 1 つ)
- [`components/tokens/SemanticColors.{stories,guideline}`](./components/tokens/) — Semantic 軸複数 (6 story、Container Pairs を含む) + 迷ったらこれ

### 3-7. lint が強制する規約 (`npm run lint`)

[`eslint.config.mjs`](./eslint.config.mjs) で、これまでドキュメント任せだった規約の一部を機械強制する (CI の Lint ステップで違反 PR をブロック)。

- **生 hex / 色 bracket 禁止** (§3): 出荷される component 実装 (`components/**/*.tsx`。stories / tokens カタログ / `.storybook` 設定は対象外) の `className` 等に `#xxxxxx` / `[#xxx]` / `[rgb(...)]` / `[hsl(...)]` を書くと error。semantic token を使う。**spacing/サイズ bracket (`w-[44px]`) は意図的利用のため対象外**
- **primitive hue 直参照禁止** (§3 / スタイリング3規律): `bg-teal-500` / `text-neutral-200` / `border-red-700` のような `{utility}-{hue}-{shade}` (hue = teal/neutral/green/red/orange/blue/yellow/lime/cyan/sky/violet/purple/pink) を書くと error。semantic token (`bg-surface-primary` / `text-onSurface-muted` 等) を使う。string literal / template literal の両方を検知 (JSDoc コメント内の反例は AST 対象外なので可)
- **`@/` エイリアス import 禁止** (§4 依存): `components/**` からの `@/...` import は error (相対 import か `@sb-blocks` を使う)
- **react-hooks**: `rules-of-hooks` (error) / `exhaustive-deps` (warn)。意図的な dep 省略は `// eslint-disable-next-line react-hooks/exhaustive-deps` + 理由コメントで明示
- **storybook recommended**: play 関数の `await` 漏れ、story 命名規約 等

新しい規約を機械化したくなったら、まず本ルールに足せるか検討する (「ドキュメントで守らせる」< 「lint で弾く」)。

### 3-8. テーマ契約 — 三層 themeable モデル (#59)

マルチブランドの**テーマ契約は semantic 層に置く**。「正しいブランドテーマ = themeable な semantic トークンの完全な集合で、検証 (コントラスト + 距離 #58) を通るもの」と定義する。primitive ramp は契約でなく任意の generator の領域 (§3-1 注記)。適用機構は CSS 変数 override 一本 (A2 #57 で Tailwind 依存が外れ override に収斂、#56 の「色は semantic 経由」規律が前提)。

themeable トークンを 3 層に分け、機械可読な manifest [`tokens/theme-contract.json`](./tokens/theme-contract.json) で定義する (将来の完全性チェック CI の入力。本バッチでは検証器は作らない):

- **① 必須 themeable** — ブランドが必ず供給 (妥当な既定なし)。`surface.primary` (+ `surface.secondary`) の実質ブランド塗り 2 色。ペア前景 (`on.inverse` / `on.primary`) は固定の白でなく primary の明度から自動導出 + コントラスト検証する設計 (上書き可、導出 generator は別途)。
- **② 任意 themeable** — 上書き可、未指定は既定継承、上書き時のみ不変条件で検証。status 一式 (success/error/warning/info の surface / -muted / on / border)・`border.focus`・brand 連動 overlay (`state.hover-primary` 等)・将来 accent。**成長は ② で行う**。
- **③ 固定** — 上書き不可、保証の土台。中性 canvas (`surface.layer-1/2/3` / inset / overlay)・中性テキスト (`on.default/soft/muted`)・中性境界 (`border.default/subtle` 系)・中性 state overlay (`state.hover/active`)・disabled / skeleton。ブランド背景が要る場合は canvas を override させず、別ロール (`brand-surface` 等) を ② に足す。

**テーマ契約 semver** (§10-6 (b)): **必須 (①) の追加 = 全テーマ作者への破壊 = MAJOR / 任意 (②) の追加 = 既定継承で後方互換 = MINOR**。① は小さく安定に保つ。

> 本バッチ範囲外 (実需要待ち): 前景の自動導出 generator / テーマ完全性チェック CI / テーマ別 contrast 多テーマ行列 / `brand-surface` 実装。

### 3-9. 軸の変数命名規約 — brand × mode × density (#60)

テーマには 3 つの直交する軸がある。触る変数集合がほぼ disjoint なので合成が安全 (brand/mode = 色トークン `--color-*` / density = 寸法トークン spacing・control-height)。

**規約: 軸は同名の semantic 変数を別セレクタで再定義する。軸別変数名を作らない。**

```css
/* ✅ OK — 同名変数をセレクタで再定義 */
:root            { --color-surface-primary: …; --control-height-md: 48px; }
[data-mode=dark] { --color-surface-primary: …; }   /* mode が色スライスだけ再定義 */
[data-density=compact] { --control-height-md: 36px; } /* density が寸法スライスだけ再定義 */

/* ❌ NG — 軸別変数名 (コンポーネントが軸を意識させられる) */
:root { --color-surface-primary-dark: …; --control-height-md-compact: 36px; }
```

- コンポーネントは**単一の変数名 / utility** (`bg-surface-primary` / `--control-height-md`) を使い続け、brand × mode × density を一切意識しない。解決値はセレクタ (属性) が切り替える。
- 合成は属性の重ね掛け: `[data-theme=acme][data-mode=dark][data-density=compact]`。各軸が自分の変数スライスだけ再定義する (直交)。
- mode の dark 値は §3-4-2、density の値の持ち方は §「md = default / サイズスケール」を参照。
- 本バッチは**命名規約 (構造) のみ**。dark / compact の実値・適用機構・検証行列は範囲外 (#60 / #61、実需要待ち)。

---

## 4. ビルドコマンド

| コマンド | 用途 |
|---|---|
| `npm install` | 依存インストール |
| `npm run tokens:build` | Style Dictionary でトークンを `tokens/source/` から `tokens/build/` へビルド |
| `npm run tokens:watch` | トークンソース変更を監視して自動ビルド |
| `npm run tokens:typecheck` | `tokens/index.ts` の型整合性をチェック |
| `npm run storybook` | Storybook ローカル起動 (http://localhost:6006) |
| `npm run build-storybook` | Storybook 静的書き出し (`storybook-static/`) |
| `npm run build` | コンポーネント + tokens の TS コンパイル (→ `dist/`) |

### 4-1. 単一コンポーネントの内側ループ

エージェントの内側ループ (1 コンポーネントの修正→検証の反復) は**秒単位**であるべき。全リポジトリ走査 (typecheck / build-storybook は重い) をイテレーションごとに払わない。

| 用途 | コマンド |
|---|---|
| イテレーション中の lint (スコープ版) | `npx eslint components/<layer>/<Name>/` |
| イテレーション中の test (story 絞り込み) | `npm run test-storybook:local -- <Name>` (要 `build-storybook` 済み) |
| **コミット前の最終確認 (全体)** | `npm run verify` |
| 視覚・a11y も含む全確認 | `npm run verify:full` |

- `npm run verify` = `tokens:build → check:contrast → check:links → lint → typecheck` (**安い順 fail-fast**)。`verify:full` はこれに `build-storybook + test-storybook:local` を足す。
- `typecheck` は incremental (`.tsbuildinfo`) のため 2 回目以降が速い。
- **イテレーション中はスコープ版、全体走査はコミット前のみ** という方針を守る。

---

## 5. コンポーネント実装規約 (新規・既存共通)

新規追加・既存移行どちらも **本セクションが規約の SSoT**。進め方は §6 (新規) / §7 (既存) を参照。

### 5-1. 4 ファイル構成

情報の置き場を重複させないため、ファイルごとに担当範囲を厳密に分ける。

| ファイル | 担当 |
|---|---|
| `ComponentName.tsx` | React 実装 + 全 Props の JSDoc + `@example` (autodocs に流れる) |
| `ComponentName.stories.tsx` | Storybook Story (**標準 7 節構成** — Docs/Playground/Variants/Sizes/States/WithIcon/EdgeCases) |
| `ComponentName.guideline.mdx` | **コンポーネントの Docs ページを兼ねる** (`<Meta of={Stories} name="Guideline" />` で autodocs を置き換え)。テキスト中心の設計指針 |
| `index.ts` | named export + 型 re-export |

配置先は §2 の Primitive vs Composite 判定に従う:

```
Primitive → components/primitives/ComponentName/
Composite → components/composites/ComponentName/
```

### 5-2. `.tsx` の規約

- `interface ComponentProps extends React.HTMLAttributes<...>` で native 属性を継承
- **各 Props に JSDoc コメント必須** — Storybook の autodocs (`react-docgen-typescript`) が拾い、Props 表の Description 列に自動表示される
- `@default` JSDoc タグで既定値を明記する (Props 表に出る)
- **Props の説明は `.tsx` JSDoc が唯一の情報源**。`.stories.tsx` の `argTypes` 側に `description` を書くと JSDoc を上書きしてしまうので書かない
- ネイティブ HTML 属性 (`disabled` 等、`React.ButtonHTMLAttributes` 等から継承) は **再宣言して JSDoc を上書き** する (React の型には JSDoc が付いておらず Props 表で Description 空欄になる回避)
- コンポーネント本体に `@example` JSDoc を 2〜3 例
- **`forwardRef` で ref 透過**: primitive は必須 (単一 HTML 要素なので ref 先が自明)。composite は **ref を当てる対象要素が明確な場合のみ**実装する (例: `Modal`→`<dialog>`、`SearchBar`→`<input>`)。対象が曖昧な複合レイアウト系 (AppShell / TwoColumn 等) は無理に付けず `React.FC` のままでよい
- **styling は `tailwind-variants` (`tv`)** で variant マップを宣言的に保持 (`Button.tsx` の `buttonVariants` 参照)。文字列配列の組立て・object lookup は避ける
- **状態は `data-*` 属性 + variant で表す** (スタイリング3規律 2)。`open` / `loading` / `selected` / `checked` / `disabled` 等は要素に `data-state=...` / `data-loading` 等を付け、tv 側を `data-[state=open]:` / `data-[loading]:` の variant で当てる。class を条件付加 (`checked ? 'bg-x' : 'bg-y'`) しない。参照実装: `Switch` (toggle 系) / `Accordion` (open 系)
- **SSR / RSC セーフを契約にする** (#62)。module / render スコープで `window` / `document` を触らない (browser API は `useEffect` / event handler 内に置く)。**`'use client'` をファイル先頭に付ける条件**: hook (`useState` / `useEffect` / `useRef` / `useId` 等) を使う、自前の event handler を host 要素に常時 attach する (例: `Link` / `Pagination`)、または Context Provider を持つ。**付けない**: hook を持たず consumer の `onClick` 等を `{...props}` で spread するだけの純表示 (Badge / Divider / Typography / Icon / レイアウト primitive / Button / Card 等) — Server Component として描けるよう「shared」のままにする。

### 5-3. `.stories.tsx` の規約 — VR 集約モデル (固定 3 節)

**全コンポーネントで 3 節に統一する**。関心事を「対話探索 / 視覚リファレンス / 文脈ストレス」に分け、視覚回帰 (Chromatic) の撮影単位をコンポーネントごとに揃える (1 コンポーネント ≒ 1〜2 枚) のが目的。

| 順 | 節名 | 役割 | VR (Chromatic) | 必須 |
|---|---|---|---|---|
| 1 | (Docs) | autodocs の Docs ページ。`.guideline.mdx` が `<Meta of={...} />` で兼ねる | — | 必須 |
| 2 | **Playground** | `args` 全開放、Controls で**任意の 1 状態**を探索する起点。play test もここ | **対象外** (`disableSnapshot`) | 必須 |
| 3 | **Overview** | **props で作れる内在的パターンを 1 枚に凍結した総覧グリッド** (variant × state / size / icon / description 等)。Controls で再現できるものは原則ここに集約 | **対象** | 必須 |
| 4 | **EdgeCases** | **Playground (Controls) では再現できない構造的なケース** (inner-span `truncate` 等の特殊マークアップ / コンテナ幅依存を固定幅で見せる / 複数インスタンス・item 数依存の配置 / 段落内 inline 等) | **対象** | 任意 (該当が無ければ省略) |

**Overview / EdgeCases の境界 = 「内在的 vs 文脈的」**:
- **内在的** (props だけで決まる) → **Overview**。variant / size / state (Hover/Focus/Active は `storybook-addon-pseudo-states` の `parameters.pseudo` で列ごとに強制表示) / icon (左右 / iconOnly) / loading / disabled / description 等。
- **文脈的** (特殊マークアップ・コンテナ幅・複数インスタンスで初めて起きる) → **EdgeCases**。**ただし Playground の Controls で再現できるもの (長文折返し・`fullWidth` 等、text/boolean prop を変えるだけのもの) は入れない** — それは Playground の役目で、VR は静的な Overview + 真の構造ケースに絞る。コンテナ幅に依存する場合は**固定幅**で見せて VR を決定的にする (例: Grid を `w-[680px]` で固定)。
- **非視覚** (SR 専用の aria-label 長文など) は **VR に撮らない** (axe (test-runner §8-4) + guideline で担保)。

**書き方ルール**:
- CSF3 (`Meta` + 名前付き `export`)。`tags: ['autodocs']` は付けない (`.guideline.mdx` が Docs を兼ねる)
- 各 story に `parameters.docs.description.story` で一行説明を必須
- **Playground は `parameters.chromatic.disableSnapshot = true`** (Controls 探索用で Overview と冗長。§9-4)
- **Overview / EdgeCases は args 非依存の静的 render** (視覚回帰の対象)
- **ReactNode prop (`icon` 等) は `argTypes` の `mapping` で Controls 化** (ラベル → 実要素)。`control: false` で逃げず、Playground で全パターンを再現可能にする (参照: Button の `icon` mapping)
- 色・余白はハードコードせず Tokens (semantic Tailwind ユーティリティ) を参照

**節省略の判断**: Playground / Overview は**絶対省略しない**。EdgeCases は文脈依存の崩れが無ければ省略可。

> **移行中の旧構造**: 旧モデルは Variants / Sizes / States / WithIcon / WithDescription のカタログ群を個別 VR していた。これらは Overview (視覚) + guideline.mdx (設計根拠の散文) に集約されるため**段階的に削除**する (1 コンポーネント = 1 PR、§7)。story id の削除は silent break (§10-2) なので CHANGELOG に明記。`check:conventions` は移行中の両構造を許容する。

参考実装: [`components/primitives/Button/Button.stories.tsx`](./components/primitives/Button/Button.stories.tsx)

### 5-4. `.guideline.mdx` の規約 — Docs を兼ねるテキスト中心ページ

**`.guideline.mdx` は `<Meta of={Stories} name="Guideline" />` で autodocs の Docs ページを置き換える**。サイドバーから「Docs」ノードが消え、「Guideline」が Docs を兼ねる。

**冒頭の必須テンプレ**:

```mdx
import { Meta, ArgTypes } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './ComponentName.stories';
import { ComponentName } from './ComponentName';
import { DoDontExample } from '@sb-blocks/DoDontExample';
import { GuidelineToc } from '@sb-blocks/GuidelineToc';

<Meta of={ComponentStories} name="Guideline" />

# ComponentName

<GuidelineToc items={[
  { label: '概要', href: '#概要' },
  { label: 'Props', href: '#props' },
  { label: 'Do / Don\'t', href: '#do--dont' },
  { label: 'アクセシビリティ', href: '#アクセシビリティ' },
  { label: '関連', href: '#関連' },
]} />
```

`<GuidelineToc>` は [`.storybook/blocks/GuidelineToc.tsx`](./.storybook/blocks/GuidelineToc.tsx) 実装、H1 直下に必ず置く。anchor 用 id は rehype-slug が自動付与。

**標準セクション** (上から順、5 セクション):

1. **概要** — 1〜2 文で **「何のためのコンポーネントか / いつ使うか / いつ使わないか (代替コンポーネント名)」** を端的に書く。サブセクション禁止
2. **Props** — `<ArgTypes of={ComponentStories.Playground} />` のみ。表の Description は `.tsx` JSDoc から autodocs が自動生成
3. **Do / Don't** — 2 サブセクション:
   - `<DoDontExample>` を **3〜5 ペア配置**。重要な NG パターンも視覚カード化 (「色だけで意味」「横並び 4 個以上」など)
   - `### 別コンポーネントの方が適切な場面` — 「やろうとすること / 使うべき別コンポーネント / 理由」の表で他コンポーネントに誘導
4. **アクセシビリティ** — キーボード操作、ARIA、タッチターゲット、SR への配慮、各種固有 a11y 仕様
5. **関連** — `### 内部で利用するコンポーネント` のみ。Icon / Spinner など子で使う Primitive を列挙

注: `<Primary />` / `<Controls />` / `<Stories />` は本リポでは使わない。各 Story はサイドバーから個別に開く運用。

**Do / Don't カードの規約**:

- **コンポーネント**: `<DoDontExample>` ([`.storybook/blocks/DoDontExample.tsx`](./.storybook/blocks/DoDontExample.tsx))。MDX からは `import { DoDontExample } from '@sb-blocks/DoDontExample'`
- **ペア数**: 3〜5 個。基本ルール + NG パターンの両方を視覚カード化
- **色分け**: 緑=Do (推奨) / 赤=Don't (非推奨) で固定
- **構造**: `label` / `doExample` / `doCaption` / `dontExample` / `dontCaption`
- **必須**: 各 `dontCaption` に **「なぜそうなのか」の理由** を 1 行
- **プレビュー**: 必ず本物のコンポーネントを描画 (スクリーンショット画像禁止、Tokens 変更追従のため)

**書かない** (重複・陳腐化の温床):

- Props 表 → `.tsx` JSDoc から autodocs が自動生成 (5-4 セクション 2 で `<ArgTypes>` で十分)
- 使用例コードブロック (純粋な props 例) → Story と重複。ユースケース内の図解スニペットは可
- 実装詳細 (使用トークン表 / Tailwind クラス一覧)
- バージョン履歴 → `git log` で十分

参考実装: [`components/primitives/Button/Button.guideline.mdx`](./components/primitives/Button/Button.guideline.mdx)

### 5-5. 完了条件 (受け入れ基準)

規約準拠は **CI が機械的に保証する項目** と **人間がレビューで判断する項目** に分ける。機械項目は PR で自動ブロックされるので、レビュアーは原則「人間が判断する項目」に集中する (機械項目を二重に目視しない)。

#### 5-5-1. CI が保証する (機械的に弾く)

| 項目 | 担保する CI ステップ |
|---|---|
| 型が通る (`tsc --noEmit` クリーン) | **Typecheck** (`npm run typecheck`) |
| 色・余白が semantic Tokens 参照 (生 hex / 色 bracket 不使用)、`components/` で `@/` import 不使用、react-hooks / storybook 規約 | **Lint** (`npm run lint`、§3-7) |
| §5 規約適合: forwardRef (§5-2) / Props の JSDoc (§5-2) / 4 ファイル構成 (§5-1) / barrel 同期 / 標準ストーリー構造 (§5-3) | **Check conventions** (`npm run check:conventions`、[`scripts/check-conventions.mjs`](./scripts/check-conventions.mjs)) |
| 壊れた Storybook 内リンク (`?path=...`) が無い | **Check links** (`npm run check:links`、§9-3) |
| コマンド・PR テンプレ・スクリプトの `§N` 参照が AGENTS.md の実在見出しを指す (改番でのリンク切れ防止) | **Check refs** (`npm run check:refs`、[`scripts/check-refs.mjs`](./scripts/check-refs.mjs)) |
| semantic 配色ペアが WCAG 2 AA を満たす + パレットの階調不変条件 (アンカー / step 差 / L 正規化 / bright-hue) が壊れていない (§8-5) | **Check contrast** (`npm run check:contrast`、[`tokens/contrast-pairs.json`](./tokens/contrast-pairs.json)) |
| 全 Story がレンダリングエラー無し + play test が pass + axe a11y 違反 0 (例外は理由付き、§8-4) | **Run Storybook tests** (`npm run test-storybook`) |

#### 5-5-2. 人間が判断する

- **API 設計**: props の粒度・命名・discriminated union 等が妥当か。native 要素ファーストか (§5-2)
- **配置判断**: Primitive / Composite の分類が §2 基準に合うか
- **標準ストーリー構造**: 節 (Playground / Variants / Sizes / States / WithIcon / EdgeCases) の取捨選択と順序が意図に合うか / `Playground` が `args` 全開放か / Variants・Sizes・States が静的一覧で持たれ、States で `parameters.pseudo` が必要十分か / `tags: ['autodocs']` 不使用 (`.guideline.mdx` が Docs を兼ねる)
- **Docs 内容**: `.guideline.mdx` が `<Meta of={...} name="Guideline" />` + 直下に `<GuidelineToc>` を持ち、`## Do / Don't` に **3〜5 ペア**の `<DoDontExample>` (**本物のコンポーネント**描画) があり、各 `dontCaption` に「なぜ Don't か」の理由があるか / 各 story の `parameters.docs.description.story` 一行説明が的確か
- **UX 妥当性**: 実際の利用文脈で迷わず使えるか、Do/Don't が現実の誤用を捉えているか

---

## 6. 新規コンポーネント追加の進め方

§5 の規約に従って 4 ファイルを揃える。雛形は Button をコピー。

### 6-1. 始め方

1. **配置判断** (§2): Primitive (`components/primitives/`) か Composite (`components/composites/`) か
2. **雛形コピー**: [`components/primitives/Button/`](./components/primitives/Button/) を新コンポーネント名にリネームコピー
3. **実装**: §5-2 規約に従って `.tsx`、§5-3 で `.stories.tsx`、§5-4 で `.guideline.mdx` を埋める
4. **検証**: §5-5 チェックリスト + §9 検証フロー

### 6-2. 新規追加時の依頼プロンプト例

```
このデザインシステムに新しい Composite コンポーネント「XXX」を追加してください。

【参照ファイル】
- components/primitives/Button/Button.{tsx,stories.tsx,guideline.mdx} — 規約のリファレンス実装
- components/composites/Card/Card.tsx — Composite 実装パターン
- AGENTS.md §3 トークン参照ルール / §5 コンポーネント実装規約 / §8 アクセシビリティ前提
- design-system-strategy.md 設計原則 (a11y / ヒエラルキー / レスポンシブ / 可読性 / UI ライティング)

【作成するファイル】
- components/{primitives|composites}/XXX/XXX.tsx
- components/{primitives|composites}/XXX/XXX.stories.tsx
- components/{primitives|composites}/XXX/XXX.guideline.mdx
- components/{primitives|composites}/XXX/index.ts
```

---

## 7. 既存コンポーネントの標準ストーリー構造への移行手順

§5 の規約を **既存コンポーネントに後追いで適用** するときの手順。

リファレンスは [`components/primitives/Button/`](./components/primitives/Button/) 一式。迷ったら Button をコピーして当てはめる。

### 7-1. 進める単位

**1 コンポーネント = 1 PR / 1 commit**。Primitives → Composites の順 (依存方向)。1 PR で複数を触ると review/revert の単位が壊れる。破壊的変更 (story id の変更等) は [`CHANGELOG.md`](./CHANGELOG.md) の `[Unreleased]` に都度追記 (§10)。

### 7-2. 監査 (5 分)

下記をざっと読んで **§5 規約とのギャップ** を把握する:

1. `ComponentName.tsx` — props 構造、variant の有無、icon prop の有無、styling パターン (object lookup か tailwind-variants か)
2. `ComponentName.stories.tsx` — 既存 story 数・命名、static render か args 依存か、`tags: ['autodocs']` の有無、`argTypes.description` の有無
3. `ComponentName.md` または `ComponentName.guideline.mdx` (どちらか or 両方存在しうる)

判定:

| 観察 | アクション |
|---|---|
| variant prop あり | Variants 節を作る |
| size prop あり | Sizes 節を作る |
| icon prop あり | WithIcon 節を作る |
| 非 interactive (Badge / Skeleton 系) | States 節を省略可 (理由を冒頭 docstring に明記) |
| iconOnly のようなテキスト省略モード | discriminated union で `aria-label` を型レベル必須化 ([`Button.tsx`](./components/primitives/Button/Button.tsx) の `ButtonIconOnlyProps` パターン) |
| 該当 prop なし | 節をまるごと省略 (順序は維持) |

### 7-3. `.tsx` のリファクタ (必要時のみ)

- **styling が文字列配列 / object lookup で書かれている** → `tailwind-variants` (`tv`) に移行 ([Button.tsx](./components/primitives/Button/Button.tsx) の `buttonVariants` 参照)
- **hover/active overlay を variant ごとに当てたい** → `--color-state-*` semantic token を `shadow-[inset_0_0_0_9999px_var(--color-state-...)]` で重ねる (Material state layer 同等)。下地の variant 色を残したまま半透明オーバーレイ可能
- **discriminated union がある場合** → `props as _InternalType` でキャストせず、discriminant で **render を 2 分岐** する (Button.tsx の `if (props.iconOnly) { ... } else { ... }` パターン)

### 7-4. `.stories.tsx` の書き直し

[`Button.stories.tsx`](./components/primitives/Button/Button.stories.tsx) を雛形にコピー → コンポーネント固有の prop で差し替え。書き方は §5-3 に従う。

**特に確認**:

- `meta.title` から `_` プレフィックス等を除去
- `tags: ['autodocs']` を削除
- `argTypes.description` を削除 (JSDoc が SSoT)
- Playground に `play` で最小限の動作テスト (`click → onClick.toHaveBeenCalled` 等)
- States 節は `parameters.pseudo: { hover: ['#id'], focusVisible: ['#id'], active: ['#id'] }` で擬似状態を強制表示

**EdgeCases に入れる候補**: `fullWidth + 長文 (折返し)` / `fullWidth + 長文 + 内側 span で truncate` / 短文 (min-width 確認) / 多言語 / icon-only モード時の長文 aria-label を視覚カタログに併記。`whitespace-nowrap` 単独などの「単なる崩れ」は入れない。

### 7-5. `.guideline.mdx` の作成 / 書き直し

[`Button.guideline.mdx`](./components/primitives/Button/Button.guideline.mdx) を雛形にコピー → 内容を差し替え。冒頭テンプレと 5 節構成は §5-4 に従う。

旧 `*.md` (legacy guideline) があれば内容を吸収した上で削除 (§7-6)。

### 7-6. 旧 `*.md` の削除

`ComponentName.md` (旧 guideline 形式) が残っていれば `git rm` で削除。`.guideline.mdx` に内容を吸収済みのはず。

### 7-7. 検証

順番に走らせる:

```sh
# 1. 型チェック (新標準で型エラーゼロを保証)
npx tsc --noEmit

# 2. Storybook 起動
npm run storybook
```

http://localhost:6006 で目視確認:

- [ ] サイドバーから旧「Docs」ノードが消え、「Guideline」が代わりに表示
- [ ] story の順序が Playground → Variants → Sizes → States → WithIcon → EdgeCases (該当節のみ)
- [ ] States story で Hover/Focus/Active が **マウス操作なしで** 強制表示されている
- [ ] Guideline ページの ArgTypes 表に props と JSDoc description が並ぶ
- [ ] DoDontExample (緑/赤バー) が表示
- [ ] a11y addon タブで violation 0

§5-5 の「完了条件チェックリスト」を全項目通ったら PR を切る。

### 7-8. PR / コミットメッセージ

- title: `refactor(<ComponentName>): 標準ストーリー構造へ移行`
- body: 監査結果と判断 (省略した節とその理由 / 新規追加した節) + 破壊的変更があれば §10 に従って CHANGELOG `[Unreleased]` に追記
- 1 PR で複数コンポーネントは触らない

### 7-9. よくある詰まりどころ

| 症状 | 原因と対処 |
|---|---|
| Guideline が Docs として表示されない / 二重に表示される | `.stories.tsx` に `tags: ['autodocs']` が残っている → 削除 |
| ArgTypes 表の Description が空欄 | `.tsx` の Props に JSDoc コメントがない / `argTypes` 側に `description` を書いて JSDoc を上書きしている → JSDoc に一元化 |
| Hover/Focus が pseudo で出ない | `parameters.pseudo` の id と story 内の `<Button id="...">` が不一致 |
| MDX で `<DoDontExample>` が `Cannot resolve module` | `@sb-blocks/*` alias が読まれていない → Storybook を再起動 (`main.ts` 変更後は必須) |
| Props 表の Default 列が消えない | sbdocs の CSS 上書きが効いていない → `.storybook/tailwind.css` の `.docblock-argstable` ルールを確認 |
| `truncate` が効かない (ellipsis 出ない) | flex 子に `min-width: 0` がない → `<ComponentName><span className="min-w-0 truncate">long text</span></ComponentName>` の inner span パターンを使う |

### 7-10. VR 集約モデルへの移行手順 (Playground / Overview / EdgeCases)

旧カタログ構造 (§7-2〜7-9 で移行したもの) を **VR 集約モデル (§5-3)** へ移す手順。**1 コンポーネント = 1 PR**、primitives → composites の順。参照実装は [`components/primitives/Button/`](./components/primitives/Button/) 一式 (先行移行済み)。

**手順 (1 コンポーネント分)**:

1. **監査**: prop 空間を把握する (variant / size / state / icon / description / loading / fullWidth など、Controls で表せる軸を洗い出す)。
2. **Playground を完全 Controls 化**: `args` を全開放し、**ReactNode prop (`icon` 等) は `argTypes` の `mapping`** (ラベル → 実要素) で選択可能にする。`control: false` を残さない (例: Button の `icon` mapping)。`chromatic.disableSnapshot: true` を付ける (VR 対象外)。play test はここ。
3. **Overview を作る (VR 対象)**: props で作れる**内在的パターンを 1 枚に凍結**する。基本構成は **variant (行) × state (列) マトリクス** + size + icon + その他 prop 別セクション。Hover/Focus/Active は `parameters.pseudo` で列ごとに id 指定して強制表示。
4. **EdgeCases を純化 (VR 対象)**: **Playground (Controls) で再現できない構造的ケースだけ**残す (inner-span `truncate` 等の特殊マークアップ / コンテナ幅依存は**固定幅**で見せる / 複数インスタンス・item 数依存の配置 / 段落内 inline 等)。**長文折返し・`fullWidth` 等 Controls で出せるものは入れない** (Playground の役目)。**非視覚 (SR 専用 aria-label 長文など) も削除** — axe (§8-4) + guideline で担保。該当ケースが無ければ EdgeCases 自体を省略。
5. **旧カタログを削除**: `Variants` / `Sizes` / `States` / `WithIcon` / `WithDescription` を削除。各 story の設計根拠 (例: size と WCAG タッチターゲット) は **guideline.mdx の Do/Don't・アクセシビリティ節に既出か確認**し、無ければ移設する (散文の方が適切)。
6. **guideline.mdx のリンク追従**: 削除した story を `?path=` で参照していないか確認 (`check:links` が CI で検出)。`<ArgTypes of={Stories.Playground} />` は維持。
7. **overlay / portal 系の特例** (Modal / Popover / Tooltip / DropdownMenu / Toast): 「開いた状態」が play 駆動 story にしか無い盲点があるため、**Overview に `open` / `defaultOpen` 直指定で開状態を静的に持たせて撮る** (トリガー裏に残さない)。`<dialog>` 系で同時に 1 つしか開けない等は、状態ごとに Overview 内のサブ snapshot か別 story で分ける。
8. **CHANGELOG**: 削除した story id を `[Unreleased]` の **⚠ BREAKING CHANGES** に明記 (Storybook URL 無効化 = silent break §10-2)。
9. **検証 → PR → accept**: `npm run verify` (check:conventions / check:links) + `npm run build-storybook` 緑。PR を出し、Chromatic (UI Tests) で Overview / EdgeCases の差分をレビュー & accept してからマージ。

**レイアウト系の注意**: `AppShell` / `TwoColumn` / `SplitPane` は **EdgeCases を `[375, 1280]`、Overview を `[1280]` のみ**で撮る (§9-4)。Overview の prop カタログ (contentMax / split / listWidth) は **cols/shell breakpoint (≥1024px) でのみ効く desktop 機能**で、mobile では全て縦積みに潰れて差が出ず重複ショットになるため。mobile↔desktop の構造切替 (サイドバー出し分け / mobileReverse / mobile で list 非表示等) は **mobile 固有挙動を持つ EdgeCases** で `[375, 1280]` 撮影して検証する。

---

## 8. アクセシビリティ前提

WCAG 2.1 の POUR 原則 (Perceivable / Operable / Understandable / Robust) に従い、**Level AA を最低目標** とする。設計判断の背景は [`design-system-strategy.md`](./design-system-strategy.md) の「設計原則」を参照。

### 8-1. 基本前提

- **フォーカスリング**: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus` を Primitive に標準装備。`outline: none` 単独は禁止 (フォーカスインジケータ削除 = WCAG 2.4.7 違反)
- **最小タッチターゲット**: 44x44px (WCAG 2.5.5 AAA)、隣接要素との間隔 8px+
- **セマンティック HTML**: `<button>` / `<a>` / `<label>` を Primitive 内で適切に使用
- **aria 属性**: 状態を持つコンポーネント (Tabs, Pagination, Switch 等) は aria-* を実装済み
- **ホバー依存禁止**: hover でしか出ない操作要素は作らない (タッチで操作不能)

### 8-2. キーボード操作とフォーカス順序

- すべてのインタラクティブ要素は **Tab / Shift+Tab / Enter / Space / Escape** で操作可能
- `tabindex` は **0 または -1 のみ**。`1` 以上は予測不能のため禁止。視覚順序と DOM 順序を一致させ tabindex で順序制御しない
- ↑↓←→ での内部移動: Tabs / Radio / Menu 等の同列要素を持つ composite で実装 (各 component States story で確認)
- ヘッダーの大きいページでは「メインコンテンツへスキップ」を `<a href="#main">` で先頭に置く

### 8-3. フォーカス管理

- **インジケータ**: 2px outline / コントラスト比 3:1+ (WCAG 2.4.11)、全 focusable で統一
- **トラップ (Modal)**: ネイティブ `<dialog>.showModal()` を使えばブラウザ標準でトラップ + Esc close + 閉じ後 trigger 復帰。自前 modal は同等の挙動を実装
- **動的コンテンツ追加時**: 追加要素に focus 移動 (例: 検索結果リスト)
- **動的コンテンツ削除時**: 削除アイテムの **論理的な次** (なければ前) に focus 移動。`<body>` 戻りを避ける
- **ページ遷移時**: 先頭または `<main>` に focus を戻す

### 8-4. a11y 自動検証 (axe) と例外の付け方

CI の **Run Storybook tests** ステップで、全 Story を [`@storybook/test-runner`](./.storybook/test-runner.ts) + axe (`axe-playwright`) により自動監査する (smoke render + play + a11y)。`npm run test-storybook` でローカル実行可 (別端末で `npm run build-storybook` → `http-server storybook-static` を起動)。

意図的に許容する違反は **必ず理由を残して** 例外化する:

- **Story 単位で axe をスキップ**: `parameters.a11y.disable = true` (理由コメント必須)
- **特定ルールのみ無効化**: `parameters.a11y.config.rules = [{ id: 'color-contrast', enabled: false }]`
- **グローバル例外** ([`.storybook/test-runner.ts`](./.storybook/test-runner.ts) に集約):
  - `Tokens/*` カテゴリは axe 対象外 (色・値の可視化であり UI ではない)
  - ページ全体前提の best-practice ルール (`region` / `landmark-unique` / `landmark-no-duplicate-*` 等) は無効 (孤立 story / 複数デモ並置のため)
  - `COLOR_CONTRAST_EXEMPT` に component 単位の color-contrast 免除を理由付きで列挙。`TODO(contrast):` 付きは**既知 finding** (token contrast 見直しで解消後にエントリ削除)

**原則**: disabled 状態の意図的低コントラストは WCAG 1.4.3 が免除するため恒久例外でよい。それ以外の違反は「直す」が既定で、例外は finding として明示し追跡する。

### 8-5. コントラスト基準 (WCAG 2 床 + APCA レンズ)

コントラストは **WCAG 2.2 AA を機械強制の床、APCA Lc を設計レンズ** とする二層方針で運用する。

- **適合基準 (床)**: WCAG 2.2 AA。テキスト 4.5:1、大きいテキスト (24px 以上、または太字 18.66px 以上) と非テキスト (UI 部品・アイコン・グラフィック) は 3:1。`check:contrast` (§5-5-1) が機械的に強制し、例外はない。
- **設計基準 (レンズ)**: APCA Lc。適合判定には使わず、(1) AA を通るペア内の読みやすさ比較、(2)「AA は通るが知覚的に不十分」の警告、(3) ダークモード設計指針、に使う。
- **条件付きペア**: 4.5:1 未満かつ 3:1 以上のペアは「条件付き合格」とし、大きいテキスト・非テキスト・装飾/ロゴ/disabled のみに使用を限定する (WCAG 2 自身の例外条項であり、基準の改変ではない)。
- **禁止**: 「APCA を満たすので AA 未満でも可」という運用 (適合は計算式で判定され、APCA に救済条項はない)。

**条件付きペアの可否 (機械可読)**:

| 区分 | 閾値 | 使用可能な場所 |
|---|---|---|
| 合格 | ≥ 4.5:1 | 全テキスト |
| 条件付き | ≥ 3:1 | heading lg 以上 / 太字 18.66px 以上 / アイコン・グラフィック・UI 境界線 / 装飾・ロゴ・disabled |
| 不合格 | < 3:1 | 使用不可 (装飾・ロゴ・disabled を除く) |

**APCA Lc 参考目標 (警告基準であり、ゲートではない)**:

| タイポトークン | APCA Lc 参考目標 |
|---|---|
| body md 以下 | Lc 75 以上 |
| body lg / heading md 以上 | Lc 60 以上 |
| caption / 補助テキスト | Lc 60 以上 (太字推奨) |
| 非テキスト | Lc 45 以上 |

**ゲートは WCAG 2 のみ**。APCA Lc は `check:contrast` のレポートに warn (exit 0) として出るだけで CI を fail させない。検証は §5-5-1 の `check:contrast`、階調設計は [Tokens/Color/Primitive guideline](?path=/docs/tokens-color-primitive--guideline) と Principles の Semantic Colors を参照。

---


## 9. 検証フローと変更時に守ること

コンポーネント / トークン変更時の標準フロー:

1. design-system 本体を編集
2. `npm run storybook` で http://localhost:6006 起動、該当コンポーネントを目視確認
3. 必要なら `npm run build` で型エラーをチェック
4. 本リポを依存として使う product 側のビルドが壊れないか確認 (本リポを `npm link` または公開済みパッケージ経由で参照)

検証用のリアルアプリは別リポジトリで管理。本リポは common (npm 化単位) のみを扱う。

**変更時に守ること**:

- semantic 色を追加したら `tokens/build/variables.css` が自動生成されることを `npm run tokens:build` で確認
- 依存している product 側のビルドが壊れないか、本リポを `npm link` または公開バージョン経由で確認
- 戦略レベルの変更 (Primitives/Composites 分類の変更、新カテゴリ追加等) は [`design-system-strategy.md`](./design-system-strategy.md) も同 PR で更新
- 破壊的変更を伴うときは §10 に従って [`CHANGELOG.md`](./CHANGELOG.md) `[Unreleased]` に追記

### 9-3. 壊れリンクチェック

`.guideline.mdx` / `.mdx` から張る Storybook 内リンク (`?path=/docs/<id>--<name>`) の参照先ページが実在するかを機械チェックする。`?path=` は型では catch されない silent break (§10-2) の典型。

- 実行: `npm run check:links` ([`scripts/check-links.mjs`](./scripts/check-links.mjs))
- 仕組み: 全 `*.stories.tsx` の `title:` と `*.mdx` の `<Meta title=... />` / `<Meta of={...} name=... />` から既知ページ ID 集合を構築し、`.mdx` 内の `?path=/docs/...` 参照を照合。未定義 ID があれば exit 1。
- CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) の `pull_request` / `push:main` で自動実行する。
- 参照先のページ (story id) を rename / 削除したら、リンク側も同 PR で追従する。

### 9-4. 視覚回帰 (Chromatic)

全 story のスクリーンショットを baseline と比較する **additive な視覚回帰層**。型・lint・axe・play では拾えない**見た目の silent break** (色相・余白の微調整、`hidden shell:block` のような breakpoint 駆動の表示崩れ等、§10-2) を検出する。test-runner (play + axe、§8-4) とは**別レイヤーで共存**し、置き換えない。

- 実行: GitHub Actions [`.github/workflows/chromatic.yml`](./.github/workflows/chromatic.yml) は **`push` ベース** (全ブランチ、tag 除く)。公式 `chromaui/action` が `npm run build-storybook` (→ `prebuild-storybook` で `tokens:build`) でビルドし撮影する。ローカルは `npm run chromatic` (要 `CHROMATIC_PROJECT_TOKEN` env)。
  - **`pull_request` イベントは使わない** (公式推奨): GitHub が作る ephemeral な merge commit 上で走り baseline の系譜を見失う (PR で before が空になる現象の原因)。push でビルドした head SHA に GitHub App が `UI Tests` status を出すので required check は機能する。
  - **`autoAcceptChanges: 'main'`**: main は baseline ブランチとして自動 accept。squash マージで git 系譜が切れても main の baseline が確定し、以降の PR が正しく比較できる。差分の人間レビューは PR 段階 (`UI Tests`) で行う前提。
- **TurboSnap** (`onlyChanged: true`): 変更 story と依存先だけ再撮影。tokens / `tokens/preset.cjs` / global CSS / `.storybook/*` を変えると全 story 再撮影 (全コンポーネントに波及するため妥当)。
- **複数 viewport はレイアウト系の EdgeCases のみ**: **AppShell / TwoColumn / SplitPane** の **EdgeCases** に `parameters.chromatic.viewports = [375, 1280]` を設定し mobile / desktop の構造切替を撮る (1280px は `shell`/`cols` breakpoint = `lg` = 1024px を超える幅)。これら 3 つの **Overview は `[1280]` のみ** — prop カタログ (contentMax / split / listWidth) は desktop 機能で mobile では縦積みに潰れて重複ショットになるため (§7-10 のレイアウト系注意)。meta に `[375,1280]` を置き Overview で `[1280]` に override すると最小記述。他 story は単一 viewport (snapshot 数を抑える)。dark / compact の `modes` は #60/#61 の実値導入後に追加 (今は設定しない)。
- **`Tokens/*` は撮影対象外**: 各 token カタログ story の meta に `parameters.chromatic.disableSnapshot = true` を付ける。§8-4 の axe 除外と同じ線引き (値の可視化であり UI ではない)。token 値の変化は利用側コンポーネントの snapshot で捕捉されるため検知漏れにはならない。
- **Playground は撮影対象外**: 全 component story の `Playground` に `parameters.chromatic.disableSnapshot = true` を付ける (Controls 探索の起点で、静的カタログ Variants/Sizes/States と冗長なため。§5-3)。
- **overlay / portal 系の開状態は #78 で対応中**: Modal / Popover / Tooltip / DropdownMenu / Toast は「開いた状態」が play 駆動 story にしか無い (Toast は未撮影)。開状態の静的 story を追加して撮るのは別 PR (#78) で進める。それまで該当 component の Playground は撮影対象に残す。
- **人間ゲート (機械的に弾く §5-5-1 とは別レイヤー)**: 視覚差分の合否は人間が Chromatic UI でレビュー & accept する。`exitZeroOnChanges: true` のため Actions の `chromatic` job は視覚差分では赤にならず、PR の required check には Chromatic の **"UI Tests"** status を使う (branch protection)。初回 baseline の accept・token 登録 (`CHROMATIC_PROJECT_TOKEN` secret) も人間が行う。
- semver: 視覚回帰の CI 追加は消費者向け契約 (§10-6) に影響せず **bump 不要**。ただし Chromatic が検出する**意図しない見た目変化**自体は visual break (§10-2) として CHANGELOG / semver の対象。

### 9-5. 適合率レポート (conformance-report)

既存検査 (`check:contrast` / `check:conventions` / `lint` / Chromatic) はすべて **pass/fail のゲート**で「規約違反が無いか」を測る。`report:conformance` ([`scripts/conformance-report.mjs`](./scripts/conformance-report.mjs)) は別レイヤーで、**token/utility がどれだけ使われているか (on-system %)** を測る **計測層**。思想は §8-5 の APCA / #58 の ΔEOK warn レンズと同じで、**ゲートではなく常に exit 0**。

- **何を測るか**: 出荷コードの **spacing/サイズ次元** の適合状況。走査範囲は ESLint と一致 (`components/**/*.tsx`、除外 `**/*.stories.tsx` と `components/tokens/**`)。対象 utility は `gap`/`p*`/`m*`/`space-*` と `w`/`h`/`min-*`/`max-*`/`size`。色は ESLint で約 100% 強制済みなので測らない。
- **主指標は「未承認 finding の絶対件数」** (比率は ~96〜99% で張り付き伸びしろが見えないため補助)。各「寸法指定」(utility 1 出現) を 4 分類:
  - **immediate** — スケール値を bracket で書いただけ (`gap-[2px]`→`gap-0.5`)。**ピクセル不変の安全置換**。**ゲート昇格の第一候補**。
  - **near-miss** — 最寄りスケール値との差が **0 < Δ ≤ ε** (既定 ε=2px、`--epsilon` で上書き)。snap すると**描画が変わる** (`mt-px` 1px→`mt-0.5` 2px)。「**修正方向」は候補であって自動修正の指示ではない** — 光学 nudge を機械的に潰さないよう「修正 or 承認」を都度判断する。
  - **off-system** — Δ > ε。該当 token 無し = **穴候補** (スケール拡張 or 設計見直しの入力)。
  - 動的値 (`calc`/`min`/`max`/`clamp`/`var`/`%`/`rem` 等) と非数値 utility (`w-full` 等) は **skip** (分母外、§8-5 の `color-mix` skip と同思想)。
- **承認例外**: 行内 or 直前行に `/* conformance-ignore: <理由> */` を置くと、その finding を**承認済み例外**として母数から外す ([`.storybook/test-runner.ts`](./.storybook/test-runner.ts) の `COLOR_CONTRAST_EXEMPT` と同じ運用)。光学的微調整 (icon の `mt-px` 整列等) を「承認された設計判断」として恒久的に黙らせる手段。**粒度は行単位** (同一行に複数 finding があると個別注釈で分離できない。要れば行を分割する) — v1 既知の制限。
- **読み方の限界**: `rem`/コンテナ幅 (`min()`/`calc()` 等) を skip するのは spacing 次元での **未測定**であり「合格」ではない。これらは layout token ([`tokens/source/layout.json`](./tokens/source/layout.json)) を見る **第 2 次元 (phase 2)** で扱う。
- **昇格運用** (#58 の warn→gate と同じ): ある次元の未承認件数が十分小さくなったら `check:*` ゲートへ昇格させ、以降は人手で見ない (§3-7 / §11「ドキュメントで守らせる < lint で弾く」)。
- **出力 / 運用**: コンソール (件数主役 + コンポーネント別) + `conformance/report.json` (機械可読)。`report.json` は **v1 では非追跡** (`.gitignore`、`generatedAt` の diff ノイズ回避) で CI artifact のみ。トレンド (履歴推移) は phase 2。**`verify` には入れない** (verify はゲートの連鎖)。

---

## 10. Semver 規約

本リポは [Semantic Versioning](https://semver.org/lang/ja/) に従い、変更は必ず [`CHANGELOG.md`](./CHANGELOG.md) に記録する。下流 product に **silent break (型では catch されない壊れ方)** を起こさないため、Tailwind class / Storybook URL / token CSS 変数の rename・削除も BREAKING として扱う。

### 10-1. MAJOR / MINOR / PATCH の判定基準

| 種別 | 例 |
|---|---|
| **MAJOR** (破壊的変更) | コンポーネント Props の型変更・rename・削除 / 既存 variant・size・color 値の削除 / semantic token の rename・削除 / Tailwind ユーティリティ class の rename・削除 (silent break) / コンポーネントの path 移動 (`primitives/` ↔ `composites/`) / Storybook story id の rename (URL リンク壊れ、silent break) / primary token の色相変更 (visual break、silent) |
| **MINOR** (後方互換ある追加) | 新コンポーネント追加 / 既存コンポーネントに optional prop / 新 variant・size・color の追加 / 新 semantic token / 新 Tailwind ユーティリティ |
| **PATCH** (修正・互換維持) | バグ修正 / a11y 修正で見た目同等 / 内部実装の refactor / Storybook story の追加・節内補強 (story id は維持) / docs/guideline 修正 |

### 10-2. silent break 警告

下記は **型で catch されない** ため、利用箇所を grep で機械的に洗い出せない:

- Tailwind utility class (`text-onSurface-xxx` 等) — 文字列扱いのため TS は通る
- 出荷 CSS クラス名 (`dist/styles.css` の `.bg-surface-primary` 等、A2 #57 で公開された配信面) — 消費側が import する静的 CSS のセレクタ。rename・削除は BREAKING (配信契約、§10-6 (c))
- CSS 変数 (`var(--color-xxx)`) — CSS 内・style 属性
- 出荷する `data-*` 属性名 (`data-state="open"` / `data-loading` 等、スタイリング3規律 2) — 消費側が属性セレクタで上書きしうる DOM 契約。rename・値変更は BREAKING
- Storybook URL (`?path=/story/...--xxx`) — 外部ドキュメント・Slack 等に貼られる
- visual change (色相・余白の微調整) — テストではほぼ拾えない

これらに該当する変更は、コミット時点で [`CHANGELOG.md`](./CHANGELOG.md) の **⚠ BREAKING CHANGES** に明記し、可能なら Migration notes に **置換用 sed コマンド or codemod 例** を添える。

### 10-3. CHANGELOG 更新手順

1. PR 単位で `[Unreleased]` セクションに追記 (`Added` / `Changed` / `Removed` / `Fixed` / `⚠ BREAKING CHANGES` のいずれかに振り分け)
2. リリース確定時、`[Unreleased]` の各エントリを **1〜2 文 + 参照リンク** に圧縮してからバージョン節へ移動する (詳細な経緯は PR / commit が SSoT。CHANGELOG には要点のみ残し、肥大化を防ぐ)
3. `[Unreleased]` を `[x.y.z] - YYYY-MM-DD` に確定、`package.json` の `version` も同期
4. 末尾のリンク参照を更新

### 10-4. 0.x 期の運用

`0.x` の間は破壊的変更を MINOR (0.y bump) に含めて差し支えないが、CHANGELOG の **⚠ BREAKING CHANGES** には必ず明記する。1.0.0 以降は厳密に MAJOR bump とする。

### 10-5. 非推奨ライフサイクルと窓 (#63)

エンタープライズ/長寿命採用に向けた安定性のコミット。利用者向けの公開要約は [`SUPPORT.md`](./SUPPORT.md)、本節が SSoT。

- **状態**: `experimental → stable → deprecated → removed`。
  - `experimental` = 予告なく変更可 (opt-in 認識、semver 保護外) / `stable` = 完全 semver 保護、**予告なく消さない** / `deprecated` = 動くが代替あり / `removed` = **MAJOR でのみ**。
- **削除の窓 (消費者の移行時間で決める)**: 非推奨は**公開から ≥3 ヶ月経過した最初の MAJOR**で削除する。「削除は MAJOR のみ」と「≥3 ヶ月の暦の予告」を両立 (次の MAJOR が早すぎたら時間床を満たす次の MAJOR まで待つ)。
  - 窓は**リリースサイクル数でなく暦時間**で測る (MAJOR が速く出るほどサイクル基準だと暦の窓が縮み、目的と逆になる)。
  - **M = 3 ヶ月** (気づく→自分のサイクルに組む→走らせる の計画レイテンシ。保守的・大規模採用者向けは 6 ヶ月)。
- **信号 (3 点セット必須)**: dev 限定 `console.warn` ([`components/_internal/deprecate.ts`](./components/_internal/deprecate.ts)、本番 no-op・warn-once) + `@deprecated` JSDoc + CHANGELOG。
- **非推奨ごとに codemod / 移行手順を必須**にする (短い窓を正当化しているのはこれ。codemod 無しなら窓を伸ばす)。

### 10-6. 3 つの versioned 契約 (#63)

DS は独立した 3 つの互換面を持ち、**どれか一つでも壊れたら package は MAJOR**。§10-1 の各破壊面はこの 3 契約のいずれかに属する。

- **(a) コンポーネント / props API**: props の型・rename・削除、variant/size/color 値の削除、`primitives/` ↔ `composites/` の path 移動、Storybook story id の rename。
- **(b) テーマトークン契約**: themeable な semantic トークンの集合 ([`tokens/theme-contract.json`](./tokens/theme-contract.json)、層定義は §3 / #59)。**必須層**トークンの追加・rename・削除 = 全テーマ作者への破壊 = **MAJOR**、**任意層**の追加 = 既定継承で後方互換 = **MINOR**。成長は任意層で、必須層は小さく安定に保つ。
- **(c) CSS + DOM 配信契約**: 出荷 CSS クラス名 (`dist/styles.css`)・`data-*` 属性・DOM 構造・CSS 変数名 (#56 / #57)。いずれも型では catch されない silent break (§10-2)。

> A2 (#57) 後は「Tailwind utility が silent break 源」という面が消える代わりに、出荷 CSS クラス名・CSS 変数名 (=テーマ契約)・data 属性・DOM 構造がその源になる。

---

## 11. 規約更新の運用 (指摘の還元)

レビュー指摘を「直して終わり」にせず、本ファイル (AGENTS.md) に還元するループを回す。**目標は「同じ指摘を二度しない」**。PR テンプレ ([`.github/pull_request_template.md`](./.github/pull_request_template.md)) の「規約への還元」と対応する。

1. **指摘を分類する**: 適合性 (規約違反。本来 lint・CI で機械的に弾けるべき) か、判断 (設計 / 命名 / UX。人間レビュー固有) か。前者は `review:conformance`、後者は `review:judgement` ラベルで計測する
2. **規約化を判断する**: 適合性指摘は
   - **機械化できる** → §3-7 の lint ルールや CI (§5-5-1) に追加し、二度と人手で見ない
   - **機械化しづらい** → 該当セクション (§2 配置 / §5 実装 / §8 a11y 等) に 1 行で明文化する
3. **§番号へ追記し、PR で記録する**: 追記した § を PR テンプレの「更新済み (§___)」にチェック。判断指摘 (UX/命名) は規約化せず、§5-5-2 の人間レビュー観点として蓄積する

> 「ドキュメントで守らせる < lint で弾く」(§3-7)。規約化の第一候補は常に機械強制できないかの検討から始める。

### 11-1. コマンドの鮮度管理

`.claude/commands/` の常設コマンドは **evergreen なもの (恒常的に有効) のみ** とする。特定フェーズ・外部 Issue 紐付きのワンショットコマンドは、フェーズ完了時に `.claude/commands/archive/` へ移動して常設群から外す (鮮度低下の防止)。
