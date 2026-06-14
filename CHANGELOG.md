
# Changelog

本プロジェクトの主要な変更点を記載する。フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠し、バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) に従う。

判定基準は [AGENTS.md §10 Semver 規約](./AGENTS.md#10-semver-規約) を参照。

## [Unreleased]

### Added

- **`layout.content.max-width.*` トークンと `max-w-content-*` ユーティリティを新設** (MINOR): `Center` の max 段 (form 28rem / reading 48rem / wide 56rem / marketing 64rem) を、これまで Tailwind 既定クラス (`max-w-md/3xl/4xl/5xl`) 直書きだったのを **token 化**。[`tokens/source/layout.json`](./tokens/source/layout.json) に `layout.content.max-width` を追加し、[`tokens/preset.cjs`](./tokens/preset.cjs) に `.max-w-content-{form|reading|wide|marketing}` を追加、[`Center.tsx`](./components/primitives/Center/Center.tsx) がこれを参照するよう変更。shell-level の `container.max-width` (px) が token 化済みなのに content 側だけ未 token だった非対称を解消し、token カタログ ([Tokens/Layout](./components/tokens/Layout.stories.tsx) に `Content` story) にも掲載して発見可能性を揃えた。
  - **値は rem を維持** (px に変換しない): content 幅は root font-size に追従させ本文 measure を保つため (a11y)。shell=px / content=rem の二軸を意図として明文化。
  - **`Center` の公開 API (`max="form|reading|wide|marketing"`) は不変・visual も同値** のため非破壊 (内部実装の refactor + 新 token 追加で全体 MINOR)。利用側 (consumer product) の改修は不要。
  - `wide` は content (896px) と container (1536px) の両軸に存在するが、token group が別 (`content.max-width` / `container.max-width`) なので CSS 変数レベルで衝突しない。

## [2.0.0] - 2026-06-14

オーバーレイ三部作 (Popover / DropdownMenu / Tooltip) を中心とする新コンポーネント追加、`@floating-ui/dom` の初導入、AI 協業ハーネス・コントラスト / 参照 / 規約の検証ゲート整備、和文タイポ最適化を含む。新規追加が中心だが、**非機能だった `font-serif` Tailwind ユーティリティの削除 (silent break, §10-2)** を含むため §10-1 上 **MAJOR**。移行手順は下記「Removed (breaking, Tailwind utility)」を参照。

### Fixed (a11y / visual)

- **`yellow` 色相を bright-hue (鮮やかな黄) に再設計** (visual): L 正規化の代償でマスタード調 (#A98000) だった yellow を vivid な黄ランプ (500=#EAB308 / 400=#FACC15) に置換。step 50〜600 は dark text (neutral-900)、700〜900 は white text で AA 準拠。**「濃色文字前提の bright-hue」** として L 正規化・白文字アンカーの例外に位置づけ。yellow は semantic 未参照のため影響は consumer の `bg-yellow-*` 直利用のみ (warning semantic は orange-600 のまま)
- **`Toast` の live region を常設コンテナ化** (a11y): `ToastProvider` を `role="status"`/`aria-live="polite"` と `role="alert"`/`aria-live="assertive"` の **2 コンテナ常設**に変え、Toast を variant で振り分けて注入。個別 Toast の live 属性を撤去し、live region のマウント遅延による告知漏れを防ぐ (単発 `<Toast>` API はラッパに同等属性を付与)
- **solid セマンティックロール色を AA 4.5 準拠にダーク化** (visual): `surface-success` (green.500→**600**) / `surface-error` (red.500→**600**) / `surface-warning` (orange.400→**600**) / `surface-info` (blue.500→**600**)。白文字/マークとのコントラストが 2.73〜3.96 → **4.57〜5.31** に改善 (WCAG 1.4.3 AA)。Badge solid / Avatar / Checkbox / Radio / ProgressBar 等が対象。axe ゲートの一時 exempt (Badge/Avatar) を撤去

### Added

- **`check:contrast` コントラスト検証ゲートを追加**: [`scripts/check-contrast.mjs`](./scripts/check-contrast.mjs) + [`tokens/contrast-pairs.json`](./tokens/contrast-pairs.json)。semantic 配色ペアを WCAG 2 AA で判定 (fail → CI fail) し、APCA Lc 参考目標未達は warn (exit 0、設計レンズ)。加えて**パレットの階調不変条件** (アンカー step700=白4.5 / step500=白3:1、step 差ルール、OKLCH L 正規化 ±0.03、bright-hue yellow + 濃色文字) を検証し、token override での破壊を検出。`culori` / `apca-w3` を devDeps 追加 (出荷しない)、CI の tokens:build 後に実行、AGENTS §5-5-1 機械表に追加。現行トークンは fail 0 (Lc 注意 2 件 = on-muted 本文)
- **`Modal` に `initialFocusRef` prop**: 開いた直後にフォーカスを当てる要素を指定できる (未指定は browser 既定 = 最初の focusable)。確認ダイアログで Footer の primary アクションに当て、SR が先に主要操作を読むようにする。play test 付き
- **`Tabs` に `activationMode` prop** (`'automatic'` | `'manual'`、既定 automatic): `manual` は矢印キーで focus のみ移動し `Enter`/`Space` で選択確定 (WAI-ARIA APG)。遅延ロード / 通信を伴う重い panel 向け。play test 付き
- **AI 協業ワークフローを整備**: (1) [`.claude/commands/add-component.md`](./.claude/commands/add-component.md) (§5 準拠の 4 ファイル scaffold→実装→検証) と [`audit-drift.md`](./.claude/commands/audit-drift.md) (規約と実装の乖離検査) を追加。(2) PR テンプレに「規約への還元 (要/不要/更新済み)」「レビュー観点ラベル」節を追加し、stale な §11→§10 (Semver) 参照を修正。(3) AGENTS.md **§11「規約更新の運用」**を新設 (指摘 → 分類 → 規約化 → §追記 のループ)。(4) GitHub ラベル `review:conformance` / `review:judgement` を作成し、strategy.md「現在の運用方針」に月次計測メモを追記
- **Principles (設計原則) セクションを需要順に再構築開始**: 2026-06-10 に撤去した principles を、責務を分離した形で `components/principles/` に再導入。第 1 弾 = 需要上位 3 本 (`Principles/Layout/Alignment` / `.../Accessibility/Screen Readers` / `Patterns/Forms`) + `Principles/Overview` (残り 19 を需要順 TODO 化)。各ページは横断的原則 (3〜5) + Do/Don't + 関連コンポーネントリンクで構成し、component 固有の具体例は guideline に置き重複させない。`preview.ts` storySort に `Principles` カテゴリを再追加。**第 2 弾** (`Interaction/Feedback/Inline Validation` / `Foundation/Accessibility/Keyboard Navigation` / `Color/Semantic Colors`、各参照 5)、**第 3 弾** (`Foundation/Accessibility/Color Contrast` / `Typography/Readability` / `Foundation/Accessibility/Touch Targets`、参照 3〜2) を追加。さらに **第 4 弾で残り全トピックを網羅** (`Layout/Grid` / `Foundation/Accessibility/Focus Management` / `Typography/Hierarchy` (scale+hierarchy) / `Typography/Imagery` (alt/比率/最適化) / `Typography/Iconography` / `Interaction/Feedback/Overview` / `Interaction/Button/Hierarchy` (priority+placement))。需要マップの主要トピックを再構築完了し、**計 16 トピックページ + Overview** に (Overview の TODO は解消)
- **Storybook test-runner + axe を CI に追加 (a11y 自動監査)**: [`.storybook/test-runner.ts`](./.storybook/test-runner.ts) で全 Story を smoke render + play + axe 監査。CI に「Run Storybook tests」ステップ (`npm run test-storybook`) を追加し、これまで手動でしか走らなかった play test と a11y チェックを自動化。AGENTS.md §8-4「axe と例外の付け方」を新設 (例外は理由付きで `test-runner.ts` に集約)
  - 検出した **既知 contrast finding** (solid role 色 + 白文字 / muted on layered bg が AA 4.5 未満) は `TODO(contrast)` 付きで一時 exempt — token ダーク化は別 PR
- **`SplitPane` の独立スクロール pane をキーボード対応** (a11y fix): `overflow-y-auto` の list/detail pane に `tabIndex={0}` を付与 (WCAG 2.1.1 / axe scrollable-region-focusable)
- **ESLint (flat config) を導入し規約を機械強制**: [`eslint.config.mjs`](./eslint.config.mjs) で生 hex / 色 bracket 禁止 (出荷 component 実装のみ、spacing bracket は対象外)、`components/` からの `@/` import 禁止、react-hooks、storybook recommended を強制。`npm run lint` を CI (typecheck の後) に追加。AGENTS.md §3-7「lint が強制する規約」を新設
- **`Tooltip` コンポーネントを新規追加**: `Popover` と同じ overlay 基盤 (native `popover="manual"` + `@floating-ui/dom`) に、hover / focus + 遅延表示と `role="tooltip"` / `aria-describedby` を載せた短い補足表示。**WCAG 1.4.13** (Esc で Dismissible / tooltip 上で Hoverable / 自動で消えない Persistent) 対応。focus 時は即時、hover 時は `delay` 後。オーバーレイ三部作 (Popover → DropdownMenu → Tooltip) 完了、Composites は 26 個に
- **`DropdownMenu` コンポーネントを新規追加**: `Popover` と同じ overlay 基盤 (native `popover` + `@floating-ui/dom`) に、WAI-ARIA APG の Menu Button パターン (`menu` / `menuitem` の roving tabindex + 矢印キー + Home/End + typeahead + Esc/Tab close) を載せた単一階層アクションメニュー。`items` で宣言、`icon` / `disabled` / `destructive` 対応、選択で `onSelect` + 自動 close + trigger へ focus 復帰。Composites は 25 個に
- **`Popover` コンポーネントを新規追加**: native `popover` 属性 (top-layer / 外側クリック・Esc の light-dismiss) を土台に、位置決めを [`@floating-ui/dom`](https://floating-ui.com/) (offset / flip / shift + autoUpdate) で行う非モーダル overlay。トリガーに `aria-haspopup` / `aria-expanded` / `aria-controls` + ref / onClick を自動注入、`role="dialog"` + フォーカス管理 (開→パネル内 / 閉→trigger) 付き。`DropdownMenu` / `Tooltip` の土台 (strategy.md ロードマップ)。Composites は 24 個に
  - **新規 runtime dependency**: `@floating-ui/dom` (本リポ初の `dependencies`、位置決めのみに使用)
- **`Modal` / `SearchBar` を `forwardRef` 対応**: `Modal` は内部 `<dialog>`、`SearchBar` は内部 `<input>` へ ref を透過 (外部 ref と内部 ref をマージ)。外から `dialog` 操作 / input への focus が可能に。AGENTS.md §5-2 の forwardRef 規約を「primitive 必須・composite は ref 対象が明確な場合のみ」に改訂し、規約と実装の乖離を解消
- **CI ワークフロー [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)**: `pull_request` / `push:main` で `typecheck` (tsc --noEmit) / `build-storybook` / `check:links` を強制
- **壊れリンクチェック [`scripts/check-links.mjs`](./scripts/check-links.mjs)** (`npm run check:links`): `.mdx` の `?path=/docs|story/...` 参照が実在する Storybook ページ / story を指すか機械検証 (AGENTS.md §9-3)。`typecheck` script も追加
- **`Tabs` の不正 `activeId` フォールバック**: `tabs` に存在しない `activeId` が来た場合 `tabs[0]` にフォールバック (開発時 console.warn)。全 panel が消える事故を防止
- **`prefers-reduced-motion` 対応 (WCAG 2.3.3)**: [`tokens/preset.cjs`](./tokens/preset.cjs) の base layer に「視差効果を減らす」設定時の animation / transition 無効化 (`0.01ms`) を注入。preset 経由で Storybook と consumer 双方に自動適用され、個別コンポーネントで `motion-reduce:` を書く必要がない
- **`line-height.snug` (1.35) トークンを新設**: 和文見出し (display/xl/lg) 用
- **`tokens/index.ts` の public API を source 全カテゴリと 1:1 化**: 参照漏れだった `Z_INDEX` / `OPACITY` / `FOCUS_RING` / `LAYOUT` を型付きで追加 export (型 re-export 含む)。`import { Z_INDEX } from '@kawachiryuya/design-system/tokens'` が可能に
- **`tailwindcss` を `peerDependencies` に追加** (`^3.4.0`): `./tokens/preset` を使う consumer に Tailwind 3 要件を明示。`peerDependenciesMeta` で optional 指定とし、variables.css のみ使う consumer には未インストール警告を出さない

### Changed

- **ドキュメント・コメントの参照表現を汎用化**: 外部プロダクト / 検証 consumer / 作業メモへの固有参照を中立表現 (consumer 等) に置換し、`docs/layout-patterns-inventory.md` を固有名を含まない要約に差し替え。公開リポとして自己完結する状態に整理 (技術内容・数値根拠・API は不変)
- **`check:refs` でドキュメント間 §参照の整合をゲート** (harness H-7): [`scripts/check-refs.mjs`](./scripts/check-refs.mjs) が `.claude/commands/*` / PR テンプレ / `scripts/*.mjs` / `eslint.config.mjs` の `§N` 参照を AGENTS.md の実在見出しと突合し、改番でのリンク切れを検出 (Principles リンク切れと同型の予防)。`verify` チェーン・AGENTS §5-5-1・ci.yml に追加。導入時に既存のダングリング参照 1 件 (`eslint.config.mjs` の §3-5 → 正しくは §3-7「lint が強制する規約」) を即検出・修正
- **`check:conventions` で §5 規約適合を機械検査** (harness H-4): [`scripts/check-conventions.mjs`](./scripts/check-conventions.mjs) が forwardRef (§5-2) / Props の JSDoc (§5-2) / 4 ファイル構成 (§5-1) / barrel 同期・件数コメント / 標準ストーリー構造 (§5-3、title 命名・autodocs 誤付与・節順序) を CI でゲート (エラーは §番号 + 現状 + 修正方向)。`verify` チェーン・AGENTS §5-5-1 機械表・ci.yml に追加。forwardRef 未対応の 6 primitive (Stack/Cluster/Center/Divider/Image/Skeleton、polymorphic/wrapper) は allowlist で debt 化。`audit-drift` コマンドは機械化 5 項目を CI に委譲し**判断項目のみ**に整理 (composite の forwardRef 要否 / allowlist 見直し / a11y TODO 放置 / 規約改訂要否)
- **検証の単一エントリ `verify` + 内側ループ高速化** (harness H-2): `npm run verify` (tokens:build → check:contrast → check:links → lint → typecheck、安い順 fail-fast) と `verify:full` (+ build-storybook + test-storybook:local) を追加。`test-storybook:local` ([`scripts/test-storybook-local.mjs`](./scripts/test-storybook-local.mjs)) で CI の serve→wait→test→kill を 1 コマンド化 (新 dep なし、story 絞り込み可)。`typecheck` を `--incremental` 化 (`.tsbuildinfo`、2 回目以降 14s→1s)。AGENTS.md §4-1 に「単一コンポーネントの内側ループ」(スコープ版 lint/test、全体走査はコミット前のみ) を明記。add-component コマンドの検証手順を `npm run verify` 参照に集約
- **AI 協業ハーネスを強化** (harness 第2ティア H-1/H-3/H-5/H-8): ルートに [`CLAUDE.md`](./CLAUDE.md) ブリッジを新設 (規約実体は AGENTS.md のみ、自動読込点を確保)。`.claude/commands/*.md` の cwd ハードコードを `git rev-parse --show-toplevel` + リポジトリ判定ガードに置換 (worktree / 別マシンで壊れない)。`.storybook/test-runner.ts` の preVisit で **reduced-motion を常時強制** (CI の play / axe の flake を排除)。AGENTS.md §11-1 にワンショットコマンドの `archive/` 運用を規定
- **階調設計とコントラスト方針を docs に明文化**: [Colors guideline](./components/tokens/Colors.guideline.mdx) に **step→役割アンカー表** (500=白3:1 / 700=白文字4.5 の普遍アンカー等、実測較正) と **L 正規化・step 差ルール**の設計原則を追加 (`check:contrast` の不変条件と 1:1)。[Principles/Semantic Colors](./components/principles/SemanticColors.mdx) に二層方針 (WCAG 2 床 + APCA レンズ)、条件付きペアの考え方、「階調の読み方」、ダークモード将来方針を追記。これでコントラスト方針 (将来のダークモード対応を除く) の明文化が完了
- **orange-500 を条件付きステップとして明文化**: 鮮オレンジ orange-500 (#BE7200) は白文字が 3.75 で AA 未満のため **large-text / 非テキスト (アイコン・グラフ) 限定**。本文面は白文字=orange-600/700 (濃色シフト)、濃色文字=orange-50〜200 (文字色反転) を使う。colors.json に description 追記、`contrast-pairs.json` に orange-500+白の条件付き non-text ペアを登録。L 正規化のため中間オレンジは muddy で、濃色文字でも APCA Lc が body 目標に届かない点も記録
- **AGENTS.md §8-5「コントラスト基準 (WCAG 2 床 + APCA レンズ)」を新設**: 適合は WCAG 2.2 AA を機械強制の床、APCA Lc は設計レンズ (ゲートにしない) とする二層方針を明文化。条件付きペア (3:1 以上を large-text/非テキスト/装飾/disabled に限定) の機械可読表、APCA Lc 参考目標表を追加。「ゲートは WCAG 2 のみ」を明記
- **AGENTS.md §5-5 受け入れ基準を「機械 / 人間」に二分**: CI が保証する項目 (typecheck / lint / check:links / test-storybook の担保ステップを明記) と、人間がレビューで判断する項目 (API 設計・命名・配置・Do/Don't 内容・UX 妥当性) を分離。レビュアーが機械項目を二重確認しない運用に
- **語彙を `Primitives` / `Composites` に一本化**: 公式語彙を実装名に統一し、`Parts` / `Blocks` は [`design-system-strategy.md`](./design-system-strategy.md) 内の由来 (経緯) に格下げ。`README.md` / `package.json` description / strategy.md の分類表を更新。**さらに strategy.md / AGENTS.md / Introduction.mdx 本文の `Parts` / `Blocks` を一掃**し経緯注記 1 箇所に集約 (Introduction の迂回文削除・見出し更新を含む)
- **未使用 7 hue (yellow/lime/cyan/sky/violet/purple/pink) の用途を予約**: 各 hue の `500` に description で「カテゴリカルパレット用 (データ可視化 / Avatar 背景)。UI セマンティクスには使わない」を明記。Colors guideline にも同旨の節を追加
- **Button guideline の「メニュー」案内を更新**: `<Modal>` (暫定) → `<DropdownMenu>` (実装済みのため)
- **[`design-system-strategy.md`](./design-system-strategy.md) の経緯と運用方針を分離**: 勤務先スクラム文脈を「Origin (経緯)」へ集約し、汎用基盤としての「現在の運用方針」セクションを新設。**配布ポリシー** (現状 UNLICENSED + GitHub Packages restricted、外部導入時の MIT 化は Phase 0 規約確認待ちの pending decision) を明文化
- **[`components/Introduction.mdx`](./components/Introduction.mdx)**: 冒頭に「読む人別の入口」(PM / デザイナー / エンジニア) を追加。インラインスタイルの生 hex を semantic/neutral トークンの CSS 変数に置換
- **AGENTS.md**: §2 SplitPane 記述を実態 (固定幅 master-detail、リサイズ機能なし) に修正。§9 に「9-3. 壊れリンクチェック」小節を新設し、空参照だったチェックリスト項目を実体に紐付け
- **`Tabs`**: automatic activation である旨と「重い / 遅延ロード panel には不向き」を JSDoc / guideline に明記。無効タブの `aria-disabled` を削除 (native `disabled` で十分・冗長解消)、`currentContent` の冗長参照を整理
- **sans フォントスタックに和文フォントを追加** (visual): 欧文 stack の後ろに `"Hiragino Kaku Gothic ProN" / "Hiragino Sans" / "Noto Sans JP" / "Yu Gothic UI" / Meiryo` を明示。従来は和文がブラウザ既定にフォールバックし Windows で別物になっていたのを是正
- **見出し (display/xl/lg) を和文最適化** (visual): letter-spacing を `-0.02em` → `0`、line-height を `tight (1.25)` → `snug (1.35)`。漢字連続で字面が窮屈になる欧文慣習を是正
- **shadow スケールの段差を拡大** (visual): sm/md/lg の elevation 差を明確化し階層言語として機能させる。lg を Tailwind 標準級 (`0 10px 15px -3px`) に引き上げ Modal / Popover の浮きをはっきりさせる
- **[`design-system-strategy.md`](./design-system-strategy.md) に「今後の検討 (ロードマップ)」を追加**: デスクトップ compact 密度ティアの方針 / オーバーレイ系 (Popover → DropdownMenu → Tooltip) のロードマップを明文化
- **mono フォントスタックをモダン化** (visual): `"Courier New", Courier, monospace` → `ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`。code 表示系が各 OS 標準の等幅フォントを使う。`tokens/preset.cjs` 経由で consumer にも伝播
- **ルート直下ファイルの整備**: README のディレクトリ構成を実態に合わせ全列挙し**コンポーネント個数のハードコードを廃止** (Storybook サイドバーを SSoT 化)。`tailwind.config.js` → **`tailwind.config.cjs`** にリネーム (`"type": "module"` との形式不一致解消) + デッドグロブ `./principles/**` を削除。`eslint.config.mjs` にテンプレートリテラル内 hex / `[rgb(`・`[hsl(` の検知を追加。`prepublishOnly` を `npm run verify && npm run build` に強化。`package.json` に `engines` (node>=20) / `sideEffects` (CSS) / `files` (CHANGELOG.md) を補完

### Removed (breaking, Tailwind utility)

- **`font-serif` Tailwind ユーティリティを削除** (silent break, §10-2): `tokens/preset.cjs` の `fontFamily.serif` を削除。元々 source に serif 定義がなく `undefined` を出力する**実質非機能**ユーティリティで、リポ内利用もゼロ。serif が必要な consumer は PJ 側 `tailwind.config` の `theme.extend.fontFamily.serif` で定義する

### Fixed

- **`Modal` の背景スクロールロック**: 開いている間 `document.body` の overflow を hidden にし、背後ページのホイール / スワイプスクロールを防止 (`<dialog>.showModal()` 単体では止まらない)。consumer に出荷されない `.storybook` CSS ではなく Modal 側 JS で制御
- **`Toast` の自動消滅を WCAG 2.2.1 準拠に**: hover / focus 中はタイマーを停止し離脱で残り時間から再開。`action` 付き Toast は到達性のため自動消滅を無期限化 (明示 `duration` も最低 10000ms にクランプ)
- **`SegmentedControl` を radiogroup パターンへ** (a11y、見た目・props 変更なし): `role="group"` + `aria-pressed` → `role="radiogroup"` + 各 option `role="radio"` / `aria-checked`、roving tabindex + 矢印キー移動 (Tab 1 ストップ)。排他選択であることが支援技術に正しく伝わる
- **Principles 壊れリンクを解消**: guideline.mdx 群の `?path=/docs/principles-*` 参照 (38 箇所 / 21 ファイル、参照先ページは 0 個) を、実在する Tokens guideline (Layout / Color / Typography) へ付替え、該当ページの無いものは削除。`preview.ts` storySort の未使用 `Principles` カテゴリも除去

## [1.1.0] - 2026-06-10

### Removed (breaking, npm export)

- **`principles/` ディレクトリを物理削除し、`package.json` の `./principles/*` export と `files` 包含を撤去**: 0.5.0 で凍結された [`principles/`](./principles/) 59 ファイル ＋ `_ARCHIVE_NOTE.md` を全削除。SSoT を [`AGENTS.md`](./AGENTS.md) + `components/**/*.guideline.mdx` + [`design-system-strategy.md`](./design-system-strategy.md) の 3 階層に完全一本化し、二重管理状態を解消。
  - **npm 影響**: `@kawachiryuya/design-system/principles/*` 形式の import path は使用不可に。consumer 側は principles/ を import しておらず実害なし。他に consumer は存在しないため effective break なし
  - **設計原則の核を SSoT に吸収**: 削除前に principles/ の (b)(c) 候補から「設計判断の核となる原則」を抽出して保存:
    - [`design-system-strategy.md`](./design-system-strategy.md) に **設計原則セクション** を新設 — アクセシビリティ基本方針 (POUR / WCAG AA) / 視覚的ヒエラルキー (サイズ・色・余白・位置・太さ の 5 手段、3〜4 段超え禁止) / レスポンシブ (モバイルファースト、コンテンツ削除禁止、44px タッチ) / テキスト可読性 (行長 25〜35 文字、行間 1.5+、左揃え、200% ズーム対応) / UI ライティング (ボイス 4 軸、ダークパターン禁止、能動態)
    - [`AGENTS.md §8`](./AGENTS.md) を拡充 — §8-1 基本前提 / §8-2 キーボード操作 (tabindex は 0/-1 のみ、スキップリンク) / §8-3 フォーカス管理 (インジケータ、Modal トラップ、動的コンテンツ時の focus 移動)
  - **救済しなかったもの**: button/priority (Button.guideline.mdx 完全カバー) / interactive-states (AGENTS.md §5-3 + 各 component States story カバー) / iconography overview (Icon.guideline.mdx カバー) / grid (Breakpoints.guideline.mdx カバー) / その他冗長な例示・チェックリスト

### Removed (breaking, AGENTS.md sections)

- **`AGENTS.md §9 principles リンク規約` を削除し §10/§11 を §9/§10 にリナンバー**: §9 (旧「principles リンク規約」、`@see principles/...` 形式と `?path=` クエリ形式の 2 種類の参照規約) は参照先 principles/ ごと不要になったため削除。後続セクションを 1 段繰り上げ。
  - **CHANGELOG / AGENTS.md 内のクロス参照** (§10 / §11 → §9 / §10、`#10-` / `#11-` アンカー含む) を全件更新

### Changed

- **`.tsx` JSDoc から `@see principles/...` 行を全削除** (36 件、22 ファイル): SSoT が `.guideline.mdx` 側に集約されているため、JSDoc から原則へのリンクを廃止。各 component の Storybook Docs (`.guideline.mdx`) から `design-system-strategy.md` 設計原則 + AGENTS.md §8 a11y 規約 を参照する流れに統一
- **`.storybook/main.ts` の stories 配列から `'../principles/**/*.mdx'` を削除**: Storybook サイドバーから "Principles" 系セクションが消える
- **[`README.md`](./README.md)** のディレクトリツリー説明と「ドキュメントの読む順」リストから principles/ 行を削除し、`design-system-strategy.md` (設計原則を含む) → `AGENTS.md` → `components/**/*.guideline.mdx` の 3 段構成として案内
- **[`design-system-strategy.md`](./design-system-strategy.md)** の §本リポでの実装対応 表で「設計原則ドキュメント」行を「本ファイル設計原則 + AGENTS.md §8 + 各 `.guideline.mdx`」に更新
- **[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md)** から `principles/_ARCHIVE_NOTE.md` 参照を削除
- **[`components/primitives/Icon/Icon.tsx`](./components/primitives/Icon/Icon.tsx)** の JSDoc inline コメントから `（principles/Typography/scale.mdx）` 参照を削除

### Changed (docs accuracy / structure cleanup)

- **コンポーネント数を全 docs で実数に正確化**: README.md / design-system-strategy.md / components/Introduction.mdx で primitives を 11〜13 → **16 個** (Layout primitive `Center` / `Stack` / `Cluster` 含む)、composites を 19〜21 → **23 個** (Layout composite `AppShell` / `TwoColumn` / `SplitPane` 含む)。README.md で composites に誤分類されていた Badge を primitives に修正。README.md のファイル構成記述で `.md` → `.guideline.mdx` を更新
- **AGENTS.md §2 に Layout コンポーネント分類を追加**: Primitive vs Composite 判定表に「Center / Stack / Cluster → Primitive (Layout)」「AppShell / TwoColumn / SplitPane → Composite (Layout)」行を追加。用途別マッピングに「要素の縦/横/中央並び」「ページ全体の骨格」「2 カラム」「領域分割」の 6 エントリを追加し、新規読者が Layout 系コンポーネントの存在と分類を把握できる状態に
- **design-system-strategy.md の構築ステップを依存方向図に簡潔化**: 旧 5 段の procedural 記述を `Token → Parts → Blocks → Layout → Organism` の 1 図に圧縮し、各ステップの実装実績は「進捗状況」セクションに集約 (旧構造では計画と実績が並列で重複していた)。Step 4 (Layout) を「未着手」→「完了 (Phase A/B)」に、Step 1 タイポグラフィ semantic 完了も反映
- **design-system-strategy.md ディレクトリ構成 diagram に命名読み替え注釈を追加**: `parts` / `blocks` (戦略上の概念名) と `primitives` / `composites` (本リポ実装名) の対応を diagram 直下で 1 文補足
- **design-system-strategy.md の「命名について」独立節を削除**: 「Parts (実装上は `primitives`)」「Blocks (実装上は `composites`)」を Atomic Design 2 層構成表の初出セルに inline 化し、独立節を削除
- **design-system-strategy.md「demo/」historical 言及を整理**: 「旧 `demo/` を分離」の歴史的注釈を削除し、consumer を「本 DS を npm 消費する dogfood consumer」と簡潔に説明
- **README.md コンポーネント一覧を rot 防止の pointer 形式に置換**: 16 / 23 個の名前列挙を削除し、`components/primitives/` / `components/composites/` ディレクトリリンク + Storybook サイドバー案内に置換 (今後コンポーネント追加で再 rot しない)
- **Introduction.mdx「アクセシビリティへの取り組み」を AGENTS.md §8 拡充内容に整合**: WCAG 2.1 POUR 原則 / Level AA / `tabindex` 規約 / フォーカス管理 (Modal trap、動的コンテンツ時の focus 移動) / 44px タッチターゲット / ホバー依存禁止 を追記

## [1.0.0] - 2026-06-10

**Stable release**: Phase A (Center / Stack / Cluster) + Phase B (AppShell / TwoColumn / SplitPane) の Layout layer 完成と全 dogfood (consumer 側) を経て **MAJOR 昇格**。Storybook 標準ストーリー構造 + guideline 完備 + npm publish 済みの状態で API 安定宣言。

過去の累積 breaking changes (`0.5.0` の Surface layer 階層化 / state token 命名 / Primitive color rename / 各 component の size 廃止 等) はすべて含まれた状態の API 安定版。以降、API の breaking change は厳密に MAJOR bump とする ([AGENTS.md §10-4](./AGENTS.md#10-4-0x-期の運用))。

### Fixed

- **`composites/Checkbox` の error message offset を `ml-7` (silent no-op) → `ml-8` に修正**: 本リポの curated spacing scale (メモ `custom-spacing-scale` 参照) に `7` (28px) が含まれないため Tailwind が CSS を生成せず、error message が input 左端に張り付いて label テキスト直下に揃わない silent UX 不具合があった。意図 (input `w-5` + 親 `gap-2` = 28px) と乖離する 4px 差を許容し、scale 内の `ml-8` (32px) に集約。

### Changed (silent break, Storybook URL)

- **AppShell / TwoColumn / SplitPane の Storybook story id を AGENTS.md §5-3 標準節 (`Playground` / `Variants` / `EdgeCases`) に集約** (silent break、Storybook URL): 旧 individual story (`ContentMaxNarrow` / `ContentMaxWide` / `WithoutBottomNav` / `HeaderOnly` / `NoSlots` / `LongContent` / `MobileReverse` / `GapVariants` / `SingleChild` / `StickyContent` / `NarrowList` / `WideList` / `NoDivider` / `ConsumerHidesListOnMobile` / `CustomHeight` 等) を `Variants` / `EdgeCases` 1 story 内に `Caption` sub-headers で集約。fullscreen layout の sub-render は固定高さ container (`h-[500px] overflow-hidden`) で wrap して 1 画面で比較可能に。旧 `?path=/story/composites-{appshell|twocolumn|splitpane}--{content-max-narrow|...}` 等の URL は壊れる、新 URL は `--playground` / `--variants` / `--edge-cases`。

## [0.14.0] - 2026-06-10

### Added

- **Button に `description` prop** ([`components/primitives/Button/Button.tsx`](./components/primitives/Button/Button.tsx)): モバイル CTA で「購入する / ¥1,200」「予約する / 残り3席」のように主アクション + サブ情報を 1 押下対象に集約するための 2 行目テキストを追加。`ButtonRegularProps` に optional として組み込み (iconOnly モードとは型レベルで両立不可)。主ラベルとの縦並び、`text-xs`(md) / `text-sm`(lg) で font-size のみで階層化 (価格・残数など読ませたい情報のため opacity は当てない)、`size="sm"` 時は描画されない (タッチターゲット内で潰れるため)。icon との共存可。Storybook に `WithDescription` story を追加 (Playground / Variants / Sizes / States / WithIcon / **WithDescription** / EdgeCases の順)。

### Changed

- **docs/layout-patterns-inventory.md を実装後の状態に更新**: Phase A (Center / Stack / Cluster) + Phase B (AppShell / TwoColumn / SplitPane) + 全 dogfood 完了を受けて、冒頭に「実装結果サマリ」表 (5 パターン × release × dogfood PR) を追加、末尾の「次のステップ」を「完了結果と dogfood の振り返り」(発見した API gap 4 件、設計判断の検証、検証ループ / Semver 運用の実態、今後の課題) に置換。実装規約への影響なし。

## [0.13.0] - 2026-06-09

### Added

- **新規 Composite `SplitPane`** ([`components/composites/SplitPane/`](./components/composites/SplitPane/)): Master-detail layout (固定幅 list pane + 流動 detail pane、両 pane が独立スクロール) を提供する composite。mobile では縦積み、PC (lg+) で `grid grid-cols-[listWidth_1fr]` + 固定高さ + 縦境界線。`listWidth` (default `'360px'`、任意 CSS 値) で list 幅を、`divider` (default `true`) で境界線、`height` (default `'calc(100vh - 4rem)'`、AppShell `py-container` 連動) で固定高さを制御。**Positional children** で 1 番目が list、2 番目が detail。CSS variable (`--sp-cols` / `--sp-height`) 経由で動的値を Tailwind safelisted class に渡す実装。`React.HTMLAttributes<HTMLDivElement>` 継承で rest props 対応。[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md) **Phase B 第 3 弾 (= Phase B 完了)**、AppShell / TwoColumn に続く最後の layout composite。

## [0.12.0] - 2026-06-09

### Added

- **新規 Composite `TwoColumn`** ([`components/composites/TwoColumn/`](./components/composites/TwoColumn/)): 2 列レイアウト (main + sidebar) を mobile 縦積み → PC 横並び grid で表現する composite。`split` (`6/6` / `7/3` / `8/4`) で grid base (10 or 12) と各 child の col-span を内部マッピング、`gap` (`sm` / `md` / `lg`、default `md` = consumer の実態 `gap-4 md:gap-6 xl:gap-8`) で列間 gap を制御、`mobileReverse` (boolean) で mobile 時の表示順を逆転 (SearchPage form 下 + preview 上 pattern)。**Positional children** で 1 番目が main、2 番目が sidebar として render される。`React.HTMLAttributes<HTMLDivElement>` 継承で rest props 対応。[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md) **Phase B 第 2 弾**、AppShell に続く composite layer。

## [0.11.0] - 2026-06-09

### Added

- **新規 Composite `AppShell`** ([`components/composites/AppShell/`](./components/composites/AppShell/)): Application shell の骨格を提供する composite。mobile (< lg) は Header + subBar? + main + BottomNav (bottom fixed)、PC (>= lg) は Sidebar + 右 pane (subBar? + main) の構造を内部で制御。4 slot (`header` / `sidebar` / `bottomNav` / `subBar`) は consumer 提供、AppShell は配置・breakpoint 制御 (`lg:hidden` / `hidden lg:block`) と main の `max-w-container[*]` / `px-container` / `py` を担当。`contentMax` (`narrow` / `default` / `wide` / `full`) で shell-level max-width を切替、`showBottomNav` で mobile main の `pb-20` クリアランスを制御。`PageTitleProvider` 等の router/state context は **DS スコープ外**、consumer 側で実装する slot-based 設計。[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md) **Phase B 第 1 弾**、Phase A 完了後の composite layer。

## [0.10.0] - 2026-06-09

### Added

- **`Cluster` / `Stack` の `as` enum に `'span'` を追加**: inline 文脈 (記事 meta / breadcrumb / icon+label 等) で semantic な `<span>` として layout primitive を使いたいケースに対応。`<Cluster as="span">` / `<Stack as="span">` が型 OK となる。`display: flex` で span が flex-container 化するのは browser 標準挙動。consumer の Cluster dogfood で発覚した API gap の解消。既存利用は不変。

## [0.9.0] - 2026-06-09

### Added

- **新規 Primitive `Cluster`** ([`components/primitives/Cluster/`](./components/primitives/Cluster/)): 子要素を水平方向に並べ、画面端で自動折り返しする layout primitive。`gap` で 6 段階 (Stack と同一スケール `xs/sm/md/lg/xl/2xl`) を指定、`as` で semantic タグ (`div / section / ul / ol / nav`)、`align` で cross-axis (`start/center/end/stretch/baseline`、default `center`)、`justify` で main-axis (`start/center/end/between/around`、default `start`) を制御。**常に折り返す** (`flex-wrap` 固定) のが Cluster の定義的特徴 — non-wrap には plain `flex items-center gap-N` を使う運用。`React.HTMLAttributes<HTMLElement>` 継承で rest props pass-through 対応済。[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md) Phase A 第 3 弾 (= Phase A 完了)、Center / Stack に続く layout primitive。

## [0.8.0] - 2026-06-09

### Added

- **Layout primitives (`Stack` / `Center`) に rest props pass-through を追加**: `StackProps` / `CenterProps` が `React.HTMLAttributes<HTMLElement>` を継承するように変更し、コンポーネントは `...rest` を内部 Tag に展開する。これにより `<Stack as="form" onSubmit={...}>`、`<Center role="region" aria-label="...">`、`data-*` 属性等が直接渡せるようになる。これまで wrap が必要だった form 系の dogfood が綺麗にハマる (consumer の Login 等で発覚)。既存 API は不変。

## [0.7.0] - 2026-06-09

### Added

- **新規 Primitive `Stack`** ([`components/primitives/Stack/`](./components/primitives/Stack/)): 子要素を垂直方向に等間隔で並べる layout primitive。`gap` で 6 段階 (`xs` 4px / `sm` 8px / `md` 12px / `lg` 16px / `xl` 24px / `2xl` 48px) を指定、`as` で semantic タグ (`div / section / article / ul / ol / nav / form`) を切替、`align` で cross-axis 配置 (`start / center / end / stretch`) を制御。**実装は `flex flex-col + gap-*`** (`space-y-*` ではない) — Fragment や条件付き children で margin が消える silent bug を回避。[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md) の Phase A 第 2 弾、Center に続く layout primitive。

## [0.6.0] - 2026-06-09

### Added

- **新規 Primitive `Center`** ([`components/primitives/Center/`](./components/primitives/Center/)): 単列コンテンツの水平センタリング (max-width + mx-auto) を担う layout primitive。`max` prop で 4 段階 (`form` 448 / `reading` 768 / `wide` 896 / `marketing` 1024) を use-case 名で指定、`as` prop で `div / section / article / main` の semantic タグを切り替え。垂直 padding やセクション間 spacing は持たず、`className` 経由 (`py-12` 等) で別途与える単機能設計。AppShell の shell-level max-width (1280px) とは別軸で、入れ子で同時に効く。[`docs/layout-patterns-inventory.md`](./docs/layout-patterns-inventory.md) で抽出した 5 パターン中 #2 CenteredContent の primitive 化、Phase A の第 1 弾。

## [0.5.1] - 2026-06-08

### Fixed

- **`peerDependencies` に `tailwind-variants` / `tailwind-merge` を追加** (packaging bug fix): shipped dist (`dist/components/_internal/tv.js` 等) が両者を bare import しているにもかかわらず `devDependencies` にしか宣言されていなかったため、consumer 側で `Failed to resolve import "tailwind-variants"` で build が失敗していた。consumer は `npm install` 時に両者を自動 install する (npm 7+ の auto-install-peers)、または明示的に install することで build が通るようになる。本リポ dogfood (consumer) で発覚。

## [0.5.0] - 2026-06-08

Token / Tailwind preset の silent bug 多数解消 + 全 Composite および主要 Primitive を「1 サイズ運用」「uniform step」「Input family focus pattern 統一」など visual polish round で整理。`size` prop 廃止が Badge / Switch / Checkbox / Radio / Pagination / SegmentedControl / ProgressBar に渡って入っており、breaking 多数。同時に spacing scale の `0.5` dot-path silent bug、preset の dead CSS variable 4 件、Avatar status dot / SegmentedControl selected focus / Checkbox-Radio checked border 等の silent no-op を網羅的に修復。

### Added (in 0.5.0)

- **新規 semantic token `surface.neutral-strong`** (`{color.neutral.700}`): Badge solid neutral / Chip 等の主張ある neutral fill 用途。`surface.neutral` (status marker 用、薄め) と用途分離。Tailwind utility: `bg-surface-neutral-strong`。
- **新規 token category `Layout` を追加** (multi-product hub での layout frame 統一管理向け): `tokens/source/layout.json` を新設し、page-level layout frame 専用の semantic token を導入:
  - `layout.container.padding-x/-y.{mobile,tablet,desktop}` — 大外コンテナ padding (breakpoint 内蔵 utility `px-container` / `py-container`)
  - `layout.container.max-width.{narrow,default,wide,full}` — `max-w-container[-narrow|-wide|-full]` の 4 variant
  - `layout.section.gap/padding-y.{sm,md,lg}` — section 間 / section 内の垂直余白 (density 軸)、utility `gap-section-{sm,md,lg}` / `py-section-{sm,md,lg}` / `space-y-section-{sm,md,lg}`
  - `layout.grid.columns/gutter.{mobile,tablet,desktop}` — 12-col 表記体系 (`grid-base` 単一 class で responsive cols + gutter 内蔵)
  - Tailwind plugin (preset.cjs) で CSS 変数経由の utility を生成、product 側は `:root` で個別 breakpoint 値を 1 行 override 可能 (例: `--layout-container-max-width-default: 1440px`)
  - `components/tokens/Layout.{stories.tsx,guideline.mdx}` 新設、AGENTS.md §3-6 準拠 (Container / Section / Grid の 3 story)

### ⚠ BREAKING CHANGES (in 0.5.0)

- **Composites/Breadcrumb の Storybook title 変更**: `Composites/_Breadcrumb` → `Composites/Breadcrumb`。`_` prefix を除去し他の Composite と命名を揃えた。`?path=/story/composites-_breadcrumb--*` の旧 URL は壊れる、新 URL は `?path=/story/composites-breadcrumb--*`。
- **Composites の Storybook story id 変更** (silent break、Phase 2 移行): 各 Composite を標準ストーリー構造 (Playground / Variants / Sizes / States / WithIcon / EdgeCases) に集約しているため、旧 story id (`default`、`all-variants` 等) の URL は壊れる。各 commit で対象 Composite を明記。`.md` ファイルは `.guideline.mdx` に統合し削除 (§7-6 準拠)。
- **Composites/Alert の Storybook story id 変更** (silent break、Phase 2 移行第 1 弾): 7 story (`default` / `with-title` / `all-variants` / `dismissible` / `without-icon` / `with-action` / `form-errors`) を標準 4 節 (`playground` / `variants` / `states` / `edge-cases`) に集約。旧 URL は壊れる。`.md` ファイルは `.guideline.mdx` に統合し削除 (§7-6 準拠)。`tags: ['autodocs']` を削除し `<Meta of={...} name="Guideline" />` 経由で Docs を兼ねる構造に。
- **Tokens/Typography/Semantic の Storybook story id 変更** (silent break): 3 story (`headings` / `body` / `label-and-caption`) を 1 つの `catalog` に統合し、`?path=/story/tokens-typography-semantic--{headings,body,label-and-caption}` の旧 URL は壊れる。新 URL は `?path=/story/tokens-typography-semantic--catalog`。理由: heading / body / label / caption は同じ semantic typography 軸内の役割で、別軸ではないため AGENTS.md §3-6 (軸 1 つ = 1 story) に整合。
- **Composites/Avatar の size step uniform 化 + status dot 配置構造修正** (silent break、視覚変化): (1) `size` step を Material 3 / Carbon 流の +8 等差 (24/32/40/48/64) に揃えた。`lg` 56→48 / `xl` 80→64 と縮小。理由: 旧 24/32/40/56/80 は md→lg で +16、lg→xl で +24 と非均一、grid 整合性が悪かった。(2) status dot の silent bug を 3 重に修正: ① `w-1.5` / `w-2.5` / `w-3.5` が spacing scale に存在せず xs/md/xl の dot が無 width で invisible だった (bracket 値 `w-[6px]` / `w-[10px]` 等 + `w-4` で全 size 25% 比率に統一)、② token level の dot-path bug (前 commit `48eb953` で解消) によって `bottom-0 right-0` が中央寄せになっていたのを正常化、③ JSX 構造を「外側 wrapper (overflow-visible) + 内側 image clipping container (overflow-hidden + rounded-full) + status dot」に再構成 — 円形 avatar で dot が `overflow-hidden + rounded-full` に clip されて見切れる問題を解消。(3) initials font size を md `text-sm`→`text-base` / lg `text-base`→`text-lg` / xl `text-xl`→`text-2xl` に拡大し全 size で container の 38-40% 比率に揃えた。
- **Tokens/Spacing の source key 表記変更 + preset の dead CSS var 修復** (silent bug fix、視覚改善あり): (1) `tokens/source/spacing.json` の `"0.5"` キーを `"0_5"` にリネーム — Style Dictionary は source key のドットを path separator として解釈するため、`spacing.0` (= `"0px"`) が `0.5` の値で上書きされて消滅し、結果として **全 `.X-0` Tailwind utility (`bottom-0` / `right-0` / `m-0` / `p-0` 等) が壊れた CSS (`5: 2px`) を生成し silent no-op になっていた**。これにより Avatar status dot 等の `absolute bottom-0 right-0` 配置が中央寄せに崩れる等の見えない不具合が広範に発生。`tokens/preset.cjs` 側で utility 名は `0.5` に逆変換するため consumer 側 (`gap-0.5` 等) は変化なし。(2) `tokens/preset.cjs` の preset で参照していた `--color-border-primary` / `--color-border-error` / `--color-border-muted` / `--color-surface-default` の 4 CSS variable が、過去の semantic refactor (Carbon 流 layer 化 / border 強度軸化) で廃止済みのため dead reference。`ring-surface` / `ring-border-error` / `ring-border-primary` / `divide-border-muted` を介して Button / Input / Select / Checkbox / Radio / Textarea / Avatar / Skeleton で sliently 透明色になっていた。alias 名は consumer 互換のため維持しつつ、現行の existing CSS var (`--color-border-focus` / `--color-border-error-emphasis` / `--color-border-subtle` / `--color-surface-layer-1`) を指すよう更新。
- **Composites/Radio から `size` prop を削除** (型 breaking、sm/lg 利用時は視覚変化): `size="sm" | "md" | "lg"` を廃止し 20×20 (旧 md) 1 サイズに統一。Checkbox と完全整合 (form 内で並ぶ Radio / Checkbox サイズが揃う)。理由・移行手順は Checkbox と同じ — Badge / Switch / Checkbox / Radio で 1 サイズ運用に揃った。checked 時の border 色 silent bug は Checkbox と同じ commit ([Checkbox エントリ](#) 参照) で同時修正済。`<Radio size="...">` → `<Radio>`、TypeScript の `RadioSize` 型 export も削除。
- **Composites/Checkbox から `size` prop を削除** (型 breaking、sm/lg 利用時は視覚変化): `size="sm" | "md" | "lg"` を廃止し 20×20 (旧 md) 1 サイズに統一。理由: Badge / Switch と同様、用途差別化が薄く 1 サイズ運用が業界主流 (Material 3 / Mantine md)。同時に **checked 時の枠線が grey のままだった silent bug を修正** — `checked:border-surface-primary` は `borderColor` preset に `surface.*` namespace が無いため Tailwind が CSS を生成しておらず実際は no-op だった。`border-border-focus` (同色 teal.700、`border.focus` は description で「branded selected 状態でも兼用」を明記) に変更。Radio も同じバグだったので同梱修正。移行: `<Checkbox size="...">` → `<Checkbox>`、TypeScript の `CheckboxSize` 型 export も削除。
- **Composites/Switch から `size` prop を削除** (型 breaking、lg 利用時は視覚変化大): `size="sm" | "md" | "lg"` を廃止し track 44×24 (旧 md) 1 サイズに統一。理由: (1) sm/md は片側 gap=2px だが lg だけ gap=4px と物理メタファーが不整合 (2) bracket 値 `w-[44px]` `translate-x-[18px]` 等が grid に乗っていなかった (3) Badge と同じく 1 サイズ運用が業界主流。移行: `<Switch size="...">` → `<Switch>`、TypeScript の `SwitchSize` 型 export も削除。実装は `w-11 h-6` (track) + `w-5 h-5` (thumb) + `translate-x-[22px]` (on) で統一、片側 gap=2px。
- **Primitives/Badge から `size` prop を削除** (型 breaking、視覚も若干変化): `size="sm" | "md"` の 2 段階を廃止し `h-6` (24px) 1 サイズに統一。理由: (1) sm/md とも `text-xs` 固定で font 差別化なく、padding 差 (`py-[2px]` vs `py-1`) で 4px 程度しか変わらず使い分け意図が薄かった (2) 実測 22/26px の半端値は font 字面 (ascender/descender) 由来の偶発値で grid に乗らない (3) 業界主流 (shadcn / Chakra / Polaris / Ant / Carbon) は Badge 1 サイズ運用が多い。移行: `<Badge size="sm">` / `<Badge size="md">` → `<Badge>`、TypeScript の `BadgeSize` 型 export も削除。
- **Layout grid gutter 値の改訂** (視覚的 silent break): `layout.grid.gutter.{tablet,desktop}` を見直し:
  - tablet: `24px` → `16px` (mobile と同値。4→8 col に倍増する分 gutter 合計幅も増えるため column 圧迫を避けて据え置き)
  - desktop: `32px` → `24px` (広い viewport に合わせて拡張するが控えめに)
  - mobile (`16px`) は変更なし
  - `grid-base` 利用箇所で tablet/desktop の card 間 gap が縮む。product 側で旧値が必要なら `:root` で `--layout-grid-gutter-tablet` / `--layout-grid-gutter-desktop` を override 可能

### Changed (in 0.5.0)

- **docs: `principles/` ディレクトリを凍結し、SSoT を AGENTS.md + `components/**/*.guideline.mdx` に集約** (実装規約への影響なし): 全 59 ファイルを「(a) 既出につき削除候補 / (b) コンポーネント `.guideline.mdx` 統合候補 / (c) `design-system-strategy.md` 吸収候補」の 3 分類で棚卸しした結果、principles/ 固有情報は実質ゼロで、AGENTS.md / strategy / `.guideline.mdx` との二重管理状態だったため凍結 (以降書き換えない) と判断。各ファイルの代替参照先は [`principles/_ARCHIVE_NOTE.md`](./principles/_ARCHIVE_NOTE.md) を参照。物理削除は (b)(c) の統合完了後に別 PR で実施予定。AGENTS.md 冒頭にも凍結通知を追記。
- **Composites/ProgressBar の lg size 廃止 + track bg semantic 修正** (型 narrowing、視覚変化なし): (1) `ProgressBarSize` を `'sm' | 'md' | 'lg'` → `'sm' | 'md'` に narrowing。lg=12px は太すぎ、Material 3 / Carbon は 4-8px 中心。`<ProgressBar size="lg">` は consumer 実装で利用なし (stories / guideline のみ)、必要な場合は className で `h-3` などを override。(2) track bg を `bg-surface-skeleton` (token description は skeleton loading 用、semantic 違反) → `bg-surface-disabled` (同色 neutral.200、用途的に「非アクティブな track」が適切) に修正。
- **Composites/SegmentedControl!: size prop 廃止 + 視覚整形 + silent bug 修正** (型 breaking、視覚変化): (1) `size = 'sm' | 'md'` を廃止し `h-10` (40px = Material 3 segmented button 標準) 1 サイズに統一 (Pagination と同じ pattern)。`SegmentedControlSize` 型 export 削除。(2) **silent bug fix**: selected 時に border が消えていたため 1px layout shift していたのを `border-transparent` で高さ揃え。(3) 非 selected hover に `bg-state-hover-primary` (8% teal) 追加で branded feedback。(4) **a11y critical**: selected 状態 (teal bg) に teal ring が乗ると同色で focus 不可視 → selected 時 ring 色を `ring-surface` (白) に切替、非 selected 時は `ring-border-focus` (teal) のまま contrast 確保。(5) button に `inline-flex items-center justify-center` を追加し icon + text の縦中央配置を保証。(6) focus を Input family ではなく button family pattern (2px inset) に揃える。Stories Sizes 削除、pseudo-states selectors を button 直接指定に修正。
- **Composites/FilterChip の silent bug 修正 + 視覚整形**: (1) **silent bug fix**: `h-9` は spacing scale に `9` が無いため CSS 未生成 → chip 高さが content + border の ~24px に潰れていた。`h-8` (32px = Material 3 filter chip 標準) に修正。(2) **a11y critical**: `focus-visible` ring が完全に欠落していた。Input family と揃える `focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-border-focus` を追加。(3) 非 active hover に `bg-state-hover-primary` (8% teal) を追加し Pagination / Accordion / NumberInput と branded pattern 整合。(4) 角丸 `rounded-full` (pill) → `rounded-md` (8px、Polaris 流の控えめな丸み、Badge / Button と integrate しやすい)。(5) Stories の「両端アイコン」例で iconRegistry 未登録の `filter_list` icon (silent no-op) を登録済の `tune` に修正。
- **Composites/Accordion の `pl-11` silent no-op を `pl-12` に修正 + hover を branded teal tint に変更**: (1) 開いた content の `pl-11` (44px、title text 揃え意図) は spacing scale から `11` 削除済 (Switch w-12 化時) で **silent no-op** だった。`pl-12` (48px) に修正し title 揃え復活。(2) trigger hover を `bg-state-hover` (neutral 8% black) → `bg-state-hover-primary` (8% teal) に変更し family と整合 (Pagination / NumberInput / SearchBar / ToggleButton default と同じ branded pattern)。
- **Composites/EmptyState の視覚調整**: (1) desc font を primitive (`text-sm` / `text-base`) → semantic (`text-body-sm` / `text-body-md`) に移行し他 component と整合。title は primitive のまま (semantic typography の text-heading-X が 20px+ で sm/md の text-base/lg と一致しないため)。(2) Button size を `size === 'sm' ? 'sm' : 'md'` (lg でも Button md 止まり) → `size={size}` の 1:1 連動に。Hero / Onboarding 用途で `<EmptyState size="lg">` 利用時に Button も lg (56px) になり CTA の存在感が見合う。
- **Composites/Modal の close ボタン silent bug + 構造整理**: (1) **silent bug fix**: close ボタンが `<Button variant="tertiary" size="sm">` 単体で `iconOnly` 指定なし → Button sm の min-w-16 (64px) が効いて **40×64 の横長 button** になっていた。`iconOnly` + `icon` + `aria-label` props を明示し正しい 40×40 円形に。VisuallyHidden 利用は aria-label に統一、import 削除。(2) Card と同じく Header / Footer の divider (border-b / border-t border-subtle) を削除、typography + padding で階層を示す pattern に。(3) padding を Header / Body / Footer 全て `p-5` (20px 全方向) で統一 (旧 Header/Body `px-5 py-4`、Footer `px-5 py-3` の不揃いを解消)。
- **Composites/Card の視覚調整 + 構造整理** (視覚変化、divider default 変更): (1) filled variant の bg を `bg-surface-inset` (Input 凹みコンテナ用、semantic 違反) → `bg-surface-layer-2` (= neutral.50、layer-1 = elevated/outlined の白から 1 段下げる意図) に修正。(2) clickable hover を `shadow-lg` → `shadow-md` に弱め outlined/filled で「影なし→影付き」のジャンプを抑制。(3) clickable focus に `focus-visible:ring-offset-focus` 追加で Button family と整合。(4) Card.Header font を `font-medium` のみ (size 継承で曖昧) → `text-body-md font-semibold` 明示。(5) **Card.Header / Card.Footer の `divider` default を `true` → `false` に変更** (Material 3 / shadcn と同じ default なし方針、typography + padding で階層を示す)。明示的な区切りが欲しい場合は `divider={true}` で opt-in。(6) Card.Body padding を `p-4` (16px 全方向) → `px-4 py-3` (16/12) で Header / Footer と統一。
- **Composites/Pagination の hover を branded teal tint に変更**: 中性 `bg-state-hover` (8% black) → `bg-state-hover-primary` (8% teal)。active state (`bg-surface-primary` solid teal) との視覚連続性 ("hover で teal 系 → 押下で full teal") + NumberInput / SearchBar / ToggleButton default 等の family と同じ branded hover pattern に統一。
- **Composites/Pagination から `size` prop を削除 + branded hover + flex-wrap** (型 breaking、デフォルト視覚 + 8px 拡大): `size="sm" | "md" | "lg"` の 3 段階 (28 / 32 / 40px) を廃止し `h-10` (40px) 1 サイズに統一。理由: (1) shadcn / Material 3 と同等の 40px が標準的、(2) 旧 md (32) より touch target に近い、(3) Badge / Switch / Checkbox / Radio と同じ 1 サイズ運用ポリシーに揃う。同時に hover 色を中性 `bg-state-hover` → `bg-state-hover-primary` (8% teal) に変更し active state (solid teal) との視覚連続性向上。nav に `flex-wrap` を追加し狭いコンテナで pagination ボタンが横はみ出さず折り返す。`PaginationSize` 型 export 削除。
- **Composites/Breadcrumb の link hover に下線 + focus ring offset 追加**: Link primitive の `underline="hover"` default と整合させ、(1) 色変化 (teal) のみだった hover に `hover:underline` を追加 (色覚多様性配慮、WCAG 1.4.1)、(2) focus-visible ring に `focus-visible:ring-offset-focus` を追加し Link primitive と同じ visual gap に。
- **Composites/SearchBar の視覚調整** (Input / NumberInput family と整合性向上): (1) **input focus pattern を Input と統一** — 旧 `ring-focus (2px outer)` → 新 `ring-1 ring-inset` で focus 時 layout shift なし + Input/Select と同じ feel。(2) **input hover を追加** — `hover:border-border-strong` (Input と同じ border 濃化)、`disabled:hover:border-border` で disabled 時の hover キャンセル。(3) **clear button を Alert / Toast の close ボタン pattern に揃える** — `inline-flex items-center justify-center h-5 w-5 rounded-sm` で focus ring が line-height 由来で縦長化するのを防止、ring-inset で button 内側表示。(4) **clear button hover に branded teal tint** — `hover:bg-state-hover-primary` (8% teal overlay) で NumberInput / ToggleButton default と同じ feedback パターン。
- **Composites/NumberInput の視覚調整**: (1) **a11y critical fix**: +/− buttons に `focus-visible:ring-focus focus-visible:ring-inset focus-visible:ring-border-focus` を追加。今までキーボードフォーカス時のリング表示がなかった。(2) container 背景を透明 → `bg-surface` で Input / Select と family 整合性向上。container hover で `border-border-strong` に濃化 (disabled でない時)。(3) +/− button hover を text-only → `hover:bg-state-hover-primary` (8% teal) で branded な薄ティール tint overlay 追加、ToggleButton と同じ強い feedback パターン。(4) disabled 時に中央の数字も `text-onSurface-disabled` (グレー) に変化させ、状態が伝わりやすく。
- **Composites/Toast の close ボタン配置を absolute positioning に変更** (Alert と同じ pattern): `<Button variant="tertiary" size="sm">` ラッパー (40×40 click area) → 直接 `<button>` の `absolute top-4 right-4 mt-px h-5 w-5` 配置に。variantConfig に `closeBtn` 設定を追加し variant 別の text 色を反映。Toast は description のみと title 付き両方で使われるため `top-4 + mt-px (= y=17)` で左 icon span と左右対称、leading-snug (title) / leading-relaxed (description) いずれの glyph center にも近い位置に。同時に neutral 背景を `bg-surface-inset` (semantic 違反) → `bg-surface-layer-2` (同色 neutral.50、視覚変化なし) に修正。VisuallyHidden 利用を aria-label に統一。
- **Composites/Alert の close ボタン配置を absolute positioning に変更** (視覚調整): flex item として `self-start -mt-0.5 -mr-0.5 p-1` で微調整していたが padding + icon center と title 視覚中央が揃わずずれていた問題を修正。shadcn / Material 3 と同じ absolute pattern (`top-3 right-3 h-5 w-5 inline-flex items-center justify-center`) に変更し、icon center が title 視覚中央 (cap height center、y≈21) に揃うように。container 側は `onClose` 時に `pr-12` を追加して close ボタン用スペースを確保。
- **Primitives/Button の lg size を 64px → 56px に縮小** (視覚的 silent break): Input / Select と同じ理由で `min-h-16` / `h-16 w-16` (iconOnly) → `min-h-14` / `h-14 w-14` に縮小。40 → 48 → 56 の +8 等差 grid に揃え Material 3 max と整合。`<Button size="lg">` を利用している場合 button 高さが 64px → 56px と縮小する。Form の Input / Select lg と並べた時にも揃って見える効果。
- **Composites/Switch track を 44px → 48px に変更** (視覚変化): `w-[44px]` (shadcn / Mantine md 流 1.83 比率) → `w-12` (1:2 = 2.0 比率)。bracket リテラルが named utility 化される副次効果 + spacing scale から `11 (44px)` を不採用にできる簡素化のため。on translate は `translate-x-[22px]` → `translate-x-[26px]` に追従 (26 は scale 外なので bracket 維持)。
- **Tokens/Spacing scale に `0.5` / `1.5` / `2.5` / `14` を追加** (視覚的 silent break): 実利用 bracket リテラル (`w-[6px]` / `w-[10px]` / `gap-[6px]` / `px-[6px]` / `py-[2px]` / `h-[56px]` 等) を named utility (`w-1.5` / `w-2.5` / `gap-1.5` / `px-1.5` / `py-0.5` / `h-14`) に置換。token catalog (`Tokens/Spacing`) でも表示可能になり scale の見通しが改善。consumer 側の class が変わるため視覚的には変化なしだが utility 名は更新される。`11 (44px)` は当初追加予定だったが Switch track を w-12 に変更したことで利用箇所が消え見送り。`3.5 (14px)` も実利用 0 件で見送り。
- **Primitives/Input + Composites/Select の lg size を 64px → 56px に縮小** (視覚的 silent break): step が `40 (sm) → 48 (md) → 64 (lg)` で md→lg のジャンプが +16 と非均一だったのを `40 → 48 → 56` の +8 等差 grid に揃えた。56px は Material 3 max / shadcn lg / Tailwind UI lg と同等で Form input の業界標準。lg は consumer 実装での利用が無く (grep 上は stories / jsdoc のみ) 影響は軽微。Textarea (size variant 無し)、NumberInput (sm/md のみ、step uniform)、SearchBar (32/40/48、用途別の独立スケール) は対象外。`<Input size="lg">` / `<Select size="lg">` を利用している場合、画面上の input が 64px → 56px と縮小する。
- **Composites/Alert の視覚 semantic 化**: (1) neutral variant 背景を `bg-surface-inset` (semantic 違反、Input 凹みコンテナ用) → `bg-surface-layer-2` (同色 neutral.50、視覚変化なし、用途的に適切な layer 2 階層)。(2) title / body の font を `text-sm` → `text-body-sm` semantic typography に揃える。
- **Composites/ToggleButton の視覚調整**: (1) font を `text-caption` (12px) → `text-body-sm` (14px) に。calendar / seat picker 等の主用途で 40×40 container に対し 30%→35% と読みやすさ改善、日本語文字 (週セレクター等) も無理なく。(2) disabled bg を `surface-inset` (Input 凹みコンテナ用、semantic 違反) → `surface-disabled` に修正。(3) hover/active に Button と同じ state-layer overlay pattern を追加 — default (白 bg) は `state-hover-primary` (8% teal) で branded な薄ティール tint、selected (teal bg) は `state-hover` (8% black) で明確な darken。今まで border 濃化のみで feedback が弱かったのを Button 派に揃えた。
- **Alert / Toast / Badge を semantic 化** (AGENTS.md §3-1 違反の解消): primitive 直参照 (`text-green-500` / `bg-neutral-700` 等) を semantic token (`text-onSurface-success` / `bg-surface-neutral-strong` 等) に置換。下流 product の brand override が効くようになる。視覚的にはアイコン色が若干濃く (e.g. green.500→700)、Alert 閉じるボタンの hover は role tint から neutral overlay (bg-state-hover) に統一。
- **AGENTS.md §3-6 に Token Catalog Story / Guideline の規約を新設**: `components/tokens/` 配下の token カタログ専用構造を明文化。flat catalog (subsection 禁止) / Catalog を Guideline から分離 (Story 埋め込み禁止 → link list) / 標準セクション (概要 / カタログ / 設計方針 / 迷ったらこれ / 関連) を固定。Animation / Shadows / FocusRing / Typography / Typography-Semantic 等の既存 Guideline を順次適用。
- **AGENTS.md §3-4-3 に Container ペアパターン規約を新設** (軸 2、構造変更なし): Material 3 流の Container ペア (role / on-role / role-container / on-role-container) を本リポ命名で実現する規約を明文化。実態は既に揃っており命名 (`-muted` / `secondary`) を本リポ semantic 規約として確定:
  - Brand: `surface.primary` + `on.inverse` + `surface.secondary` + `on.primary` (ペア揃)
  - Success/Error/Warning/Info: `surface.X` + `on.inverse` + `surface.X-muted` + `on.X` (ペア揃)
  - Disabled/Skeleton: container 単独 (intense なし、自然な設計)
  - Status indicator (surface.neutral): text counterpart 不要 (small status marker)
- `surface.inset` の **JSON 重複定義を統合** (line 26-30 と line 101-105 が同 key 違 description だった、後者の `凹み・控えめな背景（neutral Alert等）` を削除し前者の Layer 階層 description に統一)
- `surface.neutral` の description を Status 軸の意図に明確化 (offline / off 等の状態 marker、`surface.inset` との設計目的の違いを明記)

### ⚠ BREAKING CHANGES (Surface layer 階層化)

- **Surface depth 階層を Carbon 流 numeric (layer-1/2/3) に再構成** (silent break、軸 1): Multi-product hub + 将来 dark mode 視点で、Surface の depth を numeric 命名に統一:
  - `surface.default` → `surface.layer-1` (white、ページ上のカード)
  - `surface.raised` → `surface.layer-2` (neutral.50、入れ子)
  - **新規追加**: `surface.layer-3` (neutral.100、さらに深い入れ子)
  - `surface.inset` (sunken control 用) と `surface.overlay` (modal mask) は depth 軸とは別の特殊役割として **維持**
  - `surface.primary` / `secondary` / `success-muted` 等の役割色は不変
  - **`bg-surface` (DEFAULT alias) は layer-1 を指す** — Tailwind preset で alias 設定し、最頻利用 (37 callsite) を簡潔記法で残す
  - 影響: Tailwind utility `bg-surface-raised` → `bg-surface-layer-2` (3 callsite を sed)、CSS 変数 `--color-surface-default` → `--color-surface-layer-1`、`--color-surface-raised` → `--color-surface-layer-2`、新規 `--color-surface-layer-3`
  - 下流 product 移行: `sed -i '' 's/bg-surface-raised/bg-surface-layer-2/g; s/bg-surface-default/bg-surface-layer-1/g' src/**/*.{tsx,ts}` で機械置換 (`bg-surface` (suffix なし) はそのまま動く)
  - AGENTS.md §3-4-2 に Surface layer 階層 + dark mode 想定値を明文化
  - SemanticColors guideline.mdx の surface 説明を更新

### Changed

- **Style Dictionary `outputReferences: true` 有効化** (ランタイム brand override 対応): `style-dictionary.config.js` の web-css 出力に `outputReferences: true` を追加し、primitive 参照 (`{color.teal.700}` 等) を build 時に hex 解決せず `var(--color-teal-700)` として CSS 出力するように変更。これにより **下流 product は CSS 変数 1 行 override で全 semantic chain にランタイム伝播**:
  - 例: `--color-teal-700` を violet 値に override → `--color-surface-primary` / `--color-on-primary` / `--color-border-focus` / `--color-state-hover-primary` 等が全て自動的に violet ベースに切り替わる
  - SD 再 build 不要、`tailwind.config.js` の preset 継承もそのまま、product 側はオーバーライド CSS 1 行で済む
  - color-mix() を使った state.hover-primary 等の透過 overlay も自動連動
  - AGENTS.md §3-1 にランタイム連動の仕組みと利用例を追記

### ⚠ BREAKING CHANGES

- **Semantic state token を整理 + 命名統一** (silent break、軸 5): orphan 削除と命名一貫化:
  - `state.dragged` 削除 (0 callsite、真の orphan)
  - `state.hover-on-primary` → `state.hover-primary` (`-on-` 接頭辞を削除、「primary 背景上で」と「primary 色味の」の二重解釈を解消)
  - `state.active-on-primary` → `state.active-primary`
  - `state.hover-on-error` → `state.hover-error`
  - `state.active-on-error` → `state.active-error`
  - `state.hover` / `state.active` (中性) は不変
  - **見た目変化なし** (Button 全 variant 含めて token 値は同じ、命名のみ整理)
  - 影響: Tailwind utility (`bg-state-hover-on-primary` → `bg-state-hover-primary` 等)、CSS 変数 (`--color-state-hover-on-primary` → `--color-state-hover-primary` 等)
  - 本リポ内: Button (CSS var 経由 6 callsite) + Link (1 callsite) を sed 機械置換済
  - 下流 product 移行: `sed -i '' -E 's/(bg-state-|--color-state-)hover-on-/\1hover-/g; s/(bg-state-|--color-state-)active-on-/\1active-/g' src/**/*.{tsx,ts,css}` で機械置換
  - AGENTS.md §3-2 に state token 命名規約 (中性 vs 色味付き、`state.{state}-{role}` 形式) を明文化
- **Semantic border token を強度軸 (subtle/default/strong/emphasis) に再構成** (API + silent break): 軸 4 の方針 (`{role}-{intensity}` 命名で強度語彙を全 role に一律適用) を実装:
  - `border.muted` → `border.subtle`
  - `border.disabled` → `border.subtle` (同値だったため統合)
  - `border.primary` → `border.focus` (FilterChip active / Badge outline-primary など 2 callsite。Branded selected 状態は `focus` に統一)
  - `border.success` → `border.success-emphasis`
  - `border.error` → `border.error-emphasis`
  - `border.warning` → `border.warning-emphasis`
  - `border.info` → `border.info-emphasis`
  - `border.success-muted` → `border.success-subtle`
  - `border.error-muted` → `border.error-subtle`
  - `border.warning-muted` → `border.warning-subtle`
  - `border.info-muted` → `border.info-subtle`
  - **新規追加**: `border.emphasis` (neutral.700) — 最も強い neutral border、注意喚起 / CTA 周辺の輪郭強化用
  - 影響: Tailwind utility (`border-border-muted` → `border-border-subtle`、`border-border-success` → `border-border-success-emphasis` 等)、CSS 変数 (`--color-border-muted` → `--color-border-subtle` 等)
  - 下流 product 移行: `sed -i '' -E -e 's/border-border-muted/border-border-subtle/g; s/border-border-disabled/border-border-subtle/g; s/border-border-primary/border-border-focus/g; s/border-border-success-muted/border-border-success-subtle/g; ...' src/**/*.{tsx,ts}` で機械置換可能
  - 本リポ内は 100+ callsite を自動 sed 済
- **`bg.default` を brand から独立した中性に変更** (silent break): 軸 6 の方針を実装:
  - `bg.default` の参照を `{color.teal.25}` → `{color.neutral.50}` に変更
  - これに伴い `color.teal.25` primitive shade を削除 (orphan token)
  - 影響: ページ最下層の bg 色が brand 連動から中性 (neutral.50 = #FAFAFA) に変わる。Multi-product hub として brand を切り替えても bg が共通になる設計
  - 下流 product 移行: brand canvas を引き続き望む product は PJ 側で `bg.default` を `{color.{brand-hue}.50}` 等に override する
  - AGENTS.md §3-3 を「`teal.25` 専用」から「bg は brand 独立中性」に書き換え
- **Primitive Color palette key rename** (API + silent break): 2 層アーキテクチャ純度を保つため、Primitive 層から **role 名を排除して hue 名に統一**:
  - `primary` → `teal`
  - `success` → `green`
  - `error` → `red`
  - `warning` → `orange`
  - `info` → `blue`
  - 影響: Tailwind utility (`bg-primary-700` → `bg-teal-700`)、CSS 変数 (`--color-primary-700` → `--color-teal-700`)、Style Dictionary TS export (`PrimaryColor700` → `TealColor700` 等)。**Semantic 層のキー (`surface.primary` / `on.success` 等) は変更なし**、value の参照先のみ自動連動
  - 下流 product 移行: `sed -i '' -E 's/(bg|text|border|hover:bg|hover:text)-primary-([0-9])/\1-teal-\2/g; s/(bg|text|border)-success-([0-9])/\1-green-\2/g; ...' src/**/*.{tsx,ts}` 等で機械置換可能
  - 本リポ内は 31 callsite を自動 sed 済 (Alert / Toast / Card / Button / Spinner / Icon / 各 mdx)
  - AGENTS.md §3-5 に「Primitive Color は hue 名、role 名は Semantic 層に集約」の規約を新設
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

- **`on.soft` 中間階層 token を追加** (軸 3): `on.default` (neutral.900) と `on.muted` (neutral.500) の中間階層として `on.soft` (= neutral.700) を新設。サブ見出し / 強めの補足テキスト用、default ほど強くはないが muted より読ませたい階層。3 階層 + state (default / soft / muted + disabled) で text hierarchy を整理。Polaris/Primer 流を参考に `primary/secondary/tertiary` の役割名衝突を回避する命名 (primary = brand 色、独立軸)。Tailwind utility `text-onSurface-soft` / CSS 変数 `--color-on-soft` が新規生成。Typography component の `color` enum にも `soft` を追加 (既存 API は不変、callsite の sed 不要)
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
- [`AGENTS.md`](./AGENTS.md) を再構成 — §5 (旧「新規追加時の規約」147 行) と §9 (旧「既存移行手順」148 行) で重複していた **規約本体 (4 ファイル構成 / 標準 7 節 / Guideline 5 節 / DoDontExample / 完了条件)** を §5「コンポーネント実装規約 (新規・既存共通)」に集約し SSoT 化。§6 (新規追加) / §7 (既存移行) は §5 への delta + 手順だけに薄くした。旧 §7 検証フロー + §8 変更時に守ること は §9 に統合。`States` 節の必須要件を「状態を持つ component で必須、非 interactive (Badge / Skeleton / Spinner / Divider / VisuallyHidden) は省略可」と明文化 (既成事実だった運用を規約化)。外部参照は §3 (`Badge.tsx`) と §10 (`CHANGELOG.md`) のみで、両者とも番号変わらず無影響
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

- [`AGENTS.md`](./AGENTS.md) §9 — 既存コンポーネントの標準ストーリー移行手順 (Button を雛形にした段階手順)
- [`AGENTS.md`](./AGENTS.md) §10 — Semver 規約 (本リリースで追加)
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

[Unreleased]: https://github.com/kawachiryuya/design-system/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/kawachiryuya/design-system/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/kawachiryuya/design-system/compare/v1.0.0...v1.1.0
[0.4.0]: https://github.com/kawachiryuya/design-system/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kawachiryuya/design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kawachiryuya/design-system/releases/tag/v0.2.0
