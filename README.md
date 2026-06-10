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
│   ├── primitives/    Parts: 単一 HTML 要素ラッパー / Layout primitive (16 個)
│   └── composites/    Blocks: 複合コンポーネント / Layout composite (23 個)
├── tokens/
│   ├── source/        グローバル / セマンティックトークン (JSON)
│   ├── build/         Style Dictionary 自動生成成果物
│   ├── preset.cjs     Tailwind preset
│   └── index.ts       TS public API
└── .storybook/        Storybook 設定
```

## ドキュメントの読む順

1. [`design-system-strategy.md`](./design-system-strategy.md) — **なぜ・何を**: Parts/Blocks 構成、common/product 分離、トークン 2 層構造、設計原則 (a11y / ヒエラルキー / レスポンシブ / 可読性 / UI ライティング)
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
| スタイル | Tailwind CSS 3 (tokens/preset.cjs 経由) |
| バンドラ | Vite 6 |
| カタログ | Storybook 10 + @storybook/addon-a11y |
| トークン | Style Dictionary 5 |
