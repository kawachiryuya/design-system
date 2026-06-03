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
│   ├── primitives/    Parts: 単一 HTML 要素ラッパー (12 個)
│   └── composites/    Blocks: 複合コンポーネント (21 個)
├── tokens/
│   ├── source/        グローバル / セマンティックトークン (JSON)
│   ├── build/         Style Dictionary 自動生成成果物
│   ├── preset.cjs     Tailwind preset
│   └── index.ts       TS public API
├── principles/        コンポーネント実装時に参照する設計原則
└── .storybook/        Storybook 設定
```

## ドキュメントの読む順

1. [`design-system-strategy.md`](./design-system-strategy.md) — **なぜ・何を**: Parts/Blocks 構成、common/product 分離、トークン 2 層構造
2. [`AGENTS.md`](./AGENTS.md) — **どう作る**: トークン参照ルール、新規追加規約、禁則
3. [`principles/`](./principles/) — 実装時に参照する個別原則 (accessibility, button, semantic-colors 等)

## コンポーネント一覧

### Primitives (12)

Button / Divider / Icon / Image / Input / Label / Link / Skeleton / Spinner / Textarea / Typography / VisuallyHidden

### Composites (21)

Accordion / Alert / Avatar / Badge / Breadcrumb / Card / Checkbox + CheckboxGroup / EmptyState / FilterChip / Modal / NumberInput / Pagination / ProgressBar / Radio + RadioGroup / SearchBar / SegmentedControl / Select / Switch / Tabs / Toast (+ ToastProvider, useToast) / ToggleButton

各コンポーネントは `ComponentName.tsx` / `.stories.tsx` / `.md` / `index.ts` の 4 ファイル構成。

## 技術スタック

| 用途 | 技術 |
|---|---|
| コンポーネント | React 18 + TypeScript 5 |
| スタイル | Tailwind CSS 3 (tokens/preset.cjs 経由) |
| バンドラ | Vite 6 |
| カタログ | Storybook 10 + @storybook/addon-a11y |
| トークン | Style Dictionary 5 |
