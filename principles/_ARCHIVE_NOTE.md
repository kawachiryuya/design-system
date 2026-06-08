# principles/ 凍結ノート

**凍結日**: 2026-06-08
**凍結バージョン**: v0.4.x (Phase 2 Composites 移行中)

## 凍結理由

principles/ は実装と乖離していた。全 59 ファイルのうち約半数が 2026-05-31 以降更新停滞で、AGENTS.md / CHANGELOG.md / design-system-strategy.md / `components/*/.guideline.mdx` と**二重管理状態**になっていた。新規ルール (e.g. 2026-06 の Composites 移行で発生した API 変更) は AGENTS.md と CHANGELOG.md にしか書かれず、principles/ は古い情報のままだった。

二重管理を維持するコストが大きく、かつ AGENTS.md + `.guideline.mdx` の組み合わせで現行ルールはすべて表現できることが分かったため、**principles/ を凍結 (=以降書き換えない)** する判断とした。

## 凍結後の SSoT (Single Source of Truth)

| 用途 | 場所 |
| --- | --- |
| AI Agent 向け実装規約 | [AGENTS.md](../AGENTS.md) |
| 戦略・コンポーネント分類の背景 | [design-system-strategy.md](../design-system-strategy.md) |
| 変更履歴 / Breaking change governance | [CHANGELOG.md](../CHANGELOG.md) (§11 + `[Unreleased]`) |
| 各 token / コンポーネントの仕様・利用ガイド | `components/tokens/*.guideline.mdx` / `components/{primitives,composites}/*/*.guideline.mdx` |

principles/ にアクセスする必要が出たら、**このノートで代替参照先を見つけてそちらを参照する**。

## 分類サマリ

| 分類 | ファイル数 | 説明 |
| --- | --- | --- |
| (a) 削除候補 | 13 | 既に AGENTS.md / strategy / token guideline で十分カバー済み、principles/ 固有情報なし |
| (b) コンポーネント `.guideline.mdx` に統合候補 | 34 | コンポーネント固有の話、対応する `.guideline.mdx` で扱うべき内容 |
| (c) design-system-strategy.md に吸収候補 | 12 | 戦略的背景・設計哲学の文脈、strategy 文書に置くべき内容 |
| **合計** | **59** | |

## 各ファイルの代替参照先

### (a) 削除候補 — 既出につき principles/ 不要

| ファイル | 代替参照先 |
| --- | --- |
| README.mdx | [AGENTS.md](../AGENTS.md) §1〜2 + [design-system-strategy.md](../design-system-strategy.md) |
| Color/overview.mdx | `components/tokens/SemanticColors.guideline.mdx` |
| Color/brand-colors.mdx | `components/tokens/Colors.guideline.mdx` + strategy §4 |
| Color/palette.mdx | `components/tokens/Colors.guideline.mdx` (Token Catalog で視覚化済) |
| Color/semantic-colors.mdx | `components/tokens/SemanticColors.guideline.mdx` |
| Color/neutral-colors.mdx | `components/tokens/Colors.guideline.mdx` |
| Foundation/accessibility/testing.mdx | AGENTS.md (将来 testing/QA セクションが追加されたら吸収) |
| Patterns/atomic-design-implementation.mdx | AGENTS.md §2 + strategy §コンポーネント分類 |
| Patterns/storybook-stories.mdx | AGENTS.md §5-3 (標準ストーリー構造) |
| Platform/web/browser-support.mdx | (運営ポリシーとして別途定義予定、principles/ からは退避) |
| Platform/web/performance.mdx | (同上) |
| Platform/web/seo.mdx | (同上) |
| Typography/imagery/quality-optimization.mdx | 各 Image 系 component の `.guideline.mdx` |

### (b) コンポーネント `.guideline.mdx` への統合候補

