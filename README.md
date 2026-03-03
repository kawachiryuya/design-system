# Design System

**一貫性のある、アクセシブルで、美しいデジタル体験を構築するための完全なデザインシステム**

最終更新: 2026年2月21日

---

## 🚀 クイックスタート

### Storybook を起動する

```bash
# このディレクトリで実行
npm install       # 初回のみ（node_modules がない場合）
npm run storybook # http://localhost:6006 で起動
```

**Node.js が未インストールの場合**:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# ターミナル再起動後
nvm install --lts
```

### 静的サイトとして書き出す（ポートフォリオ公開用）

```bash
npm run build-storybook
# storybook-static/ に出力されます
```

---

## 📂 ディレクトリ構造

```
designSystem/
├── .storybook/              # Storybook 設定
│   ├── main.ts              ── フレームワーク・アドオン設定
│   ├── preview.ts           ── グローバルスタイル・パラメーター
│   └── tailwind.css         ── Tailwind エントリポイント
│
├── principles/              # 原則ドキュメント（62ファイル）
│   ├── foundation/          ── アクセシビリティ・カラー等の基盤
│   ├── layout/              ── グリッド・スペーシング
│   ├── interaction/         ── 状態・フィードバック・ボタン
│   ├── content/             ── タイポグラフィ・アイコン
│   ├── color/               ── カラーシステム
│   ├── motion/              ── アニメーション
│   ├── patterns/            ── フォーム・Atomic Design
│   └── platform/            ── レスポンシブ・PWA
│
├── tokens/                  # デザイントークン（JSON × 7）
│   ├── spacing.json         ── 余白（8px ベース）
│   ├── colors.json          ── カラーパレット
│   ├── typography.json      ── フォント
│   ├── shadows.json         ── 影・elevation
│   ├── radius.json          ── 角丸
│   ├── breakpoints.json     ── レスポンシブ
│   └── animation.json       ── アニメーション
│
├── components/              # React コンポーネント（Primitives 11 + Composites 15）
│   ├── primitives/            ── Primitives（単一HTML要素ラッパー）
│   │   ├── Button/            ── Button
│   │   ├── Divider/           ── Divider
│   │   ├── Icon/              ── Icon
│   │   ├── Image/             ── Image
│   │   ├── Input/             ── Input
│   │   ├── Label/             ── Label
│   │   ├── Link/              ── Link
│   │   ├── Skeleton/          ── Skeleton
│   │   ├── Spinner/           ── Spinner
│   │   ├── Textarea/          ── Textarea
│   │   └── Typography/        ── Typography
│   └── composites/            ── Composites（複合コンポーネント）
│       ├── Alert/             ── Alert
│       ├── Avatar/            ── Avatar
│       ├── Badge/             ── Badge
│       ├── Breadcrumb/        ── Breadcrumb
│       ├── Card/              ── Card（Header/Body/Footer）
│       ├── Checkbox/          ── Checkbox + CheckboxGroup
│       ├── EmptyState/        ── EmptyState
│       ├── Pagination/        ── Pagination
│       ├── ProgressBar/       ── ProgressBar
│       ├── Radio/             ── Radio + RadioGroup
│       ├── SearchBar/         ── SearchBar
│       ├── Select/            ── Select
│       ├── Switch/            ── Switch
│       └── Tabs/              ── Tabs
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
└── tailwind.config.js       # Tailwind + デザイントークン統合
```

---

## 🧩 コンポーネント一覧

### Primitives（11個）

| コンポーネント | 主要 Props | 用途 |
|--------------|-----------|------|
| **Button** | variant / size / isLoading / icon | 全アクション |
| **Divider** | orientation / label / color | 区切り線 |
| **Icon** | size / color / label | SVG アイコンラッパー |
| **Image** | aspectRatio / objectFit / rounded / fallback | 画像 |
| **Input** | type / size / error / leadingIcon | テキスト入力 |
| **Label** | required / optional / disabled | フォームラベル |
| **Link** | external / color / underline / disabled | テキストリンク |
| **Skeleton** | variant / lines / animated | ローディングプレースホルダー |
| **Spinner** | size / color / label | ローディング |
| **Textarea** | maxLength / currentLength / resize | 長文入力 |
| **Typography** | variant / as / color / truncate | テキスト全般 |

### Composites（15個）

| コンポーネント | 組み合わせ | 用途 |
|--------------|-----------|------|
| **Alert** | アイコン + タイトル + 本文 + 閉じるボタン | インラインアラート（success/error/warning/info）|
| **Avatar** | src / name / size / shape / status | ユーザーアバター |
| **Badge** | variant / appearance / dot | ステータス表示 |
| **Breadcrumb** | リンクリスト + セパレーター | パンくずナビゲーション（chevron/slash/dot）|
| **Card** | Header / Body / Footer スロット | 汎用カードコンテナ（ブログ・統計・プロフィール等） |
| **Checkbox** + CheckboxGroup | indeterminate / error / description | 複数選択（グループ: fieldset + legend + helpText/error）|
| **EmptyState** | アイコン + タイトル + 説明 + アクション | データなし・エラー・検索結果ゼロの画面 |
| **Pagination** | ページボタン + 省略記号 + 前後ボタン | ページネーション（最初・最後ボタン対応）|
| **ProgressBar** | value / color / showValue / indeterminate | 進捗表示 |
| **Radio** + RadioGroup | inline / error / legend | 単一選択 |
| **SearchBar** | SearchIcon + Input + ClearButton | 検索フィールド（Enter で実行・Escape でクリア）|
| **Select** | size / error / fullWidth | ドロップダウン選択 |
| **Switch** | role="switch" / labelPosition | ON/OFF 切替 |
| **Tabs** | tablist + tabpanel + キーボード操作 | タブ切り替え（underline/pill・制御/非制御）|

---

## 📋 開発ロードマップ

| フェーズ | 内容 | 状態 |
|---------|------|------|
| Phase 1〜4 | 原則ドキュメント（62ファイル） | ✅ 完了 |
| Phase A | デザイントークン（JSON × 7） | ✅ 完了 |
| Phase B | Primitives × 11 + Stories | ✅ 完了 |
| Phase C | Storybook セットアップ・アクセシビリティ統合 | ✅ 完了 |
| Phase D | Composites × 15 + Stories | ✅ 完了 |
| Phase E | Organisms（Header / Modal / Toast 等） | ⬜ 未着手 |

---

## 🔧 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 18.x | コンポーネント |
| TypeScript | 5.x | 型定義 |
| Tailwind CSS | 3.x | スタイリング（トークン連携） |
| Vite | 6.x | バンドラー |
| Storybook | 8.x | UI カタログ・インタラクティブプレビュー |
| @storybook/addon-a11y | 8.x | アクセシビリティ自動検査 |

---

## 💡 使い方

### AI で新しいプロジェクトを始めるとき

このデザインシステムを AI に渡す際の推奨プロンプト:

```
このデザインシステム（designSystem/）を基盤として、
新しいプロジェクトの UI を構築してください。

