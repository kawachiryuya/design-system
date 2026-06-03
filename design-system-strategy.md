# デザインシステム構築戦略

## 背景と目的

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

| 層 | 定義 | 例 |
|---|---|---|
| **Parts** | 単体で意味しない最小の UI 要素 | ボタン、入力、バッジ、アイコン |
| **Blocks** | Parts の組み合わせで 1 つの機能を持つ UI | 検索バー、カードレイアウト、フォームセクション |

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

カラーとスペーシングは common にデフォルト semantic を実装済。タイポグラフィは本ドキュメント更新に合わせて common 側に追加する。

---

## マルチプロダクト対応の設計原則

1. **命名にドメイン語を混ぜない**: common には `PrimaryButton`, `ContentCard` のような役割名を使う。`TrainButton` のようなドメイン語は product 側のみ
2. **コンポーネント API を業務ロジックから切り離す**: common の props は汎用的に「何を選ぶか・何を表示するか」は product 側が決める
3. **トークンのセマンティック層で見た目を差し替える**: 同じコンポーネントでもプロダクトごとに異なる外観を実現

---

## 構築ステップ

```
Step 1: トークン定義
  ↓ 初期済みトークンを使用
  ↓ タイポグラフィ・スペーシングのセマンティック層を追加

Step 2: Parts 構築
  ↓ ボタン、入力、アイコン、ラベル、バッジ等
  ↓ トークンのみで終わる最小単位
  ↓ Storybook に全バリエーション登録

Step 3: Blocks 構築
  ↓ 検索バー、フォームグループ、カード、ヘッダー等
  ↓ Parts の組み合わせで作れる範囲

Step 4: レイアウト基礎
  ↓ ページレイアウトパターン (1 カラム、サイドバー付き等)
  ↓ グリッドシステム、コンテンツエリアのスタック規則
  ↓ レスポンシブのブレイクポイントと挙動
  ↓ ナビゲーション構造 (グローバル、ブレッドクラム等)

Step 5: プロダクト固有 Organism 構築
  ↓ オブジェクトに紐づく UI 一式
  ↓ Step 1〜4 を持っていれば終わる
  ↓ エンジニア統合時にバックエンドロジック接続
```

Step 4 まではデザイナー単独で進行可能、バックエンド依存なし。

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

## 補足: スクラムとの関係

- デザインシステム構築は、バックログに載せず、デザイナーの作業改善として進める
- プロダクトへの統合 (ストラングラー) 段階でエンジニアと協力、その時点でバックエンドロジックの接続を依頼
- PO への説明が必要になった場合は「機能開発の速度向上のための投資」として定量的に伝える

---

## 本リポジトリでの実装対応

戦略上の概念と、本リポジトリ (`@kawachiryuya/design-system`) の現在の実装の対応関係:

| 戦略上の概念 | 本リポでの実体 |
|---|---|
| **Parts** | [`components/primitives/`](./components/primitives/) (Button, Input, Icon, Typography 等 11 個) |
| **Blocks** | [`components/composites/`](./components/composites/) (Alert, Card, SearchBar, Tabs 等 19 個) |
| **common (汎用)** | 本リポジトリ全体 (`components/`, `tokens/`, `principles/`) — npm パッケージ `@kawachiryuya/design-system` として配信 |
| **[product-name] (プロダクト固有)** | 別リポジトリで管理 (本リポを npm 依存として参照)。[`gunmaas`](https://github.com/kawachiryuya/gunmaas) (鉄道予約) / [`rail-demo-lp`](https://github.com/kawachiryuya/rail-demo-lp) (LP) |
| **グローバルトークン** | [`tokens/source/colors.json`](./tokens/source/colors.json) ほか primitive スケール |
| **セマンティックトークン** | [`tokens/source/semantic-colors.json`](./tokens/source/semantic-colors.json) (色: WHERE × WHAT 構造) / [`tokens/source/spacing.json`](./tokens/source/spacing.json) (`spacing-semantic`) / [`tokens/source/typography.json`](./tokens/source/typography.json) (`typography-semantic`) |
| **設計原則ドキュメント** | [`principles/`](./principles/) (Color / Foundation / Interaction / Layout / Patterns / Platform / Typography、Storybook で参照) |
| **検証サイト (Storybook)** | `npm run storybook` / https://design-system-storybook-murex.vercel.app |
| **検証サイト (アプリ内検証)** | 別リポ `rail-demo` (旧 `demo/` を分離) を使用 |

### 進捗状況

- Step 1 (トークン定義): カラー・スペーシングのセマンティック層完了 (common 側にデフォルトを提供)。タイポグラフィのセマンティック層も追加済 (Typography コンポーネントの variant が参照)
- Step 2 (Parts): 完了 (primitives 11 個)
- Step 3 (Blocks): 完了 (composites 19 個)
- Step 4 (レイアウト基礎): 未着手 — Layout 系コンポーネント (Grid, Stack, PageShell 等) は今後追加予定
- Step 5 (プロダクト固有 Organism): 別リポジトリ (product 側) で実装する。本リポからは切り出し済み

### 命名について

本リポでは慣例として `primitives` / `composites` を使用 (Atomic Design 由来、React コミュニティで一般的)。戦略文書上の `Parts` / `Blocks` と読み替え可能。一括リネームは影響が大きいため当面据え置く。

### 運用規約 (どう作るか)

トークン参照ルール、コンポーネント追加時の規約、禁則事項などの実装ガイドラインは [`AGENTS.md`](./AGENTS.md) を参照。本ドキュメントは「なぜ・何を」、AGENTS.md は「どう作るか」を担う。
