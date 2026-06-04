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

### Added

- [`Badge.guideline.mdx`](./components/primitives/Badge/Badge.guideline.mdx) — `<Meta of={...} name="Guideline" />` で Docs を兼ねる新規ファイル。GuidelineToc + ArgTypes + DoDontExample 5 ペア + 別コンポーネント表 + a11y セクション
- [`components/tokens/Overview.mdx`](./components/tokens/Overview.mdx) — Tokens の 2 層構造 (Primitive / Semantic) と使い分けを説明する新規 landing page、カテゴリ別の story 一覧へのリンク + AGENTS.md §3 参照
- [`components/tokens/SemanticColors.stories.tsx`](./components/tokens/SemanticColors.stories.tsx) — semantic-colors.json の bg / surface / on / border / state を視覚カタログ化 (4 sub-story、card-based、Tailwind class + source 参照 + description を併記)
- [`components/tokens/SemanticTypography.stories.tsx`](./components/tokens/SemanticTypography.stories.tsx) — typography-semantic の heading / body / label / caption を実テキストサンプルで視覚化
- [`components/tokens/SemanticSpacing.stories.tsx`](./components/tokens/SemanticSpacing.stories.tsx) — spacing-semantic の component / section をバー幅で視覚化

### Changed

- Badge.tsx を [`tailwind-variants`](https://www.tailwind-variants.org/) ベースに refactor。6 variant × 3 appearance の 18 組合せを `compoundVariants` で宣言的に保持。スタイル指定の重複を解消
- Badge.stories.tsx を標準ストーリー構造 (Playground / Variants / Sizes / EdgeCases) に再構成。`tags: ['autodocs']` 削除、`argTypes` の description を JSDoc に集約、play test で `<span>` レンダリングを検証。States / WithIcon は省略 (Badge は非 interactive で状態なし / icon prop なし)
- Badge.tsx の JSDoc 表記を "Atomic Design: Atom" → "Primitive: 単一 `<span>` 装飾、状態なし" に修正
- [`AGENTS.md`](./AGENTS.md) を再構成 — §5 (旧「新規追加時の規約」147 行) と §10 (旧「既存移行手順」148 行) で重複していた **規約本体 (4 ファイル構成 / 標準 7 節 / Guideline 5 節 / DoDontExample / 完了条件)** を §5「コンポーネント実装規約 (新規・既存共通)」に集約し SSoT 化。§6 (新規追加) / §7 (既存移行) は §5 への delta + 手順だけに薄くした。旧 §7 検証フロー + §8 変更時に守ること は §10 に統合。`States` 節の必須要件を「状態を持つ component で必須、非 interactive (Badge / Skeleton / Spinner / Divider / VisuallyHidden) は省略可」と明文化 (既成事実だった運用を規約化)。外部参照は §3 (`Badge.tsx`) と §11 (`CHANGELOG.md`) のみで、両者とも番号変わらず無影響

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
