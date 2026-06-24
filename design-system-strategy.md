# デザインシステム構築戦略

## 背景と目的

> **Origin (経緯)**: 以下は本デザインシステムが生まれた経緯。特定プロダクト・特定チーム (スクラム開発) の状況に紐づく文脈であり、汎用基盤としての現在の進め方は後述の「[現在の運用方針](#現在の運用方針)」を参照。

### 課題

- デザインとコードでコンポーネントの粒度がバラバラで、スプリント内でデザインが回らない
- Figma とコードの間に差異があり、Single Source of Truth が存在しない
- 既存プロダクトのグランドデザイン・レイアウト刷新を控えており、スクラムのスプリントに収まらない規模

### 方針

- デザイナーの作業環境を Figma からコードへ移行する
- Storybook をデザインの信頼できる情報源として構築する
- 正式なバックログには載せず、デザイナーの裁量で進める
- 動的なプロトタイプ検証・AI 活用での UI 生成の基礎にする

### 制約

- バックエンドには触らない (フロントエンドのみ)
- プロダクト側に既存の Storybook があるが粒度がバラバラなので新規で構築する
- 技術スタックは既存プロダクトに合わせる (将来の統合を見据えて)

---

## コンポーネント分類

### Atomic Design を簡略化した 2 層構成

**公式語彙は `Primitives` / `Composites`** で、実装・Storybook サイドバー・ドキュメント全体で統一する。
(経緯: 構築当初は Atomic Design 由来の `Parts` / `Blocks` と呼んでいたが、Storybook の実装名と二重化するため現語彙に一本化した。)

| 層 | 定義 | 例 |
|---|---|---|
| **Primitives** | 単体で意味しない最小の UI 要素 | ボタン、入力、バッジ、アイコン |
| **Composites** | Primitives の組み合わせで 1 つの機能を持つ UI | 検索バー、カードレイアウト、フォームセクション |

### 汎用 / プロダクト固有の切り分け

判断基準: **ドメイン知識がないと作れないか**

- **common**: ドメインに依存しない汎用パーツ・ブロック
- **product**: 特定プロダクトの業務知識に紐づくパーツ・ブロック

product 側は common を組み合わせて意味を与える関係:

```
common/parts/GridSelector     ← 汎用、何を選ぶかは知らない
  ↓
product/blocks/SeatSelector   ← 座席という意味を与える
  ↓ <GridSelector items={seats} onSelect={handleReserve} columns={3} />
```

---

## ディレクトリ構成

```
common/                      ← 汎用、将来 npm パッケージとして切り出す単位
  tokens/                    ← グローバルトークン、値そのものを定義
  components/
    parts/                   ← Button, Input, Badge, Icon 等
    blocks/                  ← SearchBar, FormSection 等

[product-name]/              ← プロダクト固有
  tokens/                    ← セマンティックトークン、役割名で参照
  components/
    parts/                   ← FareLabel 等
    blocks/                  ← SeatSelector 等
  layouts/                   ← ページ骨格パターン (グリッド、ヘッダ構造等)
```

※ 上図は戦略上の概念的命名。**本リポジトリの実装では `parts` → `primitives` / `blocks` → `composites`** (Atomic Design 由来の React 慣習名)。詳細マッピングは末尾「本リポジトリでの実装対応」表を参照。

将来複数プロダクトで運用する場合は `common/` を独立リポジトリに切り出し、npm パッケージ化する。現段階ではフォルダ分離で十分。

---

## デザイントークン設計

### 2 層構造: グローバル → セマンティック

```
グローバルトークン (common)
  値そのものを定義、プロダクトに依存しない。

セマンティックトークン (common にデフォルトを提供、product で override 可能)
  役割名で参照。common 側にデフォルトを実装することで、単一 product でも追加設定なしに動作する。
  product は tailwind.config.js の theme.extend で必要な部分だけ上書きする。
```

### 対象

| 対象 | グローバル例 | セマンティック例 |
|---|---|---|
| カラー | `--color-blue-500` | `--color-primary` |
| タイポグラフィ | `--font-size-16`, `--font-weight-bold` | `--font-heading`, `--font-body` |
| スペーシング | `--space-4`, `--space-8` | `--space-content-gap`, `--space-section-gap` |

カラー・スペーシング・タイポグラフィのいずれも common にデフォルト semantic を実装済 (詳細は「進捗状況」参照)。

---

## マルチプロダクト対応の設計原則

1. **命名にドメイン語を混ぜない**: common には `PrimaryButton`, `ContentCard` のような役割名を使う。`TrainButton` のようなドメイン語は product 側のみ
2. **コンポーネント API を業務ロジックから切り離す**: common の props は汎用的に「何を選ぶか・何を表示するか」は product 側が決める
3. **トークンのセマンティック層で見た目を差し替える**: 同じコンポーネントでもプロダクトごとに異なる外観を実現

---

## 構築ステップ

**Token → Primitives → Composites → Layout → Organism** の依存方向に沿って下から積み上げる。Step 4 (Layout) までは common パッケージ (本リポジトリ)、Step 5 (Organism) は product 側で実装。Step 4 まではデザイナー単独で進行可能、バックエンド依存なし。

```
Step 1  Token        (色 / spacing / typography 等の semantic 2 層化)
   ↓
Step 2  Primitives   (Button / Input / Icon 等、単一 HTML 要素のラッパー)
   ↓
Step 3  Composites   (Card / Modal / Form 等、Primitives の組合せ + 状態)
   ↓
Step 4  Layout      (ページ骨格 / グリッド / レスポンシブ / Navigation)
   ↓
Step 5  Organism    (product 固有、ドメイン UI、バックエンド接続)
```

各ステップの実装状態は末尾の「**進捗状況**」セクションを参照。

---

## プロダクトへの適用戦略

### ストラングラーパターン

新 UI をオブジェクト単位で段階的に置き換える。画面単位ではなくコンポーネントの依存方向に沿って下から積み上げる:

```
トークン → Primitives → Composites → Organism → 結果として画面が変わる
```

### フィーチャーフラグ

コード上に新旧両方を入れ、設定値の切り替えで表示を変えられる。デプロイとリリースを分離し、準備完了まで新 UI を隠しておける。

```javascript
if (featureFlag.newDesign) {
  return <NewHeader />
} else {
  return <OldHeader />
}
```

---

## 設計原則

実装規約 (どう作るか) は [`AGENTS.md`](./AGENTS.md) に集約。本セクションは「**なぜそう作るか / どう判断するか**」をデザイナーと開発者で共有する原則。本セクションを根拠に各 component の `.guideline.mdx` が個別判断を補強する。

### アクセシビリティ基本方針

すべてのユーザーが能力や環境に関わらず等しく情報にアクセスし、機能を利用できる状態を実装の前提とする。WCAG 2.1 の POUR 原則 (Perceivable / Operable / Understandable / Robust) に従い、**Level AA を最低目標**、可能な箇所は AAA。一時的な障害 (怪我・疲労・環境制約) や高齢ユーザーまで含めると影響範囲は WHO 推計の障害者 15% よりさらに大きい。詳細実装規約は [`AGENTS.md §8`](./AGENTS.md)。

### 視覚的ヒエラルキー

画面上の要素に重要度の順序を与え、ユーザーが迷わず視線を動かせるようにする。手段は **サイズ / 色とコントラスト / 余白 / 位置 / 太さ** の 5 つ。単独でも機能するが、Primary アクションのように強い差をつけたい場面では複数を重ねる。

- **1 画面に明確な「最重要要素」を 1 つ**。Primary Button が複数あると優先順位が消える ([`Modal.guideline.mdx`](./components/composites/Modal/Modal.guideline.mdx) で実例)
- **段数は 3〜4 を超えない**。段数が増えると 1 段差が小さくなり階層が伝わらない
- **強調 (bold / 色) は 1 段落 1〜2 箇所まで**。乱用すると "全部重要" = "何も強調されない"

### レスポンシブ設計

あらゆる画面サイズで同等の価値を提供する。デバイスに合わせて **コンテンツを削るのではなく形を変える**。

- **モバイルファースト**: CSS は `min-width` メディアクエリで小から大へ拡張。`max-width` で削っていく設計は「何を削るか」の判断が後手になり重要情報を埋もれさせる
- **コンテンツ削除禁止**: モバイルで `display: none` で隠すのは原則 NG (装飾要素のみ例外)。代わりに配置・順序を変える
- **タッチ操作前提**: 最小ターゲット 44x44px、隣接間隔 8px+、ホバー依存禁止 ([`AGENTS.md §8-1`](./AGENTS.md))
- ブレークポイント値は [`components/tokens/Breakpoints.guideline.mdx`](./components/tokens/Breakpoints.guideline.mdx) を参照

### テキスト可読性

- **行長**: 日本語 25〜35 文字 / 英語 45〜75 文字。記事本文は `max-w-2xl` (~672px) 程度
- **行間**: 本文 1.5+、UI ラベル 1.5 程度、ボタン 1.0〜1.25
- **段落間隔**: 行間の 1.5〜2 倍 (WCAG 2.1 推奨は 2 倍)
- **左揃え基本**: 両端揃え (justify) は日本語で単語間隔が崩れるため禁止。中央揃えは見出し・短文のみ、右揃えは数値列のみ
- **モバイル最小 16px**: ブラウザの自動ズームを防ぐため
- **200% ズーム対応**: 横スクロールが発生しない設計 (rem 単位)

### UI ライティング (ボイスとトーン)

ボイス (ブランド個性、常に一定) とトーン (状況対応) を分けて運用する。ビジュアルと同等の重要性。

- **ボイス 4 軸**: 明快 (Clear) / 誠実 (Honest) / 親しみやすい (Friendly) / 簡潔 (Concise)
- **トーンは状況で調整**: 通常 / 成功は明るく / エラーは落ち着いて解決策を / 警告は明確直接的に / 空状態は励まし歓迎
- **能動態優先**: 「ファイルを削除しました」(○) / 「ファイルが削除されました」(△)
- **専門用語回避**: ユーザーの語彙に合わせる
- **ダークパターン禁止**: 脅し・罪悪感誘導・選択肢の意図的非対称配置で行動を誘導しない
- 各 component の Do/Don't は `.guideline.mdx` の `<DoDontExample>` で個別具体化

---

## Origin: スクラム文脈での進め方 (経緯)

> 以下は本 DS を特定プロダクトへ最初に導入したときの進め方。汎用基盤としての現在の方針ではなく、構築の経緯として残す。

- デザインシステム構築は、バックログに載せず、デザイナーの作業改善として進める
- プロダクトへの統合 (ストラングラー) 段階でエンジニアと協力、その時点でバックエンドロジックの接続を依頼
- PO への説明が必要になった場合は「機能開発の速度向上のための投資」として定量的に伝える

---

## 現在の運用方針

本 DS は現在、特定プロダクトの一機能ではなく**汎用基盤** (`@kawachiryuya/design-system`) として運用している。

- **バージョニング**: Semantic Versioning。破壊的変更は [`CHANGELOG.md`](./CHANGELOG.md) と [`AGENTS.md §10`](./AGENTS.md) に従う。1.0.0 以降は厳密に MAJOR bump
- **品質ゲート**: PR で typecheck / **lint** / 壊れリンクチェック (§9-3) / build-storybook / **test-storybook (play + axe a11y)** を CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) で強制。AI 生成物の適合性チェックは CI に移管済み。release は tag push で GitHub Actions が自動 publish (ローカル publish は行わない)
- **ドキュメント責務**: 本ファイル (なぜ・何を) / [`AGENTS.md`](./AGENTS.md) (どう作る) / 各 `.guideline.mdx` (個別の使い方) の三層
- **規約還元ループ**: レビュー指摘は「適合性 (`review:conformance`)」と「判断 (`review:judgement`)」に分類してラベル付けし、適合性指摘は AGENTS.md / lint へ還元する ([AGENTS.md §11](./AGENTS.md))。**月次で 2 ラベルの割合を見る** — 適合性指摘の比率が下がれば、品質ゲートと規約整備が機能している証左 (人間レビューが判断系に集中できている)