| ファイル | 統合先 |
| --- | --- |
| Color/color-usage.mdx | 各 Button / Alert / Badge 等の `.guideline.mdx` |
| Foundation/accessibility/color-contrast.mdx | `components/tokens/Colors.guideline.mdx` + 各 component |
| Foundation/accessibility/focus-management.mdx | 各 component の `.guideline.mdx` + AGENTS.md §5-2 |
| Foundation/accessibility/keyboard-navigation.mdx | 各 interactive component の `.guideline.mdx` |
| Foundation/accessibility/screen-readers.mdx | 各 component の `.guideline.mdx` + AGENTS.md §5-2 |
| Foundation/accessibility/touch-targets.mdx | `components/tokens/Spacing.guideline.mdx` + 各 component |
| Interaction/button/priority.mdx | `components/primitives/Button/Button.guideline.mdx` |
| Interaction/button/placement.mdx | Form / Modal / Dialog 系 composite の `.guideline.mdx` |
| Interaction/feedback/overview.mdx | 各 Toast / Progress / Spinner の `.guideline.mdx` |
| Interaction/feedback/inline-validation.mdx | `components/primitives/Input/Input.guideline.mdx` + form composite |
| Interaction/feedback/loading-indicators.mdx | `components/primitives/Spinner/Spinner.guideline.mdx` |
| Interaction/feedback/progress-indicators.mdx | `components/composites/Progress/Progress.guideline.mdx` |
| Interaction/feedback/toast-notifications.mdx | `components/composites/Toast/Toast.guideline.mdx` |
| Interaction/gestures/tap.mdx | 各 mobile 対応 component の `.guideline.mdx` |
| Interaction/gestures/swipe.mdx | 該当 component (slider 等) の `.guideline.mdx` |
| Interaction/gestures/long-press.mdx | 該当 component の `.guideline.mdx` |
| Interaction/gestures/pinch-zoom.mdx | Platform/mobile 関連 component |
| Interaction/state/interactive-states.mdx | 各 interactive component の `.guideline.mdx` |
| Interaction/state/state-transitions.mdx | AGENTS.md §5-2 + 各 component |
| Interaction/state/status-states.mdx | Loading / Disabled / Error を持つ各 component |
| Patterns/data-display.mdx | 各 Table / List / Card の `.guideline.mdx` |
| Platform/mobile/android.mdx | Material Design 準拠 composite の `.guideline.mdx` |
| Platform/mobile/ios.mdx | iOS 対応 composite の `.guideline.mdx` |
| Platform/mobile/native-patterns.mdx | 各 mobile component の `.guideline.mdx` |
| Typography/font-families.mdx | `components/tokens/Typography.guideline.mdx` |
| Typography/scale.mdx | `components/tokens/Typography.guideline.mdx` |
| Typography/hierarchy.mdx | `components/tokens/Typography.guideline.mdx` + 各 text component |
| Typography/iconography/semantic-icons.mdx | `components/primitives/Icon/Icon.guideline.mdx` |
| Typography/iconography/sizes.mdx | `components/primitives/Icon/Icon.guideline.mdx` |
| Typography/iconography/styles.mdx | `components/primitives/Icon/Icon.guideline.mdx` |
| Typography/imagery/alt-text.mdx | `components/primitives/Image/Image.guideline.mdx` |
| Typography/imagery/aspect-ratios.mdx | `components/primitives/Image/Image.guideline.mdx` |
| Typography/writing/microcopy.mdx | 各 Button / Label / Help text 系 component |
| Typography/writing/error-messages.mdx | Input / Form / Alert 系 component |

### (c) design-system-strategy.md への吸収候補

| ファイル | 吸収すべき節 |
| --- | --- |
| Foundation/accessibility/overview.mdx | §背景と目的 (a11y 哲学) |
| Foundation/hierarchy.mdx | §視覚化原則 |
| Foundation/responsiveness.mdx | §ディレクトリ構成 (breakpoint) + tokens/Breakpoints.guideline.mdx |
| Interaction/state/overview.mdx | §設計原則 |
| Layout/alignment.mdx | §レイアウト原則 + tokens/Spacing.guideline.mdx |
| Layout/grid.mdx | tokens/Layout.guideline.mdx + strategy §設計原則 |
| Patterns/forms.mdx | §フォーム設計原則 |
| Patterns/navigation.mdx | §ナビゲーション設計原則 + Navigation 系 composite |
| Typography/readability.mdx | §タイポグラフィ原則 + tokens/Typography.guideline.mdx |
| Typography/iconography/overview.mdx | §アイコン哲学 + Icon.guideline.mdx |
| Typography/imagery/overview.mdx | §画像哲学 + Image.guideline.mdx |
| Typography/writing/tone-voice.mdx | §ブランドボイス |

## フォローアップ TODO (この凍結 PR とは別作業)

凍結はこの PR で完結する。以下は将来の別 PR / 別タスクで段階的に実施:

1. **(b) 34 ファイルの内容を各コンポーネント `.guideline.mdx` に統合する作業** — コンポーネント refactor のタイミングで一緒にやる方が文脈が揃って楽。新規 refactor PR を出すたびに該当 principles/ ファイルの内容を取り込み、統合済の旨をこの note に追記する。
2. **(c) 12 ファイルの内容を design-system-strategy.md に統合する作業** — strategy 文書の更新タイミング (大型方針変更時) でまとめて吸収する。
3. **principles/ の物理削除** — (b)(c) の統合が完了し、参照する人が完全にいなくなったら principles/ ディレクトリ自体を削除する。それまでは historical reference として残す。
