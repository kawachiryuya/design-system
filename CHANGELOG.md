# Changelog

本プロジェクトの主要な変更点を記載する。フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠し、バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) に従う。

判定基準は [AGENTS.md §11 Semver 規約](./AGENTS.md#11-semver-規約) を参照。

## [Unreleased]

### ⚠ BREAKING CHANGES

- **Badge の Storybook story id 変更** (silent break): 旧 5 story (Default / AllVariants / AllAppearances / AllSizes / WithDot / LongLabel / StatusBadges) を新標準節 (Playground / Variants / Sizes / EdgeCases) に集約。`?path=/story/primitives-badge--default` 等の旧 URL は壊れる。新 id は `--playground` / `--variants` / `--sizes` / `--edge-cases`
- **`typography-semantic.heading.xs` / `heading.2xs` 削除** (silent break): Tailwind utility `text-heading-xs` / `text-heading-2xs` が生成されなくなる。Typography コンポーネントは v0.3 で h5/h6 を削除済 (h4 までに統一) で、これらのセマンティック token は orphan として残っていた。下流で直接 utility を使っていた場合は `text-heading-sm` (h4 相当) に置換: `sed -i 's/text-heading-xs/text-heading-sm/g; s/text-heading-2xs/text-heading-sm/g' src/**/*.tsx`
- **Storybook の Tokens 系 story id 変更** (silent break): カテゴリ → レイヤの入れ子構造に再編した。旧 URL は壊れる:
  - `tokens-colors--*` → `tokens-color-primitive--*` (旧 `Semantic` sub-story は削除、新規 `tokens-color-semantic--{surface,text,border,state}` に分離)
  - `tokens-spacing--*` → `tokens-spacing-primitive--*` (旧 `Semantic` sub-story は削除、新規 `tokens-spacing-semantic--{component,section}` に分離)
  - `tokens-typography--*` → `tokens-typography-primitive--*` (新規 `tokens-typography-semantic--{headings,body,label-and-caption}` 追加)
  - Radius / Shadows / Animation は variant なしで変更なし
- **未使用トークンを一括削除** (silent break): grep audit (2026-06-05 セッション) で本リポ内 / semantic 経由いずれも参照されない真の orphan を整理。下流が直接 utility class を使っていた場合は壊れる:
  - `spacing.56` (224px) — `p-56` / `m-56` / `gap-56` 等の utility 消失
  - `spacing-semantic` 全エントリ (`component.{sm,md,lg}` / `section.{sm,md,lg}`) — `gap-component-md` 等の utility 消失、`tokens/preset.cjs` の `extend.spacing` も削除、`Tokens/Spacing/Semantic` story も削除 (`?path=/story/tokens-spacing-semantic--*` URL は壊れる)。これに伴い Spacing が flat 構造に戻り、`Tokens/Spacing/Primitive` → **`Tokens/Spacing`** に story title も再変更 (Radius / Shadows / Animation と同じく semantic 層なしカテゴリの構造)。URL は `?path=/story/tokens-spacing-primitive--scale` → `?path=/story/tokens-spacing--scale`
  - `typography.font-size.6xl` (60px) — `text-6xl` 消失
  - `typography.font-weight.light` (300) — `font-light` 消失
  - `typography.line-height.loose` (2) — `leading-loose` 消失
  - `typography.font-family.serif` — `font-serif` 消失 (mono / sans は維持)
- **`rounded` / `shadow` (bare) の挙動変更** (silent break): `tokens/preset.cjs` で `borderRadius` / `boxShadow` に `DEFAULT: md` エイリアスを追加。これまで Tailwind 設定上 DEFAULT が無く **bare 形は CSS が生成されず 0 / no-shadow で描画されていた** (= 実質 broken) が、本変更で `rounded` ≒ `rounded-md` (8px)、`shadow` ≒ `shadow-md` (中強度) と解決されるようになる。下流で `rounded` / `shadow` を bare で書いていた箇所は意図と異なる見栄え (角丸 8px, 中強度の影) になる可能性があるので、必要に応じて `rounded-sm` / `shadow-sm` 等の明示 class に書き換えるか、`rounded-none` / `shadow-none` で 0 化する
- **`radius` トークン再編** (silent break): スケールを `none / xs / sm / md / lg / full` (6 段) → `none / sm / md / lg / full` (5 段) に整理し、中核を `sm / md / lg` に揃えた (`md = default` 規約と整合)。**ラベルを 1 段上にシフト** (旧 xs の値が新 sm に、旧 sm が新 md に、旧 md が新 lg に)、旧 lg (16px) は削除:
  - `radius.xs` 削除 → `rounded-xs` utility 消失
  - `radius.sm`: 旧 8px → **4px** (旧 xs の値が繰り上がる)
  - `radius.md`: 旧 12px → **8px** (旧 sm の値が繰り上がる、`md = default` の標準値)
  - `radius.lg`: 旧 16px → **12px** (旧 md の値が繰り上がる)
  - `radius.full`: 9999px (不変)
  - 影響: `rounded-xs` の callsite は `rounded-sm` に置換 (本リポ内 17 ファイル sed 済、値は 4px で等価)。**ただし `rounded-sm` / `rounded-md` / `rounded-lg` の callsite はそのままで値だけ小さくなる** (sm: 8px→4px / md: 12px→8px / lg: 16px→12px)。下流の見栄え調整は follow-up
- **コンポーネント `size` prop の命名統一** (API breaking): `small / medium / large` 流派の Component (Input / Label / Button / Badge / SearchBar / Radio / Checkbox / Switch / SegmentedControl / NumberInput / Select) を **`sm / md / lg`** に一括 rename。Radius / Shadow が `sm / md / lg` に揃ったのに合わせ、`<Button size="md">` / `rounded-md` / `shadow-md` / `text-md` が同じ `md` で並ぶ整合性を取った。Badge / SegmentedControl / NumberInput は元から 2 段なので `sm / md`。Link / Icon / Spinner / Avatar / Pagination / ProgressBar / EmptyState / Modal は元から `sm/md/lg` 流派で変更なし。**下流の callsite 修正**: `sed -i '' -e 's/size="small"/size="sm"/g; s/size="medium"/size="md"/g; s/size="large"/size="lg"/g' src/**/*.tsx` で機械置換可能。型レベルで TS が catch するため、置換漏れはコンパイルエラーで検出される
- **`Button` の Radius が size 連動に変更** (silent break): 従来は `sm → rounded-sm` / `md → rounded-sm` / `lg → rounded-md` のように md と lg だけ別の段数を当てていたが、命名統一に合わせて **`sm → rounded-sm` / `md → rounded-md` / `lg → rounded-lg`** の 1:1 マッピングに整理。視覚的には `md` Button の角丸が 4px → 8px、`lg` Button の角丸が 8px → 12px に増える (size に合わせて角丸も大きくなる、自然な関係に)。`sm` Button は不変
- **`shadow` トークン再編** (silent break): スケールを `none / xs / sm / md / lg / xl / 2xl` (7 段) → `none / sm / md / lg` (4 段) に整理し、中核を `sm / md / lg` に揃えた (`md = default` 規約と整合)。値も全体的に **より subtle 寄りに再定義** (Tailwind デフォルトに寄せた):
  - `shadow.xs` / `shadow.xl` / `shadow.2xl` 削除 → 同名 utility 消失
  - `shadow.sm`: `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` (subtle base、Tailwind の `shadow` 既定値)
  - `shadow.md`: `0 2px 4px -1px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.06)` (中強度、dropdown / card)
  - `shadow.lg`: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` (旧 `md` 相当、modal / popover)
  - 影響: `shadow-xs` の callsite は `shadow-sm` に置換 (本リポ内 1 ファイル sed 済、視覚的にはやや強い側に変化)。`shadow-xl` / `shadow-2xl` の callsite (本リポ内なし) は `shadow-lg` で代替するか PJ 側 extend。**既存 `shadow-sm` / `shadow-md` / `shadow-lg` の callsite は値だけ全体的に弱くなる** (旧スケールが強すぎたため意図された調整)

### Added

- **新規 token カテゴリ 3 種** (semantic-only): `z-index` (7 layer: dropdown/sticky/overlay/modal/popover/toast/tooltip)、`opacity` (4 値: disabled/muted/spinner-track/spinner-spin)、`focus-ring` (width/offset 2px)。それぞれ [`tokens/source/z-index.json`](./tokens/source/z-index.json) / [`opacity.json`](./tokens/source/opacity.json) / [`focus-ring.json`](./tokens/source/focus-ring.json) を新設し、`tokens/preset.cjs` で Tailwind の `zIndex` / `opacity` / `ringWidth` / `ringOffsetWidth` に extend。`z-modal` / `opacity-disabled` / `ring-focus ring-offset-focus` の utility が利用可能に。Storybook 新規 story 3 本 (`Tokens/Z-Index` / `Tokens/Opacity` / `Tokens/Focus Ring`) を追加し、Overview の category 表からも辿れるよう更新。AGENTS.md §3-4 に semantic-only スケールの規約を明文化。**callsite 一括移行**: `opacity-50` → `opacity-disabled` (12 ファイル)、`opacity-25/75` → `opacity-spinner-track/spin` (Spinner / Button)、`opacity-70` → `opacity-muted` (Link)、`ring-2` → `ring-focus` (22 ファイル)、`ring-offset-1` / `ring-offset-2` → `ring-offset-focus` (10 ファイル、offset 値を 2px に統一)。`ring-offset-1` だった箇所 (Tabs/Radio/Pagination/Alert/Checkbox/Link/Breadcrumb) は **視覚的に 1px → 2px に拡大** (a11y プラス、規約統一)
- [`Badge.guideline.mdx`](./components/primitives/Badge/Badge.guideline.mdx) — `<Meta of={...} name="Guideline" />` で Docs を兼ねる新規ファイル。GuidelineToc + ArgTypes + DoDontExample 5 ペア + 別コンポーネント表 + a11y セクション
- [`components/tokens/Overview.mdx`](./components/tokens/Overview.mdx) — Tokens の 2 層構造 (Primitive / Semantic) と使い分けを説明する新規 landing page、カテゴリ別の story 一覧へのリンク + AGENTS.md §3 参照
- `color.primary.25` (#F5F7F5) — primary palette を 10 → 11 段に拡張。bg.default 専用の最薄 tint で、下流 product が brand 色を override すると bg もそれに連動して追従する設計 (M1)。Tailwind utility `bg-primary-25` / CSS 変数 `--color-primary-25` が新規に生成される
- [`components/tokens/Breakpoints.stories.tsx`](./components/tokens/Breakpoints.stories.tsx) — 新規 Storybook story (`Tokens/Breakpoints`)。Tailwind 標準と同じ 5 段階 (sm/md/lg/xl/2xl) を視覚バーで表示 + mobile-first 規約 + 本リポ内の利用状況 (`sm:` のみ使用) を明文化。Overview の category 表からも参照できるよう更新
- [`components/tokens/SemanticColors.stories.tsx`](./components/tokens/SemanticColors.stories.tsx) — semantic-colors.json の bg / surface / on / border / state を視覚カタログ化 (4 sub-story、card-based、Tailwind class + source 参照 + description を併記)
- [`components/tokens/SemanticTypography.stories.tsx`](./components/tokens/SemanticTypography.stories.tsx) — typography-semantic の heading / body / label / caption を実テキストサンプルで視覚化
- [`components/tokens/SemanticSpacing.stories.tsx`](./components/tokens/SemanticSpacing.stories.tsx) — spacing-semantic の component / section をバー幅で視覚化

### Changed

- Badge.tsx を [`tailwind-variants`](https://www.tailwind-variants.org/) ベースに refactor。6 variant × 3 appearance の 18 組合せを `compoundVariants` で宣言的に保持。スタイル指定の重複を解消
- Badge.stories.tsx を標準ストーリー構造 (Playground / Variants / Sizes / EdgeCases) に再構成。`tags: ['autodocs']` 削除、`argTypes` の description を JSDoc に集約、play test で `<span>` レンダリングを検証。States / WithIcon は省略 (Badge は非 interactive で状態なし / icon prop なし)
- Badge.tsx の JSDoc 表記を "Atomic Design: Atom" → "Primitive: 単一 `<span>` 装飾、状態なし" に修正
- [`AGENTS.md`](./AGENTS.md) を再構成 — §5 (旧「新規追加時の規約」147 行) と §10 (旧「既存移行手順」148 行) で重複していた **規約本体 (4 ファイル構成 / 標準 7 節 / Guideline 5 節 / DoDontExample / 完了条件)** を §5「コンポーネント実装規約 (新規・既存共通)」に集約し SSoT 化。§6 (新規追加) / §7 (既存移行) は §5 への delta + 手順だけに薄くした。旧 §7 検証フロー + §8 変更時に守ること は §10 に統合。`States` 節の必須要件を「状態を持つ component で必須、非 interactive (Badge / Skeleton / Spinner / Divider / VisuallyHidden) は省略可」と明文化 (既成事実だった運用を規約化)。外部参照は §3 (`Badge.tsx`) と §11 (`CHANGELOG.md`) のみで、両者とも番号変わらず無影響
- [`AGENTS.md`](./AGENTS.md) §3 に **「semantic token を定義するときの規約」** を新設。3-1 必ず primitive 参照 (生 hex 禁止) / 3-2 透過オーバーレイは `color-mix()` で primitive と連動 / 3-3 `primary.25` は `bg.default` 専用 — の 3 ルールを明文化 (今回の M1 / H2 / primary.25 新設で固めた規約の SSoT 化)
- [`AGENTS.md`](./AGENTS.md) §3 に **「サイズスケール内の `md = default` 規約」** を新設。`radius` / `shadow` のように size label 持つカテゴリは preset 側で `DEFAULT: md` をエイリアス宣言する設計方針を明文化。`font-size` の `base` 維持 (Tailwind 慣習) など非対象も列挙
- `bg.default` の値定義を 生 hex `#F5F7F5` から `{color.primary.25}` への参照に変更 (M1)。値は不変、構造のみ統一 (semantic は全 primitive 経由になる)
- `Tokens/Color/Primitive` story を **shade 数を palette ごとに動的取得** するよう改修 — Primary (11 shade) と他 (10 shade) の混在に対応
- `state.hover-on-primary` / `state.active-on-primary` / `state.hover-on-error` / `state.active-on-error` を **ハードコード rgba から CSS `color-mix()` + primitive 参照に変更** (H2)。`color-mix(in srgb, {color.primary.700} 8%, transparent)` のような value にすることで Style Dictionary が build 時に primitive を展開し、`primary.700` / `error.600` を変更すれば次の build で自動連動 (silent link 解消)。視覚出力は等価 (RGB 値 + 同じ alpha)。**ブラウザ要件**: `color-mix()` 対応で Safari 16.4+ / Chrome 111+ / Firefox 113+ (2023 春以降) が必要

### Removed

- 旧 `components/primitives/Badge/Badge.md` — 内容は `.guideline.mdx` に統合済み
- `tokens/source/typography.json` の `typography-semantic.heading.xs` / `heading.2xs` エントリ削除 — Typography から h5/h6 を削除した v0.3 以降 orphan だった (上記 BREAKING CHANGES 参照)

## [0.4.0] - 2026-06-04

Primitive / Composite の判定基準を「単一 HTML 要素 + 状態なし」の **2 軸厳密化** (Option A) に切り替えた。これに合わせて Badge を `composites/` → `primitives/` に再配置。前回計画時 (memory 上) は 5 components 移動予定だったが、Switch / Checkbox / Radio は `<Label>` 内包・Group state あり、ProgressBar は label+track+fill の複数構造を持つため、新定義に厳密に従い **Badge のみ移動** した。

### ⚠ BREAKING CHANGES

- **Badge の path 移動** (TS catch): `components/composites/Badge` → [`components/primitives/Badge`](./components/primitives/Badge)。サブパス import (`@kawachiryuya/design-system/components/composites/Badge`) を直接使っていると import エラー。バレル export ([`components/index.ts`](./components/index.ts)) 経由なら無変更で動作
- **Badge の Storybook story id 変更** (silent break): `composites-badge--*` → `primitives-badge--*`。サイドバー上のカテゴリも `Composites/Badge` → `Primitives/Badge` に移動。`?path=/story/composites-badge--*` 形式の URL リンクは壊れる

### Changed

- [`AGENTS.md`](./AGENTS.md) §2 — Primitive/Composite 判定を **2 軸厳密化**:
  - Primitive: **単一の HTML 要素装飾 + 状態管理なし**
  - Composite: 複数構造 / 状態管理 / 振る舞い (focus trap / portal / animation 等) のいずれか
  - 判定の具体例表を追加 (Badge=Primitive、Switch/Checkbox/Radio/ProgressBar=Composite の根拠を明記)
- [`components/Introduction.mdx`](./components/Introduction.mdx) — Primitives 12 → 13 / Composites 21 → 20 にカウント更新
- [`components/index.ts`](./components/index.ts) — Primitives セクションに Badge を移動

### Migration notes

#### Badge のサブパス import

```sh
# サブパスを直接 import している場合
# macOS (BSD sed)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" -not -path "./dist/*" \
  -exec sed -i '' "s|components/composites/Badge|components/primitives/Badge|g" {} +

# Linux (GNU sed)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" -not -path "./dist/*" \
  -exec sed -i "s|components/composites/Badge|components/primitives/Badge|g" {} +
```

バレル export 経由 (`import { Badge } from '@kawachiryuya/design-system/components'`) なら **無変更**。

#### Badge の Storybook URL

旧:
```
?path=/story/composites-badge--default
?path=/docs/composites-badge--guideline
```

新:
```
?path=/story/primitives-badge--default
?path=/docs/primitives-badge--guideline
```

外部ドキュメント・Slack 等に貼った URL を貼り直すこと。

---

## [0.3.0] - 2026-06-04

本リリースは **Primitives 全 12 個の標準ストーリー構造への移行** をまとめた累積版。0.2.0 → 0.3.0 の間にトークン体系・Typography API・Storybook story id にまたがる **silent break を含む破壊的変更** を複数含むため、下流 product では下記 [Migration notes](#migration-notes) を一読すること。

### ⚠ BREAKING CHANGES

#### トークン

- **`--color-on-subtle` を削除** (silent break)。Tailwind class `text-onSurface-subtle` を使っていると無音で壊れる。`text-onSurface-muted` に置換すること。理由: `#a3a3a3` が白背景で 2.52:1 と WCAG AA (4.5:1) を満たさず、概念的にも `muted` と差別化困難。リポ内 11 ファイルは作業時に一括置換済 ([a7178fb](https://github.com/kawachiryuya/design-system/commit/a7178fb))
- **primary 系 6 token の色相変更** (silent break / visual)。`primary.600 (#008965)` → `primary.700 (#006f50)`。白背景でのコントラスト比が 4.41:1 → 6.19:1 に上がり WCAG 1.4.3 AA を達成。影響トークン: `surface.primary` / `on.primary` / `border.focus` / `border.primary` / `state.hover-on-primary` / `state.active-on-primary` ([8e61448](https://github.com/kawachiryuya/design-system/commit/8e61448))

#### Typography API

- **`variant`: `h5` / `h6` を削除** (TS で catch)。`<Typography variant="h5">` 等は型エラーになる。`as="h5" variant="h4"` のようにタグだけ維持して見た目を流用 ([fe86ee3](https://github.com/kawachiryuya/design-system/commit/fe86ee3))
- **`color`: `subtle` を削除** (TS で catch)。`<Typography color="subtle">` は型エラー。`color="muted"` に置換 ([fe86ee3](https://github.com/kawachiryuya/design-system/commit/fe86ee3))

#### Storybook story id

- **Primitive 全 12 個の story id を変更** (silent break)。標準ストーリー構造 (Playground / Variants / Sizes / States / WithIcon / EdgeCases) に乗せ替えたため、`?path=/story/components-primitives-button--default` 形式の旧 URL は 404 / fallback になる。対象: Button / Link / Icon / Typography / Label / Spinner / Divider / Skeleton / VisuallyHidden / Image / Input / Textarea。サイドバーから新 id を確認のうえ再生成すること

### Changed

- Primitive 全 12 個を **`tailwind-variants` ベース** の styling に統一 (旧: 配列・object literal による条件分岐)
- Primitive 全 12 個の Storybook を **標準 7 節構造** (Docs/Playground/Variants/Sizes/States/WithIcon/EdgeCases) に統一 (該当しない節は省略しつつ順序固定)
- 各 Primitive の `.guideline.mdx` を **autodocs の Docs ページを兼ねる形** に再構成 (`<Meta of={...} name="Guideline" />`)
- Input / Textarea の focus を **`focus-visible` 化** して States story 干渉を解消 ([2c964d9](https://github.com/kawachiryuya/design-system/commit/2c964d9))
- Link の hover 領域確保のため `px-1 py-0.5` を base に追加。aria 領域・タッチターゲットへの影響軽微

### Added

- [`AGENTS.md`](./AGENTS.md) §10 — 既存コンポーネントの標準ストーリー移行手順 (Button を雛形にした段階手順)
- [`AGENTS.md`](./AGENTS.md) §11 — Semver 規約 (本リリースで追加)
- 本 `CHANGELOG.md`
- Icon の iconRegistry を Library story として独立
- `.storybook/blocks/` に Caption helper を切り出し (Story 間共有)

### Removed

- 旧 `*.md` 形式の Guideline (各 Primitive で `.guideline.mdx` に統合済)
- Typography の `variant="h5" | "h6"` および `color="subtle"`
- Semantic token `on.subtle` および Tailwind ユーティリティ `text-onSurface-subtle`

---

## Migration notes

### 1. `text-onSurface-subtle` Tailwind class → `text-onSurface-muted`

下流 repo のルートで実行:

```sh
# macOS (BSD sed)
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.mdx" -o -name "*.html" -o -name "*.css" \) \
  -not -path "./node_modules/*" -not -path "./dist/*" -not -path "./.next/*" \
  -exec sed -i '' 's/text-onSurface-subtle/text-onSurface-muted/g' {} +

# Linux (GNU sed)
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.mdx" -o -name "*.html" -o -name "*.css" \) \
  -not -path "./node_modules/*" -not -path "./dist/*" -not -path "./.next/*" \
  -exec sed -i 's/text-onSurface-subtle/text-onSurface-muted/g' {} +
```

### 2. Typography `variant="h5" | "h6"`

```tsx
// Before
<Typography variant="h5">セクションタイトル</Typography>

// After — タグだけ h5 を維持し、見た目は h4 を流用
<Typography as="h5" variant="h4">セクションタイトル</Typography>
```

### 3. Typography `color="subtle"`

```tsx
// Before
<Typography color="subtle">補足テキスト</Typography>

// After
<Typography color="muted">補足テキスト</Typography>
```

### 4. primary 色変更 (`#008965` → `#006f50`)

視覚的な変更のみで API 互換。primary 色味が暗くなる。

- 通常はそのまま AA 適合の新色に切り替え推奨
- ブランドカラーを固定したい場合は、下流 PJ 側の `tailwind.config.js` で primary scale を override:

```js
// tailwind.config.js
const dsPreset = require('@kawachiryuya/design-system/tokens/preset');

module.exports = {
  presets: [dsPreset],
  theme: {
    extend: {
      colors: {
        primary: {
          // 旧 primary.600 相当をブランド固定として残す例
          700: '#008965',
        },
      },
    },
  },
};
```

### 5. Storybook URL

旧 story id 形式 (例):

```
?path=/story/components-primitives-button--default
```

新 story id 形式:

```
?path=/docs/components-primitives-button--guideline  // Guideline ページ
?path=/story/components-primitives-button--playground
?path=/story/components-primitives-button--variants
```

Storybook サイドバーから新 id を確認のうえ、外部ドキュメント・Slack 等に貼った URL を貼り直すこと。

---

## [0.2.0] - リリース日不明

CHANGELOG 整備前のバージョン。詳細は git log を参照。

[Unreleased]: https://github.com/kawachiryuya/design-system/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/kawachiryuya/design-system/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kawachiryuya/design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kawachiryuya/design-system/releases/tag/v0.2.0