### 配布ポリシー

- **現状**: `license` は `UNLICENSED`、GitHub Packages へ `access: restricted` で配信。消費側プロダクトは GitHub の認証トークン (`NODE_AUTH_TOKEN`) を要する (自分のプロダクトでの利用を前提)
- **pending decision**: 外部プロジェクトの基盤として導入する場合、ライセンス (MIT 化) と配布チャネル (public registry 等) の意思決定が必要。確定するまでは現状の restricted 配信を維持する

---

## 今後の検討 (デザイン / ロードマップ)

すぐには着手しないが、場当たり対応を防ぐため方向性を固めておく項目。

### 密度ティア (デスクトップ compact)

コントロール高 `sm=40 / md=48 / lg=56` はモバイルのタッチターゲット (44px 基準) 起点で正しい。一方「モバイルファーストのサービスを PC レイアウトへ広げる」フェーズでは、テーブル操作・管理画面・フィルタ列など高密度 UI で 40px 最小が間延びする。

- **方針**: PC 適用フェーズで `h-8` (32px) 等のハードコードが場当たり的に生えるのを防ぐため、**「ポインタデバイス時のみ compact (32px) を許可」** という条件付き density ティアを将来導入する。`control-height` の compact 段を semantic 化し、`@media (pointer: fine)` または明示 prop で出し分ける案を検討する
- 現時点では追加しない (タッチ基準の単一ティアを維持)

