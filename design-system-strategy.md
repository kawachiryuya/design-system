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

**公式語彙は `Primitives` / `Composites`** (実装・Storybook サイドバー・ドキュメント全体で統一する)。
`Parts` / `Blocks` は構築当初の Atomic Design 由来の概念名で、現在は経緯として併記するに留める。

| 層 (公式) | 由来の概念名 | 定義 | 例 |
|---|---|---|---|
| **Primitives** | Parts | 単体で意味しない最小の UI 要素 | ボタン、入力、バッジ、アイコン |
| **Composites** | Blocks | Primitives の組み合わせで 1 つの機能を持つ UI | 検索バー、カードレイアウト、フォームセクション |

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

**Token → Parts → Blocks → Layout → Organism** の依存方向に沿って下から積み上げる。Step 4 (Layout) までは common パッケージ (本リポジトリ)、Step 5 (Organism) は product 側で実装。Step 4 まではデザイナー単独で進行可能、バックエンド依存なし。

```
Step 1  Token       (色 / spacing / typography 等の semantic 2 層化)
   ↓
Step 2  Parts       (Button / Input / Icon 等、単一 HTML 要素のラッパー)
   ↓
Step 3  Blocks      (Card / Modal / Form 等、Parts の組合せ + 状態)
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
トークン → Parts → Blocks → Organism → 結果として画面が変わる
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
- **品質ゲート**: PR で typecheck / build-storybook / 壊れリンクチェック (§9-3) を CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) で強制。release は tag push で GitHub Actions が自動 publish (ローカル publish は行わない)
- **ドキュメント責務**: 本ファイル (なぜ・何を) / [`AGENTS.md`](./AGENTS.md) (どう作る) / 各 `.guideline.mdx` (個別の使い方) の三層

### 配布ポリシー

- **現状**: `license` は `UNLICENSED`、GitHub Packages へ `access: restricted` で配信。消費側プロダクトは GitHub の認証トークン (`NODE_AUTH_TOKEN`) を要する (社内 / 自分のプロダクトでの利用を前提)
- **pending decision**: 様々なプロジェクト (クライアントワーク含む) の基盤として外部導入する場合、ライセンス (MIT 化) と配布チャネル (public registry 等) の意思決定が必要。現在は **規約確認 (Phase 0) 待ち**で、確定するまで現状の restricted 配信を維持する

---

## 本リポジトリでの実装対応

戦略上の概念と、本リポジトリ (`@kawachiryuya/design-system`) の現在の実装の対応関係:

| 戦略上の概念 | 本リポでの実体 |
|---|---|
| **Parts** | [`components/primitives/`](./components/primitives/) (Button, Input, Icon, Typography, Stack, Cluster, Center 等 16 個) |
| **Blocks** | [`components/composites/`](./components/composites/) (Alert, Card, SearchBar, Tabs, AppShell, TwoColumn, SplitPane 等 23 個) |
| **common (汎用)** | 本リポジトリ全体 (`components/`, `tokens/`) — npm パッケージ `@kawachiryuya/design-system` として配信 |
| **[product-name] (プロダクト固有)** | 別リポジトリで管理 (本リポを npm 依存として参照)。[`gunmaas`](https://github.com/kawachiryuya/gunmaas) (鉄道予約) / [`rail-demo-lp`](https://github.com/kawachiryuya/rail-demo-lp) (LP) |
| **グローバルトークン** | [`tokens/source/colors.json`](./tokens/source/colors.json) ほか primitive スケール |
| **セマンティックトークン** | [`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) (色: WHERE × WHAT 構造) / [`tokens/source/spacing.json`](./tokens/source/spacing.json) (`spacing-semantic`) / [`tokens/source/typography.json`](./tokens/source/typography.json) (`typography-semantic`) |
| **設計原則ドキュメント** | 本ファイル「設計原則」セクション + [`AGENTS.md §8`](./AGENTS.md) (a11y 実装規約) + 各 component の `.guideline.mdx` |
| **検証サイト (Storybook)** | `npm run storybook` / https://design-system-storybook-murex.vercel.app |
| **検証サイト (アプリ内検証)** | 別リポ [`rail-demo`](https://github.com/kawachiryuya/rail-demo) (本 DS を npm 消費する dogfood consumer) |

### 進捗状況

- Step 1 (トークン定義): カラー・スペーシング・タイポグラフィすべて semantic 層完了 (common 側にデフォルトを提供)
- Step 2 (Parts): 完了 (primitives 16 個、Layout primitive `Center` / `Stack` / `Cluster` 含む)
- Step 3 (Blocks): 完了 (composites 23 個、Layout composite `AppShell` / `TwoColumn` / `SplitPane` 含む)
- Step 4 (レイアウト基礎): 完了 (Phase A: Layout primitives / Phase B: Layout composites、いずれも rail-demo で dogfood 済 + v1.0.0 stable)
- Step 5 (プロダクト固有 Organism): 別リポジトリ (product 側) で実装する。本リポからは切り出し済み

### 運用規約 (どう作るか)

トークン参照ルール、コンポーネント追加時の規約、禁則事項などの実装ガイドラインは [`AGENTS.md`](./AGENTS.md) を参照。本ドキュメントは「なぜ・何を」、AGENTS.md は「どう作るか」を担う。
