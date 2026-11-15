# Design System

`@kawachiryuya/design-system` — Storybook を Single Source of Truth とした React コンポーネントライブラリ。

## クイックスタート

```bash
npm install
npm run tokens:build   # トークンを生成
npm run storybook      # http://localhost:6006
```

ビルド:

```bash
npm run build              # コンポーネント + tokens を dist/ へ出力
npm run build-storybook    # 静的サイトとして storybook-static/ へ出力
```

公開 Storybook: https://design-system-storybook-murex.vercel.app

## ディレクトリ構成

```
design-system/
├── components/
│   ├── primitives/    単一 HTML 要素ラッパー + Layout primitive
│   ├── composites/    複数要素を組み合わせた複合 + Layout composite
│   ├── principles/    設計原則トピックページ (MDX)
│   ├── tokens/        Token Catalog Story (token scale の可視化)
│   ├── _internal/     内部ユーティリティ (非公開)
│   ├── Introduction.mdx   Storybook トップ導入ページ
│   └── index.ts       コンポーネント public API (barrel)
├── tokens/
│   ├── source/        primitive / semantic トークン (JSON)
│   ├── build/         Style Dictionary 自動生成成果物
│   ├── preset.cjs     Tailwind preset
│   └── index.ts       TS public API
├── scripts/           検証スクリプト (check-links / contrast / conventions / refs 等)
├── docs/              リポ運用ドキュメント (strategy 補助・layout patterns 等)
├── .storybook/        Storybook 設定
├── .github/           CI ワークフロー
└── .claude/           AI エージェント用コマンド (add-component / audit-drift)
```

> コンポーネントの一覧と個数は Storybook サイドバー (Primitives / Composites) が Single Source of Truth。本 README には数を持たない (ドリフト防止)。

## ドキュメントの読む順

1. [`design-system-strategy.md`](./design-system-strategy.md) — **なぜ・何を**: Primitives/Composites 構成、common/product 分離、トークン 2 層構造、設計原則 (a11y / ヒエラルキー / レスポンシブ / 可読性 / UI ライティング)
2. [`AGENTS.md`](./AGENTS.md) — **どう作る**: トークン参照ルール、コンポーネント実装規約、a11y 実装規約、禁則、Semver
3. `components/**/*.guideline.mdx` — **個別コンポーネントの使い方**: Storybook 上で各 component の Docs ページとして閲覧 (`npm run storybook`)

## いつ、何が動くか

設定の正本は [`.github/workflows/`](./.github/workflows/) と [`package.json`](./package.json) の `scripts`。ここは全体の見取り図で、検査の一覧は持たない (検査の一覧は `package.json` の `verify`、各検査の意味は [`AGENTS.md` §5-5-1](./AGENTS.md))。

| きっかけ | 動くもの | やること | 結果の出る場所 |
|---|---|---|---|
| ブランチに push | Chromatic ([`chromatic.yml`](./.github/workflows/chromatic.yml)) | Storybook をビルドして story を撮り、基準と比べる。変わった story だけ撮り直す | PR の「UI Tests」 |
| ブランチに push | Vercel | Storybook をビルドして、プレビューの URL を出す (30 日で消える) | PR のコメント |
| PR を作る・更新する / main に入る | CI ([`ci.yml`](./.github/workflows/ci.yml)) | 下の「CI の中身」 | PR の「verify」 |
| main に入る | Chromatic | main の結果を自動で基準にする | — |
| `v` で始まるタグを push | Release ([`release.yml`](./.github/workflows/release.yml)) | 下の「公開」 | Actions |

### CI の中身

上から順に走り、どれかが落ちるとそこで止まる。

1. **`npm run verify`** — 検査の束。色のコントラスト、型、lint (色や文字サイズの直書きなど)、部品と story の決まり、リンクと参照、書いたクラスが CSS になっているか、配布 CSS の中身、テーマ契約。どの検査で落ちたかは、ログの `✗ check:...` の行に出る
2. **配布物のビルド** (`npm run build`)
3. **Tailwind なしの見本のビルド** — Tailwind を使わない利用側で動くことの確認
4. **Storybook のビルドとテスト** — 描画エラー、操作のテスト、アクセシビリティの違反
5. 適合率の集計 (`report:conformance`) — 数字を出すだけで、止めない

**検査を足すときは `verify` に足す。** CI は `verify` を呼ぶだけなので、そこに足せば手元・PR・公開の前のすべてで走る。CI の設定に検査を個別に並べない (以前は並べていて、`verify` に足した検査が CI に入らないままになった)。

### マージの条件

- **verify** (CI) が通る
- **UI Tests** (Chromatic) の差分を人が見て承認する。意図した見た目の変化は、PR の説明の前後の写真で判断する ([`AGENTS.md` §9-4](./AGENTS.md))

マージするとブランチは自動で消える。案を比べるための PR (ラベル `検討`) はマージせずに閉じるので、ブランチは PR のページのボタンで消す。

### 公開

1. `package.json` の `version` を上げ、`CHANGELOG.md` を確定する ([`AGENTS.md` §10-3](./AGENTS.md))
2. 同じ番号のタグ (`v6.0.2` など) を push する
3. Release が、タグの番号と `version` が同じかを確かめ、`npm publish` を実行する。その直前に `prepublishOnly` で `verify` とビルドが走る
4. 公開先は GitHub Packages (閲覧は制限つき)

`v` で始まらないタグでは Release は動かない。

### 手元で使うコマンド

| コマンド | 中身 |
|---|---|
| `npm run verify` | CI の 1 と同じ検査の束 |
| `npm run verify:full` | それに Storybook のビルドとテストを足したもの |

## コンポーネント一覧

- **Primitives** ([`components/primitives/`](./components/primitives/)): 単一 HTML 要素ラッパー + Layout primitive (Stack / Cluster / Center 等)
- **Composites** ([`components/composites/`](./components/composites/)): 複数要素を組み合わせた複合コンポーネント + Layout composite (AppShell / TwoColumn / SplitPane 等)

個別コンポーネントの一覧と仕様は **Storybook サイドバー** から閲覧 (`npm run storybook` または公開 Storybook)。各コンポーネントは `ComponentName.tsx` / `.stories.tsx` / `.guideline.mdx` / `index.ts` の 4 ファイル構成 (詳細規約は [`AGENTS.md §5-1`](./AGENTS.md))。

## 技術スタック

| 用途 | 技術 |
|---|---|
| コンポーネント | React 18 + TypeScript 5 |
| スタイル (本リポ内部) | Tailwind CSS 3 (tokens/preset.cjs 経由) |
| バンドラ | Vite 6 |
| カタログ | Storybook 10 + @storybook/addon-a11y |
| トークン | Style Dictionary 5 |

> **消費は 2 つの一級モード** (v4.0.0〜、Tailwind は本リポの内部オーサリング専用)。「自社で Tailwind を使うか」で分岐し、**併用は不可**:
> - **モード 1 (Tailwind 不使用)**: `tokens/variables.css` + `styles.css` (プリコンパイル CSS) を import するだけ。
> - **モード 2 (Tailwind 使用)**: `tokens/preset.cjs` を継承し content に DS dist を含めた**単一 Tailwind ビルド** (`styles.css` は import しない)。自社コードで DS の semantic utility を書く場合はこちら。
>
> 両モード併用は base/responsive utility の source 順衝突で壊れる。導入手順は Storybook の [Introduction](https://design-system-storybook-murex.vercel.app/?path=/docs/introduction--docs)「Product 側で使う際の setup」/ CHANGELOG `4.0.0` Migration を参照。