コンポーネントは components/ にあります。
  - primitives/: 単一HTML要素ラッパー（Button, Input, Typography 等）
  - composites/: 複合コンポーネント（Card, CheckboxGroup, Tabs 等）
デザイントークンは tokens/ の JSON と tailwind.config.js に定義されています。
デザイン原則は principles/ を参照してください。

Storybook で動作確認済みです（npm run storybook で確認できます）。
```

### デザイン原則の参照

```
principles/
├── foundation/accessibility/   ← アクセシビリティ要件
├── color/semantic-colors.md    ← 意味を持つカラー
├── patterns/forms.md           ← フォーム設計
└── interaction/state/          ← インタラクション状態
```

### Storybook での確認方法

1. `npm run storybook` で起動
2. 左サイドバーで `Primitives/` または `Composites/` を展開
3. コンポーネントを選択
4. **Controls パネル** で Props をリアルタイム変更
5. **Accessibility パネル** でアクセシビリティ違反を確認

---

## 📊 統計

- **原則ドキュメント**: 62ファイル（約15,000行）
- **デザイントークン**: 7ファイル
- **実装済みコンポーネント**: 26個（Primitives × 11 + Composites × 15）
- **Story ファイル**: 26個（全コンポーネントをカバー）
- **アクセシビリティ**: 全コンポーネントで ARIA 属性・キーボード操作対応

---

---

## 🌍 このデザインシステムを使ったプロジェクト

| プロジェクト | URL | リポジトリ |
|---|---|---|
| ポートフォリオサイト | https://kawachi-portfolio.vercel.app | https://github.com/kawachiryuya/portfolio（Private） |

---

**このデザインシステムは、より良いユーザー体験を、より速く、より一貫して作るためのツールです。**