### オーバーレイ系コンポーネント (Popover / DropdownMenu / Tooltip)

z-index トークンには `dropdown` / `popover` / `tooltip` が予約済みだが実体コンポーネントが無く、現状 Button guideline は「メニューは暫定で `<Modal>` 代用」と案内している。複数アクションの集約をモーダルで代替するのは操作コストが高く、デザイン的にも過剰な中断。

- **ロードマップ順**: `Popover` (anchor 配置 + dismiss の基盤) → `DropdownMenu` (Popover + `menu`/`menuitem` roving) → `Tooltip` (Popover + hover/focus delay)。Popover を土台に積み上げる
- いずれも実装は別 PR。着手時に native `popover` 属性 / CSS Anchor Positioning の採用可否を最初に判断する

### スタイルのカプセル化 (C-scoped 確定 / 完全カプセル化 D は保留) — #76

v4.0.0 で preflight を非同梱化 (#57) した結果、mode①(no-Tailwind) で utility が動く前提 (`border-style:solid` / `box-sizing:border-box` / フォーム正規化) まで欠落し部品が壊れた。最小ベースを補完するにあたり、配信方針「ライブラリは消費者の素の要素に触れない」を保つため、ベースを **DS サブツリー (`[data-ds-root]`) 配下だけに scope** した (= **C-scoped**、`:where()` で特異性 0 を維持)。

- **C は当初から中継地点**であり、今回 C-scoped に精製した。グローバル footprint をほぼゼロに戻し、配信方針を回復した。`check:styles` が global footprint の再混入を機械ガードする。
- **既知の残留リーク (受容)**: DS コンポーネントに `children` として渡された消費者コンテンツはサブツリー内なのでベースリセット (box-sizing / border 既定) を受ける。「DS の箱の中身は DS の箱モデルに従う」という意図的・許容範囲の挙動として受容する (さらに厳密に閉じるのは D の領域)。
- **完全カプセル化 (D) は保留**。進める場合の手段は **build-time の scoped CSS であり、Shadow DOM ではない**。理由: 本 DS は (1) SSR/RSC セーフが契約、(2) overlay 系 (Modal / Popover / Tooltip 等) が top-layer を多用、(3) native フォーム参加に依存しており、Shadow DOM はこの 3 点すべてと衝突する。scoped CSS は RSC ネイティブで、portal / top-layer をまたいでも効き、フォームにも影響しない。
- **forcing function (D 着手の合図)**: (a) 2 人目の実消費者が別 framework での利用を要求、または (b) 未知 / 敵対的な消費者 CSS からの隔離 (埋め込み等) が必要な案件が発生。**「スコア向上」「念のため」は合図にしない。**
- **D の最初の一歩**: 全面着手の前に overlay 系を 1 コンポーネント (例 Popover) だけ scoped CSS で spike し、実コストと痛点を実測してから全体を判断する。

---

## 本リポジトリでの実装対応

戦略上の概念と、本リポジトリ (`@kawachiryuya/design-system`) の現在の実装の対応関係:

| 戦略上の概念 | 本リポでの実体 |
|---|---|
| **Primitives** | [`components/primitives/`](./components/primitives/) (Button, Input, Icon, Typography, Stack, Cluster, Center 等 16 個) |
| **Composites** | [`components/composites/`](./components/composites/) (Alert, Card, SearchBar, Tabs, AppShell, TwoColumn, SplitPane 等 23 個) |
| **common (汎用)** | 本リポジトリ全体 (`components/`, `tokens/`) — npm パッケージ `@kawachiryuya/design-system` として配信 |
| **[product-name] (プロダクト固有)** | 別リポジトリで管理 (本リポを npm 依存として参照) |
| **グローバルトークン** | [`tokens/source/colors.json`](./tokens/source/colors.json) ほか primitive スケール |
| **セマンティックトークン** | [`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) (色: WHERE × WHAT 構造) / [`tokens/source/spacing.json`](./tokens/source/spacing.json) (`spacing-semantic`) / [`tokens/source/typography.json`](./tokens/source/typography.json) (`typography-semantic`) |
| **設計原則ドキュメント** | 本ファイル「設計原則」セクション + [`AGENTS.md §8`](./AGENTS.md) (a11y 実装規約) + 各 component の `.guideline.mdx` |
| **検証サイト (Storybook)** | `npm run storybook` / https://design-system-storybook-murex.vercel.app |
| **検証サイト (アプリ内検証)** | 別リポの dogfood consumer (本 DS を npm 消費する) |

### 進捗状況

- Step 1 (トークン定義): カラー・スペーシング・タイポグラフィすべて semantic 層完了 (common 側にデフォルトを提供)
- Step 2 (Primitives): 完了 (primitives 16 個、Layout primitive `Center` / `Stack` / `Cluster` 含む)
- Step 3 (Composites): 完了 (composites 23 個、Layout composite `AppShell` / `TwoColumn` / `SplitPane` 含む)
- Step 4 (レイアウト基礎): 完了 (Phase A: Layout primitives / Phase B: Layout composites、いずれも consumer 側で dogfood 済 + v1.0.0 stable)
- Step 5 (プロダクト固有 Organism): 別リポジトリ (product 側) で実装する。本リポからは切り出し済み

### 運用規約 (どう作るか)

トークン参照ルール、コンポーネント追加時の規約、禁則事項などの実装ガイドラインは [`AGENTS.md`](./AGENTS.md) を参照。本ドキュメントは「なぜ・何を」、AGENTS.md は「どう作るか」を担う。
