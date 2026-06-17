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

> **消費側に Tailwind は不要** (v4.0.0〜)。`npm run build` がコンポーネント CSS をプリコンパイルして `dist/styles.css` に同梱する。消費側は `tokens/variables.css` + `styles.css` を import してコンポーネントを使うだけ。導入手順は Storybook の [Introduction](https://design-system-storybook-murex.vercel.app/?path=/docs/introduction--docs) 「Product 側で使う際の setup」を参照。Tailwind は本リポが**オーサリング時に内部で**使うだけで、preset (`tokens/preset.cjs`) は引き続き export している (utility を自由に書きたい消費側向けの任意経路)。
